<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            //Representa la clave foranea de uno a muchos de folders a notification (colocar en notification)
            $table->unsignedBigInteger('folder_id')->nullable();
            $table->text('mensaje');
            $table->date('fecha_envio');
            //Relación de uno a muchos desde folders a notification
            $table->foreign('folder_id')->references('folder_id')->on('folders')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }

};
