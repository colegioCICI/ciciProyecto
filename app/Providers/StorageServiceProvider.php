<?php

namespace App\Providers;

use App\Services\StorageService;
use Illuminate\Support\ServiceProvider;

class StorageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(StorageService::class, function ($app) {
            return new StorageService('CICI');
        });

        $this->app->alias(StorageService::class, 'storage.service');
    }

    public function boot(): void
    {
        //
    }
}