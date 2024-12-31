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
        $key = $request->ip();
        $maxAttempts = 3; // Batas percobaan
        $decaySeconds = 86400; // 1 hari

        if ($this->limiter->tooManyAttempts($key, $maxAttempts)) {
            $this->limiter->hit($key, $decaySeconds); // Optional: Tambahkan hit jika perlu
            return redirect('/features/not-login')
                ->with('error', 'Anda telah mencapai batas unggahan harian. Login untuk melanjutkan.');
        }

        $this->limiter->hit($key, $decaySeconds);

        return $next($request);
    }
}