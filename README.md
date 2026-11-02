# HashCheck — Pemeriksa Integritas File

HashCheck adalah aplikasi web untuk menghitung checksum SHA-256 sebuah file dan membandingkannya dengan nilai referensi. Tujuan pengembangannya adalah menyediakan cara sederhana untuk memeriksa kesesuaian isi file yang diunduh, disalin, atau dibagikan, tanpa mengunggahnya ke layanan lain.

Antarmuka berbahasa Indonesia memakai palet lavender, ungu tua, terracotta, dan lilac. Tata letak responsif menampilkan informasi file, checksum lengkap, dan perbandingan.

## Fitur utama

- Memilih satu file dari perangkat atau melalui drag-and-drop.
- Mendukung semua jenis file, termasuk file kosong, hingga 25 MB.
- Menampilkan nama, ukuran aktual, dan jenis file jika tersedia.
- Menghitung SHA-256 dengan Web Crypto API bawaan browser.
- Menampilkan hasil 64 karakter heksadesimal dan menyalinnya melalui Clipboard API.
- Memvalidasi checksum referensi, mengabaikan kapitalisasi serta spasi di tepi, kemudian menampilkan **Cocok** atau **Tidak Cocok** setelah pengguna membandingkan.
- Membersihkan file, checksum, referensi, dan status melalui **Periksa File Lain**.

Jika referensi diubah, hasil perbandingan sebelumnya disembunyikan sampai perbandingan dilakukan kembali. Kegagalan membaca file, batas ukuran, dukungan browser, dan izin papan klip ditangani dengan pesan yang sesuai. Perhitungan lama yang selesai setelah reset tidak ditampilkan kembali.

## Teknologi dan cara kerja

Aplikasi menggunakan Laravel 13, layout Blade, HTML5, CSS3, JavaScript murni, Web Crypto API, dan Vite. Font Inter tersedia secara lokal beserta lisensinya. Tidak ada framework frontend atau library kriptografi tambahan. Laravel menyajikan halaman dan aset; session serta cache memakai file tanpa database.

SHA-256 menghasilkan hash 256 bit yang ditampilkan sebagai 64 karakter heksadesimal. Nilai dihitung dari byte isi file, bukan nama atau jenisnya. Aplikasi membaca file ke memori lalu memanggil `crypto.subtle.digest('SHA-256', ...)`. Batas 25 MB diterapkan sebelum pembacaan karena API digest tidak menerima masukan secara streaming.

## Cara menggunakan

1. Pilih satu file atau jatuhkan ke area pemilihan.
2. Tunggu checksum selesai dihitung.
3. Gunakan **Salin Checksum** bila diperlukan.
4. Tempel checksum referensi terpercaya dan tekan **Bandingkan**.
5. Gunakan **Periksa File Lain** untuk mengosongkan seluruh hasil.

Jika clipboard ditolak, checksum dipilih agar dapat disalin manual menggunakan ⌘C atau Ctrl+C.

## Privasi dan batasan

File dibaca lokal, tanpa dikirim ke Laravel, API eksternal, database, atau storage aplikasi. Tidak ada riwayat, analytics, atau pencatatan isi file. Gunakan localhost atau HTTPS agar Web Crypto tersedia. HashCheck bukan antivirus atau pemindai malware. Kecocokan hanya berlaku terhadap nilai referensi; kepercayaan terhadap sumber referensi tetap diperlukan.

## Menjalankan secara lokal

Gunakan PHP minimal 8.3, Composer 2, dan Node.js 22.12 atau lebih baru:

```sh
git clone https://github.com/AhmadNurHidayat-23/hashcheck-pemeriksa-integritas-file.git
cd hashcheck-pemeriksa-integritas-file
composer install
npm ci
cp .env.example .env
php artisan key:generate
npm run build
php artisan serve
```

Buka `http://localhost:8000`, atau `http://localhost:8888/hashcheck-pemeriksa-integritas-file/public/` pada MAMP. MySQL dan migrasi tidak diperlukan.

Jalankan `php artisan test`, `npm test`, dan `npm run build`. Pengujian Web Crypto dan drag-and-drop tersedia lewat `npm run test:browser`, kemudian buka `http://127.0.0.1:8018`.
