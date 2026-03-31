-- Eksekusi kueri ini di SQL Editor Dasbor Supabase Anda
-- Kueri ini akan melakukan 3 hal sekaligus: men-generate Encrypted Password, Membuat Profil, dan Menjadikannya Super Admin.

DO $$ 
DECLARE
  new_admin_id UUID := gen_random_uuid();
  -- Supabase membutuhkan input dalam format email yang sah (mengandung @)
  -- Jika Anda hanya menginput 'petrus1997', Supabase akan menolaknya.
  -- Sebagai gantinya, saya memakai petrus1997@admin.com. Gunakan email ini untuk login nanti.
  admin_email TEXT := 'petrus1997@admin.com'; 
  admin_pass TEXT := '1234ulix12';
BEGIN
  
  -- 1. Buat User di sistem Autentikasi Inti Supabase (auth.users)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) 
  VALUES (
    new_admin_id, 
    '00000000-0000-0000-0000-000000000000', 
    'authenticated', 
    'authenticated', 
    admin_email, 
    crypt(admin_pass, gen_salt('bf')), -- Fitur enkripsi bcrypt bawaan Supabase
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"full_name": "Pemilik Gracely"}', 
    now(), 
    now()
  );

  -- 2. Memperbarui tabel 'profiles' (karena Supabase biasanya memiliki Trigger pendaftaran otomatis)
  UPDATE public.profiles SET name = 'Admin Petrus' WHERE id = new_admin_id;
  
  -- Jika ternyata tidak ada trigger, sisipkan secara manual:
  INSERT INTO public.profiles (id, name, created_at)
  VALUES (new_admin_id, 'Admin Petrus', now())
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

  -- 3. Injeksi ID tersebut langsung ke tabel admin_users (Yang baru saja kita buat) agar mendapat Hak Akses Spesial Dasbor
  INSERT INTO public.admin_users (user_id, role, created_at)
  VALUES (new_admin_id, 'superadmin', now());

END $$;
