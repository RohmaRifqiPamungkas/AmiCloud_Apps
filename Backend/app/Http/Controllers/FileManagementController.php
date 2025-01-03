<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        if (Auth::id() == 1) {
            // Admin dapat melihat semua data
            $uploads = FileUpload::orderBy('created_at', 'desc')->paginate(10);
            $links = FileLink::orderBy('created_at', 'desc')->paginate(10);
        } else {
            // User hanya melihat data miliknya
            $uploads = FileUpload::where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate(10);
            $links = FileLink::where('user_id', Auth::id())->orderBy('created_at', 'desc')->paginate(10);
        }

        return view('management_file.list', compact('uploads', 'links'));
    }

    /**
     * Show detail of a file upload.
     */
    public function show($id)
    {
        $fileUpload = Auth::id() == 1
            ? FileUpload::findOrFail($id)
            : FileUpload::where('user_id', Auth::id())->findOrFail($id);

        return view('management_file.show', compact('fileUpload'));
    }

    /**
     * Edit the title of a file upload.
     */
    public function edit($id)
    {
        $fileUpload = Auth::id() == 1
            ? FileUpload::findOrFail($id)
            : FileUpload::where('user_id', Auth::id())->findOrFail($id);

        return view('management_file.edit', compact('fileUpload'));
    }

    /**
     * Update the title of a file upload.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $fileUpload = Auth::id() == 1
            ? FileUpload::findOrFail($id)
            : FileUpload::where('user_id', Auth::id())->findOrFail($id);

        $fileUpload->title = $request->input('title');
        $fileUpload->save();

        return redirect()->route('file-management.index')
            ->with('success', 'File title updated successfully.');
    }

    /**
     * Delete a file (uploaded or reuploaded).
     */
    public function destroy(string $id, Request $request)
    {
        $type = $request->input('type');

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
            return redirect()->back()->with('error', 'Invalid file type specified.');
        }

        return redirect()->route('file-management.index')->with('success', 'File deleted successfully.');
    }
}