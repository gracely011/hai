// =================================================================
//                 AUTH.JS (Final dengan Log Sign In/Out)
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
    let cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    document.cookie = cookieString;
}

// [HELPER FUNCTION] untuk Hapus Cookies
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; path=/; SameSite=Lax; Secure';
}

// [HELPER FUNCTION] untuk mendapatkan user ID
async function getUserId() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.id : null;
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
                    full_name: name 
                }
            }
        });
        
        if (error) {
            throw error; 
        }

        // Insert baris ke tabel 'profiles' dengan kolom baru (NULL)
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert({ 
                id: data.user.id, 
                name: name, 
                isPremium: false,
                premiumExpiryDate: null,
                configUrl: null,
                session_id: null,
                last_sign_in: null, // Kolom baru
                last_sign_out: null // Kolom baru
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
        let { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }
        
        // ** PERBAIKAN: UPDATE last_sign_in sebelum mengambil profile **
        const now = new Date().toISOString();
        const { error: updateSignInError } = await supabaseClient
            .from('profiles')
            .update({ last_sign_in: now })
            .eq('id', authData.user.id);
            
        if (updateSignInError) {
             console.warn("Gagal update last_sign_in:", updateSignInError.message);
        }

        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*') 
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            throw profileError;
        }

        const userName = profileData.name || 'User'; 
        
        let isCurrentlyPremium = false;
        if (profileData.isPremium && profileData.premiumExpiryDate) {
            const expiryDate = new Date(profileData.premiumExpiryDate);
            const today = new Date();
            if (today <= expiryDate) {
                isCurrentlyPremium = true;
            }
        }
        
        // Set LocalStorage 
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName); 
        localStorage.setItem('isPremium', isCurrentlyPremium);

        // SET COOKIES 
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
        await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/update-password.html', 
        });

        return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };

    } catch (error) {
        console.error('[auth.js] Password reset error:', error.message);
        return { success: false, message: 'Gagal memproses permintaan. Silakan coba lagi.' };
    }
}

/**
 * Fungsi Logout
 */
async function logout() {
    const userId = await getUserId();
    
    // 1. **PERBAIKAN**: UPDATE last_sign_out di tabel profiles
    if (userId) {
        const now = new Date().toISOString();
        const { error: updateSignOutError } = await supabaseClient
            .from('profiles')
            .update({ last_sign_out: now })
            .eq('id', userId);

        if (updateSignOutError) {
            console.warn("Gagal update last_sign_out:", updateSignOutError.message);
        }
    }
    
    // 2. Sign out dari Supabase Auth
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    
    // 3. Bersihkan cache lokal
    localStorage.clear();

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
