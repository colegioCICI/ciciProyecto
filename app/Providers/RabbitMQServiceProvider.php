<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use PhpAmqpLib\Connection\AMQPStreamConnection;

class RabbitMQServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('rabbitmq.connection', function ($app) {
            return new AMQPStreamConnection(
                config('rabbitmq.host', 'localhost'),
                config('rabbitmq.port', 5672),
                config('rabbitmq.user', 'guest'),
                config('rabbitmq.password', 'guest')
            );
        });
    }

    public function boot()
    {
        //
    }
}