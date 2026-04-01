-- Menghapus policy lama jika sudah ada (agar tidak error)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can view all user sessions" ON public.user_sessions;

-- 1. Berikan izin Super Admin untuk melihat SEMUA Profil
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT
    USING (public.is_admin());

-- 2. Berikan izin Super Admin untuk melihat SEMUA Log Aktivitas (Riwayat Login/Akses Web)
CREATE POLICY "Admins can view all activity logs" ON public.activity_logs
    FOR SELECT
    USING (public.is_admin());

-- 3. Berikan izin Super Admin untuk melihat SEMUA Sesi Aktif Multi-Login
CREATE POLICY "Admins can view all user sessions" ON public.user_sessions
    FOR SELECT
    USING (public.is_admin());
