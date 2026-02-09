# ⛔ PENTING: JANGAN PERNAH "GIT PULL" ⛔

## Masalah
Anda melakukan **Enkripsi Manual di GitHub** (Website). Artinya:
- File di GitHub = **Terenkripsi** (Isi berubah).
- File di Laptop = **Bersih** (Source asli).

Ini menyebabkan **Perbedaan History (Divergent History)** antara Laptop dan GitHub.

## Aturan Keselamatan
Jika Anda melakukan `git pull` atau `Sync`, Git akan mencoba menggabungkan (merge) file enkripsi dari GitHub ke file bersih di laptop.
**AKIBATNYA: FILE BERSIH ANDA AKAN RUSAK / HILANG.**

## Solusi Teknis (Sudah Diterapkan)
Saya telah menjalankan perintah: `git config pull.ff only`.
Artinya, jika Anda tidak sengaja menekan tombol Pull, **Git akan MENOLAK (Error)** karena history berbeda. Ini adalah pengaman.

## Prosedur Kerja Aman
1. **Coding** di Laptop (Bersih).
2. **Push** ke GitHub: `git push --force` (Jika history beda) atau `git push` biasa.
3. **Edit/Enkripsi** di GitHub Website.
4. **JANGAN PERNAH DOWNLOAD BALIK KE LAPTOP.**

Simpan file ini sebagai pengingat abadi.
