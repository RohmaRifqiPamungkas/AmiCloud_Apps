<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PreventRequestsDuringMaintenance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     * @throws HttpException
     */
    public function handle(Request $request, Closure $next)
    {
        if (file_exists(storage_path('framework/maintenance.php'))) {
            throw new HttpException(503, 'The application is down for maintenance.');
        }

        return $next($request);
    }
}