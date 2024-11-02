<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Factura extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;

    protected $primaryKey = 'factura_id';

    protected $fillable = [
        'fecha_factura',
        'tramite_factura',
        'folder_id',
        'direccion_inmueble',
        'numero_factura',
        'aprobacion',
        'porcentaje_cici',
        'microfilm',
        'total',
        'especie',
        'formularios',
        'valor_cobrado',
        'tipo',
    ];

    //Relacion uno a muchos inversa (esto en factura)
    public function folders()
    {
        return $this->belongsTo('App\Models\Folder', 'folder_id');
    }

    //

    public static function getFacturas()
    {
        return self::with(['folders'])
            ->get()
            ->map(function ($factura) {
                return [
                    'factura_id' => $factura->factura_id,
                    'fecha_factura' => $factura->fecha_factura,
                    'tramite_factura' => $factura->tramite_factura,
                    'folder_id' => $factura->folder_id,
                    'direccion_inmueble' => $factura->direccion_inmueble,
                    'numero_factura' => $factura->numero_factura,
                    'aprobacion' => $factura->aprobacion,
                    'porcentaje_cici' => $factura->porcentaje_cici,
                    'microfilm' => $factura->microfilm,
                    'total' => $factura->total,
                    'especie' => $factura->especie,
                    'formularios' => $factura->formularios,
                    'valor_cobrado' => $factura->valor_cobrado,
                    'tipo' => $factura->tipo,
                    'nombre_propietario' => $factura->folders ? $factura->folders->nombre_propietario : 'Nombre no encontrado',
                    'cedula' => $factura->folders ? $factura->folders->cedula : 'Dato no encontrado',
                    'estado_carpeta' => $factura->folders ? $factura->folders->estado_carpeta : 'Dato no encontrado',
                ];
            });
    }
}
