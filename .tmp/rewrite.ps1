$files = @(
    'd:\DOCUMENT\WEB\hai-main antigravity\auth.js',
    'd:\DOCUMENT\WEB\hai-main antigravity\assets\script.js',
    'd:\DOCUMENT\WEB\hai-main antigravity\assets\js\admin.js'
)

$keys = @(
    'isAuthenticated', 'userEmail', 'userName', 'isPremium',
    'userPlanName', 'userPlanNumber', 'premiumExpiryDate',
    'proExpiryDate', 'phantomExpiryDate', 'lastPopupDateDB',
    'lastExpiryWarningDateDB', 'gracely_db_session_id',
    'gracelyPremiumConfig', 'gracely_active_session_token',
    'gracely_config_url'
)

$gracelyStateCode = @'
// --- SECURE STATE HELPER ---
window.GracelyState = {
    _key: '_gx_state',
    _getAll: function() {
        try {
            const raw = localStorage.getItem(this._key);
            if (!raw) return {};
            return JSON.parse(atob(raw));
        } catch (e) {
            return {};
        }
    },
    _saveAll: function(data) {
        localStorage.setItem(this._key, btoa(JSON.stringify(data)));
    },
    get: function(key) {
        return this._getAll()[key];
    },
    set: function(key, value) {
        const data = this._getAll();
        data[key] = value;
        this._saveAll(data);
    },
    remove: function(key) {
        const data = this._getAll();
        delete data[key];
        this._saveAll(data);
    },
    clear: function() {
        localStorage.removeItem(this._key);
    }
};
// --- END SECURE STATE HELPER ---

'@

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        if ($file -match 'auth.js$') {
            $content = $gracelyStateCode + $content
        }
        
        foreach ($key in $keys) {
            $content = [regex]::Replace($content, "localStorage\.setItem\(['""]$key['""],\s*(.*?)\)", "GracelyState.set('$key', `$1)")
            $content = [regex]::Replace($content, "localStorage\.getItem\(['""]$key['""]\)", "GracelyState.get('$key')")
            $content = [regex]::Replace($content, "localStorage\.removeItem\(['""]$key['""]\)", "GracelyState.remove('$key')")
        }
        
        $content = $content -replace 'localStorage\.clear\(\)', 'GracelyState.clear(); localStorage.clear()'
        
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "Updated $file"
    }
}
Write-Host 'Done.'
