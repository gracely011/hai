// GANTI DENGAN URL YANG ANDA COPY DARI LANGKAH 3
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyntU9KHfwS--AqWoVXkESY2Nb8gwlOjfkOiiA7x3YR9sZ5i0DOK6Zm-DTT0jgg7IKc/exec";

async function login(email, password) {
    try {
        // 1. Kirim data ke "Penjaga" (Google Apps Script)
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors', // Diperlukan untuk Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        // 2. Terima balasan dari "Penjaga"
        const result = await response.json();

        // 3. Proses balasan
        if (result.success && result.user) {
            const user = result.user;

            // Simpan data ke localStorage (seperti kode lama Anda)
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('isPremium', user.isPremium);
            setCookie('gracely_active_session', 'true', 30);

            if (user.isPremium) {
                localStorage.setItem('premiumExpiryDate', user.premiumExpiryDate);
                setCookie('is_premium', 'true', 30);
                // (Anda perlu mengamankan data.js di langkah berikutnya)
            } else {
                localStorage.removeItem('premiumExpiryDate');
                localStorage.removeItem('gracelyPremiumConfig');
                setCookie('is_premium', 'false', 30);
                eraseCookie('gracely_config_url');
            }

            return { success: true }; // Kirim sukses ke script.js

        } else {
            // Jika login gagal (balasan dari server)
            eraseCookie('gracely_active_session');
            eraseCookie('is_premium');
            eraseCookie('gracely_config_url');
            return { success: false, message: result.message || 'Email or password is incorrect.' };
        }
    } catch (error) {
        console.error('[auth.js] Login error:', error);
        return { success: false, message: 'An error occurred on the system.' };
    }
}
