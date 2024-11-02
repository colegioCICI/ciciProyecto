<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail; // Importar Mail
use App\Mail\NotificacionMail; // Importar el mailable NotificacionMail

class EmailController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'folder_id' => 'required|exists:folders,folder_id',
            'mensaje' => 'required|string',
            'fecha_envio' => 'required|date',
            'email_propietario' => 'required|email',
            'email_ingeniero' => 'required|email',
        ]);

        $folder = Folder::findOrFail($request->folder_id);

        // Crear nueva notificación
        $notification = new Notification([
            'mensaje' => $request->mensaje,
            'fecha_envio' => $request->fecha_envio,
            'folder_id' => $folder->folder_id,
        ]);
        $notification->save();

        // Enviar correo al propietario
        $this->sendMailTo($request->email_propietario, $folder, $request->mensaje);

        // Enviar correo al ingeniero
        $this->sendMailTo($request->email_ingeniero, $folder, $request->mensaje);

        return redirect()->back()->with('success', 'Correos enviados con éxito.');
    }

    private function sendMailTo($email, $folder, $mensaje)
    {
        $detalles = [
            'tramite' => $folder->tramite,
            'nombre_propietario' => $folder->nombre_propietario,
            'nombre_quiendeja' => $folder->nombre_quiendeja,
            'mensaje' => $mensaje,
        ];

        Mail::to($email)->send(new NotificacionMail($detalles));
    }
}
