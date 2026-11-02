export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export function validateFile(file) {
    if (!file || typeof file.arrayBuffer !== 'function') throw new Error('Pilih satu file untuk diperiksa.');
    if (!Number.isInteger(file.size) || file.size < 0) throw new Error('Informasi ukuran file tidak valid. Pilih file lain.');
    if (file.size > MAX_FILE_SIZE) throw new Error('Ukuran file melebihi 25 MB. Pilih file yang lebih kecil.');
}

export async function calculateChecksum(file, subtle = globalThis.crypto?.subtle) {
    validateFile(file);
    if (!subtle || typeof subtle.digest !== 'function') throw new Error('Web Crypto tidak tersedia. Buka aplikasi melalui HTTPS atau localhost pada browser terbaru.');
    let buffer;
    try { buffer = await file.arrayBuffer(); }
    catch { throw new Error('File gagal dibaca. Pastikan file masih tersedia lalu pilih kembali.'); }
    try {
        const digest = await subtle.digest('SHA-256', buffer);
        return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    } catch { throw new Error('Checksum gagal dihitung. Coba lagi menggunakan browser terbaru.'); }
}

export function normalizeReference(value) {
    const reference = value.trim();
    if (!reference) throw new Error('Masukkan checksum referensi terlebih dahulu.');
    if (!/^[a-f0-9]{64}$/i.test(reference)) throw new Error('Checksum harus berisi 64 karakter heksadesimal (0–9, a–f).');
    return reference.toLowerCase();
}

export function compareChecksum(actual, reference) {
    return normalizeReference(actual) === normalizeReference(reference);
}

export function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    const megabytes = bytes >= 1024 * 1024;
    return `${(bytes / (megabytes ? 1024 * 1024 : 1024)).toLocaleString('id-ID', { maximumFractionDigits: 2 })} ${megabytes ? 'MB' : 'KB'}`;
}
