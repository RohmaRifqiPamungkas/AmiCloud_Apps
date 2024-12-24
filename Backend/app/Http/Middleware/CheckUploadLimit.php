<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUploadLimit
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            // Jika pengguna login, lewati batasan
            return $next($request);
        }

        // Jika pengguna belum login, cek session upload count
        $uploadCount = session()->get('upload_count', 0);

        if ($uploadCount >= 3) {
            return redirect()->route('login')->with('error', 'Anda telah mencapai batas unggahan sebagai pengguna publik. Silakan login untuk unggahan tanpa batas.');
        }

        return $next($request);
    }
}