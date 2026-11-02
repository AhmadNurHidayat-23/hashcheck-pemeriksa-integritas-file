import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { calculateChecksum, compareChecksum, formatSize, MAX_FILE_SIZE, normalizeReference, validateFile } from '../../resources/js/hash.js';

const abc = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

for (const [name, text, expected] of [
    ['file kosong', '', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'abc', abc],
    ['pesan multiblok', 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
]) {
    test(`SHA-256 sesuai test vector ${name}`, async () => {
        const result = await calculateChecksum(new File([text], 'uji.txt'));
        assert.equal(result, expected);
        assert.match(result, /^[a-f0-9]{64}$/);
    });
}

test('data biner dan Unicode cocok dengan implementasi SHA-256 independen', async () => {
    const bytes = new Uint8Array([0, 255, 128, 0, 1, 10, 13]);
    for (const data of [bytes, new TextEncoder().encode('Halo 👋 — HashCheck')]) {
        const expected = createHash('sha256').update(data).digest('hex');
        assert.equal(await calculateChecksum(new File([data], 'uji.bin')), expected);
    }
});

test('hash bergantung pada isi, bukan nama atau MIME file', async () => {
    const first = await calculateChecksum(new File(['abc'], 'pertama.txt', { type: 'text/plain' }));
    const second = await calculateChecksum(new File(['abc'], 'kedua.bin', { type: 'application/octet-stream' }));
    const changed = await calculateChecksum(new File(['abd'], 'pertama.txt'));
    assert.equal(first, second);
    assert.notEqual(first, changed);
});

test('batas 25 MB diterapkan sebelum membaca file', async () => {
    let read = false;
    const file = { size: MAX_FILE_SIZE + 1, arrayBuffer: async () => { read = true; return new ArrayBuffer(0); } };
    await assert.rejects(calculateChecksum(file), /25 MB/);
    assert.equal(read, false);
    assert.doesNotThrow(() => validateFile({ ...file, size: MAX_FILE_SIZE }));
});

test('file tidak tersedia dan ukuran tidak valid ditolak', () => {
    assert.throws(() => validateFile(null), /Pilih satu file/);
    assert.throws(() => validateFile({ size: -1, arrayBuffer() {} }), /ukuran/);
});

test('kegagalan membaca file diterjemahkan tanpa membocorkan pesan sumber', async () => {
    const file = { size: 3, arrayBuffer: async () => { throw new Error('private-path/disk-error'); } };
    await assert.rejects(calculateChecksum(file), { message: 'File gagal dibaca. Pastikan file masih tersedia lalu pilih kembali.' });
});

test('Web Crypto tidak tersedia atau digest gagal ditangani', async () => {
    const file = new File(['abc'], 'uji.txt');
    await assert.rejects(calculateChecksum(file, null), /HTTPS atau localhost/);
    await assert.rejects(calculateChecksum(file, { digest: async () => { throw new Error('native-error'); } }), /Checksum gagal dihitung/);
});

test('checksum referensi mengabaikan kapitalisasi dan spasi di tepi', () => {
    assert.equal(normalizeReference(` \n${abc.toUpperCase()}\t `), abc);
    assert.equal(compareChecksum(abc, abc.toUpperCase()), true);
});

test('checksum yang berbeda menghasilkan perbandingan false', () => {
    assert.equal(compareChecksum(abc, '0'.repeat(64)), false);
});

test('referensi kosong, panjang keliru, dan karakter nonheksadesimal ditolak', () => {
    for (const value of ['', '  ', 'a'.repeat(63), 'a'.repeat(65), 'g'.repeat(64), `${abc.slice(0, 32)}\n${abc.slice(32)}`]) {
        assert.throws(() => normalizeReference(value));
    }
});

test('ukuran file ditampilkan berdasarkan byte aktual', () => {
    assert.equal(formatSize(0), '0 B');
    assert.equal(formatSize(3), '3 B');
    assert.equal(formatSize(1536), '1,5 KB');
    assert.equal(formatSize(MAX_FILE_SIZE), '25 MB');
});
