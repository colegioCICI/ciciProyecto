<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $notifications = Notification::getNotificationWithFolder();
        $usuariosRoles = User::getPermissionAuthUser();
        $folders = Folder::getDocumentsWithFolders();
        return Inertia::render('Notifications/index',[
            'notifications'=> $notifications,
            'usuariosRoles'=> $usuariosRoles,
            'logoCICI' => $logoCICI, 
            'folders' => $folders, 
        ]);
    }

    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'mensaje' => 'required|string|max:255',
            'fecha_envio' => 'required|date',
        ]);

        // Crear una nueva carpeta
        $notification = Notification::create([
            'mensaje' => $validatedData['mensaje'],
            'fecha_envio' => $validatedData['fecha_envio'],
        ]);

        // Obtener la lista actualizada de carpetas
        $notifications = Notification::all();

        // Devolver la vista de carpetas con los datos actualizados usando Inertia
        return Inertia::render('Notifications/index', [
            'notifications' => $notifications,
            'success' => 'Carpeta creada exitosamente.'
        ]);
    }

    public function update(Request $request, Notification $notification)
    {
        $validatedData = $request->validate([
            'mensaje' => 'required|string|max:255',
            'fecha_envio' => 'required|date',
        ]);

        $notification->update($validatedData);

        return Inertia::render('Notifications/index', [
            'notifications' => Notification::all(),
            'success' => 'Notificacion actualizada exitosamente.'
        ]);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return Inertia::render('Notifications/index');
    }

}
