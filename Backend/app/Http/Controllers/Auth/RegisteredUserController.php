<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'image_profile' => 'images/profiles/default-profile.png',
                'is_active' => 0,
            ]);

            $role = Role::where('name', 'user')->first();
            if ($role) {
                $user->roles()->attach($role);
            }

            event(new Registered($user));

            Auth::login($user);

            $token = $user->createToken('API Token')->plainTextToken;

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Registrasi berhasil.',
                    'user' => $user,
                    'token' => $token,
                ], 201);
            }

            return redirect(route('dashboard'))->with('success', 'Registrasi berhasil!');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Terjadi kesalahan saat registrasi.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return redirect()->back()->withInput()->withErrors('Terjadi kesalahan saat registrasi.');
        }
    }
}