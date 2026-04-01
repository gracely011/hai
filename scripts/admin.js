// admin.js - Logika Manajemen Dasbor Admin Gracely

let currentAdminUid = null;
let allUsersCache = [];

// DOM Elements
const authLoader = document.getElementById('authLoader');
const tabs = {
    overview: document.getElementById('panel-overview'),
    users: document.getElementById('panel-users'),
    activity: document.getElementById('panel-activity')
};
const tabButons = {
    overview: document.getElementById('tab-overview'),
    users: document.getElementById('tab-users'),
    activity: document.getElementById('tab-activity')
};

// State Modal Edit Sub
let activeEditTargetUid = null;
let activePlanType = 'premium'; // default
let activeOriginalDate = null;

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    setupTheme();
    
    // Panggil logika autentikasi khusus Admin (tanpa requireAuth global)
    await initAdminAuth();
});

async function initAdminAuth() {
    const loginPanel = document.getElementById('adminLoginPanel');
    const authLoader = document.getElementById('authLoader');
    
    try {
        const adminUid = await getUserId();
        if (!adminUid) {
            // Belum login sama sekali -> Tampilkan Form Login
            authLoader.classList.add('hidden');
            loginPanel.classList.remove('hidden');
            return;
        }

        // Sudah ada sesi, verifikasi apakah dia Admin
        await verifyAdminAccess();
        
    } catch (e) {
        console.error("Error setting up admin auth:", e);
        authLoader.classList.add('hidden');
        loginPanel.classList.remove('hidden');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('btnAdminLogin');
    const errDiv = document.getElementById('adminLoginError');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `<div class="loader w-4 h-4 border-2 border-t-white inline-block align-middle mr-2"></div> Memeriksa...`;
    btn.disabled = true;
    errDiv.classList.add('hidden');
    
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPassword').value;
    
    try {
        const result = await login(email, pass);
        if (!result.success) {
            throw new Error(result.message || 'Login gagal.');
        }
        
        currentAdminUid = await getUserId();
        const { data: isAdmin, error } = await supabaseClient.rpc('is_admin');
        
        if (error || !isAdmin) {
            // Jika bukan admin, tendang sesi tersebut
            await supabaseClient.auth.signOut();
            localStorage.removeItem('isAuthenticated');
            throw new Error('Akses Ditolak: Anda bukan administrator.');
        }
        
        // Pindah ke tampilan Dashboard Load
        document.getElementById('adminLoginPanel').classList.add('hidden');
        document.getElementById('authLoader').classList.remove('hidden'); 
        
        await verifyAdminAccess();
        
    } catch(err) {
        errDiv.textContent = err.message;
        errDiv.classList.remove('hidden');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Setup Dark Mode
function setupTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
}

// Verifikasi Hak Akses Admin melalui RPC
async function verifyAdminAccess() {
    try {
        currentAdminUid = await getUserId();
        if (!currentAdminUid) throw new Error("Not logged in");

        // Panggil RPC 'is_admin' yang sudah dibuat di SQL
        const { data: isAdmin, error } = await supabaseClient.rpc('is_admin');
        
        if (error || !isAdmin) {
            console.warn("RESTRICTED: You do not have admin access.");
            throw new Error("Akses Ditolak: Anda bukan administrator.");
        }

        // Set nama admin
        document.getElementById('adminNameDisplay').textContent = localStorage.getItem('userName') || 'Admin Utama';
        
        // Hide Loader, Hide Login Form, Show Main Dashboard
        document.getElementById('authLoader').classList.add('hidden');
        document.getElementById('adminLoginPanel').classList.add('hidden');
        
        const dbLayout = document.getElementById('adminDashboardLayout');
        if (dbLayout) {
            dbLayout.classList.remove('hidden');
            dbLayout.classList.add('flex');
        }

        // Load Initial Data
        loadDashboardData();

    } catch (e) {
        console.error("Admin verification failed:", e);
        
        // Jika akses gagal (sesi ditolak/bukan admin), kembalikan ke layar login pannel
        supabaseClient.auth.signOut(); // Bersihkan dari local state juga
        
        document.getElementById('authLoader').classList.add('hidden');
        const loginPanel = document.getElementById('adminLoginPanel');
        if (loginPanel) loginPanel.classList.remove('hidden');
        
        const errDiv = document.getElementById('adminLoginError');
        if (errDiv) {
            errDiv.textContent = e.message || "Akses Ditolak. Silakan coba lagi.";
            errDiv.classList.remove('hidden');
        }
    }
}

// Tab Switching
function switchTab(tabId) {
    // Hide all
    Object.values(tabs).forEach(el => el.classList.add('hidden'));
    Object.values(tabButons).forEach(el => {
        el.className = "w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors border border-transparent";
    });

    // Show active
    tabs[tabId].classList.remove('hidden');
    tabButons[tabId].className = "w-full flex items-center gap-3 px-4 py-3 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 rounded-xl font-medium transition-colors border border-transparent";

    // Lazy Load Data
    if (tabId === 'users') loadUsers();
    if (tabId === 'activity') loadActivityLogs();
}

// Format Tanggal
function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date)) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric', month: 'short', day: '2-digit', 
        hour: '2-digit', minute:'2-digit'
    }).format(date);
}

// Load Dashboard Overview
async function loadDashboardData() {
    try {
        // Fetch 5 profiles for overview
        const { data: profiles, error: errProf } = await supabaseClient
            .from('profiles')
            .select('id, name, premiumExpiryDate, pro_expiry_date, phantom_expiry_date, last_sign_in, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        // Fetch User Count (Efficiently)
        const { count: totalUsers } = await supabaseClient
            .from('profiles')
            .select('id', { count: 'exact', head: true });

        // Fetch Activity Today
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const { count: todayActivity } = await supabaseClient
            .from('activity_logs')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', startOfDay.toISOString());

        // Fetch Active Sessions
        const { count: activeSessions } = await supabaseClient
            .from('user_sessions')
            .select('id', { count: 'exact', head: true });

        // Bind
        document.getElementById('statTotalUsers').textContent = totalUsers || 0;
        document.getElementById('statTodayActivity').textContent = todayActivity || 0;
        document.getElementById('statActiveSessions').textContent = activeSessions || 0;

        if (!errProf && profiles) {
            const tbody = document.getElementById('overviewUserTableBody');
            tbody.innerHTML = '';
            profiles.forEach(p => {
                const planInfo = getEffectivePlanStatus(p);
                const tr = document.createElement('tr');
                tr.className = "hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors";
                tr.innerHTML = `
                    <td class="px-6 py-4">
                        <div class="font-medium text-gray-900 dark:text-white">${p.name || 'Unknown'}</div>
                        <div class="text-[11px] text-gray-500">${p.id.substring(0,8)}...</div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs font-semibold rounded-full ${getPlanColorClass(planInfo.name)}">${planInfo.name}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-600 dark:text-gray-400 text-xs">${formatDate(p.created_at)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) { console.error("Error loading overview:", e); }
}

// Helper Get Effective Plan
function getEffectivePlanStatus(data) {
    const today = new Date();
    const premiumDate = data.premiumExpiryDate ? new Date(data.premiumExpiryDate) : null;
    const proDate = data.pro_expiry_date ? new Date(data.pro_expiry_date) : null;
    const phantomDate = data.phantom_expiry_date ? new Date(data.phantom_expiry_date) : null;

    if (phantomDate && today <= phantomDate) return { name: 'Phantom', date: phantomDate };
    if (proDate && today <= proDate) return { name: 'Pro', date: proDate };
    if (premiumDate && today <= premiumDate) return { name: 'Premium', date: premiumDate };
    return { name: 'Free', date: null };
}

function getPlanColorClass(planName) {
    switch(planName) {
        case 'Phantom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
        case 'Pro': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
        case 'Premium': return 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
}

// Load Users Table
async function loadUsers() {
    document.getElementById('usersLoading').classList.remove('hidden');
    document.getElementById('usersTableBody').innerHTML = '';

    try {
        const { data: profiles, error } = await supabaseClient
            .from('profiles')
            .select('id, name, allow_multilogin, max_devices, premiumExpiryDate, pro_expiry_date, phantom_expiry_date, last_sign_in, created_at')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        allUsersCache = profiles;
        renderUsers(profiles);
    } catch (e) {
        console.error("Error loading users:", e);
    } finally {
        document.getElementById('usersLoading').classList.add('hidden');
    }
}

function renderUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    users.forEach(p => {
        const eff = getEffectivePlanStatus(p);
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors";
        
        tr.innerHTML = `
            <td class="px-6 py-4">
                <div class="font-bold text-gray-900 dark:text-white">${p.name || 'Unnamed'}</div>
                <div class="text-[10px] text-gray-500 font-mono mt-0.5">${p.id}</div>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded ${getPlanColorClass(eff.name)}">${eff.name}</span>
                </div>
                <div class="text-[10px] ${p.allow_multilogin ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}">
                    <i data-lucide="${p.allow_multilogin ? 'smartphone' : 'monitor'}" class="w-3 h-3 inline"></i> 
                    ${p.allow_multilogin ? `Multi (${p.max_devices} Dev)` : 'Single Device'}
                </div>
            </td>
            <td class="px-6 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                ${formatDate(p.premiumExpiryDate)}
            </td>
            <td class="px-6 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                ${formatDate(p.pro_expiry_date)}
            </td>
            <td class="px-6 py-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                ${formatDate(p.phantom_expiry_date)}
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                    <button onclick="openEditSubModal('${p.id}')" title="Ubah Langganan" class="p-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:hover:bg-brand-900/60 dark:text-brand-400 rounded transition-colors">
                        <i data-lucide="calendar-plus" class="w-4 h-4"></i>
                    </button>
                    ${p.id !== currentAdminUid ? `
                    <button onclick="openDeleteModal('${p.id}')" title="Hapus Permanen" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/60 dark:text-red-400 rounded transition-colors">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

// Serach Users Client Side
document.getElementById('userSearchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allUsersCache.filter(u => 
        (u.name && u.name.toLowerCase().includes(term)) || 
        (u.id && u.id.toLowerCase().includes(term))
    );
    renderUsers(filtered);
});

// Load Activity Logs
async function loadActivityLogs() {
    document.getElementById('activityLoading').classList.remove('hidden');
    document.getElementById('activityTableBody').innerHTML = '';

    try {
        const { data: logs, error } = await supabaseClient
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        
        const tbody = document.getElementById('activityTableBody');
        logs.forEach(log => {
            const isp = log.isp_info || {};
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors";
            tr.innerHTML = `
                <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">${formatDate(log.created_at)}</td>
                <td class="px-6 py-4">
                    <div class="font-bold text-gray-900 dark:text-white">${log.name || 'Unknown'}</div>
                    <div class="text-[10px] text-gray-500">${log.user_id ? log.user_id.substring(0,8) + '...' : '-'}</div>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-[10px] font-bold rounded-full ${getActivityColor(log.activity)}">${log.activity}</span>
                </td>
                <td class="px-6 py-4 text-xs text-gray-600 dark:text-gray-400">
                    <div class="font-mono">${log.ip_address || '-'}</div>
                    <div class="text-[10px] mt-0.5">${isp.location || 'Unknown Location'}</div>
                </td>
                <td class="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate" title="${log.device}">
                    ${log.device || '-'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error("Error loading activity:", e);
    } finally {
        document.getElementById('activityLoading').classList.add('hidden');
    }
}

function getActivityColor(act) {
    if(!act) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    const a = act.toLowerCase();
    if(a.includes('login') && !a.includes('logout')) return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    if(a.includes('logout') || a.includes('kick')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    if(a.includes('register') || a.includes('sign')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
}

// Modal Logics
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function openEditSubModal(uid) {
    const user = allUsersCache.find(u => u.id === uid);
    if(!user) return;
    
    activeEditTargetUid = uid;
    document.getElementById('editSubUserName').textContent = user.name || 'User';
    
    // Default form configuration
    selectPlanForm('premium');
    document.getElementById('modalEditSub').classList.add('active');
}

function openDeleteModal(uid) {
    const user = allUsersCache.find(u => u.id === uid);
    if(!user) return;
    
    activeEditTargetUid = uid;
    document.getElementById('deleteUserName').textContent = `${user.name} (${uid})`;
    document.getElementById('modalDeleteUser').classList.add('active');
}

// Plan Form Logic
function selectPlanForm(planType) {
    activePlanType = planType;
    const user = allUsersCache.find(u => u.id === activeEditTargetUid);
    
    // Reset buttons
    ['premium', 'pro', 'phantom'].forEach(p => {
        const btn = document.getElementById('btnPlan' + p.charAt(0).toUpperCase() + p.slice(1));
        btn.className = "py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium rounded-lg text-sm hover:border-brand-500 transition-all";
    });

    // Active button
    const activeBtn = document.getElementById('btnPlan' + planType.charAt(0).toUpperCase() + planType.slice(1));
    activeBtn.className = "py-2 border-2 border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-bold rounded-lg text-sm transition-all shadow-sm";

    // Set Date input
    let targetDateStr = null;
    if (planType === 'premium') targetDateStr = user.premiumExpiryDate;
    if (planType === 'pro') targetDateStr = user.pro_expiry_date;
    if (planType === 'phantom') targetDateStr = user.phantom_expiry_date;

    const dateInput = document.getElementById('editSubDate');
    if (targetDateStr) {
        // format datetime-local input YYYY-MM-DDThh:mm
        const d = new Date(targetDateStr);
        if(!isNaN(d)) {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const h = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            dateInput.value = `${y}-${m}-${day}T${h}:${min}`;
        } else {
            dateInput.value = '';
        }
    } else {
        dateInput.value = '';
    }
}

// Tanggal Preset Calculator
function addDatePreset(days) {
    let baseDate = new Date();
    // Kalau kolom sudah isi, tambah dari tanggal itu. Kalau kosong, tambah dari sekarang.
    const inputVal = document.getElementById('editSubDate').value;
    if (inputVal) {
        baseDate = new Date(inputVal);
    }
    baseDate.setDate(baseDate.getDate() + days);
    
    // Update Input
    const y = baseDate.getFullYear();
    const m = String(baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(baseDate.getDate()).padStart(2, '0');
    const h = String(baseDate.getHours()).padStart(2, '0');
    const min = String(baseDate.getMinutes()).padStart(2, '0');
    document.getElementById('editSubDate').value = `${y}-${m}-${day}T${h}:${min}`;
}

// EXECUTE: Save Subscription RPC
async function saveSubscription() {
    const btn = document.getElementById('btnSaveSub');
    btn.innerHTML = `<div class="loader w-4 h-4 border-2 border-t-white"></div> Menyimpan...`;
    btn.disabled = true;

    try {
        const inputVal = document.getElementById('editSubDate').value;
        const targetDate = inputVal ? new Date(inputVal).toISOString() : null;

        // Panggil RPC
        const { data, error } = await supabaseClient.rpc('admin_update_subscription', {
            p_target_uid: activeEditTargetUid,
            p_plan_type: activePlanType,
            p_expire_date: targetDate
        });

        if (error) throw error;

        // Sukses
        closeModal('modalEditSub');
        loadUsers(); // Refresh Grid

    } catch (e) {
        console.error(e);
        alert("Gagal mengupdate paket: " + e.message);
    } finally {
        btn.innerHTML = "Simpan Perubahan";
        btn.disabled = false;
    }
}

// EXECUTE: Delete User RPC
async function confirmDeleteUser() {
    const btn = document.getElementById('btnConfirmDelete');
    btn.innerHTML = `<div class="loader w-4 h-4 border-2 border-t-white"></div> Menghapus...`;
    btn.disabled = true;

    try {
        const { data, error } = await supabaseClient.rpc('admin_delete_user', {
            p_target_uid: activeEditTargetUid
        });

        if (error) throw error;

        // Log the activity to our table purely for audit trail
        await logUserActivity({
            userId: currentAdminUid,
            userName: document.getElementById('adminNameDisplay').textContent,
            activity: 'Force Deleted User (' + activeEditTargetUid + ')',
            deviceName: navigator.userAgent
        });

        closeModal('modalDeleteUser');
        loadUsers();
        loadDashboardData();

    } catch (e) {
        console.error(e);
        alert("Gagal menghapus profil secara permanen: " + e.message);
    } finally {
        btn.innerHTML = "Ya, Hapus Permanen";
        btn.disabled = false;
    }
}
