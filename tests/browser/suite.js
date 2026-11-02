import { calculateChecksum } from './hash.js';
import { bindFileInput } from './file-input.js';

let passed = 0, failed = 0;
const check = (condition, message) => { if (!condition) throw new Error(message); };
const test = async (name, run) => {
    const item = document.createElement('li');
    try { await run(); passed++; item.textContent = `LULUS — ${name}`; }
    catch (error) { failed++; item.textContent = `GAGAL — ${name}: ${error.message}`; }
    document.querySelector('#results').append(item);
};
const abc = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
await test('Web Crypto pada localhost cocok dengan vector abc', async () => {
    check(window.isSecureContext, 'Konteks browser tidak aman.');
    check(await calculateChecksum(new File(['abc'], 'uji.txt')) === abc, 'Hash tidak cocok.');
});
await test('File kosong menghasilkan SHA-256 standar', async () => {
    check(await calculateChecksum(new File([], 'kosong.bin')) === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Hash kosong salah.');
});
const zone = document.createElement('div'), input = document.createElement('input'), choose = document.createElement('button');
input.type = 'file';
let selected = null, message = '';
bindFileInput({ choose, input, dropzone: zone, onFile: file => { selected = file; }, onError: text => { message = text; } });
const transfer = new DataTransfer();
transfer.items.add(new File(['abc'], 'dijatuhkan.txt'));
await test('Satu file dari drop diterima dan dihitung dengan benar', async () => {
    const event = new DragEvent('drop', { cancelable: true, dataTransfer: transfer });
    zone.dispatchEvent(event);
    check(event.defaultPrevented && selected, 'Drop tidak ditangani.');
    check(await calculateChecksum(selected) === abc, 'Hash file dari drop salah.');
});
await test('Drop beberapa file ditolak', async () => {
    transfer.items.add(new File(['lain'], 'kedua.txt'));
    selected = null;
    zone.dispatchEvent(new DragEvent('drop', { cancelable: true, dataTransfer: transfer }));
    check(!selected && message.includes('satu file'), 'Beberapa file tidak ditolak.');
});
await test('Indikator drag dibersihkan setelah keluar', async () => {
    zone.dispatchEvent(new DragEvent('dragenter', { cancelable: true, dataTransfer: transfer }));
    check(zone.classList.contains('is-dragging'), 'Indikator drag tidak aktif.');
    zone.dispatchEvent(new DragEvent('dragleave', { dataTransfer: transfer }));
    check(!zone.classList.contains('is-dragging'), 'Indikator drag tertinggal.');
});
document.querySelector('#summary').textContent = `${passed} lulus, ${failed} gagal.`;
