<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleRateLimit
{
    protected $limiter;

    public function __construct(RateLimiter $limiter)
    {
        $this->limiter = $limiter;
    }

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            // Bebaskan pengguna login dari rate limit
            return $next($request);
        }

        // Gunakan kunci berbasis IP untuk rate limiter
        $key = $request->ip();
        $maxAttempts = 3; // Batas percobaan
        $decaySeconds = 86400; // 1 hari

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            // Hit rate limit - arahkan ke login
            $this->limiter->hit($key, $decaySeconds);
            return redirect('/login')->withErrors('Anda telah mencapai batas unggahan. Login untuk melanjutkan.');
        }

        // Tambahkan hit ke rate limiter
        $this->limiter->hit($key, $decaySeconds);

        return $next($request);
    }
}