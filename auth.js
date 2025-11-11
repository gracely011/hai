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
    let cookieString = name + "=" + (value || "") + expires + "; path=/hai/; SameSite=Lax; Secure";
    document.cookie = cookieString;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
    document.cookie = name + '=; Max-Age=-99999999; path=/hai/; SameSite=Lax; Secure';
}

async function getUserId() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user ? user.id : null;
}

// FUNGSI LAMA (TETAP ADA) - Untuk keamanan 'HBO Style' di script.js
async function getClientIp() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip || 'Unknown';
    } catch (e) {
        return 'Unknown';
    }
}

// ==== FUNGSI BARU (DITAMBAHKAN) - Untuk mencatat log ====
async function getClientIpInfo() {
    try {
        // Kita pakai http://ip-api.com untuk data lengkap
        const response = await fetch('http://ip-api.com/json?fields=query,country,city,isp');
        const data = await response.json();
        if (data.query) {
            return data;
        } else {
            return { query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
        }
    } catch (e) {
        return { query: 'Unknown', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    }
}
// ==== AKHIR FUNGSI BARU ====


async function getActiveSessionToken(userId) {
    if (!userId) return null;
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('session_id, allow_multilogin, last_ip, last_browser')
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
        
        // ==== KODE LOG BARU (DITAMBAHKAN) ====
        try {
            const ipInfo = await getClientIpInfo();
            const userAgent = navigator.userAgent;
            await supabaseClient
                .from('activity_logs')
                .insert({ 
                    user_id: data.user.id, 
                    activity: 'Account Registered',
                    ip_address: ipInfo.query,
                    device: userAgent,
                    isp_info: { 
                        location: `${ipInfo.city}, ${ipInfo.country}`,
                        isp: ipInfo.isp
                    }
                });
        } catch (logError) {
            console.warn("Gagal mencatat log signup:", logError.message);
        }
        // ==== AKHIR KODE LOG BARU ====

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
        const clientIp = await getClientIp(); // Ini tetap pakai fungsi lama (string)
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
                last_ip: clientIp, // Ini tetap string, jadi aman
                last_browser: userAgent,
                session_id: sessionId,
                config_hash: configHash 
            })
            .eq('id', authData.user.id);
        if (updateSignInError) {
             console.warn(updateSignInError.message);
        }

        // ==== KODE LOG BARU (DITAMBAHKAN) ====
        try {
            const ipInfo = await getClientIpInfo(); // Panggil fungsi baru untuk data lengkap
            await supabaseClient
                .from('activity_logs')
                .insert({ 
                    user_id: authData.user.id, 
                    activity: 'Logged In',
                    ip_address: ipInfo.query,
                    device: userAgent,
                    isp_info: { 
                        location: `${ipInfo.city}, ${ipInfo.country}`,
                        isp: ipInfo.isp
                    }
                });
        } catch (logError) {
            console.warn("Gagal mencatat log login:", logError.message);
        }
        // ==== AKHIR KODE LOG BARU ====

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', userName); 
        localStorage.setItem('isPremium', isCurrentlyPremium);
        localStorage.setItem('gracely_active_session_token', authData.session.access_token);
        setCookie('gracely_active_session', 'true', 30); 
        setCookie('is_premium', isCurrentlyPremium ? 'true' : 'false', 30);
        if (typeof eraseCookie === 'function') eraseCookie('UnangJahaCookieOnLae');
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

async function updateUserPassword(newPassword) {
    try {
        const { data, error } = await supabaseClient.auth.updateUser({
            password: newPassword
        });
        if (error) {
            throw error;
        }
        await supabaseClient.auth.signOut();
        return { success: true, message: 'Password Anda telah berhasil diperbarui! Anda akan diarahkan ke halaman login.' };
    } catch (error) {
        let userMessage = 'Gagal memperbarui password. Silakan coba lagi.';
        if (error.message.includes("Password should be at least 6 characters")) {
            userMessage = 'Password minimal harus 6 karakter.';
        }
        if (error.message.includes("session is missing") || error.message.includes("Auth session missing")) {
            userMessage = 'Sesi Anda tidak valid atau sudah kadaluarsa. Silakan minta tautan reset baru.';
        }
        return { success: false, message: userMessage };
    }
}

async function updateUserName(newName) {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            throw new Error("Pengguna tidak ditemukan. Sesi mungkin telah berakhir.");
        }

        if (!newName || newName.length < 3) {
            return { success: false, message: 'Nama harus diisi (minimal 3 karakter).' };
        }

        const { error } = await supabaseClient
            .from('profiles')
            .update({ name: newName })
            .eq('id', user.id);

        if (error) {
            throw error;
        }
        
        await supabaseClient.auth.updateUser({
            data: { full_name: newName }
        });

        localStorage.setItem('userName', newName);

        return { success: true, message: 'Nama berhasil diperbarui!' };

    } catch (error) {
        console.error("Error updating name:", error.message);
        return { success: false, message: 'Gagal memperbarui nama: ' + error.message };
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
