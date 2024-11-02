<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Folder extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;
    protected $primaryKey = 'folder_id';
    protected $fillable = [
        'fecha_ingreso',
        'tramite',
        'nombre_propietario',
        'ficha',
        'cedula',
        'nombre_quiendeja',
        'estado_carpeta',
        'email_propietario',
        'email_ingeniero',
        'nombre_quienretira',
        'fecha_retiro',
        'numero_ingreso',
        'user_id',
    ];
    //Relacion uno a muchos inversa
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    //Relacion de uno a muchos
    public function notifications()
    {
        return $this->hasMany('App\Models\Notification', 'folder_id');
    }

    //Relacion de uno a muchos
    public function facturas()
    {
        return $this->hasMany('App\Models\Factura', 'folder_id');
    }

    //Relacion de uno a muchos
    public function documents()
    {
        return $this->hasMany('App\Models\Document', 'folder_id');
    }

    public static function getDocumentsWithFolders()
    {
        return self::with(['user', 'documents', 'facturas'])  // Carga las relaciones 'user' y 'documents'
            ->get()
            ->map(function ($folder) {
                // Obtenemos la primera factura si está disponible
                $firstFactura = $folder->facturas->first();

                return [
                    "folder_id" => $folder->folder_id,
                    "fecha_ingreso" => $folder->fecha_ingreso,
                    "tramite" => $folder->tramite,
                    "nombre_propietario" => $folder->nombre_propietario,
                    "ficha" => $folder->ficha,
                    "cedula" => $folder->cedula,
                    "nombre_quiendeja" => $folder->nombre_quiendeja,
                    "estado_carpeta" => $folder->estado_carpeta,
                    "email_propietario" => $folder->email_propietario,
                    "email_ingeniero" => $folder->email_ingeniero,
                    "nombre_quienretira" => $folder->nombre_quienretira,
                    "fecha_retiro" => $folder->fecha_retiro,
                    "numero_ingreso" => $folder->numero_ingreso,
                    "user_id" => $folder->user_id,
                    "nombre_usuario" => $folder->user ? $folder->user->name : 'Usuario no asignado',
                    "documents" => $folder->documents->map(function ($document) {
                        return [
                            "document_id" => $document->document_id,
                            "tipo_documento" => $document->tipo_documento,
                            "fecha_subida" => $document->fecha_subida,
                        ];
                    }),

                    // Datos de la primera factura si está disponible
                    "factura_id" => $firstFactura ? $firstFactura->factura_id : 'sin valor',
                    "fecha_factura" => $firstFactura ? $firstFactura->fecha_factura : 'sin valor',
                    "tramite_factura" => $firstFactura ? $firstFactura->tramite_factura : 'sin valor',
                    "direccion_inmueble" => $firstFactura ? $firstFactura->direccion_inmueble : 'sin valor',
                    "numero_factura" => $firstFactura ? $firstFactura->numero_factura : 'sin valor',
                    "aprobacion" => $firstFactura ? $firstFactura->aprobacion : 'sin valor',
                    "porcentaje_cici" => $firstFactura ? $firstFactura->porcentaje_cici : 'sin valor',
                    "microfilm" => $firstFactura ? $firstFactura->microfilm : 'sin valor',
                    "total" => $firstFactura ? $firstFactura->total : 'sin valor',
                    "especie" => $firstFactura ? $firstFactura->especie : 'sin valor',
                    "formularios" => $firstFactura ? $firstFactura->formularios : 'sin valor',
                    "valor_cobrado" => $firstFactura ? $firstFactura->valor_cobrado : 'sin valor',
                    "tipo" => $firstFactura ? $firstFactura->tipo : 'sin valor',

                ];
            });
    }
}
