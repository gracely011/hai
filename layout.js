(function() {
    if (!document.querySelector('link[href*="flag-icon-css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icon-css@1.1.0/css/flag-icon.min.css';
        document.head.appendChild(link);
    }
})();

const announcementBarHTML = `
<div class="announcement-bar">
  The only official Gracely website is https://gracely011.github.io/hai/. Please be aware of fake websites.
</div>`;

const translations = {
    en: {
        home: "Home",
        features: "Features",
        about: "About",
        pricing: "Pricing",
        services: "Services",
        login: "Log In",
        signup: "Sign Up",
        dashboard: "Dashboard",
        logout: "Log Out",
        view_dashboard: "View dashboard",
        purchase_premium: "Purchase premium",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        contact: "Contact Us"
    },
    id: {
        home: "Beranda",
        features: "Fitur",
        about: "Tentang",
        pricing: "Harga",
        services: "Layanan",
        login: "Masuk",
        signup: "Daftar",
        dashboard: "Dasbor",
        logout: "Keluar",
        view_dashboard: "Lihat Dasbor",
        purchase_premium: "Beli Premium",
        privacy: "Kebijakan Privasi",
        terms: "Syarat Layanan",
        contact: "Hubungi Kami"
    },
    my: { 
        home: "Utama", features: "Ciri", about: "Tentang", pricing: "Harga", services: "Perkhidmatan", 
        login: "Log Masuk", signup: "Daftar", dashboard: "Papan Pemuka", logout: "Log Keluar",
        view_dashboard: "Lihat Papan Pemuka", purchase_premium: "Beli Premium", 
        privacy: "Dasar Privasi", terms: "Syarat Perkhidmatan", contact: "Hubungi Kami"
    },
    ph: { 
        home: "Bahay", features: "Tampok", about: "Tungkol", pricing: "Presyo", services: "Serbisyo", 
        login: "Mag-login", signup: "Mag-sign up", dashboard: "Dashboard", logout: "Mag-log out",
        view_dashboard: "Tingnan ang Dashboard", purchase_premium: "Bumili ng Premium", 
        privacy: "Patakaran sa Privacy", terms: "Mga Tuntunin ng Serbisyo", contact: "Makipag-ugnayan"
    },
    vn: { 
        home: "Trang chủ", features: "Tính năng", about: "Giới thiệu", pricing: "Giá cả", services: "Dịch vụ", 
        login: "Đăng nhập", signup: "Đăng ký", dashboard: "Bảng điều khiển", logout: "Đăng xuất",
        view_dashboard: "Xem Bảng điều khiển", purchase_premium: "Mua Premium", 
        privacy: "Chính sách bảo mật", terms: "Điều khoản dịch vụ", contact: "Liên hệ"
    },
    th: { 
        home: "หน้าแรก", features: "คุณสมบัติ", about: "เกี่ยวกับ", pricing: "ราคา", services: "บริการ", 
        login: "เข้าสู่ระบบ", signup: "ลงชื่อใช้", dashboard: "แผงควบคุม", logout: "ออกจากระบบ",
        view_dashboard: "ดูแผงควบคุม", purchase_premium: "ซื้อพรีเมียม", 
        privacy: "นโยบายความเป็นส่วนตัว", terms: "เงื่อนไขการให้บริการ", contact: "ติดต่อเรา"
    },
    cn: { 
        home: "首页", features: "特征", about: "关于", pricing: "价格", services: "服务", 
        login: "登录", signup: "注册", dashboard: "仪表板", logout: "登出",
        view_dashboard: "查看仪表板", purchase_premium: "购买高级版", 
        privacy: "隐私政策", terms: "服务条款", contact: "联系我们"
    },
    jp: { 
        home: "ホーム", features: "特徴", about: "約", pricing: "価格", services: "サービス", 
        login: "ログイン", signup: "サインアップ", dashboard: "ダッシュボード", logout: "ログアウト",
        view_dashboard: "ダッシュボードを表示", purchase_premium: "プレミアムを購入", 
        privacy: "プライバシーポリシー", terms: "利用規約", contact: "お問い合わせ"
    },
    kr: { 
        home: "홈", features: "특징", about: "약", pricing: "가격", services: "서비스", 
        login: "로그인", signup: "가입하기", dashboard: "대시보드", logout: "로그아웃",
        view_dashboard: "대시보드 보기", purchase_premium: "프리미엄 구매", 
        privacy: "개인정보 처리방침", terms: "서비스 약관", contact: "문의하기"
    }
};

function getCurrentLang() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || 'en';
    
    const langMap = {
        'en': { flag: 'us', name: 'English' },
        'id': { flag: 'id', name: 'Indonesia' },
        'my': { flag: 'my', name: 'Melayu' },
        'ph': { flag: 'ph', name: 'Filipino' },
        'vn': { flag: 'vn', name: 'Tiếng Việt' },
        'th': { flag: 'th', name: 'ไทย' },
        'cn': { flag: 'cn', name: '中文' },
        'jp': { flag: 'jp', name: '日本語' },
        'kr': { flag: 'kr', name: '한국어' }
    };
    return langMap[lang] ? { ...langMap[lang], code: lang } : { ...langMap['en'], code: 'en' };
}

function t(key) {
    const current = getCurrentLang().code;
    const langData = translations[current] || translations['en'];
    return langData[key] || key;
}

function getLanguageDropdownHTML() {
    const current = getCurrentLang();
    return `
    <div class="nav-item dropdown d-inline-block me-2">
        <a class="ud-main-btn ud-login-btn text-center dropdown-toggle" 
           href="#" role="button" data-bs-toggle="dropdown" 
           aria-expanded="false" style="padding: 10px 15px; display: inline-flex; align-items: center; gap: 5px;"> 
            <span class="flag-icon flag-icon-${current.flag}"></span> 
            <span class="d-none d-md-inline">${current.name}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item ${current.flag === 'us' ? 'active' : ''}" href="?lang=en"><span class="flag-icon flag-icon-us me-2"></span> English</a></li>
            <li><a class="dropdown-item ${current.flag === 'id' ? 'active' : ''}" href="?lang=id"><span class="flag-icon flag-icon-id me-2"></span> Indonesia</a></li>
            <li><a class="dropdown-item ${current.flag === 'my' ? 'active' : ''}" href="?lang=my"><span class="flag-icon flag-icon-my me-2"></span> Melayu</a></li>
            <li><a class="dropdown-item ${current.flag === 'ph' ? 'active' : ''}" href="?lang=ph"><span class="flag-icon flag-icon-ph me-2"></span> Filipino</a></li>
            <li><a class="dropdown-item ${current.flag === 'vn' ? 'active' : ''}" href="?lang=vn"><span class="flag-icon flag-icon-vn me-2"></span> Tiếng Việt</a></li>
            <li><a class="dropdown-item ${current.flag === 'th' ? 'active' : ''}" href="?lang=th"><span class="flag-icon flag-icon-th me-2"></span> ไทย</a></li>
            <li><a class="dropdown-item ${current.flag === 'cn' ? 'active' : ''}" href="?lang=cn"><span class="flag-icon flag-icon-cn me-2"></span> 中文</a></li>
            <li><a class="dropdown-item ${current.flag === 'jp' ? 'active' : ''}" href="?lang=jp"><span class="flag-icon flag-icon-jp me-2"></span> 日本語</a></li>
            <li><a class="dropdown-item ${current.flag === 'kr' ? 'active' : ''}" href="?lang=kr"><span class="flag-icon flag-icon-kr me-2"></span> 한국어</a></li>
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
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        if (daysLeft > 4 || daysLeft <= 0) return false;

        const modalContainer = document.getElementById('notification-0');
        if(!modalContainer) return false; 
        const modalContent = modalContainer.querySelector('.notificationModal-content');
        
        const showExpiryModal = () => {
            const modalHTML = ` 
                <i class="fa fa-times gracely-modal-close-icon" id="notification-close"></i> 
                <h2 style="color: #d93025;">Peringatan Langganan</h2> 
                <p>Masa aktif premium Anda akan segera berakhir.</p> 
                <p>Sisa waktu: <strong>${daysLeft} hari lagi.</strong></p> 
                <p>Silakan lakukan perpanjangan langganan agar tidak terputus.</p> 
                <button class="ud-main-btn" id="notification-ok" style="margin-top: 10px;">OK, Saya Mengerti</button> 
            `;
            modalContent.innerHTML = modalHTML;
            modalContainer.style.display = 'flex';
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
    } catch (error) {
        console.warn(error);
        return false;
    }
}

async function initializeWebsiteAnnouncement() {
    try {
        const configResponse = await fetch('aturhonma.js');
        if (!configResponse.ok) return;
        const configText = await configResponse.text();
        
        const gracelyConfig = JSON.parse(configText.replace('const gracelyConfig =', '').trim().replace(/;$/, ''));
        const notifData = gracelyConfig.notifications?.announcement;
        
        if (!notifData || !notifData.enabled || !notifData.id) {
            return;
        }

        const newNotifId = notifData.id;
        const lastShownTimestamp = localStorage.getItem('websiteNotificationLastShown');
        const lastShownId = localStorage.getItem('websiteNotificationLastShownId');
        const oneDay = 24 * 60 * 60 * 1000;
        const timeDiff = Date.now() - parseInt(lastShownTimestamp || '0');
        
        const modalContainer = document.getElementById('notification-0');
        if(!modalContainer) return;
        const modalContent = modalContainer.querySelector('.notificationModal-content');
        
        const showModal = () => {
            if (notifData.html) {
                modalContainer.innerHTML = notifData.html;
            } else {
                let contentParagraphs = '';
                if (notifData.lines && Array.isArray(notifData.lines)) {
                    contentParagraphs = notifData.lines.map(line => `<p>${line}</p>`).join('');
                }
                const notificationHTML = ` 
                    <i class="fa fa-times gracely-modal-close-icon" id="notification-close"></i> 
                    <h2>${notifData.title}</h2> 
                    ${contentParagraphs} 
                    <button class="ud-main-btn" id="notification-ok" style="margin-top: 10px;">OK</button> 
                `;
                modalContent.innerHTML = notificationHTML;
            }

            modalContainer.style.display = 'flex';
            modalContainer.style.visibility = 'visible';
            modalContainer.style.opacity = '1';

            const closeBtn = modalContainer.querySelector('#notification-close');
            const okBtn = modalContainer.querySelector('#notification-ok');
            const closeModal = () => {
                modalContainer.style.display = 'none';
                localStorage.setItem('websiteNotificationLastShown', Date.now().toString());
                localStorage.setItem('websiteNotificationLastShownId', newNotifId);
            };
            
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (okBtn) okBtn.addEventListener('click', closeModal);
        };

        if (!lastShownTimestamp || timeDiff > oneDay || newNotifId !== lastShownId) {
            setTimeout(() => {
                showModal();
            }, 2000); 
        }
    } catch (error) {
        console.warn(error);
    }
}

async function runNotificationChecks() {
    const didShowExpiryWarning = await checkPremiumExpiryWarning();
    if (didShowExpiryWarning) {
        return;
    }
    await initializeWebsiteAnnouncement();
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">${t('features')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">${t('about')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">${t('pricing')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">${t('services')}</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
            ${getLanguageDropdownHTML()}
            <a href="login.html" class="ud-main-btn ud-login-btn">${t('login')}</a>
            <a href="signup.html" class="ud-main-btn ud-white-btn">${t('signup')}</a>
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="dashboard.html">${t('dashboard')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">${t('services')}</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-flex align-items-center">
             ${getLanguageDropdownHTML()}
             <a href="dashboard.html" class="ud-main-btn ud-login-btn d-flex align-items-center" style="gap: 8px; padding-left:15px; padding-right:15px;">
               <i class="fa-solid fa-user"></i> 
               <span style="font-weight: 600;">${userName}</span>
             </a>
             <button id="logout-button" class="ud-main-btn ud-white-btn ms-2" title="${t('logout')}" style="padding: 10px 15px;"><i class="fa fa-sign-out" aria-hidden="true"></i></button>
          </div>
        </nav>
      </div>
    </div>
  </div>
</header>
`;

const footerHTML = `
<footer class="ud-footer" data-wow-delay=".15s">
  <div class="shape shape-1">
    <img src="assets/images/footer/leftshape.png" alt="shape" />
  </div>
  <div class="shape shape-2">
    <img src="assets/images/footer/dotted-shape.svg" alt="shape" />
  </div>
  <div class="shape shape-3">
    <img src="assets/images/footer/rightshape.png" alt="shape" />
  </div>
  <div class="ud-footer-widgets">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="ud-widget">
            <a href="./" class="ud-footer-logo">
              <img src="assets/images/logo/gracely_white.png" alt="logo" />
            </a>
            <p class="ud-widget-desc">Unlock Premium Together</p>
            <ul class="ud-widget-socials">
              <li><a href="#"><i class="fa-brands fa-instagram"></i></a></li>
              <li><a href="#"><i class="fa-brands fa-discord"></i></a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">${t('about')}</h5>
            <ul class="ud-widget-links">
              <li><a href="index.html#features">${t('features')}</a></li>
              <li><a href="index.html#about">${t('about')}</a></li>
              <li><a href="index.html#pricing">${t('pricing')}</a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">${t('dashboard')}</h5>
            <ul class="ud-widget-links">
              <li><a href="dashboard.html">${t('view_dashboard')} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
              <li><a href="premium.html">${t('purchase_premium')} <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
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
            <li><a href="#">${t('privacy')}</a></li>
            <li><a href="#">${t('terms')}</a></li>
            <li><a href="#contact">${t('contact')}</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <p class="ud-footer-bottom-right">Gracely &copy; 2025</p>
        </div>
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
            purchaseButton.textContent = t('dashboard'); 
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

    const modalDiv = document.createElement('div');
    modalDiv.className = 'notificationModal';
    modalDiv.id = 'notification-0';
    modalDiv.style.display = 'none';
    modalDiv.innerHTML = '<div class="notificationModal-content"></div>';
    document.body.appendChild(modalDiv);

    if (announcementPlaceholder) announcementPlaceholder.innerHTML = announcementBarHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
    if (backToTopPlaceholder) backToTopPlaceholder.innerHTML = backToTopHTML;
    
    if (navbarPlaceholder) {
        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
            const userName = localStorage.getItem("userName") || "Member";
            navbarPlaceholder.innerHTML = loggedInNavbarHTML(userName);
            
            setTimeout(() => {
                const logoutBtn = document.getElementById('logout-button');
                if(logoutBtn && typeof logout === 'function') {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        logout();
                    });
                }
            }, 500);

            if (typeof eraseCookie === 'function') eraseCookie('UnangJahaCookieOnLae');
        } else {
            navbarPlaceholder.innerHTML = defaultNavbarHTML();
        }
    }

    if (typeof initializeScripts === 'function') {
        initializeScripts();
    }

    modifyIndexPageContent();
    runNotificationChecks();
}

document.addEventListener("DOMContentLoaded", loadLayout);
