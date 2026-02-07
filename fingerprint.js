/**
 * Device Fingerprinting Helper (WEBSITE VERSION)
 * Generates unique fingerprint untuk bind session ke device
 * NOTE: Logic disamakan dengan Extension (Service Worker) supaya hash MATCH
 */

async function getDeviceFingerprint() {
    try {
        // Collect device-specific attributes
        // HARUS SAMA PERSIS dengan Extension (background.js environment)
        // Tidak boleh pakai screen.* atau canvas karena Extension tidak bisa akses
        const components = [
            navigator.userAgent,
            navigator.language,
            navigator.languages ? navigator.languages.join(',') : '',
            new Date().getTimezoneOffset().toString(),
            navigator.hardwareConcurrency ? navigator.hardwareConcurrency.toString() : 'unknown',
            navigator.platform,
            navigator.deviceMemory ? navigator.deviceMemory.toString() : 'unknown',
            // Get Chrome version as additional entropy (sesuai Extension)
            /Chrome\/([0-9.]+)/.exec(navigator.userAgent)?.[1] || 'unknown'
        ];

        // Combine semua komponen
        const fingerprint = components.join('|||');

        // Hash dengan SHA-256
        const msgBuffer = new TextEncoder().encode(fingerprint);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        console.log('Device fingerprint generated:', hashHex);
        return hashHex;
    } catch (error) {
        console.error('Error generating device fingerprint:', error);
        // Fallback ke fingerprint sederhana jika ada error
        return await getFallbackFingerprint();
    }
}

async function getFallbackFingerprint() {
    // Simplified fingerprint untuk fallback
    // HARUS SAMA PERSIS dengan Extension
    const simple = [
        navigator.userAgent,
        new Date().getTimezoneOffset().toString(),
        navigator.language
    ].join('|||');

    const msgBuffer = new TextEncoder().encode(simple);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    console.warn('Using fallback fingerprint');
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
