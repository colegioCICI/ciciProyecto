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
        Schema::create('facturas', function (Blueprint $table) {
            $table->id('factura_id');
            $table->date('fecha_factura')->nullable();
            $table->bigInteger('tramite_factura');

            //Representa la clave foranea de uno a muchos de folders a facturas (colocar en facturas)
            $table->unsignedBigInteger('folder_id');
            $table->string('direccion_inmueble')->nullable();
            $table->string('numero_factura')->nullable();
            $table->decimal('aprobacion',10,2)->nullable();
            $table->decimal('porcentaje_cici',10,2)->nullable();
            $table->decimal('microfilm',10,2)->nullable();
            $table->decimal('total',10,2)->nullable();
            $table->decimal('especie',10,2)->nullable();
            $table->decimal('formularios',10,2)->nullable();
            $table->decimal('valor_cobrado',10,2)->nullable();
            $table->string('tipo')->nullable();

            //Relación de uno a muchos desde folders a notification
            $table->foreign('folder_id')->references('folder_id')->on('folders')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
