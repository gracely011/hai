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
  
  // =================================================================
  //                 LOGIKA SESI TUNGGAL (SINGLE SESSION)
  // =================================================================

  function handleMultiLoginKick(message) {
      alert(`PEMBERITAHUAN! ${message}`);
      if (typeof logout === 'function') {
          // Hanya bersihkan cache lokal tanpa update DB lagi
          localStorage.clear();
          localStorage.removeItem('gracely_active_session_token');
          window.location.href = 'login.html';
      } else {
          localStorage.clear();
          window.location.href = 'login.html';
      }
  }

  function startSessionCheckLoop() {
      // Pastikan loop hanya berjalan jika ada sesi yang aktif
      if (localStorage.getItem('isAuthenticated') !== 'true') {
          return;
      }

      // Ambil Access Token yang disimpan saat LOGIN di browser klien.
      const localSessionToken = localStorage.getItem('gracely_active_session_token'); 
      const checkInterval = 5000; // Cek setiap 5 detik

      if (!localSessionToken) {
          handleMultiLoginKick("Token sesi lokal hilang. Silakan Login ulang.");
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

          const dbSessionToken = await getActiveSessionToken(userId);

          // KUNCI LOGIKA: Kick terjadi HANYA jika token di DB ada dan TIDAK SAMA dengan token lokal.
          // Sesi terbaru (yang tokennya sama dengan DB) akan dipertahankan.
          if (dbSessionToken && dbSessionToken !== localSessionToken) {
              handleMultiLoginKick("Akun Anda terdeteksi melakukan Login di perangkat atau browser lain.");
          }

      }, checkInterval);
  }

  // Panggil loop pengecekan sesi saat skrip diinisialisasi
  startSessionCheckLoop();
}
