<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Document extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    use HasFactory;

    protected $primaryKey = 'document_id';
    protected $fillable = [
        'tipo_documento',
        'fecha_subida',
        'folder_id',
        'archivo',
    ];

    //Relacion uno a muchos inversa
    public function folder()
    {
        return $this->belongsTo('App\Models\Folder', 'folder_id');
    }

    //Relacion de uno a muchos
    public function reviews()
    {
        return $this->hasMany('App\Models\Review', 'document_id');
    }

    public static function getDocumentsWithFoldersWithReviews()
    {
        return self::with(['folder', 'reviews'])  // Carga las relaciones 'folder' y 'review'
            ->orderBy('document_id', 'desc')
            ->get()
            ->map(function ($document) {
                return [
                    "document_id" => $document->document_id,
                    "tipo_documento" => $document->tipo_documento,
                    "fecha_subida" => $document->fecha_subida,
                    "folder_id" => $document->folder_id,
                    "archivo" => $document->archivo,
                    "tramite" => $document->folder ? $document->folder->tramite : 'Tramite no asignado',
                    "reviews" => $document->reviews->map(function ($review) {
                        return [
                            "review_id" => $review->review_id,
                            "estado" => $review->estado,
                            "fecha_estado" => $review->fecha_estado,
                            "document_id" => $review->document_id,
                        ];
                    }),
                ];
            });
    }

}
