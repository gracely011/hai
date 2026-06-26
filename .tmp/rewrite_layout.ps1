$files = @(
    'd:\DOCUMENT\WEB\hai-main antigravity\layout.js',
    'd:\DOCUMENT\WEB\hai-main antigravity\assets\js\admin_ui.js',
    'd:\DOCUMENT\WEB\hai-main antigravity\assets\js\admin.js'
)
$keys = @(
    'isAuthenticated', 'userEmail', 'userName', 'isPremium',
    'userPlanName', 'userPlanNumber', 'premiumExpiryDate',
    'proExpiryDate', 'phantomExpiryDate', 'lastPopupDateDB',
    'lastExpiryWarningDateDB', 'gracely_db_session_id',
    'gracelyPremiumConfig', 'gracely_active_session_token',
    'gracely_config_url', 'notificationLastShown', 'notificationLastShownId'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        foreach ($key in $keys) {
            $content = [regex]::Replace($content, "localStorage\.setItem\(['""]$key['""],\s*(.*?)\)", "GracelyState.set('$key', `$1)")
            $content = [regex]::Replace($content, "localStorage\.getItem\(['""]$key['""]\)", "GracelyState.get('$key')")
            $content = [regex]::Replace($content, "localStorage\.removeItem\(['""]$key['""]\)", "GracelyState.remove('$key')")
        }
        Set-Content -Path $file -Value $content -Encoding UTF8
    }
}
