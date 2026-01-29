(function () { var a = ["gracely011.github.io", "localhost", "127.0.0.1"], h = window.location.hostname, p = window.location.pathname, o = !1; for (var i = 0; i < a.length; i++)if (h === a[i]) { o = !0; break } if (o && h === "gracely011.github.io" && !p.startsWith("/hai/")) { o = !1 } o || (window.location.href = "https://gracely011.github.io/hai/") })(); function initializeScripts() { "use strict"; console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;'); console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;'); console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;'); window.onscroll = function () { const ud_header = document.querySelector(".ud-header"); if (!ud_header) return; const sticky = ud_header.offsetTop; const logo = document.querySelector(".navbar-brand img"); if (window.pageYOffset > sticky) { ud_header.classList.add("sticky"); } else { ud_header.classList.remove("sticky"); } if (logo) { if (ud_header.classList.contains("sticky")) { logo.src = "assets/images/logo/gracely_mobile_black.png"; } else { logo.src = "assets/images/logo/gracely_mobile_white.png"; } } const backToTop = document.querySelector(".back-to-top"); if (backToTop) { if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) { backToTop.style.display = "flex"; } else { backToTop.style.display = "none"; } } }; document.body.addEventListener('click', function (event) { if (event.target.closest('.back-to-top')) { document.body.scrollTop = 0; document.documentElement.scrollTop = 0; } }); const navbarToggler = document.querySelector(".navbar-toggler"); if (navbarToggler) { navbarToggler.addEventListener("click", function () { navbarToggler.classList.toggle("active"); const navbarCollapse = document.querySelector(".navbar-collapse"); if (navbarCollapse) { navbarCollapse.classList.toggle("show"); } }); } const loginForm = document.getElementById('login-form'); if (loginForm) { loginForm.addEventListener('submit', async (event) => { event.preventDefault(); let errorMessage = document.getElementById('login-error-message'); if (!errorMessage) { errorMessage = document.createElement('p'); errorMessage.id = 'login-error-message'; errorMessage.style.color = 'red'; errorMessage.style.marginTop = '15px'; const buttonContainer = loginForm.querySelector('.ud-form-group'); if (buttonContainer) { loginForm.insertBefore(errorMessage, buttonContainer); } else { loginForm.appendChild(errorMessage); } } errorMessage.textContent = ''; const emailInput = document.getElementById('email'); const passwordInput = document.getElementById('password'); const email = emailInput ? emailInput.value.trim() : ''; const password = passwordInput ? passwordInput.value.trim() : ''; if (!email || !password) { errorMessage.textContent = "Email dan password tidak boleh kosong."; return; } const submitButton = loginForm.querySelector('button[type="submit"]'); submitButton.disabled = true; submitButton.innerHTML = 'Memuat...'; const result = await login(email, password); if (result.success) { window.location.href = "https://gracely011.github.io/hai/dashboard.html"; } else { errorMessage.textContent = result.message; submitButton.disabled = false; submitButton.innerHTML = 'Log in'; } }); } document.body.addEventListener('click', function (event) { if (event.target.closest('#logout-button')) { logout(); } }); const videoModals = [{ btnId: "openModalBtn", modalId: "videoModal", videoId: "videoElement" }, { btnId: "openModalBtnKiwi", modalId: "videoModalKiwi", videoId: "videoElementKiwi" }, { btnId: "openModalBtnOrion", modalId: "videoModalOrion", videoId: "videoElementOrion" }, { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" }]; videoModals.forEach(({ btnId, modalId, videoId }) => { const openBtn = document.getElementById(btnId); const modal = document.getElementById(modalId); const video = document.getElementById(videoId); if (openBtn && modal && video) { openBtn.addEventListener("click", () => { modal.style.display = "flex"; video.currentTime = 0; video.play(); }); window.addEventListener("click", (event) => { if (event.target === modal) { modal.style.display = "none"; video.pause(); } }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.style.display === 'flex') { modal.style.display = "none"; video.pause(); } }); } }); startSessionCheckLoop(); }
function handleMultiLoginKick(message) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isPremium');
    localStorage.removeItem('gracely_active_session_token');
    localStorage.removeItem('premiumExpiryDate');
    localStorage.removeItem('gracelyPremiumConfig');
    localStorage.removeItem('gracely_db_session_id');

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
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumExpiryDate');
    localStorage.removeItem('gracelyPremiumConfig');

    // Update Plan Details
    localStorage.setItem('userPlanName', dbStatus.planName || 'No Premium');
    localStorage.setItem('userPlanNumber', dbStatus.planNumber || '001');

    const isPremium = dbStatus.isPremium;
    if (isPremium) {
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('premiumExpiryDate', dbStatus.premiumExpiryDate);
        localStorage.setItem('proExpiryDate', dbStatus.proExpiryDate);
        localStorage.setItem('phantomExpiryDate', dbStatus.phantomExpiryDate);
    } else {
        localStorage.setItem('isPremium', 'false');
    }
    window.location.reload();
}

// FUNGSI PENJAGA SESI (SATPAM)
// FUNGSI PENJAGA SESI (SATPAM/SECURITY)
async function startSessionCheckLoop() {
    // 1. Cek User Login di Local Storage
    if (localStorage.getItem('isAuthenticated') !== 'true') { return; }

    // 2. Ambil ID Sesi
    const localSessionId = localStorage.getItem('gracely_db_session_id');

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

    // Jika error, kita harus selektif. Jangan asal tendang kalau cuma masalah internet.
    if (error) {
        // Kode PGRST116 = "Row not found" (JSON object requested, result: 0 rows)
        // Ini berarti sesi benar-benar dihapus dari database (karena login dari device lain).
        if (error.code === 'PGRST116') {
            console.warn("[Security] Sesi tidak valid (Session wiped from DB):", error);
            handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
        } else {
            // Error lain: Network error, Timeout, Server 500, dll.
            // JANGAN logout user. Anggap sesi masih valid secara lokal.
            console.warn("[Security] Gangguan koneksi saat cek sesi (Network/Server Error). User tetap login.", error.message);
        }
        return;
    }

    if (!data) {
        // Fallback jika data null tapi tidak error (jarang terjadi dengan .single())
        handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
        return;
    }

    // B. Cek Status Premium & Plan
    if (typeof getUserId === 'function' && typeof getPremiumStatus === 'function') {
        const currentUserId = await getUserId();
        if (currentUserId) {
            const dbStatus = await getPremiumStatus(currentUserId);
            if (dbStatus) {
                const localIsPremium = localStorage.getItem('isPremium');
                const localExpiryDate = localStorage.getItem('premiumExpiryDate');
                const localPlanName = localStorage.getItem('userPlanName');
                const localPlanNumber = localStorage.getItem('userPlanNumber');

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

