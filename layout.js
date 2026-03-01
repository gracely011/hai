// Branding moved to script.js

(function () {
  if (!document.querySelector('link[href*="flag-icon-css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icon-css@1.1.0/css/flag-icon.min.css';
    document.head.appendChild(link);
  }

  // --- FIX DOUBLE NOTIFICATION ---
  const originalAlert = window.alert;
  let kickAlertShown = false;
  window.alert = function (message) {
    if (message && typeof message === 'string' && message.includes("Akun Anda login di perangkat lain")) {
      if (kickAlertShown) return;
      kickAlertShown = true;
    }
    originalAlert.apply(window, arguments);
  };
})();

const announcementBarHTML = `
<div class="announcement-bar">
  The only official Gracely website is https://gracely011.github.io/hai/. Please be aware of fake websites.
</div>`;

const translations = {
  en: {
    // --- Navbar ---
    home: "Home", features: "Features", about: "About", pricing: "Pricing", services: "Services",
    login: "Log In", signup: "Sign Up", dashboard: "Dashboard", logout: "Log Out",

    // --- Footer & Misc ---
    view_dashboard: "View dashboard", purchase_premium: "Purchase premium",
    privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us",
    unlock_premium_footer: "Unlock Premium Together",

    // --- Hero Section ---
    hero_title: "Gracely <br> Unlock Premium Together",
    hero_desc: "Unlock premium experiences together with our one-click access extension.",
    hero_btn_start: "Get Started",
    hero_btn_dash: "Dashboard",
    hero_btn_watch: " Watch Demo",

    // --- Features Section ---
    feat_title: "Explore Our Features",
    feat_desc: "Uncover the power of Gracely.",
    feat_1_t: "24/7 Support", feat_1_d: "Dedicated support team available.",
    feat_2_t: "99% Uptime", feat_2_d: "Impressive uptime rate.",
    feat_3_t: "One-Click", feat_3_d: "Simple click access.",
    feat_4_t: "Affordable", feat_4_d: "Unlock premium affordably.",

    // --- About Section ---
    about_tag: "About Gracely",
    about_title: "Unlock Premium Freedom with Gracely",
    about_desc: "Gracely is your gateway to a world of premium digital experiences without the premium price tag.",
    about_btn: "Start Saving Now",

    // --- Pricing Section ---
    price_title: "Our Pricing Plans",
    price_desc: "Find the Perfect Fit for Your Needs.",
    price_popular: "POPULAR",
    price_start: "STARTING FROM",
    price_unit: "/ 30 DAYS",
    price_btn: "Purchase",

    // --- Services Section (Titles & Tabs) ---
    serv_title: "Supported Services",
    serv_desc: "We support a wide range of premium services.",
    serv_tab_prem: "Premium", serv_tab_ai: "AI Tools", serv_tab_dev: "Developer",
    serv_view_all: "View All Services",
    // Service Names (Opsional, kalau mau diterjemahkan juga)
    srv_netflix: "Netflix", srv_spotify: "Spotify", srv_applemusic: "Apple Music",
    srv_academia: "Academia", srv_canva: "Canva", srv_scribd: "Scribd",
    srv_chatgpt: "ChatGPT Plus", srv_midjourney: "Midjourney", srv_jasper: "Jasper AI",
    srv_copilot: "Copilot", srv_jetbrains: "JetBrains",

    // --- FAQ, Testimonials, Contact ---
    faq_title: "Questions & Answers",
    testi_title: "User Reviews",
    contact_title: "Get In Touch",

    // Form Labels
    form_name: "Full Name", form_email: "Email", form_msg: "Message", form_send: "Send Message"
  },
  id: {
    // --- Navbar ---
    home: "Beranda", features: "Fitur", about: "Tentang", pricing: "Harga", services: "Layanan",
    login: "Masuk", signup: "Daftar", dashboard: "Dasbor", logout: "Keluar",

    // --- Footer & Misc ---
    view_dashboard: "Lihat Dasbor", purchase_premium: "Beli Premium",
    privacy: "Kebijakan Privasi", terms: "Syarat Layanan", contact: "Hubungi Kami",
    unlock_premium_footer: "Buka Premium Bersama",

    // --- Hero Section ---
    hero_title: "Gracely <br> Buka Premium Bersama",
    hero_desc: "Nikmati pengalaman premium bersama dengan ekstensi akses satu klik kami.",
    hero_btn_start: "Mulai Sekarang",
    hero_btn_dash: "Buka Dasbor",
    hero_btn_watch: " Tonton Demo",

    // --- Features Section ---
    feat_title: "Jelajahi Fitur Kami",
    feat_desc: "Temukan kekuatan Gracely.",
    feat_1_t: "Dukungan 24/7", feat_1_d: "Tim dukungan selalu tersedia.",
    feat_2_t: "99% Uptime", feat_2_d: "Tingkat uptime yang mengesankan.",
    feat_3_t: "Satu Klik", feat_3_d: "Akses klik yang mudah.",
    feat_4_t: "Terjangkau", feat_4_d: "Buka premium dengan hemat.",

    // --- About Section ---
    about_tag: "Tentang Gracely",
    about_title: "Buka Kebebasan Premium dengan Gracely",
    about_desc: "Gracely adalah gerbang Anda menuju dunia pengalaman digital premium tanpa harga mahal.",
    about_btn: "Mulai Hemat Sekarang",

    // --- Pricing Section ---
    price_title: "Pilihan Paket Harga",
    price_desc: "Temukan yang paling pas untuk Anda.",
    price_popular: "POPULER",
    price_start: "MULAI DARI",
    price_unit: "/ 30 HARI",
    price_btn: "Beli Sekarang",

    // --- Services Section ---
    serv_title: "Layanan Yang Didukung",
    serv_desc: "Kami mendukung berbagai layanan premium.",
    serv_tab_prem: "Premium", serv_tab_ai: "Alat AI", serv_tab_dev: "Developer",
    serv_view_all: "Lihat Semua Layanan",
    // Service Names
    srv_netflix: "Netflix", srv_spotify: "Spotify", srv_applemusic: "Apple Music",
    srv_academia: "Academia", srv_canva: "Canva", srv_scribd: "Scribd",
    srv_chatgpt: "ChatGPT Plus", srv_midjourney: "Midjourney", srv_jasper: "Jasper AI",
    srv_copilot: "Copilot", srv_jetbrains: "JetBrains",

    // --- FAQ, Testimonials, Contact ---
    faq_title: "Tanya Jawab",
    testi_title: "Ulasan Pengguna",
    contact_title: "Hubungi Kami",

    // Form Labels
    form_name: "Nama Lengkap", form_email: "Email", form_msg: "Pesan", form_send: "Kirim Pesan"
  }
};

function getCurrentLang() {
  const urlParams = new URLSearchParams(window.location.search);
  let lang = urlParams.get('lang');
  if (lang) { localStorage.setItem('gracely_lang', lang); }
  else { lang = localStorage.getItem('gracely_lang') || 'en'; }
  const langMap = {
    'en': { flag: 'us', name: 'English' },
    'id': { flag: 'id', name: 'Indonesia' }
  };
  return langMap[lang] ? { ...langMap[lang], code: lang } : { ...langMap['en'], code: 'en' };
}

function t(key) {
  const current = getCurrentLang().code;
  const langData = translations[current] || translations['en'];
  const fallbackData = translations['en'];
  return langData[key] || fallbackData[key] || key;
}

// --- FUNGSI TRANSLATE YANG AMAN UNTUK GAMBAR ---
function translatePageContent() {
  // Cari semua elemen yang punya atribut 'data-i18n'
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);

    // 1. Cek jika elemen adalah Input/Textarea (ganti placeholder)
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    }
    // 2. Cek jika elemen punya icon <i> di dalamnya (seperti tombol)
    else if (element.querySelector('i')) {
      const icon = element.querySelector('i');
      // Cek posisi icon (sebelum atau sesudah teks)
      // Ini penanganan sederhana, kita asumsikan teks + icon
      // Cara paling aman: simpan icon, hapus isi, isi teks, append icon
      const iconClone = icon.cloneNode(true);
      element.innerHTML = translation + ' ';
      element.appendChild(iconClone);
    }
    // 3. Teks biasa
    else {
      element.innerHTML = translation;
    }
  });

  // Penanganan Khusus Tombol Hero (Dashboard vs Get Started)
  // Karena tombol ini berubah fungsinya tergantung login, kita handle manual
  const heroBtnWhite = document.querySelector('.ud-hero-buttons .ud-white-btn');
  if (heroBtnWhite) {
    const isDashboard = heroBtnWhite.getAttribute('href') && heroBtnWhite.getAttribute('href').includes('dashboard');
    const key = isDashboard ? 'hero_btn_dash' : 'hero_btn_start';

    // Simpan icon panah
    const icon = heroBtnWhite.querySelector('i');
    const text = t(key);

    heroBtnWhite.innerHTML = text + ' ';
    if (icon) heroBtnWhite.appendChild(icon);
  }
}

function getLanguageDropdownHTML() {
  const current = getCurrentLang();
  return `
    <div class="nav-item dropdown d-inline-block me-2">
        <a class="ud-main-btn ud-login-btn text-center dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="padding: 10px 15px; display: inline-flex; align-items: center; gap: 5px;"> 
            <span class="flag-icon flag-icon-${current.flag}"></span> <span class="d-none d-md-inline">${current.name}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="?lang=en"><span class="flag-icon flag-icon-us me-2"></span> English</a></li>
            <li><a class="dropdown-item" href="?lang=id"><span class="flag-icon flag-icon-id me-2"></span> Indonesia</a></li>
        </ul>
    </div>`;
}

async function checkPremiumExpiryWarning() {
  try {
    if (typeof isAuthenticated !== 'function' || !isAuthenticated()) return false;
    const expiryDateStr = localStorage.getItem('premiumExpiryDate');
    if (!expiryDateStr) return false;
    const expiryDate = new Date(expiryDateStr);
    const now = new Date();
    const timeLeft = expiryDate.getTime() - now.getTime();
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (daysLeft > 4 || daysLeft < 0) return false;
    
    // --- CEK LIMIT HARIAN EXPIRY WARNING ---
    const lastExpiryStr = localStorage.getItem('lastExpiryWarningDateDB');
    if (lastExpiryStr) {
        const lastExpiry = new Date(lastExpiryStr);
        const todayReset = new Date();
        todayReset.setHours(0, 0, 0, 0); // Reset pada jam 00:00 hari ini
        
        // Peringatan akan muncul kembali jika belum ada catatan log hari ini
        if (lastExpiry >= todayReset) {
            return false; // Sudah ditampilkan hari ini
        }
    }
    
    const modalContainer = document.getElementById('notification-0');
    if (!modalContainer) return false;
    const modalContent = modalContainer.querySelector('.notificationModal-content');
    const showExpiryModal = () => {
      const modalHTML = ` 
                <i class="fa fa-times gracely-modal-close-icon" id="notification-close"></i> 
                <h2>🔔</h2> 
                <p>Your Premium will <b>expire in ${daysLeft} day(s) and ${hoursLeft} hour(s)</b>.</p> 
                <p>Please renew it to extend your Premium access.</p> 
                <button class="ud-main-btn w-50" id="notification-ok" style="margin-top: 10px;">OK</button> 
            `;
      modalContent.innerHTML = modalHTML;
      modalContainer.style.display = 'flex';
      modalContainer.setAttribute('data-priority', 'high'); // Tag as High Priority
      modalContainer.style.visibility = 'visible';
      modalContainer.style.opacity = '1';
      const closeModal = () => { 
          modalContainer.style.display = 'none'; 
          localStorage.setItem('lastExpiryWarningDateDB', new Date().toISOString());
          if(typeof updateLastPopupDate === 'function') updateLastPopupDate('expiry');
      };
      const closeBtn = modalContainer.querySelector('#notification-close');
      const okBtn = modalContainer.querySelector('#notification-ok');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (okBtn) okBtn.addEventListener('click', closeModal);
    };
    showExpiryModal();
    return true;
  } catch (error) { return false; }
}

async function runNotificationChecks() {
  if (typeof checkPremiumExpiryWarning === 'function') await checkPremiumExpiryWarning();
}

const defaultNavbarHTML = () => `
<header class="ud-header">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">
            <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
            <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home" data-i18n="home">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features" data-i18n="features">${t('features')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about" data-i18n="about">${t('about')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing" data-i18n="pricing">${t('pricing')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services" data-i18n="services">${t('services')}</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-flex align-items-center">
            ${getLanguageDropdownHTML()}
            <a href="login.html" class="ud-main-btn ud-white-btn" style="padding: 10px 25px;" data-i18n="login">${t('login')}</a>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
`;

const loggedInNavbarHTML = (userName) => `
<header class="ud-header">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">
             <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
             <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home" data-i18n="home">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features" data-i18n="features">${t('features')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about" data-i18n="about">${t('about')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing" data-i18n="pricing">${t('pricing')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services" data-i18n="services">${t('services')}</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-flex align-items-center">
             ${getLanguageDropdownHTML()}
             <a href="dashboard.html" class="ud-main-btn ud-login-btn" title="${t('dashboard')}">
               <i class="fa-solid fa-user"></i> 
             </a>
             <button id="logout-button" class="ud-main-btn ud-white-btn ms-2" title="${t('logout')}" style="padding: 10px 15px;">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
             </button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
`;

const footerHTML = `
<footer class="ud-footer" data-wow-delay=".15s">
  <div class="shape shape-1"><img src="assets/images/footer/leftshape.png" alt="shape" /></div>
  <div class="shape shape-2"><img src="assets/images/footer/dotted-shape.svg" alt="shape" /></div>
  <div class="shape shape-3"><img src="assets/images/footer/rightshape.png" alt="shape" /></div>
  <div class="ud-footer-widgets">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="ud-widget">
            <a href="./" class="ud-footer-logo"><img src="assets/images/logo/gracely_white.png" alt="logo" /></a>
            <p class="ud-widget-desc" data-i18n="unlock_premium_footer">${t('unlock_premium_footer')}</p>
            <ul class="ud-widget-socials">
              <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
              <li><a href="#"><i class="fa-brands fa-discord"></i></a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title" data-i18n="about">${t('about')}</h5>
            <ul class="ud-widget-links">
              <li><a href="index.html#features" data-i18n="features">${t('features')}</a></li>
              <li><a href="index.html#about" data-i18n="about">${t('about')}</a></li>
              <li><a href="index.html#pricing" data-i18n="pricing">${t('pricing')}</a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title" data-i18n="dashboard">${t('dashboard')}</h5>
            <ul class="ud-widget-links">
              <li><a href="dashboard.html" data-i18n="view_dashboard">${t('view_dashboard')}</a></li>
              <li><a href="premium.html" data-i18n="purchase_premium">${t('purchase_premium')}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="ud-footer-bottom">
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <ul class="ud-footer-bottom-left">
            <li><a href="privacy.html" data-i18n="privacy">${t('privacy')}</a></li>
            <li><a href="terms.html" data-i18n="terms">${t('terms')}</a></li>
            <li><a href="index.html#contact" data-i18n="contact">${t('contact')}</a></li>
          </ul>
        </div>
        <div class="col-md-4"><p class="ud-footer-bottom-right">Gracely &copy; 2024-${new Date().getFullYear()}</p></div>
      </div>
    </div>
  </div>
  <div class="groupy-wave" style="margin-top:-23px">
      <div class="bg-white" style="margin-top:0px;height:23px"></div>
      <div class="bg-white" style="margin-top:1px;height:22px"></div>
      <div class="bg-white" style="margin-top:2px;height:21px"></div>
      <div class="bg-white" style="margin-top:3px;height:20px"></div>
      <div class="bg-white" style="margin-top:4px;height:19px"></div>
      <div class="bg-white" style="margin-top:5px;height:18px"></div>
      <div class="bg-white" style="margin-top:6px;height:17px"></div>
      <div class="bg-white" style="margin-top:7px;height:16px"></div>
      <div class="bg-white" style="margin-top:8px;height:15px"></div>
      <div class="bg-white" style="margin-top:9px;height:14px"></div>
      <div class="bg-white" style="margin-top:10px;height:13px"></div>
      <div class="bg-white" style="margin-top:11px;height:12px"></div>
      <div class="bg-white" style="margin-top:12px;height:11px"></div>
      <div class="bg-white" style="margin-top:13px;height:10px"></div>
      <div class="bg-white" style="margin-top:14px;height:9px"></div>
      <div class="bg-white" style="margin-top:15px;height:8px"></div>
      <div class="bg-white" style="margin-top:16px;height:7px"></div>
      <div class="bg-white" style="margin-top:17px;height:6px"></div>
      <div class="bg-white" style="margin-top:18px;height:5px"></div>
      <div class="bg-white" style="margin-top:19px;height:4px"></div>
      <div class="bg-white" style="margin-top:20px;height:3px"></div>
      <div class="bg-white" style="margin-top:21px;height:2px"></div>
      <div class="bg-white" style="margin-top:22px;height:1px"></div>
      <div class="bg-white" style="margin-top:23px;height:0px"></div>
  </div>
</footer>
`;

const backToTopHTML = `<a href="javascript:void(0)" class="back-to-top"><i class="fa-solid fa-arrow-up"></i></a>`;

function modifyIndexPageContent() {
  const path = window.location.pathname;
  const isIndexPage = path.endsWith('/') || path.endsWith('/hai/') || path.endsWith('index.html');
  if (!isIndexPage) return;

  if (typeof isAuthenticated === 'function' && isAuthenticated()) {
    const purchaseButton = document.querySelector('.ud-hero-buttons .ud-white-btn');
    if (purchaseButton) {
      // Update teks button sesuai bahasa terpilih
      purchaseButton.textContent = t('hero_btn_dash');
      purchaseButton.href = 'dashboard.html';
      purchaseButton.removeAttribute('target');
    }
  }
}

function loadLayout() {
  const announcementPlaceholder = document.getElementById("announcement-placeholder");
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");
  const backToTopPlaceholder = document.getElementById("back-to-top-placeholder");

  if (!document.getElementById('notification-0')) {
    const modalDiv = document.createElement('div');
    modalDiv.className = 'notificationModal';
    modalDiv.id = 'notification-0';
    modalDiv.style.display = 'none';
    modalDiv.innerHTML = '<div class="notificationModal-content"></div>';
    document.body.appendChild(modalDiv);
  }

  if (announcementPlaceholder) announcementPlaceholder.innerHTML = announcementBarHTML;
  if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
  if (backToTopPlaceholder) backToTopPlaceholder.innerHTML = backToTopHTML;

  if (navbarPlaceholder) {
    if (typeof isAuthenticated === 'function' && isAuthenticated()) {
      const userName = localStorage.getItem("userName") || "Member";
      navbarPlaceholder.innerHTML = loggedInNavbarHTML(userName);
      setTimeout(() => {
        const logoutBtn = document.getElementById('logout-button');
        if (logoutBtn && typeof logout === 'function') {
          logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
        }
      }, 500);
      if (typeof eraseCookie === 'function') eraseCookie('UnangJahaCookieOnLae');
    } else {
      navbarPlaceholder.innerHTML = defaultNavbarHTML();
    }
  }

  if (typeof initializeScripts === 'function') { initializeScripts(); }

  // Urutan PENTING:
  // 1. Translate dulu konten dasar
  translatePageContent();
  // 2. Baru modifikasi konten (tombol Hero) berdasarkan status login
  //    (Fungsi modifyIndexPageContent akan menimpa teks tombol jika login, 
  //     tapi tetap menggunakan t() agar bahasanya benar)
  modifyIndexPageContent();
  runNotificationChecks();
  loadExternalConfig(() => {
    initializeWebsiteAnnouncement();
  });
}

async function decryptGracelyConfig(encryptedObj) {
  const password = "kuberserah_selalu_in_GOD";
  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const fromBase64 = (str) => Uint8Array.from(atob(str), c => c.charCodeAt(0));
    const salt = fromBase64(encryptedObj.s);
    const iv = fromBase64(encryptedObj.i);
    const data = fromBase64(encryptedObj.d);

    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
    const key = await window.crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    console.error("Decryption Failed:", e);
    return null;
  }
}

async function loadExternalConfig(callback) {
  if (typeof gracelyConfig !== 'undefined') { callback(); return; }
  try {
    const response = await fetch('aturhonma.js');
    if (!response.ok) throw new Error("Status " + response.status);
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json.s && json.i && json.d) {
        window.gracelyConfig = await decryptGracelyConfig(json);
        callback();
        return;
      }
    } catch(e) {}
    
    // Fallback for Local Dev (Valid JS file)
    const script = document.createElement('script');
    script.textContent = text;
    document.head.appendChild(script);
    callback();
  } catch (e) {
    console.error("Failed to load aturhonma.js", e);
  }
}

async function initializeWebsiteAnnouncement() {
  try {
    // SECURITY CHECK: Only show for logged-in users
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) return; // Exit if not logged in

    if (typeof gracelyConfig === 'undefined') return;

    const t = gracelyConfig.notifications?.announcement;
    if (!t || !t.enabled || !t.id) return;

    const modalDiv = document.getElementById('notification-0');
    if (!modalDiv) return;
    const modalContent = modalDiv.querySelector('.notificationModal-content');
    // Note: modalContent might be null if we use innerHTML on modalDiv directly later, but let's grab it if needed.

    // Default content generator if html is missing
    let e = "";
    t.lines && Array.isArray(t.lines) && (e = t.lines.map(l => `<p>${l}</p>`).join(""));
    const n = t.html || `<div class="notificationModal-content"><i class="fa fa-times close-icon" id="notification-close"></i><h2>${t.title}</h2>${e}<button class="ud-main-btn" id="notification-ok">OK</button></div>`;
    const o = t.id;

    const show = () => {
      // Apply content
      // If t.html is present, it usually contains the "notificationModal-content" div wrapper itself or inner content?
      // Checking aturhonma.js, "html" includes "<div class='notificationModal-content'>...</div>".
      // So we should replace the innerHTML of modalDiv (container) to fully replace the auto-generated empty content div.
      // Priority Check: If a High Priority modal is already open, DO NOT OVERWRITE
      if (modalDiv.style.display === 'flex' && modalDiv.getAttribute('data-priority') === 'high') {
        // console.log("Announcement skipped due to High Priority modal.");
        return;
      }

      if (t.html) {
        modalDiv.innerHTML = t.html;
      } else {
        if (modalContent) modalContent.innerHTML = n;
        else modalDiv.innerHTML = `<div class="notificationModal-content">${n}</div>`;
      }

      modalDiv.removeAttribute('data-priority'); // Reset priority for normal announcements

      modalDiv.style.display = 'flex';
      modalDiv.style.visibility = 'visible';
      modalDiv.style.opacity = '1';

      const close = () => {
        modalDiv.style.display = 'none';
        const nowStr = Date.now().toString();
        const isoNowStr = new Date().toISOString();
        localStorage.setItem("notificationLastShown", nowStr);
        localStorage.setItem("notificationLastShownId", o);
        localStorage.setItem("lastPopupDateDB", isoNowStr); // Immediate UI sync
        if(typeof updateLastPopupDate === 'function') updateLastPopupDate('info');
      };

      const closeBtn = modalDiv.querySelector("#notification-close");
      const okBtn = modalDiv.querySelector("#notification-ok");
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (okBtn) okBtn.addEventListener("click", close);
    };

    // --- LOGIKA LIMIT HARIAN POPUP ---
    const lastShownStrDB = localStorage.getItem('lastPopupDateDB');
    const lastShownLocalStr = localStorage.getItem("notificationLastShown");
    // ID checking
    const lastId = localStorage.getItem("notificationLastShownId");

    let shouldShow = false;
    let lastShownTime = null;

    if (lastShownStrDB) {
        lastShownTime = new Date(lastShownStrDB).getTime();
    } else if (lastShownLocalStr) {
        lastShownTime = parseInt(lastShownLocalStr);
    }

    if (!lastShownTime) {
      // Belum pernah buka sama sekali
      shouldShow = true;
    } else {
      const now = new Date();
      const lastShown = new Date(lastShownTime);
      let resetThreshold = new Date();
      resetThreshold.setHours(7, 0, 0, 0); // Riset limit pada pukul 07:00 pagi

      if (now < resetThreshold) {
        resetThreshold.setDate(resetThreshold.getDate() - 1);
      }

      if (lastShown < resetThreshold) {
        // Sudah lewat hari (jam 7 pagi)
        shouldShow = true;
      } else if (o !== lastId && !lastShownStrDB) {
        // ID beda dan belum ada data dari DB (fallback ke perilaku lama jika ID ganti)
        shouldShow = true;
      } else {
        // Masih di rentang hari yang sama, JANGAN TAMPILKAN, ignore perbedaan ID
        shouldShow = false;
      }
    }

    if (shouldShow) {
      let hasShown = false;
      const triggerShow = () => {
        if (hasShown) return;
        hasShown = true;

        // Cleanup triggers
        clearTimeout(autoTimer);
        document.removeEventListener('mousemove', userInteractionTrigger);

        show();
      };

      // Trigger 1: Auto 5 detik
      const autoTimer = setTimeout(triggerShow, 5000);

      // Trigger 2: Mouse Move (Langsung muncul jika user aktif)
      const userInteractionTrigger = () => {
        triggerShow();
      };
      document.addEventListener('mousemove', userInteractionTrigger);
    }
  } catch (err) {
    console.error("Announcement Error:", err);
  }
}


// =============================================
// === PAGE-SPECIFIC SCRIPTS (Consolidated) ===
// =============================================

/**
 * 1. 3D Text Effect - Used in 404.html, blocked.html, maintenance.html
 */
function init3DTextEffect() {
  const textElement = document.getElementById('text-3d');
  if (!textElement) return;
  
  const maxRotation = 90;

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;

    const rotateY = x * (maxRotation * 2);
    const rotateX = -y * (maxRotation * 2);

    textElement.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    textElement.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
}

/**
 * 2. Dashboard: Plan Status Display
 */
function initDashboardPlanStatus() {
  const planSection = document.getElementById('plan-status-section');
  if (!planSection) return;

  // REALTIME EXTENSION REFRESH LISTENER
  // Will be triggered by auth.js on Supabase push update
  if (!window.hasRegisteredPlanRefreshListener) {
      document.addEventListener('gracelyPlanRefresh', () => {
          // console.log("Realtime UI Update Triggered: Re-rendering dashboard plan cards...");
          initDashboardPlanStatus();
      });
      window.hasRegisteredPlanRefreshListener = true;
  }

  function formatExactUTC(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const cleanDate = `${monthName} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
    const offsetMinutes = date.getTimezoneOffset();
    const offsetHours = -(offsetMinutes / 60);
    const sign = offsetHours >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetHours);
    const timezoneString = `(UTC ${sign}${absOffset})`;
    return `${cleanDate} ${timezoneString}`;
  }

  const isPremium = localStorage.getItem('isPremium') === 'true';
  const planName = localStorage.getItem('userPlanName') || 'No Premium';
  const planNumber = localStorage.getItem('userPlanNumber') || '001';

  let planHTML = '';
  try {
    if (isPremium) {
      const datePremium = localStorage.getItem('premiumExpiryDate');
      const datePro = localStorage.getItem('proExpiryDate');
      const datePhantom = localStorage.getItem('phantomExpiryDate');

      const safeFormat = (dateStr) => {
        try {
          if (!dateStr || dateStr === 'null' || dateStr === 'undefined') return null;
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return null;
          return formatExactUTC(dateStr);
        } catch (e) { return null; }
      };

      planHTML = `
        <div class="menu-section">
          <div class="menu-section-mini-header">Your plan</div>
          <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" class="top-right-image">
          <div class="${planNumber === '004' ? 'menu-section-plan-phantomwitcher' : 'menu-section-plan-premium'}">${planName}</div>
          <div class="menu-section-plan-description">`;

      let hasShownDate = false;
      const fmtPremium = safeFormat(datePremium);
      if (fmtPremium) { planHTML += `<div>Your <b>Premium</b> is valid until ${fmtPremium}.</div>`; hasShownDate = true; }
      const fmtPro = safeFormat(datePro);
      if (fmtPro) { planHTML += `<div>Your <b>Pro</b> is valid until ${fmtPro}.</div>`; hasShownDate = true; }
      const fmtPhantom = safeFormat(datePhantom);
      if (fmtPhantom) { planHTML += `<div>Your <b>The Phantom</b> is valid until ${fmtPhantom}.</div>`; hasShownDate = true; }
      if (!hasShownDate) { planHTML += `<div>Active</div>`; }

      planHTML += `</div></div>`;
    } else {
      planHTML = `
        <div class="menu-section">
          <div class="menu-section-mini-header">Your plan</div>
          <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" class="top-right-image">
          <div class="menu-section-plan-free">${planName}</div>
          <div class="menu-section-plan-description">Premium is required to access Gracely Extension.</div>
        </div>`;
    }
  } catch (err) {
    console.error("Dashboard Render Critical Error:", err);
    planHTML = `<div class="menu-section" style="color:red">Error loading plan info. Check console.</div>`;
  }
  planSection.innerHTML = planHTML;
}

/**
 * 3. Dashboard: Video Modals
 */
function initVideoModals() {
  const modals = [
    { btn: 'openModalBtn', modal: 'videoModal', video: 'videoElement' },
    { btn: 'openModalBtnKiwi', modal: 'videoModalKiwi', video: 'videoElementKiwi' },
    { btn: 'openModalBtnOrion', modal: 'videoModalOrion', video: 'videoElementOrion' }
  ];

  modals.forEach(({ btn, modal, video }) => {
    const btnEl = document.getElementById(btn);
    const modalEl = document.getElementById(modal);
    const videoEl = document.getElementById(video);
    if (!btnEl || !modalEl) return;

    btnEl.addEventListener('click', () => { modalEl.style.display = 'flex'; });
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) {
        modalEl.style.display = 'none';
        if (videoEl) videoEl.pause();
      }
    });
  });
}

/**
 * 4. Activity Logs Page
 */
async function initActivityLogsPage() {
  const tableBody = document.getElementById('logs-table-body');
  const loader = document.getElementById('table-loader');
  const modal = document.getElementById('ipModal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  if (!tableBody || !modal) return;

  if (modalCloseBtn) modalCloseBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

  try {
    if (typeof getUserId !== 'function' || typeof supabaseClient === 'undefined') return;
    const userId = await getUserId();
    if (!userId) { if (loader) loader.textContent = 'Gagal memuat log: Pengguna tidak ditemukan.'; return; }

    const { data, error } = await supabaseClient
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    if (data.length === 0) { if (loader) loader.textContent = 'No activity logs found.'; return; }

    tableBody.innerHTML = '';
    data.forEach(log => {
      const row = document.createElement('tr');
      const d = new Date(log.created_at);
      const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;

      const cellDate = document.createElement('td'); cellDate.textContent = formattedDate; row.appendChild(cellDate);
      const cellActivity = document.createElement('td'); cellActivity.textContent = log.activity; row.appendChild(cellActivity);

      const cellIp = document.createElement('td');
      const ipSpan = document.createElement('span');
      ipSpan.textContent = log.ip_address;
      ipSpan.className = 'ip-hover';
      ipSpan.onclick = () => {
        document.getElementById('modal-ip').textContent = log.ip_address;
        document.getElementById('modal-location').textContent = log.isp_info?.location || 'N/A';
        document.getElementById('modal-isp').textContent = log.isp_info?.isp || 'N/A';
        modal.style.display = 'flex';
      };
      cellIp.appendChild(ipSpan);
      row.appendChild(cellIp);

      const cellDevice = document.createElement('td');
      const deviceString = log.device || "Unknown";
      let simpleDevice = "Unknown";
      if (deviceString.includes("Windows")) simpleDevice = "windows";
      else if (deviceString.includes("Macintosh")) simpleDevice = "mac";
      else if (deviceString.includes("Android")) simpleDevice = "android";
      else if (deviceString.includes("iPhone") || deviceString.includes("iPad")) simpleDevice = "ios";
      else if (deviceString.includes("Linux")) simpleDevice = "linux";

      let browser = "unknown";
      if (deviceString.includes("Chrome/") && !deviceString.includes("Edg/")) browser = "chrome";
      else if (deviceString.includes("Firefox/")) browser = "firefox";
      else if (deviceString.includes("Edg/")) browser = "edge";
      else if (deviceString.includes("Safari/") && !deviceString.includes("Chrome/")) browser = "safari";

      const chromeVersionMatch = deviceString.match(/Chrome\/(\d+)/);
      let version = "";
      if (browser === "chrome" && chromeVersionMatch) version = "." + chromeVersionMatch[1] + ".0";
      cellDevice.textContent = `${simpleDevice}.${browser}${version}`;
      row.appendChild(cellDevice);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    if (loader) { loader.style.color = 'red'; loader.textContent = 'Gagal memuat log: ' + error.message; }
  }
}

/**
 * 5. Manual Page: URL Params + Copy
 */
function initManualPage() {
  const params = new URLSearchParams(window.location.search);
  const serviceName = params.get("name");
  const loginEmail = params.get("login");
  const loginPassword = params.get("password");
  const loginExtra = params.get("extra");
  const loginUrl = params.get("url");

  if (serviceName) {
    document.title = serviceName + " | Gracely";
    const titleElement = document.getElementById("page-title-h1");
    if (titleElement) titleElement.textContent = serviceName;
  }
  if (loginEmail) { const el = document.getElementById("login"); if (el) el.value = loginEmail; }
  if (loginPassword) { const el = document.getElementById("password"); if (el) el.value = loginPassword; }
  if (loginExtra) {
    const extraContainer = document.getElementById("extra-container");
    const extraElement = document.getElementById("extra");
    if (extraElement) extraElement.value = loginExtra;
    if (extraContainer) extraContainer.style.display = "block";
  }
  if (loginUrl) { const el = document.getElementById("manual-login-link"); if (el) el.href = loginUrl; }

  // Custom Service Warnings
  const warningDiv = document.getElementById('dynamic-warning');
  if (warningDiv && serviceName) {
    if (serviceName.toLowerCase().includes('canva')) {
      warningDiv.innerHTML = `
        <p>Please invite your personal email to join the Canva Gracely team.</p>
        <p>No need to join multiple times, just join once if your Canva account is not pro yet.</p>
        <p><b>Don't forget to keep back up your project.</b></p>
      `;
      warningDiv.style.display = 'block';
    }
    // else if (serviceName.toLowerCase().includes('other_service')) { ... }
  }
}

/**
 * 6. Copy to Clipboard Utility
 */
function copyToClipboard(elementId) {
  const copyText = document.getElementById(elementId);
  if (!copyText) return;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  try { document.execCommand("copy"); } catch (err) { console.error("Gagal menyalin teks: ", err); }
}

/**
 * 7. Password Page Handler
 */
function initPasswordPage() {
  const form = document.getElementById('update-password-form');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const updateButton = document.getElementById('update-button');
  const messageElement = document.getElementById('update-message');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      messageElement.textContent = 'Kata sandi tidak cocok.';
      messageElement.style.color = 'red';
      return;
    }
    if (newPassword.length < 6) {
      messageElement.textContent = 'Kata sandi minimal harus 6 karakter.';
      messageElement.style.color = 'red';
      return;
    }

    messageElement.textContent = '';
    updateButton.disabled = true;
    updateButton.innerHTML = 'Memperbarui...';

    if (typeof updateUserPassword === 'function') {
      const result = await updateUserPassword(newPassword);
      messageElement.textContent = result.message;
      if (result.success) {
        messageElement.style.color = 'green';
        setTimeout(() => { window.location.href = 'login.html'; }, 3000);
      } else {
        messageElement.style.color = 'red';
        updateButton.disabled = false;
        updateButton.innerHTML = 'Ubah Kata Sandi';
      }
    } else {
      messageElement.textContent = 'Error: Fungsi auth.js tidak dimuat.';
      messageElement.style.color = 'red';
    }
  });

  async function checkSession() {
    if (typeof supabaseClient === 'undefined') return;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      messageElement.textContent = 'Sesi reset kadaluarsa atau tidak valid. Silakan ulangi proses reset password.';
      messageElement.style.color = 'red';
      form.style.display = 'none';
    } else {
      messageElement.textContent = 'Sesi aktif. Silakan masukkan kata sandi baru Anda.';
      messageElement.style.color = 'blue';
    }
  }
  checkSession();
}

/**
 * 8. Profile Page Handler
 */
function initProfilePage() {
  const form = document.getElementById('update-profile-form');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const updateButton = document.getElementById('update-button');
  const messageElement = document.getElementById('update-message');
  if (!form) return;

  async function loadUserData() {
    try {
      if (typeof supabaseClient === 'undefined') return;
      const { data: { user }, error } = await supabaseClient.auth.getUser();
      if (error || !user) {
        messageElement.textContent = 'Sesi berakhir. Silakan login ulang.';
        messageElement.style.color = 'red';
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        return;
      }
      const storedName = localStorage.getItem('userName');
      nameInput.value = storedName || user.user_metadata?.full_name || '';
      emailInput.value = user.email || '';
    } catch (e) {
      console.error('Error loading user data:', e);
      messageElement.textContent = 'Gagal memuat data profil.';
      messageElement.style.color = 'red';
    }
  }
  loadUserData();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newName = nameInput.value.trim();
    if (!newName) {
      messageElement.textContent = 'Nama tidak boleh kosong.';
      messageElement.style.color = 'red';
      return;
    }

    messageElement.textContent = '';
    updateButton.disabled = true;
    updateButton.innerHTML = 'Menyimpan...';

    if (typeof updateUserName === 'function') {
      const result = await updateUserName(newName);
      messageElement.textContent = result.message;
      messageElement.style.color = result.success ? 'green' : 'red';
    } else {
      messageElement.textContent = 'Error: Fungsi auth.js tidak dimuat.';
      messageElement.style.color = 'red';
    }
    updateButton.disabled = false;
    updateButton.innerHTML = 'Simpan Profil';
  });
}

/**
 * 9. Reset Password Page Handler
 */
function initResetPage() {
  const resetForm = document.getElementById('reset-form');
  const emailInput = document.getElementById('email-input');
  const resetButton = document.getElementById('reset-button');
  const messageElement = document.getElementById('reset-message');
  if (!resetForm) return;

  resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      messageElement.textContent = 'Harap masukkan email Anda.';
      messageElement.style.color = 'red';
      return;
    }

    messageElement.textContent = '';
    resetButton.disabled = true;
    resetButton.innerHTML = 'Mengirim...';

    if (typeof sendPasswordResetEmail === 'function') {
      const result = await sendPasswordResetEmail(email);
      messageElement.textContent = result.message;
      messageElement.style.color = result.success ? 'green' : 'red';
    }
    resetButton.disabled = false;
    resetButton.innerHTML = 'Kirim tautan reset';
  });
}

/**
 * 10. Signup Page Handler
 */
function initSignupPage() {
  // Email suggestion logic
  const emailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "live.com", "msn.com"];
  const emailInput = document.getElementById("email");
  const suggestionEl = document.getElementById("email-suggestion");

  function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
        else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
    return matrix[b.length][a.length];
  }

  if (emailInput && suggestionEl) {
    emailInput.addEventListener("blur", function() {
      const value = this.value.trim();
      suggestionEl.innerHTML = "";
      if (!value.includes("@")) return;
      const [user, domain] = value.split("@");
      if (domain) {
        let closest = null, minDist = Infinity;
        for (const d of emailDomains) {
          const dist = levenshtein(domain.toLowerCase(), d);
          if (dist < minDist && dist <= 2) { minDist = dist; closest = d; }
        }
        if (closest && closest !== domain) {
          const suggested = `${user}@${closest}`;
          suggestionEl.innerHTML = `Did you mean <a href="#" style="text-decoration: underline; font-weight: bold; color: #000000;">${suggested}</a>?`;
          suggestionEl.querySelector("a").addEventListener("click", (e) => {
            e.preventDefault();
            emailInput.value = suggested;
            suggestionEl.innerHTML = "";
          });
        }
      }
    });
  }

  // Signup form handler
  const signupForm = document.getElementById('reCAPTCHA');
  if (!signupForm || window.location.pathname.includes('premium')) return; // Skip if premium page

  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = signupForm.querySelector('input[name="name"]')?.value;
    const email = signupForm.querySelector('input[name="email"]')?.value;
    const password = signupForm.querySelector('input[name="password"]')?.value;
    const confirmPassword = signupForm.querySelector('input[name="confirm_password"]')?.value;

    let errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.id = 'error-message';
      errorMessage.style.color = 'red';
      errorMessage.style.marginTop = '15px';
      signupForm.parentNode?.insertBefore(errorMessage, signupForm.nextSibling);
    }
    errorMessage.textContent = '';

    if (!name || !email || !password) { errorMessage.textContent = 'Semua kolom harus diisi!'; return; }
    if (password !== confirmPassword) { errorMessage.textContent = 'Password tidak cocok!'; return; }

    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Mendaftar...';

    if (typeof signup === 'function') {
      const result = await signup(name, email, password);
      if (result.success) {
        alert('Pendaftaran berhasil! Silakan langsung Login.');
        window.location.href = 'login.html';
      } else {
        let message = result.message;
        if (message.includes("violates row-level security policy") || message.includes("duplicate key value")) {
          alert('Pendaftaran berhasil! Silakan langsung Login.');
          window.location.href = 'login.html';
          return;
        }
        if (message.includes("User already registered")) message = "Akun dengan email ini sudah terdaftar. Silakan Log in.";
        errorMessage.textContent = 'Error: ' + message;
        submitButton.disabled = false;
        submitButton.innerHTML = 'Sign up';
      }
    }
  });
}

/**
 * 11. reCAPTCHA Submit Callback (untuk premium.html)
 */
function onSubmit(token) {
  const form = document.getElementById("reCAPTCHA");
  if (form && window.location.pathname.includes('premium')) form.submit();
}

/**
 * Page Router - Inisialisasi script berdasarkan halaman
 */
function initPageScripts() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  switch(page) {
    case '404.html':
    case 'blocked.html':
    case 'maintenance.html':
      init3DTextEffect();
      break;
    case 'dashboard.html':
      initDashboardPlanStatus();
      initVideoModals();
      break;
    case 'logs.html':
      initActivityLogsPage();
      break;
    case 'manual.html':
      initManualPage();
      break;
    case 'password.html':
      initPasswordPage();
      break;
    case 'profile.html':
      initProfilePage();
      break;
    case 'reset.html':
      initResetPage();
      break;
    case 'signup.html':
      initSignupPage();
      break;
  }
}

// =============================================
// === END PAGE-SPECIFIC SCRIPTS ===
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  loadLayout();
  initPageScripts();
});

