<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Observation extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;
    protected $primaryKey = 'observation_id';
    protected $fillable = [
        'nombre_observacion',
        'descripcion',
        'review_id',
    ];

    //Relacion uno a muchos inversa
    public function review()
    {
        return $this->belongsTo('App\Models\Review', 'review_id');
    }

    public static function getObservationDetails()
    {
        return self::with(['review.document.folder'])  // Relaciones encadenadas
            ->get()
            ->map(function ($observation) {
                return [
                    'observation_id'=> $observation->observation_id,
                    'nombre_observacion' => $observation->nombre_observacion ? $observation->nombre_observacion: 'Observación sin nombre',
                    'descripcion' => $observation->descripcion ? $observation->descripcion : 'Observación sin descripción' ,
                    'fecha_estado' => $observation->review ? $observation->review->fecha_estado : 'Fecha no disponible',
                    'tramite' => $observation->review && $observation->review->document && $observation->review->document->folder
                        ? $observation->review->document->folder->tramite
                        : 'Trámite no encontrado',
                    'nombre_propietario' => $observation->review && $observation->review->document && $observation->review->document->folder
                        ? $observation->review->document->folder->nombre_propietario
                        : 'Propietario no encontrado',
                ];
            });
    }
}
