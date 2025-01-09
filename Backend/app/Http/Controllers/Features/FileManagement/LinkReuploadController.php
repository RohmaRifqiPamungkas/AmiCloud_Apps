<?php

namespace App\Http\Controllers\Features\FileManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\FileLink;

class LinkReuploadController extends Controller
{
    /**
     * Create a link for reupload from URL.
     */
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
                    $errorMessage = 'URL tidak berisi gambar yang valid.';
                    if ($request->expectsJson()) {
                        return response()->json(['message' => $errorMessage], 400);
                    }
                    return back()->with('error_url', $errorMessage);
                }

                // Ambil konten file gambar
                $fileContent = $response->body();

                // Tentukan nama file yang aman
                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH));
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                // Validasi format file gambar yang diterima
                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $errorMessage = 'Format file tidak didukung.';
                    if ($request->expectsJson()) {
                        return response()->json(['message' => $errorMessage], 400);
                    }
                    return back()->with('error_url', $errorMessage);
                }

                // Buat nama file unik
                $uniqueCode = Str::random(8);
                $newFileName = 'AmiCloud_' . $uniqueCode . '.' . $extension;

                // Tentukan lokasi penyimpanan file
                $filePath = public_path('images/' . $newFileName);
                file_put_contents($filePath, $fileContent);

                // Simpan informasi file dalam database
                $fileLink = new FileLink();
                $fileLink->user_id = Auth::id() ?: null; 
                $fileLink->file_path = 'images/' . $newFileName;
                $fileLink->original_url = $imageUrl;
                $fileLink->parsed_url = $newFileName;
                $fileLink->ip_address = $request->ip();
                $fileLink->save();

                $imageUrl = url('images/' . $newFileName);

                // Mengembalikan hasil dengan URL gambar
                $successMessage = 'File berhasil diunggah. Akses file di: <a href="' . $imageUrl . '" target="_blank" class="text-blue-500 underline">' . $imageUrl . '</a>';

                if ($request->expectsJson()) {
                    return response()->json(['message' => $successMessage, 'image_url' => $imageUrl], 200);
                }

                return back()->with('url_image', $successMessage);
            } else {
                // Gagal mengunduh gambar dari URL
                $errorMessage = 'Gagal mengunduh gambar dari URL.';
                if ($request->expectsJson()) {
                    return response()->json(['message' => $errorMessage], 400);
                }
                return back()->with('error_url', $errorMessage);
            }
        } catch (\Exception $e) {
            // Tangani kesalahan dengan baik
            $errorMessage = 'Terjadi kesalahan: ' . $e->getMessage();
            if ($request->expectsJson()) {
                return response()->json(['message' => $errorMessage], 500);
            }
            return back()->with('error_url', $errorMessage);
        }
    }
}