<?php return array (
  'providers' => 
  array (
    0 => 'Barryvdh\\DomPDF\\ServiceProvider',
    1 => 'Inertia\\ServiceProvider',
    2 => 'Laravel\\Breeze\\BreezeServiceProvider',
    3 => 'Laravel\\Sail\\SailServiceProvider',
    4 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    5 => 'Laravel\\Tinker\\TinkerServiceProvider',
    6 => 'Carbon\\Laravel\\ServiceProvider',
    7 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    8 => 'Termwind\\Laravel\\TermwindServiceProvider',
    9 => 'OwenIt\\Auditing\\AuditingServiceProvider',
    10 => 'Spatie\\Permission\\PermissionServiceProvider',
    11 => 'Tighten\\Ziggy\\ZiggyServiceProvider',
    12 => 'App\\Providers\\RabbitMQServiceProvider',
    13 => 'App\\Providers\\AppServiceProvider',
  ),
  'eager' => 
  array (
    0 => 'Barryvdh\\DomPDF\\ServiceProvider',
    1 => 'Inertia\\ServiceProvider',
    2 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    3 => 'Carbon\\Laravel\\ServiceProvider',
    4 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    5 => 'Termwind\\Laravel\\TermwindServiceProvider',
    6 => 'OwenIt\\Auditing\\AuditingServiceProvider',
    7 => 'Spatie\\Permission\\PermissionServiceProvider',
    8 => 'Tighten\\Ziggy\\ZiggyServiceProvider',
    9 => 'App\\Providers\\RabbitMQServiceProvider',
    10 => 'App\\Providers\\AppServiceProvider',
  ),
  'deferred' => 
  array (
    'Laravel\\Breeze\\Console\\InstallCommand' => 'Laravel\\Breeze\\BreezeServiceProvider',
    'Laravel\\Sail\\Console\\InstallCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'Laravel\\Sail\\Console\\PublishCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'command.tinker' => 'Laravel\\Tinker\\TinkerServiceProvider',
  ),
  'when' => 
  array (
    'Laravel\\Breeze\\BreezeServiceProvider' => 
    array (
    ),
    'Laravel\\Sail\\SailServiceProvider' => 
    array (
    ),
    'Laravel\\Tinker\\TinkerServiceProvider' => 
    array (
    ),
  ),
);