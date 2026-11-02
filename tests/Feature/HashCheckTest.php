<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class HashCheckTest extends TestCase
{
    public function test_page_loads_in_indonesian_without_database_access(): void
    {
        DB::shouldReceive('connection')->never();

        $this->get('/')
            ->assertOk()
            ->assertSee('<html lang="id">', false)
            ->assertSee('<h1 id="page-title">Periksa Integritas File dengan Mudah.</h1>', false)
            ->assertSee('Pilih File')
            ->assertSee('Salin Checksum')
            ->assertSee('Checksum Referensi')
            ->assertSee('Bandingkan')
            ->assertSee('Periksa File Lain')
            ->assertSee('HashCheck bukan antivirus atau pemindai malware.');
    }

    public function test_no_file_upload_endpoint_is_available(): void
    {
        $this->post('/')->assertStatus(405);
    }
}
