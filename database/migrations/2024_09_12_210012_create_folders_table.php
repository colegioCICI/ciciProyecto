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
        Schema::create('folders', function (Blueprint $table) {
            $table->id('folder_id');
            $table->date('fecha_ingreso');
            $table->string('tramite')->nullable();
            $table->string('nombre_propietario');
            $table->bigInteger('ficha');
            $table->string('cedula');
            $table->string('nombre_quiendeja');
            $table->string('estado_carpeta');
            $table->string('email_propietario')->nullable();
            $table->string('email_ingeniero')->nullable();
            $table->string('nombre_quienretira')->nullable();
            $table->date('fecha_retiro')->nullable();
            $table->bigInteger('numero_ingreso');
            //Representa la clave foranea de users
            $table->unsignedBigInteger('user_id')->nullable();
            //Relación de uno a muchos desde users a folders
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folders');
    }
};
