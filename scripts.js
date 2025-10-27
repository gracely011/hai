function initializeScripts() {
  "use strict";
  console.log("[DEBUG scripts.js] Inisialisasi skrip Gracely.");

  // ======= Logika untuk Semua Video Modal =======
  // (Logika ini aslinya dari script.js Groupy, kita simpan di sini)
  const modals = [
    // Ini untuk modal di index.html
    { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" }, 
    // Ini untuk 3 modal di dashboard.html
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
    console.log("[DEBUG scripts.js] Event listener untuk #login-form ditambahkan.");
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("[DEBUG scripts.js] Form #login-form disubmit.");

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

      console.log("[DEBUG scripts.js] Memanggil fungsi login() dari auth.js...");
      const result = await login(email, password); // Ini memanggil auth.js
      console.log("[DEBUG scripts.js] Hasil dari auth.js:", result);

      if (result.success) {
        console.log("[DEBUG scripts.js] Login sukses, redirect ke dashboard.html");
        window.location.href = "dashboard.html"; // Path relatif sudah cukup
      } else {
        errorMessage.textContent = result.message;
        console.log("[DEBUG scripts.js] Login gagal dari auth.js:", result.message);
      }
    });
  } else {
      console.warn("[DEBUG scripts.js] Elemen #login-form tidak ditemukan.");
  }

  // ======= Logika Tombol Logout =======
  document.body.addEventListener('click', function(event) {
    // Kita gunakan .closest() untuk memastikan kita menangkap klik di dalam tombol
    if (event.target.closest('#logout-button')) { 
        console.log("[DEBUG scripts.js] Tombol logout ditekan.");
        logout(); // Ini memanggil auth.js
    }
  });

  console.log("[DEBUG scripts.js] Inisialisasi skrip Gracely selesai.");
}
// Fungsi initializeScripts() akan dipanggil oleh layout.js
