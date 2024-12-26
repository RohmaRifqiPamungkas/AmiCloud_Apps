<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('upload-image', function ($request) {
            return $request->user()
                ? Limit::none() // Tanpa batasan untuk pengguna yang login
                : Limit::perDay(3)->by($request->ip()); // Batas 3 unggahan per IP
        });
    }
}