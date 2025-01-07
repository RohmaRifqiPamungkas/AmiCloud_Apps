<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     * 
     * If set to `*`, Laravel will trust all proxies.
     * If you use a specific proxy, provide its IP address or a list of IPs.
     *
     * @var array|string|null
     */
    protected $proxies = '*'; // Trust all proxies, or specify proxy IP addresses here.

    /**
     * The headers that should be used to detect proxies.
     *
     * @var array|string
     */
    protected $headers = [
        'X-Forwarded-For',
        'X-Forwarded-Host',
        'X-Forwarded-Port',
        'X-Forwarded-Proto',
    ];
}