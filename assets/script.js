(function () { var a = ["gracely011.github.io", "localhost", "127.0.0.1"], h = window.location.hostname, p = window.location.pathname, o = !1; for (var i = 0; i < a.length; i++)if (h === a[i]) { o = !0; break } if (o && h === "gracely011.github.io" && !p.startsWith("/hai/")) { o = !1 } o || (window.location.href = "https://gracely011.github.io/hai/") })();

// --- SECURE STORAGE LAYER (WEB - UI SYNC) ---
// Self-executing singleton pattern to share with auth.js
// --- SECURE STORAGE LAYER (WEB - UI SYNC) ---
// Self-executing singleton pattern to share with auth.js
(function () {
    if (window.secureStorage) return; // Already defined by auth.js or previous script

    var UI_SECURE_KEY = "Gracely_Secure_Local_2026";
    var UI_SECURE_MAPPING = {
        'isAuthenticated': '_w_auth_s1',
        'userEmail': '_w_usr_e1',
        'userName': '_w_usr_n1',
        'isPremium': '_w_sts_p1',
        'userPlanName': '_w_pln_nm1',
        'userPlanNumber': '_w_pln_nb1',
        'premiumExpiryDate': '_w_exp_p1',
        'proExpiryDate': '_w_exp_p2',
        'phantomExpiryDate': '_w_exp_p3',
        'gracely_db_session_id': '_w_ses_db1',
        'gracely_active_session_token': '_w_ses_tk1', // kept for compat
        'gracely_config_url': '_w_cfg_url1', // kept for compat
        'gracelyPremiumConfig': '_w_cfg_prm1' // kept for compat
    };

    function getKeyMap(key) {
        if (UI_SECURE_MAPPING[key]) return UI_SECURE_MAPPING[key];
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) return '_w_sup_tok_1';
        return key;
    }

    function obfuscateStorage(e) { try { const t = UI_SECURE_KEY; let r = ""; for (let n = 0; n < e.length; n++)r += String.fromCharCode(e.charCodeAt(n) ^ t.charCodeAt(n % t.length)); return btoa(r) } catch (t) { return e } }
    function deobfuscateStorage(e) { try { const t = UI_SECURE_KEY, r = atob(e); let n = ""; for (let e = 0; e < r.length; e++)n += String.fromCharCode(r.charCodeAt(e) ^ t.charCodeAt(e % t.length)); return n } catch (t) { return e } }

    window.secureStorage = {
        getItem: function (key) {
            const secureKey = getKeyMap(key);
            const storedValue = localStorage.getItem(secureKey);
            if (storedValue === null) return null;
            try {
                return deobfuscateStorage(storedValue);
            } catch (e) {
                return storedValue;
            }
        },
        setItem: function (key, value) {
            const secureKey = getKeyMap(key);
            const secureValue = obfuscateStorage(String(value));
            localStorage.setItem(secureKey, secureValue);
        },
        removeItem: function (key) {
            const secureKey = getKeyMap(key);
            localStorage.removeItem(secureKey);
        },
        clear: function () {
            localStorage.clear();
        }
    };
})();
// ----------------------------

function initializeScripts() { "use strict"; console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;'); console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;'); console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;'); window.onscroll = function () { const ud_header = document.querySelector(".ud-header"); if (!ud_header) return; const sticky = ud_header.offsetTop; const logo = document.querySelector(".navbar-brand img"); if (window.pageYOffset > sticky) { ud_header.classList.add("sticky"); } else { ud_header.classList.remove("sticky"); } if (logo) { if (ud_header.classList.contains("sticky")) { logo.src = "assets/images/logo/gracely_mobile_black.png"; } else { logo.src = "assets/images/logo/gracely_mobile_white.png"; } } const backToTop = document.querySelector(".back-to-top"); if (backToTop) { if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) { backToTop.style.display = "flex"; } else { backToTop.style.display = "none"; } } }; document.body.addEventListener('click', function (event) { if (event.target.closest('.back-to-top')) { document.body.scrollTop = 0; document.documentElement.scrollTop = 0; } }); const navbarToggler = document.querySelector(".navbar-toggler"); if (navbarToggler) { navbarToggler.addEventListener("click", function () { navbarToggler.classList.toggle("active"); const navbarCollapse = document.querySelector(".navbar-collapse"); if (navbarCollapse) { navbarCollapse.classList.toggle("show"); } }); } const loginForm = document.getElementById('login-form'); if (loginForm) { loginForm.addEventListener('submit', async (event) => { event.preventDefault(); let errorMessage = document.getElementById('login-error-message'); if (!errorMessage) { errorMessage = document.createElement('p'); errorMessage.id = 'login-error-message'; errorMessage.style.color = 'red'; errorMessage.style.marginTop = '15px'; const buttonContainer = loginForm.querySelector('.ud-form-group'); if (buttonContainer) { loginForm.insertBefore(errorMessage, buttonContainer); } else { loginForm.appendChild(errorMessage); } } errorMessage.textContent = ''; const emailInput = document.getElementById('email'); const passwordInput = document.getElementById('password'); const email = emailInput ? emailInput.value.trim() : ''; const password = passwordInput ? passwordInput.value.trim() : ''; if (!email || !password) { errorMessage.textContent = "Email dan password tidak boleh kosong."; return; } const submitButton = loginForm.querySelector('button[type="submit"]'); submitButton.disabled = true; submitButton.innerHTML = 'Memuat...'; const result = await login(email, password); if (result.success) { window.location.href = "https://gracely011.github.io/hai/dashboard.html"; } else { errorMessage.textContent = result.message; submitButton.disabled = false; submitButton.innerHTML = 'Log in'; } }); } document.body.addEventListener('click', function (event) { if (event.target.closest('#logout-button')) { logout(); } }); const videoModals = [{ btnId: "openModalBtn", modalId: "videoModal", videoId: "videoElement" }, { btnId: "openModalBtnKiwi", modalId: "videoModalKiwi", videoId: "videoElementKiwi" }, { btnId: "openModalBtnOrion", modalId: "videoModalOrion", videoId: "videoElementOrion" }, { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" }]; videoModals.forEach(({ btnId, modalId, videoId }) => { const openBtn = document.getElementById(btnId); const modal = document.getElementById(modalId); const video = document.getElementById(videoId); if (openBtn && modal && video) { openBtn.addEventListener("click", () => { modal.style.display = "flex"; video.currentTime = 0; video.play(); }); window.addEventListener("click", (event) => { if (event.target === modal) { modal.style.display = "none"; video.pause(); } }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.style.display === 'flex') { modal.style.display = "none"; video.pause(); } }); } }); startSessionCheckLoop(); }
function handleMultiLoginKick(message) {
    secureStorage.removeItem('isAuthenticated');
    secureStorage.removeItem('userEmail');
    secureStorage.removeItem('userName');
    secureStorage.removeItem('isPremium');
    secureStorage.removeItem('gracely_active_session_token');
    secureStorage.removeItem('premiumExpiryDate');
    secureStorage.removeItem('gracelyPremiumConfig');
    secureStorage.removeItem('gracely_db_session_id');

    // 1. Force Clear Main Session Cookie
    document.cookie = 'gracely_session_token=; Max-Age=-99999999; path=/; SameSite=Lax; Secure';
    document.cookie = 'gracely_session_token=; Max-Age=-99999999; path=/hai/; SameSite=Lax; Secure';

    // 2. Trigger Extension Logout (Critical)
    document.cookie = 'UnangJahaCookieOnLae=true; path=/; SameSite=Lax; Secure';

    if (typeof eraseCookie === 'function') {
        eraseCookie('gracely_active_session');
        eraseCookie('gracely_config_url');
        eraseCookie('is_premium');
        eraseCookie('gracely_session_token');
    }

    alert(message);
    window.location.href = 'login.html';
}
function handleStatusUpdate(dbStatus) {
    secureStorage.removeItem('isPremium');
    secureStorage.removeItem('premiumExpiryDate');
    secureStorage.removeItem('gracelyPremiumConfig');

    // Update Plan Details
    secureStorage.setItem('userPlanName', dbStatus.planName || 'No Premium');
    secureStorage.setItem('userPlanNumber', dbStatus.planNumber || '001');

    const isPremium = dbStatus.isPremium;
    if (isPremium) {
        secureStorage.setItem('isPremium', 'true');
        secureStorage.setItem('premiumExpiryDate', dbStatus.premiumExpiryDate);
        secureStorage.setItem('proExpiryDate', dbStatus.proExpiryDate);
        secureStorage.setItem('phantomExpiryDate', dbStatus.phantomExpiryDate);
    } else {
        secureStorage.setItem('isPremium', 'false');
    }
    window.location.reload();
}

// FUNGSI PENJAGA SESI (SATPAM)
// FUNGSI PENJAGA SESI (SATPAM/SECURITY)
async function startSessionCheckLoop() {
    // 1. Cek User Login di Local Storage
    if (secureStorage.getItem('isAuthenticated') !== 'true') { return; }

    // 2. Ambil ID Sesi
    const localSessionId = secureStorage.getItem('gracely_db_session_id');

    if (!localSessionId) {
        console.warn("ID Sesi hilang, melewati pemeriksaan keamanan.");
        return;
    }

    console.log(`[Security] Mulai pengawasan untuk Sesi: ${localSessionId}`);

    // --- FITUR 1: REALTIME LISTENER (CCTV-nya) ---
    try {
        const channel = supabaseClient.channel('session_guard_' + localSessionId)
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'user_sessions'
                },
                (payload) => {
                    // Manual filter client-side to avoid binding mismatches
                    if (payload.old && payload.old.session_token === localSessionId) {
                        console.error("[Security] TERDETEKSI: Sesi dihapus dari database (Login di perangkat lain)!", payload);
                        handleMultiLoginKick("Akun Anda telah login di perangkat lain. Sesi ini dihentikan saat itu juga, bos!");
                    }
                }
            )
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    console.log("[Security] Terhubung ke sistem keamanan Realtime.");
                } else if (status === 'CHANNEL_ERROR') {
                    console.error("[Security] Gagal terhubung ke Realtime:", err);
                } else if (status === 'TIMED_OUT') {
                    console.warn("[Security] Koneksi Realtime timeout, mengandalkan polling.");
                }
            });
    } catch (realtimeErr) {
        console.error("[Security] Error in Realtime setup:", realtimeErr);
    }

    // --- FITUR 2: POLLING FALLBACK (Patroli Rutin) ---
    // Jaga-jaga kalau koneksi Realtime putus, tetap cek manual setiap 5 detik
    const checkInterval = 5000;

    // Cek awal langsung
    checkSessionValidity(localSessionId);

    setInterval(() => checkSessionValidity(localSessionId), checkInterval);
}

async function checkSessionValidity(localSessionId) {
    // A. Cek Eksistensi Sesi di Database
    const { data, error } = await supabaseClient
        .from('user_sessions')
        .select('session_token')
        .eq('session_token', localSessionId)
        .single();

    // Jika error atau data kosong, berarti sesi sudah dihapus
    if (error || !data) {
        console.warn("[Security] Sesi tidak valid (Polling):", error);
        handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
        return;
    }

    // B. Cek Status Premium & Plan
    if (typeof getUserId === 'function' && typeof getPremiumStatus === 'function') {
        const currentUserId = await getUserId();
        if (currentUserId) {
            const dbStatus = await getPremiumStatus(currentUserId);
            if (dbStatus) {
                const localIsPremium = secureStorage.getItem('isPremium');
                const localExpiryDate = secureStorage.getItem('premiumExpiryDate');
                const localPlanName = secureStorage.getItem('userPlanName');
                const localPlanNumber = secureStorage.getItem('userPlanNumber');

                const dbIsPremium = dbStatus.isPremium ? 'true' : 'false';

                // Cek perubahan data
                const isStatusChanged = (dbIsPremium !== localIsPremium);
                const isExpiryChanged = (dbIsPremium === 'true' && dbStatus.premiumExpiryDate != localExpiryDate);
                const isPlanNameChanged = (dbStatus.planName != localPlanName);
                const isPlanNumberChanged = (dbStatus.planNumber != localPlanNumber);

                if (isStatusChanged || isExpiryChanged || isPlanNameChanged || isPlanNumberChanged) {
                    console.log("Perubahan data akun terdeteksi, melakukan update...");
                    handleStatusUpdate(dbStatus);
                }
            }
        }
    }
}

// Ensure it runs independent of other initializers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSessionCheckLoop);
} else {
    startSessionCheckLoop();
}

