// =================================================================
//                 AUTH.JS
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

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
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

        const { error: profileError } = await supabaseClient
            .from('profiles')
            .insert([
                { 
                    id: data.user.id, 
                    username: name,
                    isPremium: false,
                    premiumExpiryDate: null,
                    configUrl: null
                }
            ]);

        if (profileError) {
            await supabaseClient.auth.signOut();
            throw profileError;
        }

        return { success: true };

    } catch (error) {
        console.error('[auth.js] Signup error:', error.message);
        return { success: false, message: error.message };
    }
}

async function login(email, password) {
    try {
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            throw authError;
        }

        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            throw profileError;
        }

        const isPremium = profileData.isPremium || false;
        const expiryDate = profileData.premiumExpiryDate;
        const configUrl = profileData.configUrl;
        const userName = profileData.username;

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', userName);
        localStorage.setItem('isPremium', isPremium);
        
        setCookie('gracely_active_session', authData.session.access_token, 30);
        setCookie('is_premium', isPremium ? 'true' : 'false', 30);
        
        if (isPremium) {
            localStorage.setItem('premiumExpiryDate', expiryDate);
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
