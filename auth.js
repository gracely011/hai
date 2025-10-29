// =================================================================
//                 AUTH.JS (Versi SUPABASE)
//         GANTIKAN SEMUA FILE LAMA ANDA DENGAN INI
// =================================================================

// 1. Inisialisasi Klien Supabase (API Key Anda di sini)
const SUPABASE_URL = 'https://mujasmmozswplmtkijr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11amFzbW1sb3pzd3BsbXRraWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDM4ODgsImV4cCI6MjA3NzI3OTg4OH0.tttyPcoVUtyPLfBm1irS2qYthzt84Yb0OhjxD-tZ4Nw';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/**
 * [DIROMBAK] Fungsi Login Baru
 * Menghubungi Supabase untuk login & mengambil data profil
 */
async function login(email, password) {
    try {
        // 1. Coba login ke Supabase Authentication
        let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            // Jika error (misal: password salah)
            throw authError;
        }

        // 2. Jika login berhasil, ambil data dari tabel 'profiles'
        //    (Ini butuh RLS Policy SELECT yang sudah kita buat)
        let { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*') // Ambil semua kolom (name, isPremium, configUrl, dll)
            .eq('id', authData.user.id) // Cari yang ID-nya cocok
            .single(); // Kita tahu hasilnya pasti cuma 1

        if (profileError) {
            // Jika error (misal: RLS belum diatur)
            throw profileError;
        }

        // 3. SUKSES! Simpan semua data ke LocalStorage
        //    (Kita gunakan key yang sama persis dengan auth.js lama Anda
        //     agar dashboard.html dan layout.js tidak error)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', authData.user.email);
        localStorage.setItem('userName', profileData.name);
        
        // Cek apakah premium masih aktif
        let isCurrentlyPremium = false;
        if (profileData.isPremium && profileData.premiumExpiryDate) {
            const expiryDate = new Date(profileData.premiumExpiryDate);
            const today = new Date();
            if (today <= expiryDate) {
                isCurrentlyPremium = true;
            }
        }
        
        localStorage.setItem('isPremium', isCurrentlyPremium);

        if (isCurrentlyPremium) {
            localStorage.setItem('premiumExpiryDate', profileData.premiumExpiryDate);
            localStorage.setItem('gracelyPremiumConfig', profileData.configUrl);
        } else {
            // Hapus data premium jika sudah kedaluwarsa atau non-premium
            localStorage.removeItem('premiumExpiryDate');
            localStorage.removeItem('gracelyPremiumConfig');
        }

        return { success: true };

    } catch (error) {
        console.error('[auth.js] Login error:', error.message);
        // Hapus sisa-sisa login yang gagal
        localStorage.clear();
        
        // Berikan pesan error yang lebih ramah
        if (error.message.includes("Invalid login credentials")) {
            return { success: false, message: 'Email atau password salah.' };
        }
        if (error.message.includes("profiles violates row-level security policy")) {
             return { success: false, message: 'Keamanan (RLS) belum diatur. Cek Dasbor Supabase.' };
        }
        
        return { success: false, message: error.message };
    }
}

/**
 * [DIPERBARUI] Fungsi Logout Baru
 * Sekarang juga memanggil supabase.auth.signOut()
 */
async function logout() {
    // 1. Beritahu Supabase untuk logout
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error.message);
    }
    
    // 2. Hapus semua data dari LocalStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumExpiryDate');
    localStorage.removeItem('gracelyPremiumConfig');

    // 3. Hapus cookie lama (jika ada - ini dari auth.js lama Anda)
    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');

    // 4. Arahkan ke halaman login
    window.location.href = 'login.html';
}

/**
 * [TETAP SAMA] Fungsi-fungsi ini masih bekerja
 * karena mereka membaca dari LocalStorage
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

// Helper dari auth.js lama Anda (ditaruh di bawah agar rapi)
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}
