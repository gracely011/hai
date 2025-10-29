// =================================================================
//                 AUTH.JS (Versi SUPABASE - PERBAIKAN)
//         Memperbaiki error "Cannot access 'supabase' before initialization"
// =================================================================

// 1. Inisialisasi Klien Supabase
const SUPABASE_URL = 'https://mujasmmozswplmtkijr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amFzbW1sb3pzd3BsbXRraWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDM4ODgsImV4cCI6MjA3NzI3OTg4OH0.tttyPcoVUtyPLfBm1irS2qYthzt84Yb0OhjxD-tZ4Nw';

// [PERBAIKAN]
// Kita panggil fungsi 'createClient' dari 'supabase' (global, dari CDN)
// dan simpan di variabel baru 'supabaseClient' agar tidak tabrakan nama.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/**
 * [BARU] Fungsi Signup
 * Mendaftar pengguna baru ke Supabase Auth
 */
async function signup(name, email, password) {
    try {
        // [PERBAIKAN] Menggunakan 'supabaseClient'
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name 
                }
            }
        });
        
        if (error) {
            throw error; // Lempar error jika ada
        }
        
        // Sukses
        return { success: true, data: data };

    } catch (error) {
        // Tampilkan Error
        return { success: false, message: error.message };
    }
}


/**
 * Fungsi Login
 * Menghubungi Supabase untuk login & mengambil data profil
 */
async function login(email, password) {
    try {
        // 1. Coba login
        // [PERBAIKAN] Menggunakan 'supabaseClient'
        let { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        // 2. Jika login berhasil, ambil data dari tabel 'profiles'
        // [PERBAIKAN] Menggunakan 'supabaseClient'
        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*') 
            .eq('id', authData.user.id)
            .single(); 

        if (profileError) {
            throw profileError;
        }

        // 3. SUKSES! Simpan semua data ke LocalStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', profileData.name);
        
        // Cek apakah premium masih aktif
        let isCurrentlyPremium = false;
        if (profileData.isPremium && profileData.premiumExpiryDate) {
            const expiryDate = new Date(profileData.premiumExpiryDate);
            const today = new Date();
            if (today <= expiryDate) {
                isCurrentlyPremium = true;
            }
        }
        
        localStorage.setItem('isPremium', isCurrentlyPremium);

        if (isCurrentlyPremium) {
            localStorage.setItem('premiumExpiryDate', profileData.premiumExpiryDate);
            localStorage.setItem('gracelyPremiumConfig', profileData.configUrl);
        } else {
            localStorage.removeItem('premiumExpiryDate');
            localStorage.removeItem('gracelyPremiumConfig');
        }
        
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');

        return { success: true };

    } catch (error) {
        console.error('[auth.js] Login error:', error.message);
        localStorage.clear();
        
        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: 'Email atau password salah.' };
        }
        if (error.message.includes("profiles violates row-level security policy")) {
             return { success: false, message: 'Keamanan (RLS) belum diatur. Cek Dasbor Supabase.' };
        }
        
        return { success: false, message: error.message };
    }
}

/**
 * Fungsi Logout Baru
 */
async function logout() {
    // 1. Beritahu Supabase untuk logout
    // [PERBAIKAN] Menggunakan 'supabaseClient'
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    
    // 2. Hapus semua data dari LocalStorage
    localStorage.clear();

    // 3. Hapus cookie lama
    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');

    // 4. Arahkan ke halaman login
    window.location.href = 'login.html';
}

/**
 * Fungsi Helper (Tidak Berubah)
 */
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}
