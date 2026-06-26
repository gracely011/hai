Get-ChildItem -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $newContent = $content -replace 'src="auth\.js[^"]*"', 'src="auth.js?v=auth-unicode-fix"'
    Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
}
