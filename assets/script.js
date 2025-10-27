document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("openModalBtn");
    const videoModal = document.getElementById("videoModal");
    const videoElement = document.getElementById('videoElement');

    if (openModalBtn && videoModal && videoElement) {
        openModalBtn.addEventListener("click", () => {
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
    
    const openModalBtnKiwi = document.getElementById("openModalBtnKiwi");
    const videoModalKiwi = document.getElementById("videoModalKiwi");
    const videoElementKiwi = document.getElementById('videoElementKiwi');

    if (openModalBtnKiwi && videoModalKiwi && videoElementKiwi) {
        openModalBtnKiwi.addEventListener("click", () => {
            videoModalKiwi.style.display = "block";
            videoElementKiwi.currentTime = 0;
            videoElementKiwi.play();
        });

        window.addEventListener("click", (event) => {
            if (event.target === videoModalKiwi) {
                videoModalKiwi.style.display = "none";
                videoElementKiwi.pause();
            }
        });
    }
    
        const openModalBtnOrion = document.getElementById("openModalBtnOrion");
    const videoModalOrion = document.getElementById("videoModalOrion");
    const videoElementOrion = document.getElementById('videoElementOrion');

    if (openModalBtnOrion && videoModalOrion && videoElementOrion) {
        openModalBtnOrion.addEventListener("click", () => {
            videoModalOrion.style.display = "block";
            videoElementOrion.currentTime = 0;
            videoElementOrion.play();
        });

        window.addEventListener("click", (event) => {
            if (event.target === videoModalOrion) {
                videoModalOrion.style.display = "none";
                videoElementOrion.pause();
            }
        });
    }

  console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
  console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');


    let currentNotification = 0;
    const notifications = document.querySelectorAll(".notificationModal");
  
    // Show the first notification
    if (notifications.length > 0) {
      showNotification(currentNotification);
    }
  
    function showNotification(index) {
      if (notifications[index]) {
        notifications[index].style.display = "flex"; // Show modal
      }
    }
  
    function closeNotification(index) {
      if (notifications[index]) {
        notifications[index].style.display = "none"; // Hide current modal
        currentNotification++;
  
        // Show the next notification
        if (notifications[currentNotification]) {
          showNotification(currentNotification);
        }
      }
    }
  
    // Expose the closeNotification function to the global scope
    window.closeNotification = closeNotification;

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
