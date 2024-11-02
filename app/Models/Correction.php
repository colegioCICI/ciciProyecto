<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Correction extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    use HasFactory;
    protected $primaryKey = 'correction_id';
    protected $fillable = [
        'estado_corrección',
        'fecha_corrección',
    ];

    //Relacion uno a muchos inversa
    public function review(){
        return $this->belongsTo('App\Models\Review');
    }
}
