// DOMAIN CHECK DISABLED FOR LOCAL DEV
// (function () {
//     var a = ["gracely011.github.io", "localhost", "127.0.0.1"],
//         h = window.location.hostname,
//         p = window.location.pathname,
//         o = !1;
//     for (var i = 0; i < a.length; i++)
//         if (h === a[i]) {
//             o = !0;
//             break
//         }
//     if (o && h === "gracely011.github.io" && !p.startsWith("/hai/")) {
//         o = !1
//     }
//     o || (window.location.href = "https://gracely011.github.io/hai/")
// })();

// --- AGGRESSIVE CLEANUP START ---
(function cleanupLegacy() {
    try {
        // 1. Force delete the old cookie path
        document.cookie = "gracely_session_token=; Max-Age=-99999999; path=/hai/; SameSite=Lax; Secure";

        // 2. Remove legacy Local Storage
        // NOTE: DO NOT remove 'gracely_db_session_id', it is needed for script.js session safety check!
        const keysToRemove = [
            'gracely_config_url',
            'gracelyPremiumConfig',
            'gracely_active_session_token'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (e) { /* Silent error handling */ }
})();
// --- AGGRESSIVE CLEANUP END ---

// --- DEVICE FINGERPRINTING HELPER (formerly fingerprint.js) ---
// Generates unique fingerprint untuk bind session ke device
// NOTE: Logic disamakan dengan Extension (Service Worker) supaya hash MATCH
async function getDeviceFingerprint() {
    try {
        // Collect device-specific attributes
        // HARUS SAMA PERSIS dengan Extension (background.js environment)
        // Tidak boleh pakai screen.* atau canvas karena Extension tidak bisa akses
        const components = [
            navigator.userAgent || '',
            navigator.language || '',
            new Date().getTimezoneOffset().toString()
        ];

        // Combine semua komponen
        const fingerprint = components.join('|||');

        // Hash dengan SHA-256
        const msgBuffer = new TextEncoder().encode(fingerprint);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // console.log('Device fingerprint generated:', hashHex);
        return hashHex;
    } catch (error) {
        console.error('Error generating device fingerprint:', error);
        return await getFallbackFingerprint();
    }
}

async function getFallbackFingerprint() {
    // Simplified fingerprint untuk fallback
    // HARUS SAMA PERSIS dengan Extension
    const simple = [
        navigator.userAgent,
        new Date().getTimezoneOffset().toString(),
        navigator.language
    ].join('|||');

    const msgBuffer = new TextEncoder().encode(simple);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    console.warn('Using fallback fingerprint');
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// --- END DEVICE FINGERPRINTING HELPER ---

var SUPABASE_URL = 'https://mujasmmlozswplmtkijr.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amFzbW1sb3pzd3BsbXRraWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDM4ODgsImV4cCI6MjA3NzI3OTg4OH0.tttyPcoVUtyPLfBm1irS2qYthzt84Yb0OhjxD-tZ4Nw';
var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- SESSION RECOVERY (SYNC EXTENSION -> WEBSITE) ---
(async function syncSessionFromCookies() {
    try {
        const getCookie = (name) => {
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : null;
        };

        const cookieAccessToken = getCookie('gracely_session_token');
        const cookieRefreshToken = getCookie('gracely_refresh_token');

        if (cookieAccessToken && cookieRefreshToken) {
            const { data: { session } } = await supabaseClient.auth.getSession();

            // If Supabase has no session OR has a different access token, adopt the cookie's session
            if (!session || session.access_token !== cookieAccessToken) {
                console.log("Syncing session from Extension cookies...");
                const { error } = await supabaseClient.auth.setSession({
                    access_token: cookieAccessToken,
                    refresh_token: cookieRefreshToken
                });
                if (error) {
                    console.warn("Failed to sync session from cookies:", error);
                    // If syncing fails (e.g., token invalid), allow normal flow or logout
                } else {
                    console.log("Session synchronized successfully.");
                }
            }
        }
    } catch (e) {
        console.warn("Session sync error:", e);
    }
})();
// --- SESSION RECOVERY END ---

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Strict Path enforcement
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
    document.cookie = name + '=; Max-Age=-99999999; path=/hai/; SameSite=Lax; Secure'; // Explicit clearing for safety
}

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
            setCookie('gracely_session_token', session.access_token, 30);
            if (session.refresh_token) {
                setCookie('gracely_refresh_token', session.refresh_token, 30);
            }
        }
    } else if (event === 'SIGNED_OUT') {
        eraseCookie('gracely_session_token');
        eraseCookie('gracely_refresh_token');
    }
});

async function getUserId() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.id : null;
}

async function getPremiumStatus(userId) {
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select(`
                premiumExpiryDate,
                pro_expiry_date,
                phantom_expiry_date,
                plan_gracely (
                    name_plan,
                    number_plan
                )
            `)
            .eq('id', userId)
            .single();

        if (error || !data) return null;

        const plan = data.plan_gracely || { name_plan: 'No Premium', number_plan: '001' };

        // Check validity for ALL plans
        const today = new Date();
        const premiumDate = data.premiumExpiryDate ? new Date(data.premiumExpiryDate) : null;
        const proDate = data.pro_expiry_date ? new Date(data.pro_expiry_date) : null;
        const phantomDate = data.phantom_expiry_date ? new Date(data.phantom_expiry_date) : null;

        const isPremiumValid = premiumDate && today <= premiumDate;
        const isProValid = proDate && today <= proDate;
        const isPhantomValid = phantomDate && today <= phantomDate;

        // Determine Effective Plan based on Hierarchy: Phantom > Pro > Premium
        let finalPlanName = 'No Premium';
        let finalPlanNumber = '001';

        if (isPhantomValid) {
            finalPlanName = 'The Phantom';
            finalPlanNumber = '004';
        } else if (isProValid) {
            finalPlanName = 'Pro';
            finalPlanNumber = '003';
        } else if (isPremiumValid) {
            finalPlanName = 'Premium';
            finalPlanNumber = '002';
        }

        // isPremium is TRUE if ANY plan is valid
        const isPremium = (isPremiumValid || isProValid || isPhantomValid);

        return {
            isPremium: isPremium,
            premiumExpiryDate: data.premiumExpiryDate,
            proExpiryDate: data.pro_expiry_date,
            phantomExpiryDate: data.phantom_expiry_date,
            planName: finalPlanName,
            planNumber: finalPlanNumber
        };
    } catch (e) {
        console.error("Error fetching premium status:", e);
        return null;
    }
}

async function getClientIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip || 'Unknown';
    } catch (e) {
        return 'Unknown';
    }
}

// --- ADVANCED DETECTION HELPERS ---
async function detectIncognito() {
    try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const { quota } = await navigator.storage.estimate();
            if (quota < 120000000) return true; // Incognito biasanya punya quota storage sangat kecil
        }
        return false;
    } catch (e) { return false; }
}

function getDetailedBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let version = "Unknown";

    if (ua.indexOf("Firefox") > -1) {
        browser = "Mozilla Firefox";
        version = ua.match(/Firefox\/([0-9.]+)/)[1];
    } else if (ua.indexOf("SamsungBrowser") > -1) {
        browser = "Samsung Internet";
        version = ua.match(/SamsungBrowser\/([0-9.]+)/)[1];
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browser = "Opera";
        version = ua.match(/(Opera|OPR)\/([0-9.]+)/)[2];
    } else if (ua.indexOf("Trident") > -1) {
        browser = "Microsoft Internet Explorer";
    } else if (ua.indexOf("Edge") > -1) {
        browser = "Microsoft Edge";
        version = ua.match(/Edge\/([0-9.]+)/)[1];
    } else if (ua.indexOf("Chrome") > -1) {
        browser = "Google Chrome";
        version = ua.match(/Chrome\/([0-9.]+)/)[1];
    } else if (ua.indexOf("Safari") > -1) {
        browser = "Apple Safari";
        version = ua.match(/Version\/([0-9.]+)/)[1];
    }

    return `${browser} ${version}`;
}
// --- END ADVANCED DETECTION HELPERS ---

async function getClientIpInfo() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        let data;
        try {
            const response = await fetch('https://ipinfo.io/json?token=331facddfc11cf', { signal: controller.signal });
            data = await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
        
        // Deteksi Proxy Sederhana (TimeZone Mismatch)
        let isProxySuspect = false;
        try {
            if (data.timezone) {
                const ipTimezone = data.timezone;
                const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (ipTimezone !== browserTimezone) {
                    isProxySuspect = true;
                }
            }
        } catch (e) {}

        const isIncognito = await detectIncognito();
        const browserDetail = getDetailedBrowserInfo();

        return data.ip ? {
            query: data.ip,
            country: data.country || 'Unknown',
            city: data.city || 'Unknown',
            isp: data.org || 'Unknown',
            timezone: data.timezone || 'Unknown',
            is_proxy: isProxySuspect,
            is_incognito: isIncognito,
            browser_detail: browserDetail
        } : { 
            query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown',
            is_proxy: false, is_incognito: false, browser_detail: navigator.userAgent
        };
    } catch (e) {
        return { 
            query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown',
            is_proxy: false, is_incognito: false, browser_detail: navigator.userAgent
        };
    }
}

// --- CENTRALIZED LOGGING HELPER ---
async function logUserActivity({ userId, userName, activity, deviceName = null, extraReason = null }) {
    try {
        const ipInfo = await getClientIpInfo();
        // Gunakan navigator.userAgent (Raw) agar layout.js bisa memparsing OS & Browser dengan benar
        // Jika deviceName diberikan (dari sesi lama), gunakan itu.
        const userAgent = deviceName || navigator.userAgent;
        
        const ispInfo = { 
            location: `${ipInfo.city}, ${ipInfo.country}`, 
            isp: ipInfo.isp,
            timezone: ipInfo.timezone,
            detected_proxy: ipInfo.is_proxy,
            detected_incognito: ipInfo.is_incognito
        };

        if (extraReason) {
            ispInfo.reason = extraReason;
        }

        const { error } = await supabaseClient.from('activity_logs').insert({
            user_id: userId,
            name: userName,
            activity: activity,
            ip_address: ipInfo.query,
            device: userAgent,
            isp_info: ispInfo
        });

        if (error) console.warn(`Failed to insert activity log (${activity}):`, error.message);

    } catch (err) {
        console.warn(`Failed to log activity (${activity}):`, err);
    }
}
// --- END LOGGING HELPER ---

async function signup(name, email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: name } }
        });
        if (error) throw error;
        
        if (data.user) {
            // Gunakan centralized logging
            await logUserActivity({
                userId: data.user.id,
                userName: name,
                activity: 'Account Registered'
            });
        }
        
        return { success: true };
    } catch (error) { return { success: false, message: error.message }; }
}

async function login(email, password) {
    try {
        let { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (authError) throw authError;

        // Fetch Minimal Profile Data for UI
        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select(`*, plan_gracely (number_plan, name_plan), allow_multilogin, max_devices, last_popup_date, last_expiry_warning_date`)
            .eq('id', authData.user.id)
            .single();

        if (profileError) throw profileError;

        const userPlan = profileData.plan_gracely || {
            number_plan: '001',
            name_plan: 'No Premium'
        };

        const now = new Date().toISOString();
        const clientIp = await getClientIp();
        const userAgent = navigator.userAgent;
        const secureSessionToken = authData.session.access_token;
        const userName = profileData.name || 'User';
        const uniqueSessionID = crypto.randomUUID();

        // Generate device fingerprint untuk session binding
        const deviceFingerprint = await getDeviceFingerprint();
        console.log('Device fingerprint generated for session binding');


        /* 
           MULTI-LOGIN SUPPORT
           Cek setting allow_multilogin dan max_devices dari profile user
        */
        const allowMultilogin = profileData.allow_multilogin || false;
        const maxDevices = profileData.max_devices || 1;

        if (allowMultilogin) {
            // === MULTI-LOGIN ENABLED ===
            // Cek jumlah session yang sudah ada
            const { data: existingSessions } = await supabaseClient
                .from('user_sessions')
                .select('id, device_fingerprint, created_at, device_name')
                .eq('user_id', authData.user.id)
                .order('created_at', { ascending: true }); // Urutkan dari terlama
            
            const sessionCount = existingSessions?.length || 0;
            
            // Cek apakah device ini sudah punya session
            const existingDeviceSession = existingSessions?.find(
                s => s.device_fingerprint === deviceFingerprint
            );
            
            if (existingDeviceSession) {
                // Device yang sama login ulang: Update session yang ada
                console.log('Device sudah terdaftar, update session...');
                await supabaseClient
                    .from('user_sessions')
                    .update({ session_token: uniqueSessionID, device_name: userAgent })
                    .eq('id', existingDeviceSession.id);
            } else if (sessionCount >= maxDevices) {
                // Batas device tercapai: Hapus session paling lama, tambah yang baru
                console.log(`Batas ${maxDevices} device tercapai, hapus session terlama...`);
                
                // LOG: Catat kejadian kick sesi lama akibat batas device
                // Menggunakan centralized logging untuk konsistensi
                const sessionsToDeleteCount = sessionCount - maxDevices + 1;
                const sessionsToDelete = existingSessions.slice(0, sessionsToDeleteCount);
                const sessionIdsToDelete = sessionsToDelete.map(s => s.id);

                await supabaseClient
                    .from('user_sessions')
                    .delete()
                    .in('id', sessionIdsToDelete);

                for (const session of sessionsToDelete) {
                    await logUserActivity({
                        userId: authData.user.id,
                        userName: userName,
                        activity: 'Logout Multi Login',
                        deviceName: session.device_name || 'Unknown Device', // Gunakan device lama yang dihapus
                        extraReason: `Session terlama ditendang: batas ${maxDevices} device tercapai`
                    });
                }

                await supabaseClient.from('user_sessions').insert({
                    user_id: authData.user.id,
                    session_token: uniqueSessionID,
                    device_name: userAgent,
                    device_fingerprint: deviceFingerprint
                });
            } else {
                // Belum capai limit: Tambah session baru
                // console.log(`Menambah device baru (${sessionCount + 1}/${maxDevices})...`);
                await supabaseClient.from('user_sessions').insert({
                    user_id: authData.user.id,
                    session_token: uniqueSessionID,
                    device_name: userAgent,
                    device_fingerprint: deviceFingerprint
                });
            }
        } else {
            // === SINGLE-LOGIN (Default) ===
            // Hapus semua session lama, hanya 1 device yang boleh aktif
            const { data: oldSessions } = await supabaseClient
                .from('user_sessions')
                .select('id, device_name') // Ambil device_name
                .eq('user_id', authData.user.id);

            const { error: deleteError } = await supabaseClient
                .from('user_sessions')
                .delete()
                .eq('user_id', authData.user.id);

            if (deleteError) console.warn("Gagal menghapus session lama:", deleteError);

            // LOG: Catat kick sesi lama hanya jika memang ada sesi lama sebelumnya
            if (oldSessions && oldSessions.length > 0) {
                for (const session of oldSessions) {
                    await logUserActivity({
                        userId: authData.user.id,
                        userName: userName,
                        activity: 'Logout Multi Login',
                        deviceName: session.device_name || 'Unknown Device', // Gunakan device lama
                        extraReason: 'Sesi lama ditendang: login perangkat baru (single-device policy)'
                    });
                }
            }

            await supabaseClient.from('user_sessions').insert({
                user_id: authData.user.id,
                session_token: uniqueSessionID,
                device_name: userAgent,
                device_fingerprint: deviceFingerprint
            });
        }

        // ... existing code ...
        let isCurrentlyPremium = false;

        const expiryDate = profileData.premiumExpiryDate ? new Date(profileData.premiumExpiryDate) : null;
        const proDate = profileData.pro_expiry_date ? new Date(profileData.pro_expiry_date) : null;
        const phantomDate = profileData.phantom_expiry_date ? new Date(profileData.phantom_expiry_date) : null;

        const today = new Date();
        const isPremiumValid = expiryDate && today <= expiryDate;
        const isProValid = proDate && today <= proDate;
        const isPhantomValid = phantomDate && today <= phantomDate;

        // Determine Effective Plan based on Hierarchy: Phantom > Pro > Premium
        let finalPlanName = 'No Premium';
        let finalPlanNumber = '001';

        if (isPhantomValid) {
            finalPlanName = 'The Phantom';
            finalPlanNumber = '004';
        } else if (isProValid) {
            finalPlanName = 'Pro';
            finalPlanNumber = '003';
        } else if (isPremiumValid) {
            finalPlanName = 'Premium';
            finalPlanNumber = '002';
        }

        // Global Active Check
        if (finalPlanNumber !== '001') {
            isCurrentlyPremium = true;
        }

        // Only store purely UI-related data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName);
        localStorage.setItem('isPremium', isCurrentlyPremium); // UI toggle
        localStorage.setItem('userPlanName', finalPlanName);
        localStorage.setItem('userPlanNumber', finalPlanNumber);
        localStorage.setItem('premiumExpiryDate', profileData.premiumExpiryDate);
        localStorage.setItem('proExpiryDate', profileData.pro_expiry_date);
        localStorage.setItem('phantomExpiryDate', profileData.phantom_expiry_date);
        
        // Simpan waktu terakhir popup dari Profil jika ada
        if (profileData.last_popup_date) {
            localStorage.setItem('lastPopupDateDB', profileData.last_popup_date);
        } else {
            localStorage.removeItem('lastPopupDateDB');
        }

        if (profileData.last_expiry_warning_date) {
            localStorage.setItem('lastExpiryWarningDateDB', profileData.last_expiry_warning_date);
        } else {
            localStorage.removeItem('lastExpiryWarningDateDB');
        }

        // IMPORTANT: Store the DB Session ID so script.js can verify it!
        localStorage.setItem('gracely_db_session_id', uniqueSessionID);

        // CLEANUP: Remove legacy items to avoid confusion
        localStorage.removeItem('gracely_config_url');
        localStorage.removeItem('gracelyPremiumConfig');
        // localStorage.removeItem('gracely_db_session_id'); // DO NOT REMOVE THIS!
        localStorage.removeItem('gracely_active_session_token');

        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        if (typeof eraseCookie === 'function') eraseCookie('UnangJahaCookieOnLae');

        // The most important part: The Session Cookie for the Extension
        setCookie('gracely_session_token', secureSessionToken, 30);
        if (authData.session.refresh_token) {
            setCookie('gracely_refresh_token', authData.session.refresh_token, 30);
        }

        await supabaseClient.from('profiles').update({
            last_sign_in: now,
            last_ip: clientIp,
            last_browser: userAgent
        }).eq('id', authData.user.id);

        // Gunakan centralized logging
        await logUserActivity({
            userId: authData.user.id,
            userName: userName,
            activity: 'Logged In'
        });

        return { success: true };
    } catch (error) {
        localStorage.clear();
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');
        eraseCookie('gracely_config_url');
        eraseCookie('gracely_session_token');
        eraseCookie('gracely_refresh_token');
        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: 'Email atau password salah.' };
        }
        return { success: false, message: error.message };
    }
}

async function sendPasswordResetEmail(email) {
    try {
        await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/password.html',
        });
        return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda.' };
    } catch (error) { return { success: false, message: 'Gagal memproses permintaan.' }; }
}

async function updateUserPassword(newPassword) {
    try {
        const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
        if (error) throw error;
        await supabaseClient.auth.signOut();
        return { success: true, message: 'Password berhasil diperbarui! Silakan login ulang.' };
    } catch (error) { return { success: false, message: 'Gagal memperbarui password.' }; }
}

async function updateUserName(newName) {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) throw new Error("Sesi berakhir.");
        const { error } = await supabaseClient.from('profiles').update({ name: newName }).eq('id', user.id);
        if (error) throw error;
        await supabaseClient.auth.updateUser({ data: { full_name: newName } });
        localStorage.setItem('userName', newName);
        return { success: true, message: 'Nama berhasil diperbarui!' };
    } catch (error) { return { success: false, message: error.message }; }
}

// Helper untuk mencatat kapan User melihat popup hari ini
async function updateLastPopupDate(type) {
    try {
        const userId = await getUserId();
        if (!userId) return false;
        
        const now = new Date().toISOString();
        const updateData = {};
        
        if (type === 'info') {
            updateData.last_popup_date = now;
            localStorage.setItem('lastPopupDateDB', now);
        } else if (type === 'expiry') {
            updateData.last_expiry_warning_date = now;
            localStorage.setItem('lastExpiryWarningDateDB', now);
        }

        const { error } = await supabaseClient.from('profiles')
            .update(updateData)
            .eq('id', userId);
            
        if (error) {
            console.warn(`Gagal mengupdate tanggal popup (${type}):`, error.message);
            return false;
        }
        return true;
    } catch (e) {
        console.warn(`Error updating popup date (${type}):`, e);
        return false;
    }
}

async function logout() {
    const userId = await getUserId();
    const currentName = localStorage.getItem('userName') || 'Unknown';
    // Ambil session ID SEBELUM localStorage.clear() dipanggil
    const mySessionId = localStorage.getItem('gracely_db_session_id');

    if (userId) {
        const now = new Date().toISOString();
        await supabaseClient.from('profiles').update({ last_sign_out: now }).eq('id', userId);

        // Hapus session ini dari user_sessions agar login ulang tidak trigger "Logout Multi Login" palsu
        if (mySessionId) {
            try {
                await supabaseClient.from('user_sessions')
                    .delete()
                    .eq('user_id', userId)
                    .eq('session_token', mySessionId);
            } catch (sessErr) { console.warn('Gagal menghapus user_sessions:', sessErr); }
        }

        // Gunakan centralized logging
        await logUserActivity({
            userId: userId,
            userName: currentName,
            activity: 'Logout Manual'
        });
    }

    localStorage.clear();
    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');
    eraseCookie('gracely_session_token');
    eraseCookie('gracely_refresh_token');

    // Explicit trigger for extension to wipe data
    setCookie('UnangJahaCookieOnLae', 'true', 1);

    window.location.href = 'login.html';
}

function isAuthenticated() { return localStorage.getItem('isAuthenticated') === 'true'; }

// CRITICAL SECURITY: Server-side validation untuk multiuser environment
async function requireAuth() {
    // 1. Instant UI check (prevent flash of login page)
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Background server validation menggunakan SECURITY STANDARD (Seperti Ekstensi)
    try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (!token) {
            await logout();
            return;
        }

        // Ambil Fingerprint unik Dasbor ini
        const myBrowserFingerprint = await getDeviceFingerprint();

        // Panggil RPC Keamanan Gracely (Mencocokkan sidik jari dengan isi user_sessions)
        const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_gracely_auth_status`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                p_fingerprint: myBrowserFingerprint 
            })
        });

        if (!rpcResponse.ok) {
            // Jika error jaringan murni (misal Supabase down/RTO), longgarkan
            return;
        }

        const rpcData = await rpcResponse.json();

        // 3. VALIDASI KEPUTUSAN HAKIM
        if (!rpcData || !rpcData.isValid) {
            const reason = rpcData ? rpcData.reason : 'unknown_error';
            
            // JIKA DIVONIS NO_SESSION KARENA DEVICE LIMIT: CERAiKAN!
            if (reason === 'unauthorized' || reason === 'no_session' || reason === 'profile_not_found') {
                console.error("RPC menolak validitas. Alasan:", reason);
                await logout();
                return;
            }
            
            // Jika alasan 'expired' (Paket Habis), Dasbor tetap terbuka (berfungsi sebatas Free Tier)
            // karena session-nya sendiri masih legal.
        }

        // Optional check: Ensure the correct profile is being viewed
        const storedEmail = localStorage.getItem('userEmail');
        const { data: userData } = await supabaseClient.auth.getUser();
        if (userData?.user && storedEmail && userData.user.email !== storedEmail) {
            await logout();
            return;
        }

    } catch (e) {
        // Abaikan Network Error demi kenyamanan User Experience
        // await logout();
    }
}

function redirectIfAuthenticated() { if (isAuthenticated()) { window.location.href = 'dashboard.html'; } }

// --- REALTIME PROFILE LISTENER ---
let profileListenerChannel = null;

async function initRealtimeProfileListener() {
    if (!isAuthenticated() || profileListenerChannel) return;
    
    const userId = await getUserId();
    if (!userId) return;

    // Listen only to changes for THIS user's profile
    profileListenerChannel = supabaseClient.channel(`public:profiles:id=eq.${userId}`)
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
            async (payload) => {
                // console.log('Realtime Profile Update Received:', payload);
                
                const newData = payload.new;
                
                const today = new Date();
                const premiumDate = newData.premiumExpiryDate ? new Date(newData.premiumExpiryDate) : null;
                const proDate = newData.pro_expiry_date ? new Date(newData.pro_expiry_date) : null;
                const phantomDate = newData.phantom_expiry_date ? new Date(newData.phantom_expiry_date) : null;
        
                const isPremiumValid = premiumDate && today <= premiumDate;
                const isProValid = proDate && today <= proDate;
                const isPhantomValid = phantomDate && today <= phantomDate;
        
                // Determine Effective Plan based on Hierarchy: Phantom > Pro > Premium
                let finalPlanName = 'No Premium';
                let finalPlanNumber = '001';
        
                if (isPhantomValid) {
                    finalPlanName = 'The Phantom';
                    finalPlanNumber = '004';
                } else if (isProValid) {
                    finalPlanName = 'Pro';
                    finalPlanNumber = '003';
                } else if (isPremiumValid) {
                    finalPlanName = 'Premium';
                    finalPlanNumber = '002';
                }

                let isCurrentlyPremium = (finalPlanNumber !== '001');

                // Update Local Storage purely UI
                localStorage.setItem('isPremium', isCurrentlyPremium);
                localStorage.setItem('userPlanName', finalPlanName);
                localStorage.setItem('userPlanNumber', finalPlanNumber);

                if (newData.premiumExpiryDate) localStorage.setItem('premiumExpiryDate', newData.premiumExpiryDate);
                else localStorage.removeItem('premiumExpiryDate');

                if (newData.pro_expiry_date) localStorage.setItem('proExpiryDate', newData.pro_expiry_date);
                else localStorage.removeItem('proExpiryDate');

                if (newData.phantom_expiry_date) localStorage.setItem('phantomExpiryDate', newData.phantom_expiry_date);
                else localStorage.removeItem('phantomExpiryDate');

                // FORCE EXTENSION TO WAKE UP AND SYNC via Cookie 
                // Extension usually listens to cookie changes or validates per action
                // Changing the UnangJahaCookieOnLae temporarily triggers reload in background script if configured.
                // We'll set a special sync cookie instead:
                setCookie('gracely_plan_sync', Date.now().toString(), 1); 

                // Dispatch Custom Event so layout.js can re-render dashboard instantly
                document.dispatchEvent(new Event('gracelyPlanRefresh'));
            }
        )
        .subscribe((status) => {
            // console.log('Realtime Subscription Status:', status);
        });
}

// Auto-start listener if authenticated upon load
if (isAuthenticated()) {
    setTimeout(initRealtimeProfileListener, 2000); // Delay slightly to ensure getUserId is ready
}
// --- END REALTIME PROFILE LISTENER ---
