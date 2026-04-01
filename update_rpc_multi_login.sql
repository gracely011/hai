-- SCRIPT SQL UNTUK MEMPERBARUI FUNGSI "get_gracely_auth_status" DI SUPABASE
-- COPY DAN JALANKAN INI DI MENU "SQL EDITOR" SUPABASE GRACELY ANDA

CREATE OR REPLACE FUNCTION public.get_gracely_auth_status(p_fingerprint text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_plan_id text;
  v_plan_name text;
  v_premium_expiry timestamptz;
  v_pro_expiry timestamptz;
  v_phantom_expiry timestamptz;
  v_final_plan text;
  v_decryption_key text;
  
  -- Variabel untuk validasi Multi-Login Strict Mode
  v_session_exists boolean;
  
BEGIN
  -- 1. Get current Authenticated User ID
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'isValid', false, 
      'reason', 'unauthorized', 
      'message', 'User tidak sedang login atau Token tidak valid'
    );
  END IF;

  -- 2. PENGECEKAN MULTI-LOGIN (ATURAN TABEL PROFIL vs SESSION TERDAFTAR)
  -- Jika p_fingerprint disertakan (Artinya dipanggil oleh Extension/Website baru)
  IF p_fingerprint IS NOT NULL THEN
     SELECT EXISTS (
         SELECT 1 FROM public.user_sessions 
         WHERE user_id = v_user_id AND device_fingerprint = p_fingerprint
     ) INTO v_session_exists;
     
     -- Jika sidik jarinya tak ada di tabel (karena terhapus waktu over limit/logout)
     IF v_session_exists = FALSE THEN
         -- PUKUL MUNDUR, TENDANG KELUAR!
         RETURN json_build_object(
            'isValid', false, 
            'reason', 'no_session', 
            'message', 'Sesi perangkat telah dibatalkan karena pembatasan Multi-Login'
         );
     END IF;
  END IF;

  -- 3. Fetch Premium Status from Profiles
  SELECT 
    p."premiumExpiryDate",
    p.pro_expiry_date,
    p.phantom_expiry_date
  INTO 
    v_premium_expiry, v_pro_expiry, v_phantom_expiry
  FROM public.profiles p
  WHERE p.id = v_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'isValid', false, 
      'reason', 'profile_not_found', 
      'message', 'Profil pengguna dihapus dari database'
    );
  END IF;

  -- 4. Check if AT LEAST ONE of the plans is currently valid (Active)
  IF (v_premium_expiry IS NOT NULL AND v_premium_expiry >= now()) OR
     (v_pro_expiry IS NOT NULL AND v_pro_expiry >= now()) OR
     (v_phantom_expiry IS NOT NULL AND v_phantom_expiry >= now()) THEN
     
    -- PENENTUAN JENIS PAKET (HIRARKI)
    IF v_phantom_expiry IS NOT NULL AND v_phantom_expiry >= now() THEN
        v_final_plan := '004'; -- The Phantom
    ELSIF v_pro_expiry IS NOT NULL AND v_pro_expiry >= now() THEN
        v_final_plan := '003'; -- Pro
    ELSE
        v_final_plan := '002'; -- Premium
    END IF;

    -- AMBIL DECRYPTION KEY DARI TABEL plan_gracely
    SELECT decryption_key INTO v_decryption_key 
    FROM public.plan_gracely 
    WHERE number_plan = v_final_plan;

    -- VALID PREMIUM USER (Lebih dari 1 jenis aktif, tidak masalah, cukup true)
    RETURN json_build_object(
      'isValid', true,
      'plan', v_final_plan,
      'decryption_key', v_decryption_key,
      'premiumExpiryDate', v_premium_expiry,
      'pro_expiry_date', v_pro_expiry,
      'phantom_expiry_date', v_phantom_expiry,
      'user_id', v_user_id
    );
  ELSE
    -- EXPIRED OR NO PREMIUM, TETAPI SESINYA (LOGIN-NYA) TETAP SAH
    v_final_plan := '001'; -- No Premium
    
    -- AMBIL DECRYPTION KEY DARI TABEL plan_gracely
    SELECT decryption_key INTO v_decryption_key 
    FROM public.plan_gracely 
    WHERE number_plan = v_final_plan;

    RETURN json_build_object(
      'isValid', false, 
      'reason', 'expired', 
      'message', 'Batas usia Premium tang telah usai atau tidak memiliki Premium aktif',
      'plan', v_final_plan,
      'decryption_key', v_decryption_key,
      'premiumExpiryDate', v_premium_expiry,
      'pro_expiry_date', v_pro_expiry,
      'phantom_expiry_date', v_phantom_expiry,
      'user_id', v_user_id
    );
  END IF;

END;
$function$
;
