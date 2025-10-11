<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Folder;
use App\Models\Document;
use App\Models\Review;
use App\Models\Observation;
use App\Models\Factura;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;


class DashboardController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        $usuariosRoles = User::getPermissionAuthUser();
        $folders = Folder::getDocumentsWithFolders();

        // ========== ESTADÍSTICAS PRINCIPALES SIMPLIFICADAS ==========
        $stats = [
            'total_carpetas' => Folder::count(),
            'total_documentos' => Document::count(),
            'documentos_revisados' => Review::whereIn('estado', ['aprobado', 'Aprobado'])->count(),
            'observaciones_activas' => Observation::count(),
        ];

        // ========== TRÁMITES RECIENTES (CORREGIDO) ==========
        // Primero obtenemos los nombres de las columnas para debug
        $folderColumns = Schema::getColumnListing('folders');
        
        $tramitesRecientes = Folder::with(['user'])
            ->orderBy('fecha_ingreso', 'desc')
            ->limit(8)
            ->get()
            ->map(function($folder) {
                return [
                    'id' => $folder->getKey(), // Usamos getKey() para obtener la clave primaria
                    'tramite' => $folder->tramite ?? 'Sin Trámite',
                    'propietario' => $folder->nombre_propietario ?? 'Sin Nombre',
                    'estado' => $folder->estado_carpeta ?? 'Sin Estado',
                    'fecha' => $folder->fecha_ingreso ? Carbon::parse($folder->fecha_ingreso)->format('d/m/Y') : 'Sin fecha',
                    'usuario' => $folder->user ? $folder->user->name : 'Sin Usuario',
                    'color' => $this->getColorForStatus($folder->estado_carpeta)
                ];
            });

        // ========== ESTADOS DE REVISIÓN CORREGIDO ==========
        $reviewStatusData = Review::select('estado', DB::raw('count(*) as cantidad'))
            ->groupBy('estado')
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->estado ?? 'Sin Estado',
                    'value' => $item->cantidad,
                    'color' => $this->getColorForReviewStatus($item->estado)
                ];
            });

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => Auth::user()
            ],
            'usuariosRoles' => $usuariosRoles,
            'folders' => $folders,
            
            // Datos para el dashboard simplificado
            'stats' => $stats,
            'tramitesRecientes' => $tramitesRecientes,
            'reviewStatusData' => $reviewStatusData,
        ]);
    }

    /**
     * Asigna colores según el estado para revisiones
     */
    private function getColorForReviewStatus($status)
    {
        $colors = [
            'aprobado' => '#22c55e',
            'Aprobado' => '#22c55e',
            'rechazado' => '#ef4444',
            'Rechazado' => '#ef4444',
            'pendiente' => '#f59e0b',
            'Pendiente' => '#f59e0b',
            'en revision' => '#3b82f6',
            'En Revision' => '#3b82f6',
            'observado' => '#8b5cf6',
            'Observado' => '#8b5cf6',
        ];

        return $colors[$status] ?? '#6b7280';
    }

    /**
     * Asigna colores según el estado para carpetas
     */
    private function getColorForStatus($status)
    {
        $colors = [
            'En Proceso' => '#3b82f6',
            'Aprobada' => '#22c55e',
            'Aprobado' => '#22c55e',
            'Con Observaciones' => '#f59e0b',
            'Observaciones' => '#f59e0b',
            'Rechazada' => '#ef4444',
            'Rechazado' => '#ef4444',
            'Pendiente' => '#8b5cf6',
            'Completado' => '#22c55e',
            'Finalizado' => '#22c55e',
        ];

        return $colors[$status] ?? '#6b7280';
    }
}