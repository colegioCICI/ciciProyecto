<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Folder;


class DashboardController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        $usuariosRoles = User::getPermissionAuthUser();
        $folders = Folder::getDocumentsWithFolders();
        return Inertia::render('Dashboard', [
            'users' => $users,
            'roles' => $roles,
            'usuariosRoles' => $usuariosRoles,
            'folders' => $folders,
        ]);
    }
}
