<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost',
        'http://localhost:8000',
        'http://localhost:8001',
        'http://localhost:8002',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3004',
        'http://nginx',
        'http://cici:8001'
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];