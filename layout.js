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
    return langMap[lang] ? langMap[lang] : langMap['en'];
}

function getLanguageDropdownHTML() {
    const current = getCurrentLang();
    return `
    <div class="nav-item dropdown d-inline-block me-2">
        <a class="ud-main-btn ud-login-btn text-center dropdown-toggle" 
           href="#" role="button" data-bs-toggle="dropdown" 
           aria-expanded="false" style="padding: 10px 15px;"> 
            <span class="flag-icon flag-icon-${current.flag} me-1"></span> 
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
                <i class="fa fa-times close-icon" id="notification-close"></i> 
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

async function runNotificationChecks() {
    await checkPremiumExpiryWarning();
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">Features</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">About</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">Pricing</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">Services</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
            ${getLanguageDropdownHTML()}
            <a href="dashboard.html" class="ud-main-btn ud-login-btn"><i class="fa-solid fa-user"></i></a>
            <a href="login.html" class="ud-main-btn ud-white-btn"><i class="fa fa-sign-in" aria-hidden="true"></i></a>
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">Services</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
             ${getLanguageDropdownHTML()}
             <a href="dashboard.html" class="ud-main-btn ud-login-btn"><i class="fa-solid fa-user"></i> ${userName}</a>
             <button id="logout-button" class="ud-main-btn ud-white-btn"><i class="fa fa-sign-out" aria-hidden="true"></i></button>
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
            <h5 class="ud-widget-title">About</h5>
            <ul class="ud-widget-links">
              <li><a href="index.html#features">Features</a></li>
              <li><a href="index.html#about">About</a></li>
              <li><a href="index.html#pricing">Pricing</a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">Dashboard</h5>
            <ul class="ud-widget-links">
              <li><a href="dashboard.html">View dashboard <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
              <li><a href="premium.html">Purchase premium <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
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
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#contact">Contact Us</a></li>
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
            purchaseButton.textContent = 'Go to Dashboard';
            purchaseButton.href = 'dashboard.html';
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
            const userName = localStorage.getItem("userName") || "User";
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

    modifyIndexPageContent();
    runNotificationChecks();
}

document.addEventListener("DOMContentLoaded", loadLayout);
