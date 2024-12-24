<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\FileLink;

class LinkReuploadController extends Controller
{
    public function createLink(Request $request)
    {
        $request->validate([
            'image_url' => 'required|url',
        ]);

        $imageUrl = $request->input('image_url');

        try {
            $response = Http::get($imageUrl);

            if ($response->successful()) {
                $contentType = $response->header('Content-Type');

                if (!preg_match('/image\/*/', $contentType)) {
                    return back()->with('error_url', 'URL tidak berisi gambar yang valid.');
                }

                // Ambil konten file gambar
                $fileContent = $response->body();

                // Ekstrak nama file dan ekstensi
                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH));
                $extension = pathinfo($originalName, PATHINFO_EXTENSION);

                $uniqueCode = Str::random(8);
                $newFileName = 'amicloud_' . $uniqueCode . '.' . $extension;

                $filePath = public_path('images/' . $newFileName);
                file_put_contents($filePath, $fileContent);
                
                $fileLink = new FileLink();
                $fileLink->user_id = Auth::id();
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
            return back()->with('error_url', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }


}