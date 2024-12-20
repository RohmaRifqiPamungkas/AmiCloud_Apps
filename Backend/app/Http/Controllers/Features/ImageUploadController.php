<?php

namespace App\Http\Controllers\Features;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FileUpload;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
        $uniqueFileName = "amicloud_{$uniqueCode}.{$extension}";

        $fileSize = $image->getSize();

        $image->move(public_path('images'), $uniqueFileName);

        $fileUpload = new FileUpload();
        $fileUpload->user_id = Auth::id();
        $fileUpload->filename = $originalName;
        $fileUpload->file_path = 'images/' . $uniqueFileName;
        $fileUpload->file_size = $fileSize; 
        $fileUpload->upload_type = $extension;
        $fileUpload->save();

        $imageUrl = url('images/' . $uniqueFileName);

        return back()->with([
            'success' => 'File berhasil diunggah.',
            'image_url' => $imageUrl,
        ]);

    }
}