Get-ChildItem -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace 'src="layout\.js[^"]*"', 'src="layout.js?v=layout-password-fix"'
    Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
}
