import re
import os

files = [
    r'd:\DOCUMENT\WEB\hai-main antigravity\auth.js',
    r'd:\DOCUMENT\WEB\hai-main antigravity\assets\script.js',
    r'd:\DOCUMENT\WEB\hai-main antigravity\assets\js\admin.js'
]

keys = [
    'isAuthenticated', 'userEmail', 'userName', 'isPremium',
    'userPlanName', 'userPlanNumber', 'premiumExpiryDate',
    'proExpiryDate', 'phantomExpiryDate', 'lastPopupDateDB',
    'lastExpiryWarningDateDB', 'gracely_db_session_id',
    'gracelyPremiumConfig', 'gracely_active_session_token',
    'gracely_config_url'
]

gracely_state_code = '''// --- SECURE STATE HELPER ---
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

'''

for file_path in files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, does not exist.")
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if file_path.endswith('auth.js'):
        content = gracely_state_code + content
    
    for key in keys:
        # Replace setItem
        pattern_set = r"localStorage\.setItem\(['\"]" + key + r"['\"],\s*(.*?)\)"
        content = re.sub(pattern_set, r"GracelyState.set('" + key + r"', \1)", content)
        
        # Replace getItem
        pattern_get = r"localStorage\.getItem\(['\"]" + key + r"['\"]\)"
        content = re.sub(pattern_get, r"GracelyState.get('" + key + "')", content)
        
        # Replace removeItem
        pattern_remove = r"localStorage\.removeItem\(['\"]" + key + r"['\"]\)"
        content = re.sub(pattern_remove, r"GracelyState.remove('" + key + "')", content)

    # Note: localStorage.clear() might be used in auth.js catch block
    content = content.replace('localStorage.clear();', 'GracelyState.clear(); localStorage.clear();')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print('Replacement complete.')
