<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class UploadRateLimiter
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $key = 'upload:' . $request->ip();

        // Rate limiting: Batas 3 upload per menit untuk IP yang sama
        if (RateLimiter::remaining($key, 1) === 0) {
            return response()->json([
                'error' => 'Too many uploads. Please try again later.'
            ], 429);
        }

        // Increment the number of uploads for this IP
        RateLimiter::hit($key, 60);

        return $next($request);
    }
}