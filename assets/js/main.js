(function () {
  "use strict";

  // Fungsi helper bisa di luar DOMContentLoaded
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

  // Bungkus semua kode yang berinteraksi dengan DOM di sini
  document.addEventListener('DOMContentLoaded', function() {

    // ======= Sticky =======
    window.onscroll = function () {
      const ud_header = document.querySelector(".ud-header");
      // Tambahkan pengecekan null untuk header
      if (!ud_header) return; 
      
      const sticky = ud_header.offsetTop;
      const logo = document.querySelector(".navbar-brand img");

      // Gunakan pageYOffset yang lebih konsisten
      if (window.pageYOffset > sticky) { 
        ud_header.classList.add("sticky");
      } else {
        ud_header.classList.remove("sticky");
      }

      // === logo change ===
      // Tambahkan pengecekan null untuk logo
      if (logo) { 
        if (ud_header.classList.contains("sticky")) {
          logo.src = "assets/images/logo/groupy_mobile_black.png";
        } else {
          logo.src = "assets/images/logo/groupy_mobile_white.png";
        }
      }

      // show or hide the back-top-top button
      const backToTop = document.querySelector(".back-to-top");
      // Tambahkan pengecekan null untuk tombol backToTop
      if (backToTop) { 
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          backToTop.style.display = "flex";
        } else {
          backToTop.style.display = "none";
        }
      }
    }; // Akhir dari window.onscroll

    //===== close navbar-collapse when a clicked =====
    let navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    // Tambahkan pengecekan null sebelum menambahkan event listener
    if (navbarToggler && navbarCollapse) { 
      document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
        e.addEventListener("click", () => {
          // Periksa lagi di dalam event listener jika elemen masih ada
          const currentToggler = document.querySelector(".navbar-toggler");
          const currentCollapse = document.querySelector(".navbar-collapse");
          if (currentToggler) currentToggler.classList.remove("active");
          if (currentCollapse) currentCollapse.classList.remove("show");
        })
      );
      
      navbarToggler.addEventListener("click", function () {
        // Periksa lagi di dalam event listener
         const currentToggler = document.querySelector(".navbar-toggler");
         const currentCollapse = document.querySelector(".navbar-collapse");
         if (currentToggler) currentToggler.classList.toggle("active");
         if (currentCollapse) currentCollapse.classList.toggle("show");
      });
    } // Akhir dari if (navbarToggler && navbarCollapse)

    // ===== submenu =====
    const submenuButton = document.querySelectorAll(".nav-item-has-children");
    submenuButton.forEach((elem) => {
      const link = elem.querySelector("a");
      const submenu = elem.querySelector(".ud-submenu");
      // Pastikan link dan submenu ada
      if (link && submenu) { 
        link.addEventListener("click", (event) => {
           // Mencegah navigasi default jika ini link anchor
           if (link.getAttribute('href') === '#' || link.classList.contains('ud-menu-scroll')) {
               event.preventDefault(); 
           }
           submenu.classList.toggle("show");
        });
      }
    });

    // ===== wow js =====
    // Pastikan WOW sudah terdefinisi sebelum init
    if (typeof WOW !== 'undefined') { 
      new WOW().init();
    }

    // ====== scroll top js ======
    // Event listener untuk tombol back-to-top dipindahkan ke body agar lebih fleksibel
    document.body.addEventListener('click', function(event) {
        // Gunakan closest untuk menangkap klik di dalam ikon juga
        if (event.target.closest('.back-to-top')) { 
            scrollTo(document.documentElement);
        }
    });
    
  }); // Akhir dari DOMContentLoaded

})(); // Akhir dari IIFE
