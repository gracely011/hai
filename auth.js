function setCookie(name, value, days) {
    console.log(`[DEBUG auth.js] Mencoba setCookie: ${name}=${value}`); // <-- DEBUG
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    let domain = window.location.hostname;
    console.log(`[DEBUG auth.js] Hostname saat ini: ${domain}`); // <-- DEBUG

    if (domain.split('.').length > 2) {
         domain = domain.split('.').slice(-2).join('.');
    }

    let cookieString = "";
    if (domain === 'localhost') {
        cookieString = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
        console.log(`[DEBUG auth.js] Setting cookie untuk localhost: ${cookieString}`); // <-- DEBUG
        document.cookie = cookieString;
    } else {
        cookieString = name + "=" + (value || "") + expires + "; path=/; domain=" + domain + "; SameSite=Lax";
        console.log(`[DEBUG auth.js] Setting cookie untuk domain ${domain}: ${cookieString}`); // <-- DEBUG
        document.cookie = cookieString;
    }
    console.log(`[DEBUG auth.js] Cookie setelah percobaan set: ${document.cookie}`); // <-- DEBUG
}

function eraseCookie(name) {
    console.log(`[DEBUG auth.js] Mencoba eraseCookie: ${name}`); // <-- DEBUG
    let domain = window.location.hostname;
    if (domain.split('.').length > 2) {
         domain = domain.split('.').slice(-2).join('.');
    }
    if (domain === 'localhost') {
        document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax';
    } else {
         document.cookie = name + '=; Max-Age=-99999999; path=/; domain=' + domain + '; SameSite=Lax';
    }
    console.log(`[DEBUG auth.js] Cookie setelah percobaan erase: ${document.cookie}`); // <-- DEBUG
}

async function login(email, password) {
    console.log("[DEBUG auth.js] Fungsi login() dipanggil."); // <-- DEBUG
    try {
        const response = await fetch('https://gracely011.github.io/hai/credentials.json');
        console.log("[DEBUG auth.js] Fetch credentials response:", response.ok); // <-- DEBUG
        if (!response.ok) throw new Error('Failed to load credentials.');

        const users = await response.json();
        const user = users.find(u => u.email === email);
        console.log("[DEBUG auth.js] User ditemukan:", user ? user.email : 'Tidak ditemukan'); // <-- DEBUG

        if (user && user.password === password) {
            console.log("[DEBUG auth.js] Password cocok."); // <-- DEBUG
            let isCurrentlyPremium = false;
            if (user.isPremium && user.premiumExpiryDate) {
                const expiryDate = new Date(user.premiumExpiryDate);
                const today = new Date();
                if (today <= expiryDate) {
                    isCurrentlyPremium = true;
                }
            }
            console.log("[DEBUG auth.js] Status premium saat ini:", isCurrentlyPremium); // <-- DEBUG

            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('isPremium', isCurrentlyPremium);

            console.log("[DEBUG auth.js] Memanggil setCookie untuk gracely_active_session..."); // <-- DEBUG
            setCookie('gracely_active_session', 'true', 30); 

            if (isCurrentlyPremium) {
                console.log("[DEBUG auth.js] User adalah premium. Memanggil setCookie untuk is_premium dan gracely_config_url..."); // <-- DEBUG
                localStorage.setItem('premiumExpiryDate', user.premiumExpiryDate);
                localStorage.setItem('gracelyPremiumConfig', user.configUrl);
                setCookie('is_premium', 'true', 30);
                setCookie('gracely_config_url', user.configUrl, 30);
            } else {
                console.log("[DEBUG auth.js] User BUKAN premium atau sudah expired. Memanggil eraseCookie..."); // <-- DEBUG
                localStorage.removeItem('premiumExpiryDate');
                localStorage.removeItem('gracelyPremiumConfig');
                setCookie('is_premium', 'false', 30); // Tetap set is_premium false
                eraseCookie('gracely_config_url');
            }

            console.log("[DEBUG auth.js] Login berhasil, mengembalikan success: true"); // <-- DEBUG
            return { success: true };
        } else {
            console.log("[DEBUG auth.js] Password TIDAK cocok atau user tidak ditemukan."); // <-- DEBUG
            eraseCookie('gracely_active_session');
            eraseCookie('is_premium');
            eraseCookie('gracely_config_url');
            return { success: false, message: 'Email or password is incorrect.' };
        }
    } catch (error) {
        console.error('[DEBUG auth.js] Login error:', error); // <-- DEBUG UBAH JADI ERROR
        return { success: false, message: 'An error occurred on the system.' };
    }
}

function logout() {
    console.log("[DEBUG auth.js] Fungsi logout() dipanggil."); // <-- DEBUG
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
