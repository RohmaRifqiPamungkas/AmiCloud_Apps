<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\FileLink;

class LinkReuploadController extends Controller
{
    public function createLink(Request $request)
    {
        // Validasi URL
        $request->validate([
            'image_url' => 'required|url',
        ]);

        $imageUrl = $request->input('image_url');

        try {
            $response = Http::get($imageUrl);

            // Periksa apakah respons berhasil
            if ($response->successful()) {
                $contentType = $response->header('Content-Type');

                // Validasi bahwa URL merujuk ke file gambar
                if (!preg_match('/^image\/[a-zA-Z]+$/', $contentType)) {
                    return back()->with('error_url', 'URL tidak berisi gambar yang valid.');
                }

                // Ambil konten file gambar
                $fileContent = $response->body();

                // Tentukan nama file yang aman
                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH));
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])) {
                    return back()->with('error_url', 'Format file tidak didukung.');
                }

                // Buat nama file unik
                $uniqueCode = Str::random(8);
                $newFileName = 'AmiCloud_' . $uniqueCode . '.' . $extension;

                // Tentukan lokasi penyimpanan file
                $filePath = public_path('images/' . $newFileName);
                file_put_contents($filePath, $fileContent);

                // Simpan informasi file dalam database
                $fileLink = new FileLink();
                $fileLink->user_id = Auth::id() ?: null; // Jika tidak login, null
                $fileLink->file_path = 'images/' . $newFileName;
                $fileLink->original_url = $imageUrl;
                $fileLink->parsed_url = $newFileName;
                $fileLink->save();

                $imageUrl = url('images/' . $newFileName);

                return back()->with('url_image', 'Akses file di: <a href="' . $imageUrl . '" target="_blank" class="text-blue-500 underline">' . $imageUrl . '</a>');
            } else {
                return back()->with('error_url', 'Gagal mengunduh gambar dari URL.');
            }
        } catch (\Exception $e) {
            // Tangani kesalahan dengan baik
            return back()->with('error_url', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}