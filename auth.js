function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // PERBAIKAN: Tambahkan 'Secure' karena situs ini HTTPS
    let cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure";
    document.cookie = cookieString;
}

function eraseCookie(name) {
    // PERBAIKAN: Tambahkan 'Secure'
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
}

async function login(email, password) {
    try {
        const response = await fetch('https://gracely011.github.io/hai/credentials.json');
        if (!response.ok) throw new Error('Failed to load credentials.');

        const users = await response.json();
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            let isCurrentlyPremium = false;
            if (user.isPremium && user.premiumExpiryDate) {
                const expiryDate = new Date(user.premiumExpiryDate);
                const today = new Date();
                if (today <= expiryDate) {
                    isCurrentlyPremium = true;
                }
            }

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('isPremium', isCurrentlyPremium);

            setCookie('gracely_active_session', 'true', 30); 

            if (isCurrentlyPremium) {
                localStorage.setItem('premiumExpiryDate', user.premiumExpiryDate);
                localStorage.setItem('gracelyPremiumConfig', user.configUrl);
                setCookie('is_premium', 'true', 30);
                setCookie('gracely_config_url', user.configUrl, 30);
            } else {
                localStorage.removeItem('premiumExpiryDate');
                localStorage.removeItem('gracelyPremiumConfig');
                setCookie('is_premium', 'false', 30);
                eraseCookie('gracely_config_url');
            }
            return { success: true };
        } else {
            eraseCookie('gracely_active_session');
            eraseCookie('is_premium');
            eraseCookie('gracely_config_url');
            return { success: false, message: 'Email or password is incorrect.' };
        }
    } catch (error) {
        console.error('[auth.js] Login error:', error);
        return { success: false, message: 'An error occurred on the system.' };
    }
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumExpiryDate');
    localStorage.removeItem('gracelyPremiumConfig');

    eraseCookie('gracely_active_session');
    eraseCookie('is_premium');
    eraseCookie('gracely_config_url');

    window.location.href = 'login.html';
}

function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}
