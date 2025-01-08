<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Email sudah diverifikasi.',
                ], 200); 
            }

            return redirect()->intended(route('dashboard', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Tautan verifikasi email telah dikirim.',
            ], 200); 
        }

        return back()->with('status', 'verification-link-sent');
    }
}