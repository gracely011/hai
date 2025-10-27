function initializeScripts() {
  "use strict";
  console.log("[DEBUG scripts.js] initializeScripts() dimulai."); // <-- DEBUG AWAL

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
                videoElement.play();
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
    console.log("[DEBUG scripts.js] Event listener untuk #login-form ditambahkan."); // <-- DEBUG LISTENER
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("[DEBUG scripts.js] Form #login-form disubmit."); // <-- DEBUG SUBMIT

      let errorMessage = document.getElementById("error-message");
      if (!errorMessage) {
          errorMessage = document.createElement('p');
          errorMessage.id = 'error-message';
          errorMessage.style.color = 'red';
          errorMessage.style.marginTop = '15px';
          const buttonContainer = loginForm.querySelector('.ud-form-group');
          // Periksa apakah buttonContainer ditemukan sebelum menyisipkan
          if (buttonContainer) {
             loginForm.insertBefore(errorMessage, buttonContainer);
          } else {
             loginForm.appendChild(errorMessage); // Fallback jika .ud-form-group tidak ada
             console.warn("[DEBUG scripts.js] .ud-form-group tidak ditemukan, error message ditambahkan di akhir form.");
          }
      }
      errorMessage.textContent = '';

      const emailInput = document.getElementById('email'); // Ambil elemen input
      const passwordInput = document.getElementById('password'); // Ambil elemen input

      // Pastikan elemen input ada sebelum mengambil value
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      console.log(`[DEBUG scripts.js] Email: ${email}, Password: *****`); // <-- DEBUG KREDENSIAL

      if (!email || !password) {
        errorMessage.textContent = "Email dan password tidak boleh kosong.";
        console.log("[DEBUG scripts.js] Login gagal: Email atau password kosong."); // <-- DEBUG VALIDASI
        return;
      }

      console.log("[DEBUG scripts.js] Memanggil fungsi login() dari auth.js..."); // <-- DEBUG PANGGIL AUTH.JS
      const result = await login(email, password); // Ini memanggil auth.js
      console.log("[DEBUG scripts.js] Hasil dari auth.js:", result); // <-- DEBUG HASIL AUTH.JS

      if (result.success) {
        console.log("[DEBUG scripts.js] Login sukses, redirect ke dashboard.html"); // <-- DEBUG SUKSES
        window.location.href = "https://gracely011.github.io/hai/dashboard.html";
      } else {
        errorMessage.textContent = result.message;
        console.log("[DEBUG scripts.js] Login gagal dari auth.js:", result.message); // <-- DEBUG GAGAL
      }
    });
  } else {
      console.warn("[DEBUG scripts.js] Elemen #login-form tidak ditemukan."); // <-- DEBUG FORM TIDAK ADA
  }

  // ======= Logika Tombol Logout =======
  document.body.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'logout-button') {
        console.log("[DEBUG scripts.js] Tombol logout ditekan."); // <-- DEBUG LOGOUT
        logout(); // Ini memanggil auth.js
    }
  });

  console.log("[DEBUG scripts.js] initializeScripts() selesai."); // <-- DEBUG AKHIR
}

// Panggil fungsi initializeScripts setelah layout dimuat (ini penting dari layout.js)

// Tidak perlu event listener DOMContentLoaded di sini karena layout.js sudah menanganinya

