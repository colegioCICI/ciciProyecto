<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Review extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;
    protected $primaryKey = 'review_id';
    protected $fillable = [
        'estado',
        'fecha_estado',
        'document_id',
    ];

    //Relacion uno a muchos inversa
    public function document()
    {
        return $this->belongsTo('App\Models\Document', 'document_id');
    }
    //Relacion de uno a muchos
    public function observations()
    {
        return $this->hasMany('App\Models\Observation', 'review_id');
    }

    //Relacion de uno a muchos
    public function correction()
    {
        return $this->hasMany('App\Models\Correction', 'review_id');
    }

    //Funcion para traer las observaciones con las revisiones
    public static function getObservationWithReview()
    {
        return self::with(['observations', 'document.folder'])  // Incluimos document y la carpeta (folder) relacionada
            ->whereNotNull('document_id')
            ->get()
            ->map(function ($review) {
                // Obtenemos la primera observación si está disponible
                $firstObservation = $review->observations->first();

                return [
                    "review_id" => $review->review_id,
                    "estado" => $review->estado,
                    "fecha_estado" => $review->fecha_estado,
                    "document_id" => $review->document_id,
                    "tipo_documento" => $review->document ? $review->document->tipo_documento : 'Documento no encontrado',
                    "fecha_subida" => $review->document ? $review->document->fecha_subida : 'Fecha no disponible',
                    "tramite" => $review->document && $review->document->folder ? $review->document->folder->tramite : 'Trámite no encontrado',  // Acceso a tramite
                    "folder_id" => $review->document && $review->document->folder ? $review->document->folder->folder_id : 'Trámite no encontrado',  // Acceso a tramite

                    // Mapeamos todas las observaciones
                    "observations" => $review->observations->map(function ($observation) {
                        return [
                            "nombre_observacion" => $observation->nombre_observacion,
                            "descripcion" => $observation->descripcion,
                        ];
                    }),

                    // Nuevos campos: primer nombre de observación y primera descripción
                    "first_observation_name" => $firstObservation ? $firstObservation->nombre_observacion : 'Sin observaciones',
                    "first_observation_description" => $firstObservation ? $firstObservation->descripcion : 'Sin descripción',
                ];
            });
    }


    public static function getReviewsByDocumentId($documentId)
    {
        return self::with(['observations', 'document.folder'])  // Incluimos las relaciones necesarias
            ->where('document_id', $documentId)  // Filtramos por el document_id recibido
            ->get()
            ->map(function ($review) {
                // Obtenemos la primera observación si está disponible
                $firstObservation = $review->observations->first();

                return [
                    "review_id" => $review->review_id,
                    "estado" => $review->estado,
                    "fecha_estado" => $review->fecha_estado,
                    "document_id" => $review->document_id,
                    "tipo_documento" => $review->document ? $review->document->tipo_documento : 'Documento no encontrado',
                    "fecha_subida" => $review->document ? $review->document->fecha_subida : 'Fecha no disponible',
                    "tramite" => $review->document && $review->document->folder ? $review->document->folder->tramite : 'Trámite no encontrado',
                    "folder_id" => $review->document && $review->document->folder ? $review->document->folder->folder_id : 'Trámite no encontrado',

                    // Mapeamos todas las observaciones
                    "observations" => $review->observations->map(function ($observation) {
                        return [
                            "nombre_observacion" => $observation->nombre_observacion,
                            "descripcion" => $observation->descripcion,
                        ];
                    }),

                    // Nuevos campos: primer nombre de observación y primera descripción
                    "first_observation_name" => $firstObservation ? $firstObservation->nombre_observacion : 'Sin observaciones',
                    "first_observation_description" => $firstObservation ? $firstObservation->descripcion : 'Sin descripción',
                ];
            });
    }
}
