<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|View
    {
        if ($request->user()->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Email sudah diverifikasi.',
                ], 200);
            }

            return redirect()->intended(route('dashboard', absolute: false));
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Email belum diverifikasi. Silakan cek email Anda.',
            ], 403); 
        }

        return view('auth.verify-email');
    }
}