<?php

namespace App\Http\Controllers\Features\FileManagement;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Http\Controllers\Controller;
use App\Models\FileUpload;
use App\Models\FileLink;

class FileManagementController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view file management', only: ['index']),
            new Middleware('permission:show file management', only: ['show']),
            new Middleware('permission:edit file management', only: ['edit']),
            new Middleware('permission:create file management', only: ['create']),
            new Middleware('permission:delete file management', only: ['destroy']),
        ];
    }

    /**
     * Display file management dashboard.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);
        $type = $request->query('type');

        if (Auth::id() == 1) {
            // Admin dapat melihat semua data
            $uploadsQuery = FileUpload::orderBy('created_at', 'DESC');
            $linksQuery = FileLink::orderBy('created_at', 'DESC');
        } else {
            // User hanya bisa melihat data miliknya
            $uploadsQuery = FileUpload::where('user_id', Auth::id())->orderBy('created_at', 'desc');
            $linksQuery = FileLink::where('user_id', Auth::id())->orderBy('created_at', 'desc');
        }

        if ($search) {
            $uploadsQuery->where(function ($query) use ($search) {
                $query->where('upload_type', 'LIKE', "%{$search}%")
                    ->orWhere('filename', 'LIKE', "%{$search}%");
            });

            $linksQuery->where(function ($query) use ($search) {
                $query->where('file_path', 'LIKE', "%{$search}%")
                    ->orWhere('original_url', 'LIKE', "%{$search}%");
            });
        }

        if ($type === 'upload') {
            $uploads = $uploadsQuery->paginate($perPage);
            $links = null;
        } elseif ($type === 'link') {
            $uploads = null;
            $links = $linksQuery->with(['user.role'])->paginate($perPage);
        } else {
            $uploads = $uploadsQuery->paginate($perPage);
            $links = $linksQuery->with(['user.role'])->paginate($perPage);
        }

        if ($request->expectsJson()) {
            if (!$links && !$uploads) {
                return response()->json(['message' => 'No data available'], 404);
            }

            return response()->json([
                'uploads' => $uploads ? $uploads : [],
                'links' => $links ? $links->through(function ($link) {
                    return [
                        'id' => $link->id,
                        'name' => $link->user ? $link->user->name : null,
                        'filename' => basename($link->file_path),
                        'file_size' => $this->getFileSize($link->file_path),
                        'resolutions' => $this->getImageResolution($link->file_path),
                        'format' => pathinfo($link->file_path, PATHINFO_EXTENSION),
                        'file_path' => $link->file_path,
                        'thumbnail' => url($link->file_path),
                        'parsed_link' => $link->parsed_url,
                        'original_url' => $link->original_url,
                        'date' => $link->created_at->toDateString(),
                        'role' => $link->user ? ($link->user->role ? $link->user->role->name : null) : null,
                    ];
                }) : []
            ]);
        }

        return view('management_file.list', compact('uploads', 'links'))
            ->with('uploads', $uploads->isEmpty() ? [] : $uploads)
            ->with('links', $links->isEmpty() ? [] : $links);
    }

    /**
     * Show detail of a file upload.
     */
    public function show($id, Request $request)
    {
        $type = $request->query('type');
        $fileData = null;
        $imageResolution = null;

        if ($type === 'upload') {
            $fileData = Auth::id() == 1
                ? FileUpload::findOrFail($id)
                : FileUpload::where('user_id', Auth::id())->findOrFail($id);

            if (in_array($fileData->mime_type, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
                $imagePath = Storage::disk('public')->path('images/' . $fileData->file_path);
                if (file_exists($imagePath)) {
                    $dimensions = getimagesize($imagePath);
                    if ($dimensions) {
                        $imageResolution = $dimensions[0] . ' x ' . $dimensions[1] . ' pixels';
                    }
                }
            }
        } elseif ($type === 'link') {
            $fileData = Auth::id() == 1
                ? FileLink::findOrFail($id)
                : FileLink::where('user_id', Auth::id())->findOrFail($id);
        } else {
            return response()->json(['message' => 'Invalid type specified'], 400);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'file' => $fileData,
                'imageResolution' => $imageResolution,
            ]);
        }

        return view('management_file.show', compact('fileData', 'imageResolution'));
    }

    /**
     * Edit the title of a file upload.
     */
    public function edit($id, Request $request)
    {
        $fileUpload = Auth::id() == 1
            ? FileUpload::find($id)
            : FileUpload::where('user_id', Auth::id())->find($id);

        if (!$fileUpload) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'File not found or you don’t have permission to access this file.',
                ], 404);
            }

            return redirect()->route('file-management.index')
                ->with('error', 'File not found or you don’t have permission to access this file.');
        }

        if ($request->expectsJson()) {
            return response()->json([
                'file' => $fileUpload,
            ]);
        }

        return view('management_file.edit', compact('fileUpload'));
    }

    /**
     * Update the title and filename of a file upload.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid input.',
                'errors' => $validator->errors()
            ], 422);
        }

        $fileUpload = Auth::id() == 1
            ? FileUpload::findOrFail($id)
            : FileUpload::where('user_id', Auth::id())->findOrFail($id);

        $fileUpload->filename = $request->input('filename');
        $fileUpload->save();
        $fileUpload->refresh();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'File updated successfully.',
                'file' => $fileUpload,
            ]);
        }

        return redirect()->route('file-management.index')
            ->with('success', 'File updated successfully.');
    }

    /**
     * Get Size Files
     */
    public function getFileSize($filePath)
    {
        if (Storage::exists($filePath)) {
            return Storage::size($filePath);
        }

        return 0;
    }

    /**
     * Get Resolutions Image
     */
    public function getImageResolution($filePath)
    {
        // Misalnya file disimpan di public/profiles
        $file = public_path('images/' . $filePath);

        // Cek apakah file ada
        if (file_exists($file)) {
            list($width, $height) = getimagesize($file);
            return $width . 'px : ' . $height . 'px';
        }

        return 'File not found';
    }

    /**
     * Copy a link (uploaded or reuploaded).
     */
    public function copyLink($id, Request $request)
    {
        $type = $request->input('type');
        if (!$type) {
            return response()->json([
                'message' => 'File type must be specified as "upload" or "link".',
            ], 400);
        }

        $url = null;

        if ($type === 'upload') {
            $fileUpload = Auth::id() == 1
                ? FileUpload::findOrFail($id)
                : FileUpload::where('user_id', Auth::id())->findOrFail($id);

            $domain = env('APP_URL');
            $filePath = $fileUpload->file_path;

            if (strpos($filePath, 'images/') === false) {
                $filePath = 'images/' . $filePath;
            }

            $url = $domain . '/' . $filePath;
        } elseif ($type === 'link') {
            $fileLink = Auth::id() == 1
                ? FileLink::findOrFail($id)
                : FileLink::where('user_id', Auth::id())->findOrFail($id);

            $url = $fileLink->original_url;
        } else {
            return response()->json([
                'message' => 'Invalid file type specified. Use "upload" or "link".',
            ], 400);
        }

        return response()->json([
            'message' => 'Link copied successfully.',
            'url' => $url,
        ], 200);
    }

    /**
     * Share link to social media (WhatsApp, etc.).
     */
    public function shareLink($id, Request $request)
    {
        $type = $request->input('type');

        if (!$type) {
            return response()->json([
                'message' => 'File type must be specified as "upload" or "link".'
            ], 400);
        }

        $url = null;

        if ($type === 'upload') {
            $fileUpload = Auth::id() == 1
                ? FileUpload::findOrFail($id)
                : FileUpload::where('user_id', Auth::id())->findOrFail($id);

            $domain = env('APP_URL');
            $filePath = $fileUpload->file_path;
            if (strpos($filePath, 'images/') === false) {
                $filePath = 'images/' . $filePath;
            }
            $url = $domain . '/' . $filePath;
        } elseif ($type === 'link') {
            $fileLink = Auth::id() == 1
                ? FileLink::findOrFail($id)
                : FileLink::where('user_id', Auth::id())->findOrFail($id);

            $url = $fileLink->parsed_url ?: $fileLink->original_url;
        } else {
            return response()->json([
                'message' => 'Invalid file type specified.'
            ], 400);
        }

        // Encode URL and message for sharing
        $encodedUrl = urlencode($url);
        $message = urlencode('Check out this file: ' . $url);

        // Generate WhatsApp share URL with specified format
        $whatsAppUrl = "https://api.whatsapp.com/send/?text={$message}&type=custom_url&app_absent=0";

        return response()->json([
            'message' => 'Share link generated successfully.',
            'originalUrl' => $url,
            'whatsAppUrl' => $whatsAppUrl
        ], 200);
    }

    /**
     * Delete a file (uploaded or reuploaded).
     */
    public function destroy(string $id, Request $request): \Illuminate\Http\JsonResponse
    {
        $type = $request->input('type');

        if (!$type) {
            return response()->json([
                'message' => 'File type must be specified as "upload" or "link".'
            ], 400);
        }

        if ($type === 'upload') {
            $file = Auth::id() == 1
                ? FileUpload::findOrFail($id)
                : FileUpload::where('user_id', Auth::id())->findOrFail($id);

            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        } elseif ($type === 'link') {
            $link = Auth::id() == 1
                ? FileLink::findOrFail($id)
                : FileLink::where('user_id', Auth::id())->findOrFail($id);

            Storage::disk('public')->delete($link->file_path);
            $link->delete();
        } else {
            return response()->json([
                'message' => 'Invalid file type specified.'
            ], 400);
        }

        return response()->json([
            'message' => 'File deleted successfully.'
        ], 200);
    }
}