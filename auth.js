// =================================================================
//                 AUTH.JS (Versi FINAL DAN LENGKAP)
// =================================================================

const SUPABASE_URL = 'https://mujasmmlozswplmtkijr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amFzbW1sb3pzd3BsbXRraWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDM4ODgsImV4cCI6MjA3NzI3OTg4OH0.tttyPcoVUtyPLfBm1irS2qYthzt84Yb0OhjxD-tZ4Nw';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

function eraseCookie(name) {   
    document.cookie = name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

async function signup(name, email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    user_name: name 
                }
            }
        });

        if (error) {
            throw error;
        }

        const userId = data.user.id;
        
        // Cek/Insert ke tabel 'profiles' menggunakan kolom 'username'
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .upsert({ 
                id: userId, 
                username: name,
                isPremium: false,
                premiumExpiryDate: null,
                configUrl: null
            }, { onConflict: 'id' });

        if (profileError) {
            throw profileError;
        }
       
        return { success: true };

    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function login(email, password) {
    try {
        let { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        // Ambil data dari tabel 'profiles'
        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('isPremium, premiumExpiryDate, configUrl, username')
            .eq('id', authData.user.id)
            .single();

        let userName = 'User';
        let isCurrentlyPremium = false;
        let configUrl = null;
        let premiumExpiryDate = null;
        
        if (profileData && profileData.username) {
             // **PERBAIKAN UTAMA: Gunakan kolom 'username' dari tabel profiles**
            userName = profileData.username;
            isCurrentlyPremium = profileData.isPremium || false;
            premiumExpiryDate = profileData.premiumExpiryDate;
            configUrl = profileData.configUrl;

            if (isCurrentlyPremium && premiumExpiryDate) {
                const expiryDate = new Date(premiumExpiryDate);
                const today = new Date();
                isCurrentlyPremium = today <= expiryDate;
            }
        } 
        
        // JANGAN MENGGUNAKAN profileData.name karena skema Anda memakai 'username'
        
        // 4. Set LocalStorage (untuk dashboard.html)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', userName);
        localStorage.setItem('isPremium', isCurrentlyPremium);

        // 5. SET COOKIES
        setCookie('gracely_active_session', 'true', 30);
        setCookie('is_premium', isCurrentlyPremium ? 'true' : 'false', 30);

        if (isCurrentlyPremium && configUrl) {
            localStorage.setItem('premiumExpiryDate', premiumExpiryDate);
            localStorage.setItem('gracelyPremiumConfig', configUrl);
            setCookie('gracely_config_url', configUrl, 30); 
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

async function sendPasswordResetEmail(email) {
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/update-password.html', 
        });

        if (error) {
            // Memberikan pesan error yang lebih umum untuk mencegah enumerasi email
            if (error.message.includes("Email address") && error.message.includes("is invalid")) {
                 return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };
            }
            throw error;
        }

        return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };

    } catch (error) {
        console.error('[auth.js] Password reset error:', error.message);
        return { success: false, message: error.message };
    }
}

async function logout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    
    localStorage.clear();

    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');

    window.location.href = 'login.html';
}

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
