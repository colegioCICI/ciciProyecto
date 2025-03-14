<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\Api\TramiteRequerimientosController;

// Ruta para obtener los documentos de un trámite basado en el campo "tramite"
Route::get('/documentos/tramiteCICI/{tramite}', [TramiteRequerimientosController::class, 'getDocumentosPorTramite']);

// Ruta para obtener los documentos de un trámite basado en el campo "tramite"
Route::get('/emailsCICI/{tramite}', [TramiteRequerimientosController::class, 'getEmailsPorTramite']);