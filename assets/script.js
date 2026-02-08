// 0. INIT CHECK
// Debug log removed as per user request
// Last Deploy: 2026-02-08 23:05 (Encrypted Test)


// 0. REDIRECT BLOCKER FOR LOCAL DEVELOPMENT
(function () {
    try {
        // Only activate for local testing (file://, localhost, etc.)
        const isLocal = window.location.protocol === 'file:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        if (isLocal) {
            // Override window.location.href setter to block redirects to live site
            try {
                Object.defineProperty(window, '__gracelyBlockRedirect', {
                    value: function (url) {
                        if (url && typeof url === 'string' && url.includes('gracely011.github.io')) {
                            console.warn('🚫 BLOCKED redirect to:', url);
                            return true; // blocked
                        }
                        return false; // allow
                    },
                    writable: false
                });
            } catch (err) {
                console.warn('Could not define __gracelyBlockRedirect:', err);
            }

            console.log('🛡️ Local Dev Mode: Redirect blocker ACTIVE');
        }
    } catch (e) {
        console.error("Redirect blocker error:", e);
    }
})();

// GRACELY BRANDING - shows on all pages that load script.js
(function () {
    if (window.gracelyBrandingShown) return;
    window.gracelyBrandingShown = true;

    console.log('%cgracely', 'color: black; font-size: 60px; font-weight: bold; font-family: "Montserrat", sans-serif;');
    console.log('%cUnlock Premium Together', 'color: black; font-size: 20px; font-weight: bold; font-family: "Montserrat", sans-serif;');
    console.log('%ccontact@gracely.id', 'color: black; font-size: 15px; font-weight: bold; font-family: "Montserrat", sans-serif;');
})();

// 2. Domain Security Check
(function () {
    // Allow file protocol for local testing without redirect
    if (window.location.protocol === 'file:') return;

    var a = ["gracely011.github.io", "localhost", "127.0.0.1"],
        h = window.location.hostname,
        p = window.location.pathname,
        o = !1;
    for (var i = 0; i < a.length; i++) {
        if (h === a[i]) {
            o = !0;
            break;
        }
    }
    if (o && h === "gracely011.github.io" && !p.startsWith("/hai/")) {
        o = !1;
    }
    if (!o) {
        // Only redirect if NOT local development/file
        // window.location.href = "https://gracely011.github.io/hai/";
        console.warn("⚠️ Domain check failed but redirect DISABLED for local dev");
    }
})();

function initializeScripts() {
    "use strict";

    // Scroll handling
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
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                backToTop.style.display = "flex";
            } else {
                backToTop.style.display = "none";
            }
        }
    };

    // Back to top button
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.back-to-top')) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }
    });

    // Navbar toggler  
    const navbarToggler = document.querySelector(".navbar-toggler");
    if (navbarToggler) {
        navbarToggler.addEventListener("click", function () {
            navbarToggler.classList.toggle("active");
            const navbarCollapse = document.querySelector(".navbar-collapse");
            if (navbarCollapse) {
                navbarCollapse.classList.toggle("show");
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            let errorMessage = document.getElementById('login-error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('p');
                errorMessage.id = 'login-error-message';
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
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = 'Memuat...';
            const result = await login(email, password);
            if (result.success) {
                // Use relative path for local dev support
                window.location.href = "dashboard.html";
            } else {
                errorMessage.textContent = result.message;
                submitButton.disabled = false;
                submitButton.innerHTML = 'Log in';
            }
        });
    }

    // Logout button
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('#logout-button')) {
            logout();
        }
    });

    // Video modals
    const videoModals = [
        { btnId: "openModalBtn", modalId: "videoModal", videoId: "videoElement" },
        { btnId: "openModalBtnKiwi", modalId: "videoModalKiwi", videoId: "videoElementKiwi" },
        { btnId: "openModalBtnOrion", modalId: "videoModalOrion", videoId: "videoElementOrion" },
        { btnId: "openModalBtnDemo", modalId: "videoModalDemo", videoId: "videoElementDemo" }
    ];
    videoModals.forEach(({ btnId, modalId, videoId }) => {
        const openBtn = document.getElementById(btnId);
        const modal = document.getElementById(modalId);
        const video = document.getElementById(videoId);
        if (openBtn && modal && video) {
            openBtn.addEventListener("click", () => {
                modal.style.display = "flex";
                video.currentTime = 0;
                video.play();
            });
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                    video.pause();
                }
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && modal.style.display === 'flex') {
                    modal.style.display = "none";
                    video.pause();
                }
            });
        }
    });

    // Start session check
    startSessionCheckLoop();
}
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
    localStorage.setItem('userPlanNumber', dbStatus.planNumber || '0');

    // Update Premium Status
    if (dbStatus.isPremium) {
        localStorage.setItem('isPremium', 'true');
        localStorage.setItem('premiumExpiryDate', dbStatus.premiumExpiryDate || '');
        localStorage.setItem('gracelyPremiumConfig', dbStatus.premiumConfig || '');
    } else {
        localStorage.setItem('isPremium', 'false');
    }
}

function startSessionCheckLoop() {
    // 1. Periksa apakah user login
    if (localStorage.getItem('isAuthenticated') !== 'true') { return; }

    // 2. Ambil ID Sesi
    const localSessionId = localStorage.getItem('gracely_db_session_id');
    if (!localSessionId) {
        return;
    }

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
                        handleMultiLoginKick("Akun Anda telah login di perangkat lain. Sesi ini dihentikan saat itu juga, bos!");
                    }
                }
            )
            .subscribe((status, err) => {
                // Silently subscribe
            });
    } catch (realtimeErr) {
        // Silent error handling
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

    // CRITICAL FIX: Distinguish between network errors and actual session invalidation
    if (error) {
        // Check if this is a network error (should be IGNORED)
        const errorMsg = (error.message || '').toLowerCase();
        const isNetworkError = (
            errorMsg.includes('fetch') ||
            errorMsg.includes('network') ||
            errorMsg.includes('connection') ||
            errorMsg.includes('timeout') ||
            errorMsg.includes('failed to fetch') ||
            error.message === 'Failed to fetch' ||
            !error.message  // No message usually means network issue
        );

        if (isNetworkError) {
            return;  // EXIT - do NOT logout on network errors!
        }

        // Only logout if it's a confirmed DB error (not network)
        handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
        return;
    }

    // If no data returned, session was deleted
    if (!data) {
        handleMultiLoginKick("Akun Anda login di perangkat lain. Sesi ini berakhir.");
        return;
    }

    // B. Cek Premium/Config Update
    if (typeof getUserId === 'function' && typeof getPremiumStatus === 'function') {
        const userId = await getUserId();
        if (userId) {
            const dbStatus = await getPremiumStatus(userId);
            if (dbStatus) {
                const currentPremium = localStorage.getItem('isPremium');
                const currentExpiry = localStorage.getItem('premiumExpiryDate');
                const currentPlanName = localStorage.getItem('userPlanName');
                const currentPlanNumber = localStorage.getItem('userPlanNumber');

                const newPremium = dbStatus.isPremium ? 'true' : 'false';
                const premiumChanged = newPremium !== currentPremium;
                const expiryChanged = newPremium === 'true' && dbStatus.premiumExpiryDate != currentExpiry;
                const nameChanged = dbStatus.planName != currentPlanName;
                const numberChanged = dbStatus.planNumber != currentPlanNumber;

                if (premiumChanged || expiryChanged || nameChanged || numberChanged) {
                    handleStatusUpdate(dbStatus);
                }
            }
        }
    }
}
