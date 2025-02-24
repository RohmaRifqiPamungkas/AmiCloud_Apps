<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\FileLink;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use App\Models\FileUpload;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $this->assignUploadsToUser($request);

        if ($request->expectsJson()) {
            $user = $request->user();

            $token = $user->createToken('API Token')->plainTextToken;

            return response()->json([
                'message' => 'Login berhasil',
                'user' => $user,
                'token' => $token,
            ]);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Update file uploads for the current logged-in user.
     */
    protected function assignUploadsToUser(Request $request): void
    {
        if (Auth::check()) {
            $userId = Auth::id();
            $ipAddress = $request->ip();

            FileUpload::where('ip_address', $ipAddress)
                ->whereNull('user_id')
                ->update(['user_id' => $userId]);

            FileLink::where('ip_address', $ipAddress)
                ->whereNull('user_id')
                ->update(['user_id' => $userId]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Successfully logged out.'
        ], 200);
    }
}