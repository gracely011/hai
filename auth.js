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
    const { data } = await supabaseClient
        .from('profiles')
        .select('active_session_token')
        .eq('id', userId)
        .single();

    return data ? data.active_session_token : null;
}

async function setActiveSessionToken(userId, token) {
    await supabaseClient
        .from('profiles')
        .update({ active_session_token: token, last_sign_in: new Date().toISOString() })
        .eq('id', userId);
}

async function signup(name, email, password) {
    try {
        const { data: { user }, error: authError } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (authError) {
            if (authError.message.includes("already registered")) {
                return { success: false, message: 'User already registered' };
            }
            throw authError;
        }

        if (user) {
            const { error: insertError } = await supabaseClient
                .from('profiles')
                .insert([
                    { id: user.id, full_name: name, email: email }
                ]);
        
            if (insertError) {
                throw insertError;
            }
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
            throw error;
        }

        const user = data.user;
        const userId = user.id;
        const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        await setActiveSessionToken(userId, sessionToken);

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', user.user_metadata.full_name || 'User');
        localStorage.setItem('gracely_active_session_token', sessionToken);
        setCookie('gracely_active_session', 'true', 30);
        
        const { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('is_premium, premium_expiry_date, gracely_premium_config_url')
            .eq('id', userId)
            .single();

        if (profileError) {
            throw new Error('Gagal mengambil data profil.');
        }

        if (profileData.is_premium) {
            setCookie('is_premium', 'true', 30);
            setCookie('gracely_config_url', profileData.gracely_premium_config_url, 30);
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumExpiryDate', profileData.premium_expiry_date);
            localStorage.setItem('gracelyPremiumConfig', profileData.gracely_premium_config_url);
        } else {
            eraseCookie('is_premium');
            eraseCookie('gracely_config_url');
            localStorage.removeItem('isPremium');
            localStorage.removeItem('premiumExpiryDate');
            localStorage.removeItem('gracelyPremiumConfig');
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
        await supabaseClient
            .from('profiles')
            .update({ last_sign_out: now })
            .eq('id', userId);
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
