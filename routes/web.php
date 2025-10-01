<?php

use App\Http\Controllers\CorrectionController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\AuditController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('login');
});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'service' => config('app.name'),
        'timestamp' => now()->toISOString()
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Rutas para usuarios
    Route::get('/users', [UserController::class, 'index'])->middleware('can:view.users')->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->middleware('can:create.users')->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->middleware('can:edit.users')->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('can:delete.users')->name('users.destroy');

    //Rutas para Carpetas
    Route::get('/folders', [FolderController::class, 'index'])->middleware('can:view.folders')->name('folders.index');
    Route::post('/folders', [FolderController::class, 'store'])->middleware('can:create.folders')->name('folders.store');
    Route::patch('/folders/{folder}', [FolderController::class, 'update'])->middleware('can:edit.folders')->name('folders.update');
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy'])->middleware('can:delete.folders')->name('folders.destroy');

    //Ruta para el correo electronico
    Route::post('/send-email', [EmailController::class, 'sendEmail'])->name('send.email');

    //Rutas para Notificaciones
    Route::get('/notifications', [NotificationController::class, 'index'])->middleware('can:view.notification')->name('notifications.index');
    Route::post('/notifications', [NotificationController::class, 'store'])->middleware('can:create.notification')->name('notifications.store');
    Route::put('/notifications/{notification}', [NotificationController::class, 'update'])->middleware('can:edit.notification')->name('notifications.update');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->middleware('can:delete.notification')->name('notifications.destroy');

    //Rutas para Documentos
    Route::get('/documents/pdf', [DocumentController::class, 'pdf'])->middleware('can:view.document')->name('documents.pdf');
    Route::get('/documents', [DocumentController::class, 'index'])->middleware('can:view.document')->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->middleware('can:create.document')->name('documents.store');
    Route::put('/documents/{document}', [DocumentController::class, 'update'])->middleware('can:edit.document')->name('documents.update');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->middleware('can:delete.document')->name('documents.destroy');
// En routes/web.php
Route::post('/documents/upload-file', [DocumentController::class, 'uploadFile'])->name('documents.uploadFile');
Route::get('/documents/{id}/view-file', [DocumentController::class, 'viewFile'])->name('documents.view-file');
    //Rutas para Revisiones
    Route::get('/reviews', [ReviewController::class, 'index'])->middleware('can:view.reviews')->name('reviews.index');
    Route::get('/reviews/{document}', [ReviewController::class, 'show'])->middleware('can:view.reviews')->name('reviews.show');
    Route::post('/reviews', [ReviewController::class, 'store'])->middleware('can:create.reviews')->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->middleware('can:edit.reviews')->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->middleware('can:delete.reviews')->name('reviews.destroy');


    //Rutas para Observaciones
    Route::get('/observations', [ObservationController::class, 'index'])->middleware('can:view.observation')->name('observations.index');
    Route::post('/observations', [ObservationController::class, 'store'])->middleware('can:create.observation')->name('observations.store');
    Route::put('/observations/{observation}', [ObservationController::class, 'update'])->middleware('can:edit.observation')->name('observations.update');
    Route::delete('/observations/{observation}', [ObservationController::class, 'destroy'])->middleware('can:delete.observation')->name('observations.destroy');


    
    Route::get('/audits', [AuditController::class, 'index'])->name('audits.index');
    
    //Rutas para facturas
    Route::get('/facturas', [FacturaController::class, 'index'])->middleware('can:view.facturas')->name('facturas.index');
    Route::patch('/facturas/{factura}', [FacturaController::class, 'update'])->middleware('can:edit.facturas')->name('facturas.update');
    Route::delete('/facturas/{factura}', [FacturaController::class, 'destroy'])->middleware('can:delete.facturas')->name('facturas.destroy');
});

require __DIR__ . '/auth.php';
