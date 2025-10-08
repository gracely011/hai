// Kredensial dummy. Di aplikasi nyata, ini akan diverifikasi oleh server.
const DUMMY_CREDENTIALS = {
    email: 'user@example.com',
    password: 'password123'
};

/**
 * Memverifikasi kredensial pengguna dan mengelola sesi di localStorage.
 * @param {string} email - Email yang dimasukkan pengguna.
 * @param {string} password - Password yang dimasukkan pengguna.
 * @returns {{success: boolean, message?: string}} - Objek yang menandakan keberhasilan login.
 */
function login(email, password) {
    if (email === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password) {
        // Jika kredensial cocok, simpan status login di localStorage.
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        return { success: true };
    } else {
        // Jika tidak, kembalikan pesan error.
        return { success: false, message: 'Email atau password salah.' };
    }
}

/**
 * Menghapus sesi pengguna dari localStorage dan mengalihkan ke halaman login.
 */
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    // Pastikan path ini relatif agar berfungsi di GitHub Pages.
    window.location.href = './index.html';
}

/**
 * Memeriksa apakah pengguna sudah terotentikasi.
 * @returns {boolean} - True jika pengguna sudah login, sebaliknya false.
 */
function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

/**
 * Fungsi guard: jika pengguna belum login, alihkan ke halaman login.
 * Fungsi ini harus dipanggil di halaman yang memerlukan otentikasi (cth: dashboard.html).
 */
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = './index.html';
    }
}

/**
 * Fungsi guard: jika pengguna sudah login, alihkan ke dashboard.
 * Fungsi ini harus dipanggil di halaman yang tidak boleh diakses saat sudah login (cth: index.html).
 */
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = './dashboard.html';
    }
}
