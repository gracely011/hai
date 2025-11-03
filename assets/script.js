function initializeScripts() {
  "use strict";
  console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');

  window.onscroll = function () {
    const ud_header = document.querySelector(".ud-header");
    if (!ud_header) return;
    const sticky = ud_header.offsetTop;
    const logo = document.querySelector(".navbar-brand img");

    if (window.pageYOffset > sticky) {
      ud_header.classList.add("sticky");
    } else {
      ud_header.classList.remove("sticky");
    }

    if (logo) {
      if (ud_header.classList.contains("sticky")) {
        logo.src = "assets/images/logo/gracely_mobile_black.png";
      } else {
        logo.src = "assets/images/logo/gracely_mobile_white.png";
      }
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTop.style.display = "flex";
        } else {
            backToTop.style.display = "none";
        }
    }
  };

  document.body.addEventListener('click', function(event) {
    if (event.target.closest('.back-to-top')) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
  });

  const navbarToggler = document.querySelector(".navbar-toggler");
  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      navbarToggler.classList.toggle("active");
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse) {
        navbarCollapse.classList.toggle("show");
      }
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      let errorMessage = document.getElementById('login-error-message');
      if (!errorMessage) {
          errorMessage = document.createElement('p');
          errorMessage.id = 'login-error-message';
          errorMessage.style.color = 'red';
          errorMessage.style.marginTop = '15px';
          const buttonContainer = loginForm.querySelector('.ud-form-group');
          if (buttonContainer) {
             loginForm.insertBefore(errorMessage, buttonContainer);
          } else {
             loginForm.appendChild(errorMessage);
          }
      }
      errorMessage.textContent = '';

      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!email || !password) {
        errorMessage.textContent = "Email dan password tidak boleh kosong.";
        return;
      }

      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.innerHTML = 'Memuat...';

      const result = await login(email, password);

      if (result.success) {
        window.location.href = "https://gracely011.github.io/hai/dashboard.html"; 
      } else {
        errorMessage.textContent = result.message;
        submitButton.disabled = false;
        submitButton.innerHTML = 'Log in';
      }
    });
  }

  document.body.addEventListener('click', function(event) {
    if (event.target.closest('#logout-button')) { 
        logout();
    }
  });
  
  const videoModals = [
      { btnId: "openModalBtn", modalId: "videoModal", videoId: "videoElement" },
      { btnId: "openModalBtnKiwi", modalId: "videoModalKiwi", videoId: "videoElementKiwi" },
      { btnId: "openModalBtnOrion", modalId: "videoModalOrion", videoId: "videoElementOrion" },
      { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" }
  ];

  videoModals.forEach(({ btnId, modalId, videoId }) => {
      const openBtn = document.getElementById(btnId);
      const modal = document.getElementById(modalId);
      const video = document.getElementById(videoId);

      if (openBtn && modal && video) {
          openBtn.addEventListener("click", () => {
              modal.style.display = "flex";
              video.currentTime = 0;
              video.play();
          });

          window.addEventListener("click", (event) => {
              if (event.target === modal) {
                  modal.style.display = "none";
                  video.pause();
              }
          });
          
          document.addEventListener('keydown', (event) => {
              if (event.key === 'Escape' && modal.style.display === 'flex') {
                  modal.style.display = "none";
                  video.pause();
              }
          });
      }
  });
  
  function handleMultiLoginKick(message) {
      localStorage.clear();
      localStorage.removeItem('gracely_active_session_token');
      localStorage.removeItem('gracelyToken');
      
      if (typeof eraseCookie === 'function') {
          eraseCookie('gracely_active_session');
          eraseCookie('gracely_config_url');
          eraseCookie('is_premium');
      }

      alert(message + " Anda akan diarahkan ke halaman Login.");
      window.location.href = 'login.html';
  }

  function handleStatusUpdate(newGracelyToken) {
      localStorage.removeItem('gracelyToken');
      localStorage.setItem('gracelyToken', newGracelyToken);
      window.location.reload(); 
  }

  function startSessionCheckLoop() {
      const localSupabaseToken = localStorage.getItem('gracely_active_session_token'); 
      const localGracelyToken = localStorage.getItem('gracelyToken');
      
      const checkInterval = 5000;

      if (!localSupabaseToken || !localGracelyToken) {
          handleMultiLoginKick("Token sesi lokal hilang atau rusak.");
          return;
      }
      
      setInterval(async () => {
          if (typeof getUserId !== 'function' || typeof getActiveSessionToken !== 'function') {
              return;
          }
          
          const userId = await getUserId();
          if (!userId) {
              handleMultiLoginKick("Sesi Anda telah berakhir.");
              return;
          }

          const profileSessionData = await getActiveSessionToken(userId);
          
          if (profileSessionData) {
              const dbSupabaseToken = profileSessionData.session_id;
              const dbGracelyToken = profileSessionData.gracelyToken;
              const canMultiLogin = profileSessionData.allow_multilogin === true;

              // 1. Cek Session Kick (Supabase Token)
              if (!canMultiLogin && dbSupabaseToken && dbSupabaseToken !== localSupabaseToken) {
                  handleMultiLoginKick("Akun Anda terdeteksi melakukan Login di perangkat atau browser lain.");
                  return;
              }
              
              // 2. Cek Status Premium Kick (Gracely Token)
              // Jika token di DB tidak sama dengan token di lokal, berarti Admin mengubah status
              if (dbGracelyToken && dbGracelyToken !== localGracelyToken) {
                   handleStatusUpdate(dbGracelyToken);
                   return;
              }
          }

      }, checkInterval);
  }

  startSessionCheckLoop();
}
