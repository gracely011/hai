-- Tabel Spesial untuk Hak Akses Admin Dasbor
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengamankan Tabel (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_users" ON public.admin_users
    FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- Fungsi 1: Mengecek apakah user yang memanggil fungsi adalah Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi 2: RPC Update Waktu Langganan
-- PENTING: Karena profil di-update, pastikan nama kolom persis sesuai skema Anda.
-- (Biasanya premiumExpiryDate menggunakan camelCase, sedangkan yang lain snake_case berdasarkan auth.js)
CREATE OR REPLACE FUNCTION public.admin_update_subscription(
    p_target_uid UUID,
    p_plan_type TEXT, 
    p_expire_date TIMESTAMP WITH TIME ZONE
)
RETURNS boolean AS $$
BEGIN
    -- Tolak jika bukan admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Akses ditolak. Tindakan tak berizin!';
    END IF;

    -- Update database berdasar variasi paket (pastikan sesuai nama kolom di profil)
    IF p_plan_type = 'premium' THEN
        UPDATE public.profiles SET "premiumExpiryDate" = p_expire_date WHERE id = p_target_uid;
    ELSIF p_plan_type = 'pro' THEN
        UPDATE public.profiles SET pro_expiry_date = p_expire_date WHERE id = p_target_uid;
    ELSIF p_plan_type = 'phantom' THEN
        UPDATE public.profiles SET phantom_expiry_date = p_expire_date WHERE id = p_target_uid;
    ELSE
        RAISE EXCEPTION 'Tipe paket tidak dikenali!';
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fungsi 3: RPC Hapus User
-- Fungsi ini sangat OP karena menggunakan SECURITY DEFINER yang berarti ia dieksekusi 
-- seolah-olah oleh server/superuser itu sendiri, mampu melewati RLS.
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_target_uid UUID)
RETURNS boolean AS $$
BEGIN
    -- Tolak jika bukan admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Akses ditolak. Tindakan tak berizin!';
    END IF;

    -- Lindungi dari Bunuh Diri (Admin tak bisa hapus akunnya sendiri dari dasbor)
    IF p_target_uid = auth.uid() THEN
        RAISE EXCEPTION 'Aksi ilegal: Anda tidak bisa menghapus akun Anda sendiri.';
    END IF;

    -- Menghapus user secara total (Cascade otomatis menghapus Profil dan Log)
    DELETE FROM auth.users WHERE id = p_target_uid;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
