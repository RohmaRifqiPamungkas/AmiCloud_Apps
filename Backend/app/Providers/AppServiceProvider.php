<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
            return $user->hasRole('admin') ? true : null;
        });

        RateLimiter::for('upload-image', function (Request $request) {
            return $request->user()
                ? Limit::none()
                : Limit::perDay(3)->by($request->ip());
        });

        RateLimiter::for('link-upload', function (Request $request) {
            return $request->user()
                ? Limit::none()
                : Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('features.limiter', function (Request $request) {
            return Limit::perMinute(10)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });

        RateLimiter::for('admin-panel', function (Request $request) {
            return Limit::perMinute(20)->by($request->user()?->id ?: $request->ip());
        });
    }
}