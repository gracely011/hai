(function () {
    var a = ["gracely011.github.io", "localhost", "127.0.0.1"],
        h = window.location.hostname,
        p = window.location.pathname,
        o = !1;
    for (var i = 0; i < a.length; i++)
        if (h === a[i]) {
            o = !0;
            break
        }
    if (o && h === "gracely011.github.io" && !p.startsWith("/hai/")) {
        o = !1
    }
    o || (window.location.href = "https://gracely011.github.io/hai/")
})();

// --- AGGRESSIVE CLEANUP START ---
(function cleanupLegacy() {
    try {
        // 1. Force delete the old cookie path
        document.cookie = "gracely_session_token=; Max-Age=-99999999; path=/hai/; SameSite=Lax; Secure";
        console.log("Cleaned up legacy /hai/ cookie.");

        // 2. Remove legacy Local Storage
        // NOTE: DO NOT remove 'gracely_db_session_id', it is needed for script.js session safety check!
        const keysToRemove = [
            'gracely_config_url',
            'gracelyPremiumConfig',
            'gracely_active_session_token'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log("Cleaned up legacy Local Storage configuration.");
    } catch (e) { console.warn("Cleanup warning:", e); }
})();
// --- AGGRESSIVE CLEANUP END ---

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
        }
    } else if (event === 'SIGNED_OUT') {
        eraseCookie('gracely_session_token');
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

        // isPremium is TRUE if ANY plan is valid
        const isPremium = (isPremiumValid || isProValid || isPhantomValid);

        return {
            isPremium: isPremium,
            premiumExpiryDate: data.premiumExpiryDate,
            proExpiryDate: data.pro_expiry_date,
            phantomExpiryDate: data.phantom_expiry_date,
            planName: plan.name_plan,
            planNumber: plan.number_plan
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

async function getClientIpInfo() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=331facddfc11cf');
        const data = await response.json();
        return data.ip ? {
            query: data.ip,
            country: data.country || 'Unknown',
            city: data.city || 'Unknown',
            isp: data.org || 'Unknown'
        } : { query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    } catch (e) {
        return { query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    }
}

async function signup(name, email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: name } }
        });
        if (error) throw error;
        try {
            const ipInfo = await getClientIpInfo();
            const userAgent = navigator.userAgent;
            if (data.user) {
                await supabaseClient.from('activity_logs').insert({
                    user_id: data.user.id,
                    name: name,
                    activity: 'Account Registered',
                    ip_address: ipInfo.query,
                    device: userAgent,
                    isp_info: { location: `${ipInfo.city}, ${ipInfo.country}`, isp: ipInfo.isp }
                });
            }
        } catch (logError) { console.warn("Log signup failed:", logError); }
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
            .select(`*, plan_gracely (number_plan, name_plan)`) // configurl removed
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

        /* 
           Website no longer manages active sessions for the Extension logic.
           We simply insert a log and let the Extension handle its own session checks.
        */

        // 1. DELETE OLD SESSIONS for this user to enforce single session
        const { error: deleteError } = await supabaseClient
            .from('user_sessions')
            .delete()
            .eq('user_id', authData.user.id);

        if (deleteError) console.warn("Failed to clear old sessions:", deleteError);

        // 2. INSERT NEW SESSION
        const { error: sessionError } = await supabaseClient.from('user_sessions').insert({
            user_id: authData.user.id,
            session_token: uniqueSessionID,
            device_name: userAgent
        });

        let isCurrentlyPremium = false;
        if (profileData.premiumExpiryDate) {
            const expiryDate = new Date(profileData.premiumExpiryDate);
            const today = new Date();
            if (today <= expiryDate && userPlan.number_plan !== '001') {
                isCurrentlyPremium = true;
            }
        }

        // Only store purely UI-related data
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName);
        localStorage.setItem('isPremium', isCurrentlyPremium); // UI toggle
        localStorage.setItem('userPlanName', userPlan.name_plan);
        localStorage.setItem('userPlanNumber', userPlan.number_plan);
        localStorage.setItem('premiumExpiryDate', profileData.premiumExpiryDate);
        localStorage.setItem('proExpiryDate', profileData.pro_expiry_date);
        localStorage.setItem('phantomExpiryDate', profileData.phantom_expiry_date);

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

        await supabaseClient.from('profiles').update({
            last_sign_in: now,
            last_ip: clientIp,
            last_browser: userAgent
        }).eq('id', authData.user.id);

        try {
            const ipInfo = await getClientIpInfo();
            await supabaseClient.from('activity_logs').insert({
                user_id: authData.user.id,
                name: userName,
                activity: 'Logged In',
                ip_address: ipInfo.query,
                device: userAgent,
                isp_info: { location: `${ipInfo.city}, ${ipInfo.country}`, isp: ipInfo.isp }
            });
        } catch (logError) { console.warn("Log login failed:", logError); }

        return { success: true };
    } catch (error) {
        localStorage.clear();
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');
        eraseCookie('gracely_session_token');
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

async function logout() {
    const userId = await getUserId();
    const currentName = localStorage.getItem('userName') || 'Unknown';
    if (userId) {
        const now = new Date().toISOString();
        await supabaseClient.from('profiles').update({ last_sign_out: now }).eq('id', userId);
        try {
            const ipInfo = await getClientIpInfo();
            const userAgent = navigator.userAgent;
            await supabaseClient.from('logoutactivity_logs').insert({
                user_id: userId,
                name: currentName,
                activity: 'Logged Out',
                ip_address: ipInfo.query,
                device: userAgent,
                isp_info: { location: `${ipInfo.city}, ${ipInfo.country}`, isp: ipInfo.isp }
            });
        } catch (logError) { console.warn("Log logout failed:", logError); }
    }

    // Explicitly delete session from DB if we can track it (current implementation creates new UUID on login, so we can't easily delete specifi one unless we tracked it locally, which user asked us to remove from local storage. So we rely on Extension's multi-login detection or just simple logout.)

    localStorage.clear();
    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');
    eraseCookie('gracely_session_token');

    // Explicit trigger for extension to wipe data
    setCookie('UnangJahaCookieOnLae', 'true', 1);

    window.location.href = 'login.html';
}

function isAuthenticated() { return localStorage.getItem('isAuthenticated') === 'true'; }
function requireAuth() { if (!isAuthenticated()) { window.location.href = 'login.html'; } }
function redirectIfAuthenticated() { if (isAuthenticated()) { window.location.href = 'dashboard.html'; } }
