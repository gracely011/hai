const announcementBarHTML = ``;

async function checkPremiumExpiryWarning() {
    try {
        if (typeof isAuthenticated !== 'function' || !isAuthenticated()) {
            return false;
        }
        const expiryDateStr = localStorage.getItem('premiumExpiryDate');
        if (!expiryDateStr) {
            return false;
        }
        const expiryDate = new Date(expiryDateStr);
        const now = new Date();
        const timeLeft = expiryDate.getTime() - now.getTime();
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        if (daysLeft > 4 || daysLeft <= 0) {
            return false;
        }
        const modalContainer = document.getElementById('notification-0');
        const modalContent = modalContainer.querySelector('.notificationModal-content');
        const showExpiryModal = () => {
            const modalHTML = ` <i class="fa fa-times gracely-modal-close-icon" id="notification-close"></i> <h2 style="color: #d93025;">Peringatan Langganan</h2> <p>Masa aktif premium Anda akan segera berakhir.</p> <p>Sisa waktu: <strong>${daysLeft} hari lagi.</strong></p> <p>Silakan lakukan perpanjangan langganan agar tidak terputus.</p> <button class="ud-main-btn" id="notification-ok" style="margin-top: 10px;">OK, Saya Mengerti</button> `;
            modalContent.innerHTML = modalHTML;
            modalContainer.style.display = 'flex';
            modalContainer.style.visibility = 'visible';
            modalContainer.style.opacity = '1';
            const closeModal = () => {
                modalContainer.style.display = 'none';
            };
            const closeBtn = modalContainer.querySelector('#notification-close');
            const okBtn = modalContainer.querySelector('#notification-ok');
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (okBtn) okBtn.addEventListener('click', closeModal);
        };
        showExpiryModal();
        return true;
    } catch (error) {
        console.warn("Gagal cek peringatan kadaluarsa:", error);
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
        const modalContent = modalContainer.querySelector('.notificationModal-content');
        
        const showModal = () => {
            // LOGIKA BARU: Cek apakah ada HTML custom?
            if (notifData.html) {
                // Jika ada HTML custom, inject langsung ke container utama (timpa wrapper lama)
                modalContainer.innerHTML = notifData.html;
            } else {
                // Fallback ke logika lama (Title + Lines)
                let contentParagraphs = '';
                if (notifData.lines && Array.isArray(notifData.lines)) {
                    contentParagraphs = notifData.lines.map(line => `<p>${line}</p>`).join('');
                }
                const notificationHTML = ` <i class="fa fa-times gracely-modal-close-icon" id="notification-close"></i> <h2>${notifData.title}</h2> ${contentParagraphs} <button class="ud-main-btn" id="notification-ok" style="margin-top: 10px;">OK</button> `;
                modalContent.innerHTML = notificationHTML;
            }

            modalContainer.style.display = 'flex';
            modalContainer.style.visibility = 'visible';
            modalContainer.style.opacity = '1';

            // Pasang Event Listener (Perlu pencarian ulang karena DOM baru saja dirender)
            const closeBtn = modalContainer.querySelector('#notification-close');
            const okBtn = modalContainer.querySelector('#notification-ok');
            
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (okBtn) okBtn.addEventListener('click', closeModal);
        };

        const closeModal = () => {
            modalContainer.style.display = 'none';
            localStorage.setItem('websiteNotificationLastShown', Date.now().toString());
            localStorage.setItem('websiteNotificationLastShownId', newNotifId);
        };

        // Tampilkan jika: Belum pernah, Sudah lewat 1 hari, atau ID notif baru
        if (!lastShownTimestamp || timeDiff > oneDay || newNotifId !== lastShownId) {
            setTimeout(() => {
                showModal();
            }, 2000); // Delay dikit biar smooth
        }
    } catch (error) {
        console.warn("Gagal memuat notifikasi website:", error);
    }
}

async function runNotificationChecks() {
    const didShowExpiryWarning = await checkPremiumExpiryWarning();
    if (didShowExpiryWarning) {
        return;
    }
    await initializeWebsiteAnnouncement();
}

const defaultNavbarHTML = `
<header class="ud-header">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="https://gracely011.github.io/hai/">
            <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
            <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#features">Features</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#about">About</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#pricing">Pricing</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#services">Services</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
            <a href="login.html" class="ud-main-btn ud-login-btn">Log In</a>
            <a href="signup.html" class="ud-main-btn ud-white-btn">Sign Up</a>
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
          <a class="navbar-brand" href="https://gracely011.github.io/hai/">
             <img src="assets/images/logo/gracely_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
             <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#features">Features</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#about">About</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#pricing">Pricing</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="https://gracely011.github.io/hai/#services">Services</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
             <a href="dashboard.html" class="ud-main-btn ud-login-btn">${userName}</a>
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
    <img src="assets/images/footer/dotted-shape.svg" alt="shape" />
  </div>
  <div class="ud-footer-widgets">
    <div class="container">
      <div class="row">
        <div class="col-xl-3 col-lg-4 col-md-6">
          <div class="ud-widget">
            <a href="./" class="ud-footer-logo">
              <img src="assets/images/logo/gracely_white.png" alt="logo" />
            </a>
            <p class="ud-widget-desc">
            Unlock Premium Together
            </p>
            <ul class="ud-widget-socials">
              <li>
                <a href="#">
                  <i class="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa-brands fa-discord"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">About</h5>
            <ul class="ud-widget-links">
              <li><a href="https://gracely011.github.io/hai/#features">Features</a></li>
              <li><a href="https://gracely011.github.io/hai/#about">About</a></li>
              <li><a href="https://gracely011.github.io/hai/#pricing">Pricing</a></li>
              <li><a href="https://gracely011.github.io/hai/#services">Services</a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">Dashboard</h5>
            <ul class="ud-widget-links">
              <li><a href="dashboard.html" rel="nofollow noopener">View dashboard <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
              <li><a href="premium.html" rel="nofollow noopener">Purchase premium <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6">
          <div class="ud-widget">
            <h5 class="ud-widget-title">Extension</h5>
            <ul class="ud-widget-links">
              <li><a href="dashboard.html" rel="nofollow noopener">Download extension <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li>
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
            <li><a href="#">Privacy Policy</a></li> <li><a href="#">Terms of Service</a></li> <li><a href="index.html#contact">Contact Us</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <p class="ud-footer-bottom-right">Gracely &copy; 2023-2025</p>
          <p class="ud-footer-bottom-right">
          This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="groupy-wave" style="margin-top:-23px">
      <div class="bg-white" style="margin-top:0px;height:23px"></div><div class="bg-white" style="margin-top:1px;height:22px"></div><div class="bg-white" style="margin-top:2px;height:21px"></div><div class="bg-white" style="margin-top:3px;height:20px"></div><div class="bg-white" style="margin-top:4px;height:19px"></div><div class="bg-white" style="margin-top:5px;height:18px"></div><div class="bg-white" style="margin-top:6px;height:17px"></div><div class="bg-white" style="margin-top:7px;height:16px"></div><div class="bg-white" style="margin-top:8px;height:15px"></div><div class="bg-white" style="margin-top:9px;height:14px"></div><div class="bg-white" style="margin-top:10px;height:13px"></div><div class="bg-white" style="margin-top:11px;height:12px"></div><div class="bg-white" style="margin-top:12px;height:11px"></div><div class="bg-white" style="margin-top:13px;height:10px"></div><div class="bg-white" style="margin-top:14px;height:9px"></div><div class="bg-white" style="margin-top:15px;height:8px"></div><div class="bg-white" style="margin-top:16px;height:7px"></div><div class="bg-white" style="margin-top:17px;height:6px"></div><div class="bg-white" style="margin-top:18px;height:5px"></div><div class="bg-white" style="margin-top:19px;height:4px"></div><div class="bg-white" style="margin-top:20px;height:3px"></div><div class="bg-white" style="margin-top:21px;height:2px"></div><div class="bg-white" style="margin-top:22px;height:1px"></div><div class="bg-white" style="margin-top:23px;height:0px"></div>
  </div>
</footer>
`;

const backToTopHTML = `<a href="javascript:void(0)" class="back-to-top"><i class="fa-solid fa-arrow-up"></i></a>`;

function modifyIndexPageContent() {
    const path = window.location.pathname;
    const isIndexPage = path.endsWith('/') || path.endsWith('/hai/') || path.endsWith('index.html');
    if (!isIndexPage) {
        return;
    }
    if (typeof isAuthenticated === 'function' && isAuthenticated()) {
        const purchaseButton = document.querySelector('#home .ud-hero-buttons .ud-white-btn');
        const demoButton = document.querySelector('#home .ud-hero-buttons .ud-link-btn');
        if (purchaseButton) {
            purchaseButton.textContent = 'Go to Dashboard';
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
            const userName = localStorage.getItem("userName") || "User";
            navbarPlaceholder.innerHTML = loggedInNavbarHTML(userName);
            if (typeof eraseCookie === 'function') {
                eraseCookie('UnangJahaCookieOnLae');
            }
        } else {
            navbarPlaceholder.innerHTML = defaultNavbarHTML;
        }
    }
    if (typeof initializeScripts === 'function') {
        initializeScripts();
    }
    modifyIndexPageContent();
    runNotificationChecks();
}
document.addEventListener("DOMContentLoaded", loadLayout);
