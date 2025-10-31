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

async function getActiveSessionToken(userId) {
    const { data: profiles, error } = await supabaseClient
        .from('profiles')
        .select('active_session_token')
        .eq('id', userId)
        .single();
    if (error) {
        return null;
    }
    return profiles.active_session_token;
}

async function signup(name, email, password) {
    try {
        const { error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: name, last_sign_in: new Date().toISOString() },
            },
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true };

    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function login(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            if (error.message.includes("Invalid login credentials")) {
                return { success: false, message: 'Email atau password salah.' };
            }
            return { success: false, message: error.message };
        }

        const user = data.user;
        const userId = user.id;
        const sessionToken = crypto.randomUUID();
        const now = new Date().toISOString();

        const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ last_sign_in: now, active_session_token: sessionToken })
            .eq('id', userId);

        if (updateError) {}

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', user.user_metadata.full_name || 'User');
        localStorage.setItem('gracely_active_session_token', sessionToken);
        setCookie('gracely_active_session', 'true', 7);

        const { data: profilesData, error: profilesError } = await supabaseClient
            .from('profiles')
            .select('is_premium, premium_expiry_date, config_url')
            .eq('id', userId)
            .single();

        if (!profilesError) {
            const isPremium = profilesData.is_premium;
            const expiryDate = profilesData.premium_expiry_date;
            const configUrl = profilesData.config_url;

            localStorage.setItem('isPremium', isPremium ? 'true' : 'false');
            setCookie('is_premium', isPremium ? 'true' : 'false', 7);

            if (isPremium && expiryDate) {
                localStorage.setItem('premiumExpiryDate', expiryDate);
            } else {
                localStorage.removeItem('premiumExpiryDate');
            }

            if (configUrl) {
                localStorage.setItem('gracelyPremiumConfig', configUrl);
                setCookie('gracely_config_url', configUrl, 7);
            } else {
                localStorage.removeItem('gracelyPremiumConfig');
                eraseCookie('gracely_config_url');
            }
        } else {
            localStorage.setItem('isPremium', 'false');
            setCookie('is_premium', 'false', 7);
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

        if (updateSignOutError) {}
    }
    
    await supabaseClient.auth.signOut();
    
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

window.sendPasswordResetEmail = sendPasswordResetEmail;
window.logout = logout;
window.isAuthenticated = isAuthenticated;
window.requireAuth = requireAuth;
window.redirectIfAuthenticated = redirectIfAuthenticated;
window.login = login;
window.signup = signup;
