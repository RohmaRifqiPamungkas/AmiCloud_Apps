<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthOptional
{
    public function handle(Request $request, Closure $next)
    {
        // Jika pengguna sudah terautentikasi, biarkan mereka melanjutkan ke rute berikutnya
        if (Auth::check()) {
            return $next($request);
        }

        // Jika tidak terautentikasi, kita lanjutkan permintaan tanpa autentikasi
        return $next($request);
    }
}