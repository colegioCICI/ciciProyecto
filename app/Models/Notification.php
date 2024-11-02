<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Notification extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;
    protected $primaryKey = 'notification_id';
    protected $fillable = [
        'mensaje',
        'fecha_envio',
        'folder_id',
    ];

    //Relacion uno a muchos inversa (esto en notification)
    public function folders()
    {
        return $this->belongsTo('App\Models\Folder','folder_id');
    }

    //Obtener las notificaciones con su carpeta
    public static function getNotificationWithFolder()
    {
        return self::with(['folders'])
            ->whereNotNull('folder_id')  // Filtra las notificaciones que tienen carpeta
            ->get()
            ->map(function ($notification) {
                return [
                    "notification_id" => $notification->notification_id,
                    "mensaje" => $notification->mensaje,
                    "fecha_envio" => $notification->fecha_envio,
                    "folder_id" => $notification->folder_id,
                    "tramite" => $notification->folders ? $notification->folders->tramite : 'Tramite no encontrado',
                    "nombre_propietario" => $notification->folders ? $notification->folders->nombre_propietario : 'Nombre no encontrado',
                    "nombre_quiendeja" => $notification->folders ? $notification->folders->nombre_quiendeja : 'Nombre no encontrado',
                    "email_propietario" => $notification->folders ? $notification->folders->email_propietario : 'Dato no encontrado',
                    "email_ingeniero" => $notification->folders ? $notification->folders->email_ingeniero : 'Dato no encontrado',
                ];
            });
    }
}
