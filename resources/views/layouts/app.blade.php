<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Hitung dan bandingkan checksum SHA-256 file secara lokal dengan HashCheck. Tanpa mengunggah file, tanpa akun, dan tanpa riwayat.">
    <meta name="theme-color" content="#f3f0fa">
    <title>HashCheck — Pemeriksa Integritas File</title>
    <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <a class="skip-link" href="#file-area">Langsung ke pemeriksa file</a>
    <header class="site-header wrap">
        <a class="wordmark" href="{{ route('home') }}" aria-label="HashCheck, halaman utama">hashcheck<span>.</span></a>
        <span class="header-note">File Anda tetap di perangkat Anda.</span>
    </header>
    <main class="wrap">@yield('content')</main>
    <footer class="site-footer wrap"><p>HashCheck — Pemeriksa Integritas File.</p><span>Lokal. Tanpa unggah.</span></footer>
</body>
</html>
