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
        $request->validate([
            'image_url' => 'required|url',
        ]);

        $imageUrl = $request->input('image_url');

        try {
            $response = Http::get($imageUrl);

            if ($response->successful()) {
                $contentType = $response->header('Content-Type');

                if (!preg_match('/^image\/[a-zA-Z]+$/', $contentType)) {
                    $errorMessage = 'URL tidak berisi gambar yang valid.';
                    if ($request->expectsJson()) {
                        return response()->json(['message' => $errorMessage], 400);
                    }
                    return back()->with('error_url', $errorMessage);
                }

                $fileContent = $response->body();

                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH));
                $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

                if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'])) {
                    $errorMessage = 'Format file tidak didukung.';
                    if ($request->expectsJson()) {
                        return response()->json(['message' => $errorMessage], 400);
                    }
                    return back()->with('error_url', $errorMessage);
                }

                $uniqueCode = Str::random(8);
                $newFileName = 'AmiCloud_' . $uniqueCode . '.' . $extension;

                $filePath = public_path('images/' . $newFileName);
                file_put_contents($filePath, $fileContent);

                $fileLink = new FileLink();
                $fileLink->user_id = Auth::id() ?: null;
                $fileLink->file_path = 'images/' . $newFileName;
                $fileLink->original_url = $imageUrl;
                $domain = env('APP_URL', 'http://127.0.0.1:8000');
                $fileLink->parsed_url = $domain . '/images/' . $newFileName;
                $fileLink->ip_address = $request->ip();
                $fileLink->save();

                $imageUrl = $domain . '/images/' . $newFileName;

                $successMessage = 'File berhasil diunggah. Akses file di: <a href="' . $imageUrl . '" target="_blank" class="text-blue-500 underline">' . $imageUrl . '</a>';

                if ($request->expectsJson()) {
                    return response()->json(['message' => $successMessage, 'image_url' => $imageUrl], 200);
                }

                return back()->with('url_image', $successMessage);
            } else {
                $errorMessage = 'Gagal mengunduh gambar dari URL.';
                if ($request->expectsJson()) {
                    return response()->json(['message' => $errorMessage], 400);
                }
                return back()->with('error_url', $errorMessage);
            }
        } catch (\Exception $e) {
            $errorMessage = 'Terjadi kesalahan: ' . $e->getMessage();
            if ($request->expectsJson()) {
                return response()->json(['message' => $errorMessage], 500);
            }
            return back()->with('error_url', $errorMessage);
        }
    }
}