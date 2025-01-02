<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Models\FileUpload;
use App\Models\FileLink;

class FileManagementController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:manage files', only: ['index', 'destroy']),
            new Middleware('permission:upload files', only: ['upload']),
            new Middleware('permission:reupload files', only: ['reupload']),
        ];
    }

    /**
     * Display file management dashboard.
     */
    public function index(Request $request)
    {
        $uploads = FileUpload::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $links = FileLink::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return view('management_file.admin.list', compact('uploads', 'links'));
    }

    /**
     * Handle file upload.
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:png,jpg,jpeg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('uploads', $filename, 'public');

        $fileUpload = new FileUpload();
        $fileUpload->user_id = Auth::id();
        $fileUpload->filename = $file->getClientOriginalName();
        $fileUpload->file_path = $filePath;
        $fileUpload->file_size = $file->getSize();
        $fileUpload->upload_type = $file->extension();
        $fileUpload->ip_address = $request->ip();
        $fileUpload->save();

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    /**
     * Handle file reupload from a URL.
     */
    public function reupload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image_url' => 'required|url',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $imageUrl = $request->input('image_url');

        try {
            $response = Http::get($imageUrl);
            if ($response->successful()) {
                $contentType = $response->header('Content-Type');
                if (!preg_match('/image\/(png|jpg|jpeg|gif)/', $contentType)) {
                    return redirect()->back()
                        ->with('error', 'Invalid image type.');
                }

                $originalName = basename(parse_url($imageUrl, PHP_URL_PATH));
                $extension = pathinfo($originalName, PATHINFO_EXTENSION);
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $filePath = 'uploads/' . $filename;

                Storage::disk('public')->put($filePath, $response->body());

                $fileLink = new FileLink();
                $fileLink->user_id = Auth::id();
                $fileLink->file_path = $filePath;
                $fileLink->original_url = $imageUrl;
                $fileLink->parsed_url = Storage::disk('public')->url($filePath);
                $fileLink->save();

                return redirect()->back()->with('success', 'File reuploaded successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to fetch the file from the provided URL.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }

    /**
     * Delete a file (uploaded or reuploaded).
     */
    public function destroy(string $id, Request $request)
    {
        $type = $request->input('type'); // Determine if deleting 'upload' or 'link'

        if ($type === 'upload') {
            $file = FileUpload::findOrFail($id);
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        } elseif ($type === 'link') {
            $link = FileLink::findOrFail($id);
            Storage::disk('public')->delete($link->file_path);
            $link->delete();
        } else {
            return redirect()->back()->with('error', 'Invalid file type specified.');
        }

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}