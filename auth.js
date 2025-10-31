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
    document.cookie = name + '=; Max-Age=-99999999; path=/; path=/; SameSite=Lax; Secure';
}

async function getUserId() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.id : null;
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

async function getActiveSessionToken(userId) {
    if (!userId) return null;
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('session_id, allow_multilogin')
            .eq('id', userId)
            .single();

        return data;

    } catch (error) {
        return null;
    }
}

async function getPremiumStatus(userId) {
    if (!userId) return null;
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('isPremium, premiumExpiryDate, configUrl')
            .eq('id', userId)
            .single();

        return data; 

    } catch (error) {
        return null;
    }
}

async function signup(name, email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: name }
            }
        });
        
        if (error) {
            throw error; 
        }

        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert({ 
                id: data.user.id, 
                name: name, 
                isPremium: false,
                premiumExpiryDate: null,
                configUrl: null,
                session_id: null,
                last_sign_in: null, 
                last_sign_out: null,
                last_ip: null,
                last_browser: null,
                config_hash: null
            });
            
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
        
        const now = new Date().toISOString();
        const clientIp = await getClientIp();
        const userAgent = navigator.userAgent; 
        const sessionId = authData.session.access_token;

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
        
        const configHash = isCurrentlyPremium ? profileData.configUrl.substring(0, 8) : 'NULL';

        const { error: updateSignInError } = await supabaseClient
            .from('profiles')
            .update({ 
                last_sign_in: now,
                last_ip: clientIp,
                last_browser: userAgent,
                session_id: sessionId,
                config_hash: configHash 
            })
            .eq('id', authData.user.id);
            
        if (updateSignInError) {
             console.warn(updateSignInError.message);
        }

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName); 
        localStorage.setItem('isPremium', isCurrentlyPremium);
        localStorage.setItem('gracely_active_session_token', authData.session.access_token);

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
        localStorage.clear();
        
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');
        localStorage.removeItem('gracely_active_session_token');

        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: 'Email atau password salah.' };
        }
        return { success: false, message: error.message };
    }
}

async function sendPasswordResetEmail(email) {
    try {
        await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/update-password.html', 
        });

        return { success: true, message: 'Jika email terdaftar, tautan reset kata sandi telah dikirim ke kotak masuk Anda. Harap cek folder spam/sampah.' };

    } catch (error) {
        return { success: false, message: 'Gagal memproses permintaan. Silakan coba lagi.' };
    }
}

async function logout() {
    const userId = await getUserId();
    
    if (userId) {
        const now = new Date().toISOString();
        const { error: updateSignOutError } = await supabaseClient
            .from('profiles')
            .update({ last_sign_out: now })
            .eq('id', userId);

        if (updateSignOutError) {
            console.warn(updateSignOutError.message);
        }
    }
    
    // ===== PERUBAHAN UTAMA DI SINI =====
    // Kita tidak memanggil 'supabaseClient.auth.signOut()'
    // Kita lakukan logout manual di sisi klien
    
    localStorage.clear();

    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');
    localStorage.removeItem('gracely_active_session_token');

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
