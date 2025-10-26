document.addEventListener('DOMContentLoaded', function() {
    initializeScripts();
});

function initializeScripts() {
    console.log('[DEBUG scripts.js] initializeScripts() dimulai.');

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessageDiv = document.getElementById('error-message');
            const submitButton = loginForm.querySelector('button[type="submit"]');

            errorMessageDiv.textContent = '';
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            const result = await login(email, password);

            if (result.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorMessageDiv.textContent = result.message || 'Login failed.';
                submitButton.disabled = false;
                submitButton.textContent = 'Log In';
            }
        });
    } else {
         console.warn('[DEBUG scripts.js] Elemen #login-form tidak ditemukan.');
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (typeof logout === 'function') {
                logout();
            } else {
                console.error('[scripts.js] Fungsi logout() tidak ditemukan.');
            }
        });
    }

    console.log('[DEBUG scripts.js] initializeScripts() selesai.');
}


window.addEventListener('storage', function(event) {
  if (event.key === 'isAuthenticated') {
    if (event.newValue === null || event.newValue === 'false') {
      window.location.reload();
    }
  }
});
