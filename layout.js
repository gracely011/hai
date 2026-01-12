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
        home: "Home", features: "Features", about: "About", pricing: "Pricing", services: "Services",
        login: "Log In", signup: "Sign Up", dashboard: "Dashboard", logout: "Log Out",
        view_dashboard: "View dashboard", purchase_premium: "Purchase premium",
        privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us",
        unlock_premium: "Unlock Premium Together",
        hero_title: "Unlock Premium Together",
        hero_desc: "Unlock premium experiences together with our one-click access extension.",
        hero_btn_purchase: "Get Started", hero_btn_dashboard: "Dashboard", hero_btn_watch: " Watch Demo",
        feat_title: "Explore Our Features", feat_desc: "Uncover the power of Gracely.",
        price_title: "Explore Our Pricing Plans", price_desc: "Find the Perfect Fit for Your Needs.",
        price_popular: "POPULAR", price_start: "STARTING FROM", price_unit: "/ 30 DAYS",
        serv_title: "Discover Premium Account Services", serv_desc: "Real-time updates.", serv_check_dash: "Check full list on Dashboard."
    },
    id: {
        home: "Beranda", features: "Fitur", about: "Tentang", pricing: "Harga", services: "Layanan",
        login: "Masuk", signup: "Daftar", dashboard: "Dasbor", logout: "Keluar",
        view_dashboard: "Lihat Dasbor", purchase_premium: "Beli Premium",
        privacy: "Kebijakan Privasi", terms: "Syarat Layanan", contact: "Hubungi Kami",
        unlock_premium: "Buka Premium Bersama",
        hero_title: "Buka Premium Bersama",
        hero_desc: "Nikmati pengalaman premium bersama dengan ekstensi akses satu klik kami.",
        hero_btn_purchase: "Mulai Sekarang", hero_btn_dashboard: "Buka Dasbor", hero_btn_watch: " Tonton Demo",
        feat_title: "Jelajahi Fitur Kami", feat_desc: "Temukan kekuatan Gracely.",
        price_title: "Pilihan Paket Harga", price_desc: "Temukan yang paling pas untuk Anda.",
        price_popular: "POPULER", price_start: "MULAI DARI", price_unit: "/ 30 HARI",
        serv_title: "Layanan Akun Premium", serv_desc: "Pembaruan waktu nyata.", serv_check_dash: "Lihat daftar lengkap di Dasbor."
    },
    my: { 
        home: "Utama", features: "Ciri", about: "Tentang", pricing: "Harga", services: "Perkhidmatan", 
        login: "Log Masuk", signup: "Daftar", dashboard: "Papan Pemuka", logout: "Log Keluar",
        view_dashboard: "Lihat Papan Pemuka", purchase_premium: "Beli Premium", 
        privacy: "Dasar Privasi", terms: "Syarat Perkhidmatan", contact: "Hubungi Kami",
        unlock_premium: "Buka Premium Bersama",
        hero_title: "Akses Premium Bersama",
        hero_desc: "Nikmati pengalaman premium bersama dengan sambungan akses satu klik kami.",
        hero_btn_purchase: "Mula Sekarang", hero_btn_dashboard: "Papan Pemuka", hero_btn_watch: " Tonton Demo",
        feat_title: "Terokai Ciri Kami", feat_desc: "Temui kehebatan Gracely.",
        price_title: "Pelan Harga Kami", price_desc: "Cari yang sesuai untuk anda.",
        price_popular: "POPULAR", price_start: "BERMULA DARI", price_unit: "/ 30 HARI",
        serv_title: "Perkhidmatan Akaun Premium", serv_desc: "Kemas kini masa nyata.", serv_check_dash: "Lihat senarai penuh di Papan Pemuka."
    },
    ph: { 
        home: "Bahay", features: "Tampok", about: "Tungkol", pricing: "Presyo", services: "Serbisyo", 
        login: "Mag-login", signup: "Mag-sign up", dashboard: "Dashboard", logout: "Mag-log out",
        view_dashboard: "Tingnan ang Dashboard", purchase_premium: "Bumili ng Premium", 
        privacy: "Patakaran sa Privacy", terms: "Mga Tuntunin ng Serbisyo", contact: "Makipag-ugnayan",
        unlock_premium: "I-unlock ang Premium",
        hero_title: "I-unlock ang Premium",
        hero_desc: "I-unlock ang mga premium na karanasan gamit ang aming one-click extension.",
        hero_btn_purchase: "Magsimula Na", hero_btn_dashboard: "Pumunta sa Dashboard", hero_btn_watch: " Panoorin ang Demo",
        feat_title: "Tuklasin ang Mga Tampok", feat_desc: "Tuklasin ang lakas ng Gracely.",
        price_title: "Mga Plano sa Presyo", price_desc: "Hanapin ang perpekto para sa iyo.",
        price_popular: "SIKAT", price_start: "NAGSISIMULA SA", price_unit: "/ 30 ARAW",
        serv_title: "Mga Serbisyo ng Premium Account", serv_desc: "Real-time na update.", serv_check_dash: "Tingnan ang buong listahan sa Dashboard."
    },
    vn: { 
        home: "Trang chủ", features: "Tính năng", about: "Giới thiệu", pricing: "Giá cả", services: "Dịch vụ", 
        login: "Đăng nhập", signup: "Đăng ký", dashboard: "Bảng điều khiển", logout: "Đăng xuất",
        view_dashboard: "Xem Bảng điều khiển", purchase_premium: "Mua Premium", 
        privacy: "Chính sách bảo mật", terms: "Điều khoản dịch vụ", contact: "Liên hệ",
        unlock_premium: "Mở khóa Premium cùng nhau",
        hero_title: "Mở khóa Premium",
        hero_desc: "Mở khóa trải nghiệm cao cấp cùng nhau với tiện ích mở rộng truy cập một cú nhấp chuột.",
        hero_btn_purchase: "Bắt đầu ngay", hero_btn_dashboard: "Bảng điều khiển", hero_btn_watch: " Xem Demo",
        feat_title: "Khám phá Tính năng", feat_desc: "Khám phá sức mạnh của Gracely.",
        price_title: "Gói Giá Của Chúng Tôi", price_desc: "Tìm gói phù hợp nhất với nhu cầu của bạn.",
        price_popular: "PHỔ BIẾN", price_start: "BẮT ĐẦU TỪ", price_unit: "/ 30 NGÀY",
        serv_title: "Dịch vụ Tài khoản Premium", serv_desc: "Cập nhật thời gian thực.", serv_check_dash: "Xem danh sách đầy đủ trong Bảng điều khiển."
    },
    th: { 
        home: "หน้าแรก", features: "คุณสมบัติ", about: "เกี่ยวกับ", pricing: "ราคา", services: "บริการ", 
        login: "เข้าสู่ระบบ", signup: "ลงชื่อใช้", dashboard: "แผงควบคุม", logout: "ออกจากระบบ",
        view_dashboard: "ดูแผงควบคุม", purchase_premium: "ซื้อพรีเมียม", 
        privacy: "นโยบายความเป็นส่วนตัว", terms: "เงื่อนไขการให้บริการ", contact: "ติดต่อเรา",
        unlock_premium: "ปลดล็อกพรีเมียม",
        hero_title: "ปลดล็อกพรีเมียม",
        hero_desc: "ปลดล็อกประสบการณ์พรีเมียมด้วยส่วนขยายคลิกเดียวของเรา",
        hero_btn_purchase: "เริ่มเลย", hero_btn_dashboard: "แผงควบคุม", hero_btn_watch: " ดูสาธิต",
        feat_title: "สำรวจคุณสมบัติ", feat_desc: "ค้นพบพลังของ Gracely",
        price_title: "แผนราคาของเรา", price_desc: "ค้นหาแผนที่เหมาะกับคุณ",
        price_popular: "ยอดนิยม", price_start: "เริ่มต้นที่", price_unit: "/ 30 วัน",
        serv_title: "บริการบัญชีพรีเมียม", serv_desc: "อัปเดตเรียลไทม์", serv_check_dash: "ดูรายการทั้งหมดในแผงควบคุม"
    },
    cn: { 
        home: "首页", features: "特征", about: "关于", pricing: "价格", services: "服务", 
        login: "登录", signup: "注册", dashboard: "仪表板", logout: "登出",
        view_dashboard: "查看仪表板", purchase_premium: "购买高级版", 
        privacy: "隐私政策", terms: "服务条款", contact: "联系我们",
        unlock_premium: "一起解锁高级版",
        hero_title: "Gracely <br> 一起解锁高级版",
        hero_desc: "使用我们的一键访问扩展程序解锁高级体验。",
        hero_btn_purchase: "立即开始", hero_btn_dashboard: "仪表板", hero_btn_watch: " 观看演示",
        feat_title: "探索我们的功能", feat_desc: "发掘 Gracely 的力量。",
        price_title: "探索我们的定价计划", price_desc: "找到最适合您的方案。",
        price_popular: "流行", price_start: "起价", price_unit: "/ 30 天",
        serv_title: "高级帐户服务", serv_desc: "实时更新。", serv_check_dash: "登录后在仪表板上查看完整列表。"
    },
    jp: { 
        home: "ホーム", features: "特徴", about: "約", pricing: "価格", services: "サービス", 
        login: "ログイン", signup: "サインアップ", dashboard: "ダッシュボード", logout: "ログアウト",
        view_dashboard: "ダッシュボードを表示", purchase_premium: "プレミアムを購入", 
        privacy: "プライバシーポリシー", terms: "利用規約", contact: "お問い合わせ",
        unlock_premium: "プレミアムを一緒に",
        hero_title: " プレミアムを解除",
        hero_desc: "ワンクリックアクセス拡張機能でプレミアム体験を解除しましょう。",
        hero_btn_purchase: "今すぐ開始", hero_btn_dashboard: "ダッシュボード", hero_btn_watch: " デモを見る",
        feat_title: "機能を探る", feat_desc: "Gracelyの力を発見してください。",
        price_title: "価格プラン", price_desc: "あなたにぴったりのプランを見つけましょう。",
        price_popular: "人気", price_start: "開始価格", price_unit: "/ 30日",
        serv_title: "プレミアムアカウントサービス", serv_desc: "リアルタイム更新。", serv_check_dash: "ログイン後のダッシュボードで完全なリストを確認してください。"
    },
    kr: { 
        home: "홈", features: "특징", about: "약", pricing: "가격", services: "서비스", 
        login: "로그인", signup: "가입하기", dashboard: "대시보드", logout: "로그아웃",
        view_dashboard: "대시보드 보기", purchase_premium: "프리미엄 구매", 
        privacy: "개인정보 처리방침", terms: "서비스 약관", contact: "문의하기",
        unlock_premium: "프리미엄 잠금 해제",
        hero_title: " 프리미엄 잠금 해제",
        hero_desc: "원클릭 액세스 확장 프로그램으로 프리미엄 경험을 잠금 해제하세요.",
        hero_btn_purchase: "지금 시작", hero_btn_dashboard: "대시보드", hero_btn_watch: " 데모 보기",
        feat_title: "기능 살펴보기", feat_desc: "Gracely의 힘을 발견하세요.",
        price_title: "가격 플랜 살펴보기", price_desc: "나에게 맞는 플랜을 찾으세요.",
        price_popular: "인기", price_start: "시작 가격", price_unit: "/ 30일",
        serv_title: "프리미엄 계정 서비스", serv_desc: "실시간 업데이트.", serv_check_dash: "로그인 후 대시보드에서 전체 목록을 확인하세요."
    }
};

function getCurrentLang() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    if (lang) { localStorage.setItem('gracely_lang', lang); } 
    else { lang = localStorage.getItem('gracely_lang') || 'en'; }
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
    const fallbackData = translations['en'];
    return langData[key] || fallbackData[key] || key;
}

function translatePageContent() {
    const heroTitle = document.querySelector('.ud-hero-title');
    if (heroTitle) heroTitle.innerHTML = t('hero_title');
    const heroDesc = document.querySelector('.ud-hero-desc');
    if (heroDesc) heroDesc.textContent = t('hero_desc');
    const heroBtnWhite = document.querySelector('.ud-hero-buttons .ud-white-btn');
    if (heroBtnWhite) {
        if(heroBtnWhite.getAttribute('href') && heroBtnWhite.getAttribute('href').includes('dashboard')) {
             heroBtnWhite.textContent = t('hero_btn_dashboard');
        } else {
             const icon = heroBtnWhite.querySelector('i');
             heroBtnWhite.textContent = t('hero_btn_purchase') + ' ';
             if(icon) heroBtnWhite.appendChild(icon);
        }
    }
    const heroBtnLink = document.querySelector('.ud-hero-buttons .ud-link-btn');
    if (heroBtnLink) heroBtnLink.innerHTML = `<i class="fa fa-play-circle" aria-hidden="true"></i> ${t('hero_btn_watch')}`;
    const featTitle = document.querySelector('.ud-features .ud-section-title h2');
    if (featTitle) featTitle.textContent = t('feat_title');
    const featDesc = document.querySelector('.ud-features .ud-section-title p');
    if (featDesc) featDesc.textContent = t('feat_desc');
    const priceTitle = document.querySelector('.ud-pricing .ud-section-title h2');
    if (priceTitle) priceTitle.textContent = t('price_title');
    const priceDesc = document.querySelector('.ud-pricing .ud-section-title p');
    if (priceDesc) priceDesc.textContent = t('price_desc');
    const popularTag = document.querySelector('.ud-popular-tag');
    if (popularTag) popularTag.innerHTML = `<i class="fa fa-star"></i> ${t('price_popular')} <i class="fa fa-star"></i>`;
    const priceStart = document.querySelector('.ud-pricing-header h3');
    if (priceStart) priceStart.textContent = t('price_start');
    const priceUnit = document.querySelector('.ud-pricing-header h4 span');
    if (priceUnit) priceUnit.textContent = t('price_unit');
    const priceBtns = document.querySelectorAll('.ud-pricing-footer .ud-main-btn');
    priceBtns.forEach(btn => {
        btn.textContent = t('purchase_premium');
    });
    const servTitle = document.querySelector('.ud-team .ud-section-title h2');
    if (servTitle) servTitle.textContent = t('serv_title');
    const servDesc = document.querySelector('.ud-team .ud-section-title p');
    if (servDesc) servDesc.textContent = t('serv_desc');
    const servChecks = document.querySelectorAll('.ud-team .text-center a.ud-main-btn');
    servChecks.forEach(btn => {
        btn.textContent = t('serv_check_dash');
    });
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
            <li><a class="dropdown-item" href="?lang=my"><span class="flag-icon flag-icon-my me-2"></span> Melayu</a></li>
            <li><a class="dropdown-item" href="?lang=ph"><span class="flag-icon flag-icon-ph me-2"></span> Filipino</a></li>
            <li><a class="dropdown-item" href="?lang=vn"><span class="flag-icon flag-icon-vn me-2"></span> Tiếng Việt</a></li>
            <li><a class="dropdown-item" href="?lang=th"><span class="flag-icon flag-icon-th me-2"></span> ไทย</a></li>
            <li><a class="dropdown-item" href="?lang=cn"><span class="flag-icon flag-icon-cn me-2"></span> 中文</a></li>
            <li><a class="dropdown-item" href="?lang=jp"><span class="flag-icon flag-icon-jp me-2"></span> 日本語</a></li>
            <li><a class="dropdown-item" href="?lang=kr"><span class="flag-icon flag-icon-kr me-2"></span> 한국어</a></li>
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">${t('features')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">${t('about')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">${t('pricing')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">${t('services')}</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-flex align-items-center">
            ${getLanguageDropdownHTML()}
            <a href="login.html" class="ud-main-btn ud-white-btn" style="padding: 10px 25px;">${t('login')}</a>
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
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#home">${t('home')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#features">${t('features')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#about">${t('about')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#pricing">${t('pricing')}</a></li>
              <li class="nav-item"><a class="ud-menu-scroll" href="index.html#services">${t('services')}</a></li>
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
            <p class="ud-widget-desc">${t('unlock_premium')}</p>
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
              <li><a href="dashboard.html">${t('view_dashboard')}</a></li>
              <li><a href="premium.html">${t('purchase_premium')}</a></li>
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
        <div class="col-md-4"><p class="ud-footer-bottom-right">Gracely &copy; 2025</p></div>
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
            purchaseButton.textContent = t('hero_btn_dashboard'); 
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
                if(logoutBtn && typeof logout === 'function') {
                    logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
                }
            }, 500);
            if (typeof eraseCookie === 'function') eraseCookie('UnangJahaCookieOnLae');
        } else {
            navbarPlaceholder.innerHTML = defaultNavbarHTML();
        }
    }

    if (typeof initializeScripts === 'function') { initializeScripts(); }
    
    translatePageContent();
    modifyIndexPageContent();
    runNotificationChecks();
}

document.addEventListener("DOMContentLoaded", loadLayout);

