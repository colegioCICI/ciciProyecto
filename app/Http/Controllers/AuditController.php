<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OwenIt\Auditing\Models\Audit;
use App\Models\User;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png');
        
        // ❌ ESTA LÍNEA CAUSA EL ERROR - EL MÉTODO NO EXISTE
        // $audits = Audit::getCustomAuditRecords();
        
        // ✅ REEMPLAZAR CON MÉTODOS ESTÁNDAR
        $audits = Audit::with(['user']) // Cargar relación con usuario
                      ->orderBy('created_at', 'desc') // Ordenar por fecha
                      ->paginate(20); // Paginar resultados
        
        $usuariosRoles = User::getPermissionAuthUser();
        
        return Inertia::render('Audit/index', [
            'audits' => $audits,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI, 
        ]);
    }
}