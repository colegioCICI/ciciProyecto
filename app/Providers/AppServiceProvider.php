<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

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
        // Esta línea obliga a Laravel a usar la APP_URL para generar todas las rutas.
        // Es la solución definitiva para problemas con proxies y subcarpetas.
        if ($this->app->environment('local', 'production')) { // O el entorno que uses
            URL::forceRootUrl(config('app.url'));
        }
    }
}

// namespace App\Providers;

// use Illuminate\Support\Facades\URL;
// use Illuminate\Support\ServiceProvider;

// class AppServiceProvider extends ServiceProvider
// {
//     /**
//      * Register any application services.
//      */
//     public function register(): void
//     {
//         //
//     }

//     /**
//      * Bootstrap any application services.
//      */
//     public function boot(): void
//     {
//         // Force the root URL to respect the APP_URL from the environment.
//         // This is crucial for generating correct URLs behind a reverse proxy.
//         if (config('app.url')) {
//             URL::forceRootUrl(config('app.url'));
//         }
//     }
// }


// namespace App\Providers;

// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\URL;
// use Illuminate\Support\ServiceProvider;

// class AppServiceProvider extends ServiceProvider {
//     /**
//      * Register any application services.
//      */
//     public function register(): void {
//         //
//     }

//     /**
//      * Bootstrap any application services.
//      */
//     public function boot(): void {
//         if (config("app.env") === "production") {
//             URL::forceScheme("https");
//         }

//         if (Auth::check()) {
//             session(["last_activity" => time()]);
//         }
//     }
// }
