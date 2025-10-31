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
    if (!userId) return null;
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('active_session_token')
        .eq('id', userId)
        .single();
    if (error) {
        console.error(error.message);
        return null;
    }
    return data ? data.active_session_token : null;
}

async function signup(name, email, password) {
    try {
        const { data: { user }, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { full_name: name }
            }
        });

        if (error) {
            throw error;
        }
        
        const userId = user.id;

        const { error: insertError } = await supabaseClient
            .from('profiles')
            .insert([
                { id: userId, full_name: name, email: email }
            ]);

        if (insertError) {
            console.error(insertError.message);
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
        const sessionToken = crypto.randomUUID();
        const now = new Date().toISOString();

        const { data: updateData, error: updateError } = await supabaseClient
            .from('profiles')
            .update({ active_session_token: sessionToken, last_sign_in: now })
            .eq('id', user.id)
            .select();

        if (updateError) {
            throw new Error(updateError.message);
        }

        const userName = updateData[0].full_name;

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', userName);
        localStorage.setItem('gracely_active_session_token', sessionToken);
        setCookie('gracely_active_session', 'true', 30);
        
        const { data: premiumData } = await supabaseClient
            .from('premium_users')
            .select('expiry_date, config_url')
            .eq('user_id', user.id)
            .single();

        if (premiumData && new Date(premiumData.expiry_date) > new Date()) {
            const expiryDate = new Date(premiumData.expiry_date);
            localStorage.setItem('isPremium', 'true');
            localStorage.setItem('premiumExpiryDate', expiryDate.toISOString());
            localStorage.setItem('gracelyPremiumConfig', JSON.stringify({ config_url: premiumData.config_url }));
            setCookie('is_premium', 'true', 30);
            setCookie('gracely_config_url', premiumData.config_url, 30);
        } else {
            localStorage.removeItem('isPremium');
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
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://gracely011.github.io/hai/update-password.html',
        });

        if (error) {
            throw error;
        }

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
    
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error(error.message);
    }
    
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
