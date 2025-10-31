// =================================================================
//                 AUTH.JS (Edisi Final & Diperbaiki)
// =================================================================

// 1. Inisialisasi Klien Supabase
const SUPABASE_URL = 'https://mujasmmlozswplmtkijr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amFzbW1sb3pzd3BsbXRraWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDM4ODgsImV4cCI6MjA3NzI3OTg4OH0.tttyPcoVUtyPLfBm1irS2qYthzt84Yb0OhjxD-tZ4Nw';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// [HELPER FUNCTION] untuk Set Cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Wajib: path=/, SameSite=Lax, Secure
    let cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    document.cookie = cookieString;
}

// [HELPER FUNCTION] untuk Hapus Cookies
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; path=/; SameSite=Lax; Secure';
}


/**
 * Fungsi Signup
 */
async function signup(name, email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name // Metadata yang disimpan di auth.users
                }
            }
        });
        
        if (error) {
            throw error; 
        }

        // PERBAIKAN: Langsung insert ke profiles dengan kolom 'username'
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert({ 
                id: data.user.id, 
                username: name,
                isPremium: false,
                premiumExpiryDate: null,
                configUrl: null
            });
            
        if (profileError) {
             throw profileError;
        }
        
        return { success: true };

    } catch (error) {
        return { success: false, message: error.message };
    }
}


/**
 * Fungsi Login
 */
async function login(email, password) {
    try {
        // 1. Coba login ke Supabase Authentication
        let { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        // 2. Ambil data dari tabel 'profiles'
        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('username, isPremium, premiumExpiryDate, configUrl') // Ambil kolom yang dibutuhkan
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            // Ini akan terjadi jika profil tidak ada
            throw profileError; 
        }

        // 3. Tentukan Nama Pengguna (Menggunakan kolom 'username')
        // PERBAIKAN UTAMA: Ambil nama dari kolom 'username'
        const userName = profileData.username || 'User'; 
        
        // 4. Tentukan Status Premium
        let isCurrentlyPremium = false;
        if (profileData.isPremium && profileData.premiumExpiryDate) {
            const expiryDate = new Date(profileData.premiumExpiryDate);
            const today = new Date();
            // Periksa jika tanggal hari ini <= tanggal kedaluwarsa
            if (today <= expiryDate) {
                isCurrentlyPremium = true;
            }
        }
        
        // 5. Set LocalStorage (untuk dashboard.html)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName); // Nama sudah benar
        localStorage.setItem('isPremium', isCurrentlyPremium);

        // 6. SET COOKIES (untuk ekstensi background.js)
        setCookie('gracely_active_session', 'true', 30);
        setCookie('is_premium', isCurrentlyPremium ? 'true' : 'false', 30);

        if (isCurrentlyPremium && profileData.configUrl) {
            localStorage.setItem('premiumExpiryDate', profileData.premiumExpiryDate);
            localStorage.setItem('gracelyPremiumConfig', profileData.configUrl);
            setCookie('gracely_config_url', profileData.configUrl, 30);
        } else {
            localStorage.removeItem('premiumExpiryDate');
            localStorage.removeItem('gracelyPremiumConfig');
            eraseCookie('gracely_config_url');
        }

        return { success: true };

    } catch (error) {
        console.error('[auth.js] Login error:', error.message);
        localStorage.clear();
        
        // Hapus semua cookies saat gagal login
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');

        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: 'Email atau password salah.' };
        }
        return { success: false, message: error.message };
    }
}

/**
 * Fungsi Reset Password
 */
async function sendPasswordResetEmail(email) {
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/update-password.html', 
        });

        if (error) {
            // Memberikan pesan error yang lebih umum untuk mencegah enumerasi email
            // (Ini mengatasi error Supabase yang mengatakan email tidak valid)
            return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };
        }

        return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };

    } catch (error) {
        console.error('[auth.js] Password reset error:', error.message);
        return { success: false, message: error.message };
    }
}

/**
 * Fungsi Logout
 */
async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    
    localStorage.clear();

    // Hapus semua cookies
    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');

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
