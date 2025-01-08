<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\View\View;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): View
    {
        return view('auth.forgot-password');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|\Illuminate\Http\JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($request->expectsJson()) {
            // Return a JSON response for API requests
            if ($status == Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Tautan pengaturan ulang kata sandi telah dikirim.',
                ], 200);
            }

            return response()->json([
                'message' => 'Gagal mengirim tautan pengaturan ulang kata sandi.',
                'errors' => ['email' => [__($status)]],
            ], 422);
        }

        // Web response
        return $status == Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withInput($request->only('email'))
            ->withErrors(['email' => __($status)]);
    }
}