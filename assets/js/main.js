// Tunggu hingga seluruh konten halaman dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // Pastikan form ada di halaman ini sebelum menambahkan event listener
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            // Mencegah form dari pengiriman standar (yang akan me-reload halaman)
            event.preventDefault();

            // Sembunyikan pesan error sebelumnya
            errorMessage.textContent = '';

            // Ambil nilai dari input email dan password
            const email = loginForm.email.value.trim();
            const password = loginForm.password.value.trim();

            // Validasi dasar: pastikan input tidak kosong
            if (!email || !password) {
                errorMessage.textContent = 'Email dan password tidak boleh kosong.';
                return;
            }

            // Panggil fungsi login dari auth.js
            const result = login(email, password);

            if (result.success) {
                // Jika login berhasil, alihkan ke dashboard
                window.location.href = './dashboard.html';
            } else {
                // Jika gagal, tampilkan pesan error
                errorMessage.textContent = result.message;
            }
        });
    }
});
