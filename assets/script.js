(function(){var a=["gracely011.github.io","localhost","127.0.0.1"],h=window.location.hostname,p=window.location.pathname,o=!1;for(var i=0;i<a.length;i++)if(h===a[i]){o=!0;break}if(o&&h==="gracely011.github.io"&&!p.startsWith("/hai/")){o=!1}o||(window.location.href="https://gracely011.github.io/hai/")})();function initializeScripts(){"use strict";console.log('%cgracely','color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');console.log('%cUnlock Premium Together','color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');console.log('%ccontact@gracely.id','color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');window.onscroll=function(){const ud_header=document.querySelector(".ud-header");if(!ud_header)return;const sticky=ud_header.offsetTop;const logo=document.querySelector(".navbar-brand img");if(window.pageYOffset>sticky){ud_header.classList.add("sticky");}else{ud_header.classList.remove("sticky");}if(logo){if(ud_header.classList.contains("sticky")){logo.src="assets/images/logo/gracely_mobile_black.png";}else{logo.src="assets/images/logo/gracely_mobile_white.png";}}const backToTop=document.querySelector(".back-to-top");if(backToTop){if(document.body.scrollTop>50||document.documentElement.scrollTop>50){backToTop.style.display="flex";}else{backToTop.style.display="none";}}};document.body.addEventListener('click',function(event){if(event.target.closest('.back-to-top')){document.body.scrollTop=0;document.documentElement.scrollTop=0;}});const navbarToggler=document.querySelector(".navbar-toggler");if(navbarToggler){navbarToggler.addEventListener("click",function(){navbarToggler.classList.toggle("active");const navbarCollapse=document.querySelector(".navbar-collapse");if(navbarCollapse){navbarCollapse.classList.toggle("show");}});}const loginForm=document.getElementById('login-form');if(loginForm){loginForm.addEventListener('submit',async(event)=>{event.preventDefault();let errorMessage=document.getElementById('login-error-message');if(!errorMessage){errorMessage=document.createElement('p');errorMessage.id='login-error-message';errorMessage.style.color='red';errorMessage.style.marginTop='15px';const buttonContainer=loginForm.querySelector('.ud-form-group');if(buttonContainer){loginForm.insertBefore(errorMessage,buttonContainer);}else{loginForm.appendChild(errorMessage);}}errorMessage.textContent='';const emailInput=document.getElementById('email');const passwordInput=document.getElementById('password');const email=emailInput?emailInput.value.trim():'';const password=passwordInput?passwordInput.value.trim():'';if(!email||!password){errorMessage.textContent="Email dan password tidak boleh kosong.";return;}const submitButton=loginForm.querySelector('button[type="submit"]');submitButton.disabled=true;submitButton.innerHTML='Memuat...';const result=await login(email,password);if(result.success){window.location.href="https://gracely011.github.io/hai/dashboard.html";}else{errorMessage.textContent=result.message;submitButton.disabled=false;submitButton.innerHTML='Log in';}});}document.body.addEventListener('click',function(event){if(event.target.closest('#logout-button')){logout();}});const videoModals=[{btnId:"openModalBtn",modalId:"videoModal",videoId:"videoElement"},{btnId:"openModalBtnKiwi",modalId:"videoModalKiwi",videoId:"videoElementKiwi"},{btnId:"openModalBtnOrion",modalId:"videoModalOrion",videoId:"videoElementOrion"},{btnId:"openModalBtnDemo",modalId:"videoModalDemo",videoId:"videoElementDemo"}];videoModals.forEach(({btnId,modalId,videoId})=>{const openBtn=document.getElementById(btnId);const modal=document.getElementById(modalId);const video=document.getElementById(videoId);if(openBtn&&modal&&video){openBtn.addEventListener("click",()=>{modal.style.display="flex";video.currentTime=0;video.play();});window.addEventListener("click",(event)=>{if(event.target===modal){modal.style.display="none";video.pause();}});document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&modal.style.display==='flex'){modal.style.display="none";video.pause();}});}});startSessionCheckLoop();}
function handleMultiLoginKick(message){localStorage.removeItem('isAuthenticated');localStorage.removeItem('userEmail');localStorage.removeItem('userName');localStorage.removeItem('isPremium');localStorage.removeItem('gracely_active_session_token');localStorage.removeItem('premiumExpiryDate');localStorage.removeItem('gracelyPremiumConfig');localStorage.removeItem('gracely_db_session_id');if(typeof eraseCookie==='function'){eraseCookie('gracely_active_session');eraseCookie('gracely_config_url');eraseCookie('is_premium');eraseCookie('gracely_session_token');}alert(message);window.location.href='login.html';}
function handleStatusUpdate(dbStatus){localStorage.removeItem('isPremium');localStorage.removeItem('premiumExpiryDate');localStorage.removeItem('gracelyPremiumConfig');const isPremium=dbStatus.isPremium;if(isPremium){localStorage.setItem('isPremium','true');localStorage.setItem('premiumExpiryDate',dbStatus.premiumExpiryDate);}else{localStorage.setItem('isPremium','false');}window.location.reload();}

// FUNGSI PENJAGA SESI (SATPAM)
function startSessionCheckLoop() {
    // Jika belum login, tidak perlu cek
    if (localStorage.getItem('isAuthenticated') !== 'true') { return; }

    // Ambil ID Sesi Unik yang dibuat saat login di auth.js
    const localSessionId = localStorage.getItem('gracely_db_session_id');
    const checkInterval = 5000; // Cek setiap 5 detik (Bisa dipercepat ke 3000 jika mau lebih galak)

    // Jika user tidak punya ID Sesi (mungkin login sebelum update sistem), tendang biar login ulang
    if (!localSessionId) {
        handleMultiLoginKick("Sistem keamanan diperbarui. Silakan login kembali.");
        return;
    }

    setInterval(async () => {
        // 1. Cek apakah ID Sesi saya masih ada di database?
        // Jika Trigger DB sudah menghapusnya (karena ada device baru login), query ini akan return null/error
        const { data, error } = await supabaseClient
            .from('user_sessions')
            .select('session_token')
            .eq('session_token', localSessionId)
            .single(); // single() akan return error jika data tidak ditemukan

        // JIKA DATA HILANG DARI DB -> TENDANG!
        if (error || !data) {
            handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
            return;
        }

        // 2. Cek Status Premium (Logika Lama, tetap dipertahankan)
        if (typeof getUserId === 'function' && typeof getPremiumStatus === 'function') {
            const userId = await getUserId();
            if (userId) {
                const dbStatus = await getPremiumStatus(userId);
                if (dbStatus) {
                    const localIsPremium = localStorage.getItem('isPremium');
                    const localExpiryDate = localStorage.getItem('premiumExpiryDate');
                    const dbIsPremium = dbStatus.isPremium ? 'true' : 'false';
                    const isStatusChanged = (dbIsPremium !== localIsPremium);
                    let isDataChanged = false;
                    if (dbIsPremium === 'true') {
                        const dbExpiryDate = dbStatus.premiumExpiryDate;
                        isDataChanged = (dbExpiryDate != localExpiryDate);
                    }
                    if (isStatusChanged || isDataChanged) {
                        handleStatusUpdate(dbStatus);
                    }
                }
            }
        }
    }, checkInterval);
}
