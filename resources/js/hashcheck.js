import { calculateChecksum, compareChecksum, formatSize, validateFile } from './hash.js';
import { bindFileInput } from './file-input.js';

const byId = id => document.getElementById(id);
const choose = byId('choose-button'), reset = byId('reset-button'), input = byId('file-input');
const area = byId('file-area'), output = byId('checksum-output'), reference = byId('reference-input');
const copy = byId('copy-button'), copyStatus = byId('copy-status');
const supported = window.isSecureContext && typeof globalThis.crypto?.subtle?.digest === 'function';
let checksum = '', generation = 0, busy = false, copyBusy = false;

function showError(text = '') {
    byId('file-error').textContent = text;
    byId('file-error').hidden = !text;
}

function clearComparison() {
    byId('comparison-result').hidden = true;
    byId('comparison-title').textContent = '';
    byId('comparison-description').textContent = '';
    byId('reference-error').hidden = true;
    byId('reference-error').textContent = '';
    reference.setAttribute('aria-invalid', 'false');
}

function resetState() {
    generation++;
    checksum = '';
    busy = false;
    input.value = '';
    output.value = '';
    reference.value = '';
    clearComparison();
    showError();
    byId('result-area').hidden = true;
    byId('process-status').textContent = '';
    byId('file-title').textContent = 'Mulai dengan satu file.';
    byId('file-details').textContent = '';
    byId('file-details').hidden = true;
    byId('file-hint').hidden = false;
    byId('file-icon').hidden = false;
    area.classList.remove('has-file', 'is-dragging');
    area.setAttribute('aria-busy', 'false');
    copyStatus.textContent = '';
    copyStatus.dataset.error = 'false';
    copy.disabled = byId('compare-button').disabled = true;
    reset.hidden = true;
    choose.hidden = false;
    choose.disabled = !supported;
}

async function selectFile(file) {
    if (!supported) { showError('Web Crypto membutuhkan HTTPS atau localhost. Gunakan browser terbaru.'); return; }
    if (busy) { showError('Tunggu perhitungan selesai, atau gunakan Periksa File Lain untuk memulai ulang.'); return; }
    resetState();
    try { validateFile(file); } catch (error) { showError(error.message); return; }
    const current = generation;
    busy = true;
    choose.disabled = true;
    choose.hidden = true;
    reset.hidden = false;
    area.classList.add('has-file');
    area.setAttribute('aria-busy', 'true');
    byId('file-icon').hidden = true;
    byId('file-hint').hidden = true;
    byId('file-title').textContent = file.name;
    byId('file-details').textContent = `${formatSize(file.size)} · ${file.type || 'Jenis file tidak diketahui'}`;
    byId('file-details').hidden = false;
    byId('process-status').textContent = 'Menghitung SHA-256 di browser…';
    try {
        const result = await calculateChecksum(file);
        if (current !== generation) return;
        checksum = result;
        output.value = result;
        byId('result-area').hidden = false;
        copy.disabled = copyBusy;
        byId('compare-button').disabled = false;
        showError();
        byId('process-status').textContent = 'Checksum selesai dihitung. File tidak dikirim ke server.';
    } catch (error) {
        if (current === generation) {
            showError(error.message);
            byId('process-status').textContent = '';
        }
    } finally {
        if (current === generation) {
            busy = false;
            choose.disabled = false;
            area.setAttribute('aria-busy', 'false');
        }
    }
}

bindFileInput({ choose, input, dropzone: area, onFile: selectFile, onError: showError });
reset.addEventListener('click', () => { resetState(); choose.focus(); });
reference.addEventListener('input', clearComparison);
byId('compare-form').addEventListener('submit', event => {
    event.preventDefault();
    clearComparison();
    if (!checksum || busy) return;
    try {
        const matches = compareChecksum(checksum, reference.value);
        byId('comparison-result').dataset.match = String(matches);
        byId('comparison-title').textContent = matches ? 'Cocok' : 'Tidak Cocok';
        byId('comparison-description').textContent = matches
            ? 'Nilai SHA-256 file sama dengan checksum referensi.'
            : 'Checksum file berbeda dari referensi. Isi file mungkin berbeda atau nilai referensi keliru.';
        byId('comparison-result').hidden = false;
    } catch (error) {
        byId('reference-error').textContent = error.message;
        byId('reference-error').hidden = false;
        reference.setAttribute('aria-invalid', 'true');
        reference.focus();
    }
});

copy.addEventListener('click', async () => {
    if (!checksum || copyBusy) return;
    const current = generation, value = checksum;
    copyBusy = true;
    copy.disabled = true;
    copyStatus.textContent = '';
    copyStatus.dataset.error = 'false';
    try {
        if (typeof navigator.clipboard?.writeText !== 'function') throw new Error();
        await navigator.clipboard.writeText(value);
        if (current === generation) copyStatus.textContent = 'Checksum berhasil disalin.';
    } catch {
        if (current === generation) {
            output.focus(); output.select();
            copyStatus.textContent = 'Papan klip tidak tersedia atau izinnya ditolak. Checksum sudah dipilih; tekan ⌘C atau Ctrl+C untuk menyalin.';
            copyStatus.dataset.error = 'true';
        }
    } finally {
        copyBusy = false;
        copy.disabled = !checksum;
    }
});

window.addEventListener('pagehide', resetState);
choose.disabled = !supported;
if (!supported) showError('Web Crypto tidak tersedia. Buka aplikasi melalui HTTPS atau localhost pada browser terbaru.');
