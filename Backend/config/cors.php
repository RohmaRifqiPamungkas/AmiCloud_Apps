<?php

return [

    /*
    |----------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |----------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],  // Ensures CORS is enabled on API routes and CSRF cookie route

    'allowed_methods' => ['*'],  // Allows all HTTP methods

    'allowed_origins' => [
        'http://localhost:3000',  // Allows requests only from localhost:3000
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],  // Allows all headers

    'exposed_headers' => [],  // No special headers to expose

    'max_age' => 0,  // Preflight request cache time in seconds

    'supports_credentials' => true,  // Allow cookies to be sent with cross-origin requests (useful for authentication)
];