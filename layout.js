// ═══════════════════════════════════════════════════════════════
// GRACELY BRANDING - Shows on ALL pages using this layout
// ═══════════════════════════════════════════════════════════════
(function gracelyBranding() {
  console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');
})();

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
      const closeModal = () => { modalContainer.style.display = 'none'; };
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
            <li><a href="#" data-i18n="privacy">${t('privacy')}</a></li>
            <li><a href="#" data-i18n="terms">${t('terms')}</a></li>
            <li><a href="#contact" data-i18n="contact">${t('contact')}</a></li>
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

  // FIX: Mobile navbar toggler - add event listener AFTER navbar is injected
  setTimeout(() => {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener("click", function (e) {
        e.preventDefault();
        navbarToggler.classList.toggle("active");
        navbarCollapse.classList.toggle("show");
      });
    }
  }, 100);

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

function loadExternalConfig(callback) {
  if (typeof gracelyConfig !== 'undefined') {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = 'aturhonma.js';
  script.onload = () => {
    // console.log("aturhonma.js loaded dynamically");
    callback();
  };
  script.onerror = () => {
    console.error("Failed to load aturhonma.js");
  };
  document.head.appendChild(script);
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
        console.log("Announcement skipped due to High Priority modal.");
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
        localStorage.setItem("notificationLastShown", Date.now().toString());
        localStorage.setItem("notificationLastShownId", o);
      };

      const closeBtn = modalDiv.querySelector("#notification-close");
      const okBtn = modalDiv.querySelector("#notification-ok");
      if (closeBtn) closeBtn.addEventListener("click", close);
      if (okBtn) okBtn.addEventListener("click", close);
    };

    // --- 7 AM RESET LOGIC ---
    const lastShownStr = localStorage.getItem("notificationLastShown");
    const lastId = localStorage.getItem("notificationLastShownId");

    let shouldShow = false;

    if (o !== lastId) {
      shouldShow = true;
    } else if (!lastShownStr) {
      shouldShow = true;
    } else {
      const now = new Date();
      const lastShown = new Date(parseInt(lastShownStr));
      let resetThreshold = new Date();
      resetThreshold.setHours(7, 0, 0, 0);

      if (now < resetThreshold) {
        resetThreshold.setDate(resetThreshold.getDate() - 1);
      }

      if (lastShown < resetThreshold) {
        shouldShow = true;
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


document.addEventListener("DOMContentLoaded", loadLayout);

