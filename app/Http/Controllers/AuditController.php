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
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $audits = Audit::getCustomAuditRecords();
        $usuariosRoles = User::getPermissionAuthUser();
        return Inertia::render('Audit/index', [
            'audits' => $audits,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI, 
        ]);
    }
}
