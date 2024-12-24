<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     * @throws AuthenticationException
     */
    public function handle(Request $request, Closure $next, $guard = null)
    {
        // Check if the user is authenticated for the specified guard.
        if (auth($guard)->guest()) {
            throw new AuthenticationException('Unauthenticated.');
        }

        return $next($request);
    }
}