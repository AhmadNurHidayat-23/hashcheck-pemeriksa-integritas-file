@extends('layouts.app')

@section('content')
    <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow">PEMERIKSA CHECKSUM FILE</p>
        <h1 id="page-title">Periksa Integritas File dengan Mudah.</h1>
        <p class="description">Hitung dan bandingkan checksum SHA-256 untuk memeriksa apakah isi file tetap sama.</p>
    </section>

    <section class="workspace" aria-label="Pemeriksaan integritas file">
        <div class="file-area" id="file-area" aria-label="Pilih file untuk diperiksa" aria-describedby="file-hint file-limit">
            <input type="file" id="file-input" hidden>
            <div class="file-copy">
                <div id="file-icon" class="file-icon"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 4H7v24h18V11L18 4Z"/><path d="M18 4v8h7M11 18h10M11 22h7"/></svg></div>
                <div class="file-description">
                    <h2 id="file-title">Mulai dengan satu file.</h2>
                    <p id="file-hint">Tarik file ke sini atau pilih dari perangkat Anda.</p>
                    <p id="file-details" hidden></p>
                    <p class="file-limit" id="file-limit">Semua jenis file · Maksimal 25 MB</p>
                </div>
            </div>
            <button class="button" id="choose-button" type="button" disabled>Pilih File <span aria-hidden="true">↗</span></button>
            <button class="button button-secondary" id="reset-button" type="button" hidden>Periksa File Lain</button>
        </div>
        <div class="process-feedback">
            <p class="process-status" id="process-status" role="status" aria-live="polite" aria-atomic="true"></p>
            <p class="error-message" id="file-error" role="alert" hidden></p>
            <noscript><p class="error-message">Aktifkan JavaScript untuk menghitung dan membandingkan checksum file.</p></noscript>
        </div>

        <div class="result-grid" id="result-area" hidden>
            <section class="checksum-panel" aria-labelledby="checksum-title">
                <div class="panel-heading"><h2 id="checksum-title">Checksum file</h2><span class="algorithm">SHA-256</span></div>
                <p class="field-hint">64 karakter heksadesimal dari isi file Anda.</p>
                <label class="sr-only" for="checksum-output">Hasil checksum SHA-256</label>
                <textarea id="checksum-output" rows="3" readonly spellcheck="false"></textarea>
                <button class="button button-copy" id="copy-button" type="button" disabled><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H4v13h4"/></svg>Salin Checksum</button>
                <p class="copy-status" id="copy-status" role="status" aria-live="polite" aria-atomic="true"></p>
            </section>

            <section class="reference-panel" aria-labelledby="reference-title">
                <h2 id="reference-title">Bandingkan dengan referensi</h2>
                <p class="field-hint">Gunakan checksum dari sumber yang Anda percaya.</p>
                <form id="compare-form" novalidate>
                    <label for="reference-input">Checksum Referensi</label>
                    <textarea id="reference-input" rows="3" maxlength="512" placeholder="Tempel checksum SHA-256 di sini…" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="reference-error"></textarea>
                    <p class="error-message" id="reference-error" role="alert" hidden></p>
                    <button class="button" id="compare-button" type="submit" disabled>Bandingkan <span aria-hidden="true">→</span></button>
                </form>
                <div class="comparison-result" id="comparison-result" role="status" aria-live="polite" aria-atomic="true" hidden>
                    <p class="comparison-title" id="comparison-title"></p>
                    <p id="comparison-description"></p>
                </div>
            </section>
        </div>
    </section>

    <section class="explanation" aria-labelledby="about-title">
        <h2 id="about-title">Apa itu SHA-256?</h2>
        <div><p>SHA-256 menghasilkan nilai hash berisi 64 karakter heksadesimal untuk membandingkan isi file terhadap checksum referensi.</p><p>HashCheck bukan antivirus atau pemindai malware. Kecocokan checksum bergantung pada referensi yang Anda gunakan; pastikan sumbernya dapat dipercaya.</p></div>
    </section>
@endsection
