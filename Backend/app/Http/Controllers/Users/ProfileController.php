<?php

namespace App\Http\Controllers\Users;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(string $id, Request $request)
    {
        // Ambil data user beserta role-nya
        $user = User::with('roles')->findOrFail($id);

        // Jika request JSON, kembalikan profile beserta roles-nya
        if ($request->expectsJson()) {
            return response()->json([
                'user' => array_merge($user->toArray(), [
                    'roles' => $user->roles->pluck('name'),
                ]),
            ]);
        }

        // Untuk view biasa (non-API)
        return view('profile.index', [
            'user' => $user,
        ]);
    }


    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        // Ambil data user yang sedang terautentikasi beserta roles-nya
        $user = $request->user()->load('roles');

        // Jika request JSON, kembalikan profile beserta roles-nya
        if ($request->expectsJson()) {
            return response()->json([
                'user' => $user->makeHidden(['roles']), // Menyembunyikan data 'roles' dari objek utama 'user'
                'image_profile' => $request->image_profile,
                'roles' => $user->roles->pluck('name'),
            ]);
        }

        // Untuk view biasa (non-API)
        return view('profile.edit', [
            'user' => $user,
        ]);
    }



    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();

        $validatedData = $request->validated();

        if ($request->hasFile('image_profile')) {
            $image = $request->file('image_profile');
            $imageName = 'profile_' . time() . '.' . $image->getClientOriginalExtension();
            $image->move(base_path('../public_html/api-amicloud.temukreatif.id/images/profiles'), $imageName);

            $validatedData['image_profile'] = 'images/profiles/' . $imageName;
        }

        $user->fill($validatedData);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Profile updated successfully.',
                'user' => $user,
                'image_profile' => $user->image_profile,
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse|JsonResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User account deleted successfully.',
            ], 200);
        }

        return response()->json([
            'message' => 'Failed to delete user account.',
        ], 400);
    }
}
