function setCookiesInternal(username, isPremium, configUrl) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expiryString = expiryDate.toUTCString();
    const cookieOptions = `expires=${expiryString}; path=/; SameSite=Lax`;

    document.cookie = `gracely_active_session=true; ${cookieOptions}`;
    document.cookie = `is_premium=${isPremium}; ${cookieOptions}`;
    document.cookie = `gracely_config_url=${configUrl}; ${cookieOptions}`;
    document.cookie = `username=${username}; ${cookieOptions}`;
}

function setLoginCookies(username, isPremium, configUrl) {
    setCookiesInternal(username, isPremium, configUrl);

    try {
        localStorage.setItem('gracely_auth', JSON.stringify({
            username: username,
            isPremium: isPremium,
            configUrl: configUrl,
            isActive: true
        }));
    } catch (e) {
        console.error("Gagal menyimpan backup auth ke localStorage", e);
    }
}

function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});
    return cookies[name];
}

function restoreSessionFromBackup() {
    const isActiveCookie = getCookie('gracely_active_session');

    if (isActiveCookie === 'true') {
        return;
    }

    try {
        const backupAuth = localStorage.getItem('gracely_auth');
        if (backupAuth) {
            const parsedBackup = JSON.parse(backupAuth);
            
            if (parsedBackup.isActive && parsedBackup.isPremium) {
                console.log("Memulihkan sesi auth dari backup localStorage...");
                setCookiesInternal(parsedBackup.username, parsedBackup.isPremium, parsedBackup.configUrl);
            }
        }
    } catch (e) {
        console.error("Gagal membaca backup auth", e);
        localStorage.removeItem('gracely_auth');
    }
}

function getAuthStatus() {
    const isActive = getCookie('gracely_active_session') === 'true';
    const isPremium = getCookie('is_premium') === 'true';
    
    return { isActive, isPremium };
}

function logout() {
    const pastDate = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `gracely_active_session=; ${pastDate}`;
    document.cookie = `is_premium=; ${pastDate}`;
    document.cookie = `gracely_config_url=; ${pastDate}`;
    document.cookie = `username=; ${pastDate}`;

    localStorage.removeItem('gracely_auth');
    
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    restoreSessionFromBackup();

    if (document.body.id === 'login-page' || document.body.id === 'index-page') {
        checkAuth(false);
    } else {
        checkAuth(true);
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

function checkAuth(protectedPage = false) {
    const { isActive, isPremium } = getAuthStatus();

    if (protectedPage && (!isActive || !isPremium)) {
        window.location.href = 'login.html';
    } else if (!protectedPage && isActive && isPremium) {
        window.location.href = 'dashboard.html';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('error-message');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('credentials.json');
        if (!response.ok) {
            throw new Error('Database kredensial tidak ditemukan.');
        }
        const credentials = await response.json();

        const user = credentials.find(u => u.username === username && u.password === password);

        if (user) {
            if (user.is_premium) {
                setLoginCookies(user.username, user.is_premium, user.config_url);
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = 'Akun Anda tidak memiliki akses premium.';
            }
        } else {
            errorMsg.textContent = 'Username atau password salah.';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMsg.textContent = 'Terjadi kesalahan. Coba lagi nanti.';
    }
}
