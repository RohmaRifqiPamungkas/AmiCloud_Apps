<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class EncryptCookies
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        // You can add cookies that should be excluded from encryption here
    ];

    /**
     * Encrypt the cookies on response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        foreach (Cookie::get() as $name => $value) {
            if (!in_array($name, $this->except)) {
                Cookie::queue(Cookie::make($name, encrypt($value)));
            }
        }

        return $next($request);
    }
}