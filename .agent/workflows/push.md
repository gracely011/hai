---
description: Push perubahan ke GitHub dengan otomatis
---

# Push ke GitHub

Workflow ini untuk push folder hai-main antigravity ke GitHub secara otomatis.

// turbo-all

## Steps

1. Cek status git:
```powershell
& "C:\Program Files\Git\bin\git.exe" status
```

2. Add semua perubahan:
```powershell
& "C:\Program Files\Git\bin\git.exe" add -A
```

3. Commit dengan pesan otomatis berdasarkan tanggal:
```powershell
& "C:\Program Files\Git\bin\git.exe" commit -m "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
```

4. Pull dengan rebase (jika ada conflict, auto-resolve dengan versi lokal):
```powershell
& "C:\Program Files\Git\bin\git.exe" -c core.editor=true pull --rebase origin main
```

5. Jika ada conflict, resolve semua dengan versi lokal:
```powershell
& "C:\Program Files\Git\bin\git.exe" checkout --theirs .
& "C:\Program Files\Git\bin\git.exe" add -A
& "C:\Program Files\Git\bin\git.exe" -c core.editor=true rebase --continue
```

6. Push ke GitHub:
```powershell
& "C:\Program Files\Git\bin\git.exe" push origin main
```

## Notes
- Semua command menggunakan path lengkap Git karena tidak ada di PATH sistem
- `core.editor=true` mencegah Vim terbuka untuk edit commit message
- Workflow ini prioritaskan versi lokal jika ada conflict
