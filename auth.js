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

function decodeGracelyToken(token) {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodedPayload);
        
        let isCurrentlyPremium = false;
        if (payload.premium && payload.expiry) {
            const expiryDate = new Date(payload.expiry);
            const today = new Date();
            if (today <= expiryDate) {
                isCurrentlyPremium = true;
            }
        }
        
        return {
            ...payload,
            isCurrentlyPremium: isCurrentlyPremium
        };
    } catch (e) {
        console.error("Gagal decode token:", e);
        return null;
    }
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
            .select('session_id, allow_multilogin, gracelyToken')
            .eq('id', userId)
            .single();

        return data;

    } catch (error) {
        return null;
    }
}

async function getPremiumStatus(userId) {
    // Fungsi ini tidak lagi mengambil status, tapi token
    // Fungsi ini sekarang digantikan oleh getActiveSessionToken
    // Kita biarkan kosong agar tidak error jika dipanggil di tempat lama
    return null;
}

async function generateGracelyToken(userId, userAccessToken) {
    const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/generate-token`;
    
    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccessToken}`, 
            },
            body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal membuat token premium.');
        }

        const data = await response.json();
        return data.gracelyToken;
    } catch (error) {
        console.error("Error generating token:", error);
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
                config_hash: null,
                gracelyToken: null
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
        const supabaseSessionId = authData.session.access_token;

        let { data: profileData, error: profileError } = await supabaseClient
            .from('profiles')
            .select('name') 
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            throw profileError;
        }
        
        const userName = profileData.name || 'User';

        // Panggil Edge Function untuk membuat token aman
        const gracelyToken = await generateGracelyToken(authData.user.id, supabaseSessionId);

        if (!gracelyToken) {
            return { success: false, message: 'Login gagal: Gagal mengamankan token sesi premium.' };
        }

        const { error: updateSignInError } = await supabaseClient
            .from('profiles')
            .update({ 
                last_sign_in: now,
                last_ip: clientIp,
                last_browser: userAgent,
                session_id: supabaseSessionId,
                gracelyToken: gracelyToken
            })
            .eq('id', authData.user.id);
            
        if (updateSignInError) {
             console.warn(updateSignInError.message);
        }

        // Hapus semua penyimpanan lama
        localStorage.clear();
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');

        // Simpan data sesi baru yang aman
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', userName); 
        localStorage.setItem('gracelyToken', gracelyToken);
        
        // Simpan token Supabase (dibutuhkan untuk session kick)
        localStorage.setItem('gracely_active_session_token', supabaseSessionId);

        setCookie('gracely_active_session', 'true', 30); 

        return { success: true };

    } catch (error) {
        localStorage.clear();
        eraseCookie('gracely_active_session');
        eraseCookie('is_premium');
        eraseCookie('gracely_config_url');
        localStorage.removeItem('gracely_active_session_token');
        localStorage.removeItem('gracelyToken');

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
            .update({ 
                last_sign_out: now,
                gracelyToken: null,
                session_id: null
             })
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
    localStorage.removeItem('gracelyToken');

    window.location.href = 'login.html';
}

function isAuthenticated() {
    // Status login sekarang tergantung pada keberadaan gracelyToken
    return localStorage.getItem('gracelyToken') ? true : false;
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
