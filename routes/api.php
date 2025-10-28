<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\Api\TramiteRequerimientosController;
use App\Http\Controllers\Auth\AuthController;


// // Ruta de prueba
Route::get('/api/hello', function () {
    return response()->json(['message' => 'Hello World from CICI API']);
});

Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
Route::middleware(['api.token'])->group(function () {
    Route::get('/folders/{folder_id}', [FolderController::class, 'show']);
    Route::get('/documentos/tramiteCICI/{tramite}', [TramiteRequerimientosController::class, 'getDocumentosPorTramite']);
    Route::get('/emailsCICI/{tramite}', [TramiteRequerimientosController::class, 'getEmailsPorTramite']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'service' => config('app.name'),
        'environment' => config('app.env')
    ]);
});

Route::get('/api/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'service' => config('app.name'),
        'environment' => config('app.env')
    ]);
});