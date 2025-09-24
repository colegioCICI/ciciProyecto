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

use App\Http\Controllers\DocumentController;
Route::get('/documents/{id}/download', [DocumentController::class, 'download']);

use App\Http\Controllers\FolderController;
use App\Http\Controllers\ReviewController;
Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    
use App\Http\Controllers\Auth\AuthController;
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
});