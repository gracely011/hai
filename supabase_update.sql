-- Script untuk menambahkan kolom durasi terpisah untuk paket Pro dan Phantom
-- Jalankan script ini di Supabase SQL Editor

-- 1. Tambahkan kolom untuk Paket Pro
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pro_expiry_date timestamp with time zone DEFAULT NULL;

-- 2. Tambahkan kolom untuk Paket Phantom
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phantom_expiry_date timestamp with time zone DEFAULT NULL;

-- 3. (Opsional) Memastikan kolom premiumExpiryDate yang lama tetap ada (tidak perlu diubah, hanya memastikan)
-- Kolom 'premiumExpiryDate' akan tetap digunakan untuk Paket Premium biasa.

-- Konfirmasi
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('premiumExpiryDate', 'pro_expiry_date', 'phantom_expiry_date');
