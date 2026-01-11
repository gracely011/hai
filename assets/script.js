/* =========================================
   1. SECURITY & CONFIG (Gracely Core)
   ========================================= */

// Domain Protection: Mencegah kode dijalankan di domain lain
(function() {
    var allowedDomains = ["gracely011.github.io", "localhost", "127.0.0.1"];
    var hostname = window.location.hostname;
    var pathname = window.location.pathname;
    
    // Khusus GitHub Pages, harus di subfolder /hai/
    var isValid = false;
    for (var i = 0; i < allowedDomains.length; i++) {
        if (hostname === allowedDomains[i]) {
            isValid = true;
            break;
        }
    }
    
    // Strict check untuk GitHub Pages
    if (isValid && hostname === "gracely011.github.io" && !pathname.startsWith("/hai/")) {
        isValid = false;
    }
    
    if (!isValid) {
        // Redirect jika domain salah
        window.location.href = "https://gracely011.github.io/hai/";
    }
})();

// Session Watchdog (Fitur SATPAM): Cek apakah akun login di device lain
async function startSessionCheckLoop() {
    if (typeof isAuthenticated !== 'function' || !isAuthenticated()) {
        return; 
    }

    // Loop setiap 5 detik
    setInterval(async () => {
        const localSessionID = localStorage.getItem('gracely_db_session_id');
        
        // Jika tidak ada session ID di local, tapi dianggap login -> Logout paksa
        if (!localSessionID && isAuthenticated()) {
            if (typeof logout === 'function') await logout();
            return;
        }

        if (localSessionID && typeof supabaseClient !== 'undefined') {
            try {
                // Cek ke database apakah session ID ini masih valid
                const { data, error } = await supabaseClient
                    .from('user_sessions')
                    .select('session_token')
                    .eq('session_token', localSessionID)
                    .single();

                // Jika error (tidak ketemu di DB), berarti sudah dilogout dari device lain
                if (error || !data) {
                    console.warn("Sesi tidak valid atau telah berakhir di perangkat lain.");
                    if (typeof logout === 'function') await logout();
                }
            } catch (err) {
                // Silent error (koneksi putus dll), biarkan saja
            }
        }
    }, 5000); 
}

/* =========================================
   2. TRANSLATION SYSTEM (Groupy Feature)
   ========================================= */

const translations = {
    // Navigasi
    nav_home: { en: "Home", id: "Beranda" },
    nav_features: { en: "Features", id: "Fitur" },
    nav_about: { en: "About", id: "Tentang" },
    nav_pricing: { en: "Pricing", id: "Harga" },
    nav_services: { en: "Services", id: "Layanan" },
    btn_login: { en: "Log In", id: "Masuk" },
    btn_signup: { en: "Sign Up", id: "Daftar" },

    // Hero Section
    hero_title: { en: "Unlock Premium Together", id: "Buka Akses Premium Bersama" },
    hero_desc: { 
        en: "Get access to premium accounts at a fraction of the cost. Secure, fast, and community-driven sharing.", 
        id: "Dapatkan akses akun premium dengan harga jauh lebih hemat. Aman, cepat, dan berbasis komunitas." 
    },
    btn_get_started: { en: "Get Started", id: "Mulai Sekarang" },
    
    // Features Section
    features_title: { en: "Main Features", id: "Fitur Utama" },
    features_desc: { 
        en: "Everything you need to enjoy premium services without the hassle.", 
        id: "Semua yang Anda butuhkan untuk menikmati layanan premium tanpa ribet." 
    },
    
    // Pricing Section
    pricing_title: { en: "Our Pricing Plans", id: "Pilihan Paket Harga" },
    pricing_desc: { 
        en: "Choose the plan that suits you best.", 
        id: "Pilih paket yang paling sesuai untuk Anda." 
    },
    
    // About Section
    about_title: { en: "About Gracely", id: "Tentang Gracely" },
    about_desc: {
        en: "We provide shared access to premium tools to help you save money.",
        id: "Kami menyediakan akses bersama ke alat premium untuk membantu Anda menghemat biaya."
    }
};

function updateContent(lang) {
    // Simpan bahasa pilihan
    localStorage.setItem('gracely_lang', lang);

    // Update teks di Navbar (EN/ID)
    const langDisplay = document.getElementById('currentLangDisplay');
    if (langDisplay) {
        langDisplay.textContent = lang === 'en' ? 'EN' : 'ID';
    }

    // Ganti teks elemen yang punya data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key] && translations[key][lang]) {
            element.textContent = translations[key][lang];
        }
    });
}

// Fungsi inisialisasi utama (dipanggil oleh layout.js)
function initializeScripts() {
    // 1. Jalankan Loop Keamanan
    startSessionCheckLoop();

    // 2. Jalankan Logika Bahasa
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const savedLang = localStorage.getItem('gracely_lang');
    let currentLang = langParam || savedLang || 'en';

    // Beri sedikit delay untuk memastikan elemen ter-render
    setTimeout(() => {
        updateContent(currentLang);
    }, 100);
}
