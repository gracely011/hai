function initializeScripts() {
  "use strict";
  // ===== Logo Console =====
  console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  // ========================

  // ======= Logika untuk Navbar Sticky & Tombol Back-to-Top =======
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
        logo.src = "assets/images/logo/groupy_mobile_black.png";
      } else {
        logo.src = "assets/images/logo/groupy_mobile_white.png";
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

  // ======= Logika untuk Menu Mobile (Hamburger) =======
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  if (navbarToggler && navbarCollapse) {
      document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
          e.addEventListener("click", () => {
              navbarToggler.classList.remove("active");
              navbarCollapse.classList.remove("show");
          })
      );
      navbarToggler.addEventListener("click", function () {
          navbarToggler.classList.toggle("active");
          navbarCollapse.classList.toggle("show");
      });
  }

  // ======= Inisialisasi Animasi Scroll (WOW.js) =======
  if (typeof WOW !== 'undefined') {
    new WOW().init();
  }

  // ======= Fungsi untuk Scroll-to-Top =======
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    const animateScroll = () => {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  document.body.addEventListener('click', event => {
      if (event.target.closest('.back-to-top')) {
          scrollTo(document.documentElement);
      }
  });

  // ======= Logika untuk Semua Video Modal =======
    const modals = [
        // Modal Demo di Index
        { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" },
        // Modal Tutorial di Dashboard
        { btnId: "openModalBtn", modalId: "videoModal", videoId: "videoElement" },
        { btnId: "openModalBtnKiwi", modalId: "videoModalKiwi", videoId: "videoElementKiwi" },
        { btnId: "openModalBtnOrion", modalId: "videoModalOrion", videoId: "videoElementOrion" }
    ];

    modals.forEach(modalInfo => {
        const openBtn = document.getElementById(modalInfo.btnId);
        const videoModal = document.getElementById(modalInfo.modalId);
        const videoElement = document.getElementById(modalInfo.videoId);

        if (openBtn && videoModal && videoElement) {
            openBtn.addEventListener("click", () => {
                videoModal.style.display = "block";
                videoElement.currentTime = 0;
                // Penanganan error jika video gagal dimuat
                videoElement.play().catch(error => {
                    console.error(`Error playing video ${modalInfo.videoId}:`, error);
                    // Anda bisa tambahkan pesan error ke UI di sini jika mau
                });
            });

            window.addEventListener("click", (event) => {
                if (event.target === videoModal) {
                    videoModal.style.display = "none";
                    videoElement.pause();
                }
            });
        }
    });

  // ======= Logika Form Login =======
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      let errorMessage = document.getElementById("error-message");
      if (!errorMessage) {
          errorMessage = document.createElement('p');
          errorMessage.id = 'error-message';
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

      const result = await login(email, password); // Memanggil auth.js

      if (result.success) {
        // Alamat lengkap tetap diperlukan untuk GitHub Pages
        window.location.href = "https://gracely011.github.io/hai/dashboard.html"; 
      } else {
        errorMessage.textContent = result.message;
      }
    });
  }

  // ======= Logika Tombol Logout =======
  document.body.addEventListener('click', function(event) {
    // Gunakan .closest() untuk target yang lebih fleksibel
    if (event.target.closest('#logout-button')) { 
        logout(); // Memanggil auth.js
    }
  });

}
// Fungsi initializeScripts() akan dipanggil oleh layout.js setelah DOM siap
