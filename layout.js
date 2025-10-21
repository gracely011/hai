const announcementBarHTML = `
<div class="announcement-bar">
    The only official Gracely website is <b>https://gracely.id/</b>. Please be aware of fake websites. Join our Discord server for service updates and the latest discounts: <a href="#">https://discord.gg/gracely</a>
</div>
`;

const defaultNavbarHTML = `
<header class="ud-header">
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="index.html">
            <img src="https://groupy.id/assets/images/logo/groupy_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
            <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">Features</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">About</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">Pricing</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">Services</a></li>
            </ul>
          </div>
          <div class="navbar-btn">
            <a href="https://gracely011.github.io/hai/login.html" class="ud-main-btn ud-login-btn">Log In</a>
            <a href="https://gracely011.github.io/hai/signup.html" class="ud-main-btn ud-white-btn">Sign Up</a>
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
             <img src="https://groupy.id/assets/images/logo/groupy_mobile_white.png" alt="Logo" id="logo" />
          </a>
          <button class="navbar-toggler">
            <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
          </button>
          <div class="navbar-collapse">
             <ul id="nav" class="navbar-nav mx-auto">
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home">Home</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">Features</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">About</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">Pricing</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">Services</a></li>
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
    <div class="shape shape-1"><img src="https://groupy.id/assets/images/footer/leftshape.png" alt="shape"/></div>
    <div class="shape shape-2"><img src="https://groupy.id/assets/images/footer/dotted-shape.svg" alt="shape"/></div>
    <div class="shape shape-3"><img src="https://groupy.id/assets/images/footer/rightshape.png" alt="shape"/></div>
    <div class="ud-footer-widgets">
        <div class="container">
            <div class="row">
                <div class="col-xl-3 col-lg-4 col-md-6"><div class="ud-widget"><a href="index.html" class="ud-footer-logo"><img src="https://groupy.id/assets/images/logo/groupy_white.png" alt="logo"/></a><p class="ud-widget-desc">Unlock Premium Together</p><ul class="ud-widget-socials"><li><a href="#"><i class="fa-brands fa-instagram"></i></a></li><li><a href="#"><i class="fa-brands fa-discord"></i></a></li></ul></div></div>
                <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6"><div class="ud-widget"><h5 class="ud-widget-title">About</h5><ul class="ud-widget-links"><li><a href="index.html#features">Features</a></li><li><a href="index.html#about">About</a></li><li><a href="index.html#pricing">Pricing</a></li><li><a href="index.html#services">Services</a></li></ul></div></div>
                <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6"><div class="ud-widget"><h5 class="ud-widget-title">Dashboard</h5><ul class="ud-widget-links"><li><a href="https://gracely011.github.io/hai/dashboard.html">View dashboard <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li><li><a href="#">Purchase premium <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li></ul></div></div>
                <div class="col-xl-2 col-lg-2 col-md-6 col-sm-6"><div class="ud-widget"><h5 class="ud-widget-title">Extension</h5><ul class="ud-widget-links"><li><a href="https://gracely011.github.io/hai/dashboard.html">Download extension <i class="fa-solid fa-arrow-up-right-from-square"></i></a></li></ul></div></div>
                <div class="col-xl-2 col-lg-2 col-md-6 col-sm-10"><div class="ud-widget"><h5 class="ud-widget-title">Partners</h5><ul class="ud-widget-brands"><li><a href="#" rel="nofollow noopener" target="_blank"><img src="https://tripay.co.id/new-template/images/logo-dark.png" alt="TriPay"></a><a href="#" rel="nofollow noopener" target="_blank"><img src="https://companieslogo.com/img/orig/NET_BIG.D-52893f5e.png" alt="Cloudflare"></a></li></ul></div></div>
            </div>
        </div>
    </div>
    <div class="ud-footer-bottom">
        <div class="container">
            <div class="row">
                <div class="col-md-8"><ul class="ud-footer-bottom-left"><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li><li><a href="index.html#contact">Contact Us</a></li></ul></div>
                <div class="col-md-4"><p class="ud-footer-bottom-right">Gracely © 2023-2025</p></div>
            </div>
        </div>
    </div>
</footer>
`;

const backToTopHTML = `<a href="javascript:void(0)" class="back-to-top"><i class="fa-solid fa-arrow-up"></i></a>`;

function loadLayout() {
    const announcementPlaceholder = document.getElementById("announcement-placeholder");
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");
    const backToTopPlaceholder = document.getElementById("back-to-top-placeholder");
    const loginStatusPlaceholder = document.getElementById("login-status-placeholder");

    if (announcementPlaceholder) announcementPlaceholder.innerHTML = announcementBarHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;
    if (backToTopPlaceholder) backToTopPlaceholder.innerHTML = backToTopHTML;

    if (navbarPlaceholder) {
        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
            const userName = localStorage.getItem("userName") || "User";
            navbarPlaceholder.innerHTML = loggedInNavbarHTML(userName);
        } else {
            navbarPlaceholder.innerHTML = defaultNavbarHTML;
        }
    }

    if (loginStatusPlaceholder) {
        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
            loginStatusPlaceholder.textContent = "Status: Sudah Login";
            loginStatusPlaceholder.style.color = "lightgreen";
        } else {
            loginStatusPlaceholder.textContent = "Status: Belum Login";
            loginStatusPlaceholder.style.color = "orange";
        }
    }

    if (typeof initializeScripts === 'function') {
      initializeScripts();
    }
}


document.addEventListener("DOMContentLoaded", loadLayout);


