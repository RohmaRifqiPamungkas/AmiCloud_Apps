<?php

namespace App\Http\Controllers\Features\FileManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\FileUpload;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,png,jpeg,gif,webp|max:5240',
        ]);

        $image = $request->file('image');
        $originalName = $image->getClientOriginalName();
        $extension = $image->getClientOriginalExtension();
        $uniqueCode = Str::random(8);
        $uniqueFileName = "AmiCloud_{$uniqueCode}.{$extension}";
        $fileSize = $image->getSize();

        $filePath = "images/{$uniqueFileName}";
        $image->move(public_path('images'), $uniqueFileName);

        $fileUpload = new FileUpload();
        $fileUpload->user_id = Auth::check() ? Auth::id() : null;
        $fileUpload->filename = $originalName;
        $fileUpload->file_path = $filePath;
        $fileUpload->file_size = $fileSize;
        $fileUpload->upload_type = $extension;
        $fileUpload->ip_address = $request->ip();
        $fileUpload->save();

        $imageUrl = url($filePath);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'File uploaded successfully.',
                'image_url' => $imageUrl,
            ], 200);
        }

        return back()->with([
            'success' => 'File berhasil diunggah.',
            'image_url' => $imageUrl,
        ]);
    }
}