(function () {
  "use strict";

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

  document.addEventListener('DOMContentLoaded', function() {
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
        if (
          document.body.scrollTop > 50 ||
          document.documentElement.scrollTop > 50
        ) {
          backToTop.style.display = "flex";
        } else {
          backToTop.style.display = "none";
        }
      }
    };

    let navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");

    if (navbarToggler && navbarCollapse) {
      document.querySelectorAll(".ud-menu-scroll").forEach((e) =>
        e.addEventListener("click", () => {
          const currentToggler = document.querySelector(".navbar-toggler");
          const currentCollapse = document.querySelector(".navbar-collapse");
          if (currentToggler) currentToggler.classList.remove("active");
          if (currentCollapse) currentCollapse.classList.remove("show");
        })
      );

      navbarToggler.addEventListener("click", function () {
         const currentToggler = document.querySelector(".navbar-toggler");
         const currentCollapse = document.querySelector(".navbar-collapse");
         if (currentToggler) currentToggler.classList.toggle("active");
         if (currentCollapse) currentCollapse.classList.toggle("show");
      });
    }

    const submenuButton = document.querySelectorAll(".nav-item-has-children");
    submenuButton.forEach((elem) => {
      const link = elem.querySelector("a");
      const submenu = elem.querySelector(".ud-submenu");
      if (link && submenu) {
        link.addEventListener("click", (event) => {
           if (link.getAttribute('href') === '#' || link.classList.contains('ud-menu-scroll')) {
               event.preventDefault();
           }
           submenu.classList.toggle("show");
        });
      }
    });

    if (typeof WOW !== 'undefined') {
      new WOW().init();
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.back-to-top')) {
            scrollTo(document.documentElement);
        }
    });
  });
})();
