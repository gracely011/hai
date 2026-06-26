const fs = require('fs');
const path = require('path');

const files = [
    'd:\\DOCUMENT\\WEB\\hai-main antigravity\\auth.js',
    'd:\\DOCUMENT\\WEB\\hai-main antigravity\\assets\\script.js',
    'd:\\DOCUMENT\\WEB\\hai-main antigravity\\assets\\js\\admin.js'
];

const keys = [
    'isAuthenticated', 'userEmail', 'userName', 'isPremium',
    'userPlanName', 'userPlanNumber', 'premiumExpiryDate',
    'proExpiryDate', 'phantomExpiryDate', 'lastPopupDateDB',
    'lastExpiryWarningDateDB', 'gracely_db_session_id',
    'gracelyPremiumConfig', 'gracely_active_session_token',
    'gracely_config_url'
];

const gracelyStateCode = `// --- SECURE STATE HELPER ---
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

`;

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filePath}, does not exist.`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (filePath.endsWith('auth.js')) {
        content = gracelyStateCode + content;
    }
    
    keys.forEach(key => {
        // Replace setItem
        const setRegex = new RegExp(`localStorage\\.setItem\\(['"]${key}['"],\\s*(.*?)\\)`, 'g');
        content = content.replace(setRegex, `GracelyState.set('${key}', $1)`);
        
        // Replace getItem
        const getRegex = new RegExp(`localStorage\\.getItem\\(['"]${key}['"]\\)`, 'g');
        content = content.replace(getRegex, `GracelyState.get('${key}')`);
        
        // Replace removeItem
        const removeRegex = new RegExp(`localStorage\\.removeItem\\(['"]${key}['"]\\)`, 'g');
        content = content.replace(removeRegex, `GracelyState.remove('${key}')`);
    });
    
    content = content.replace(/localStorage\.clear\(\);/g, 'GracelyState.clear(); localStorage.clear();');
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
});
console.log('Done.');
