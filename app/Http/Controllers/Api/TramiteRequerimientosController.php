<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use Illuminate\Http\Request;

class TramiteRequerimientosController extends Controller
{
    /**
     * Obtener los documentos asociados a un trámite basado en el campo "tramite".
     *
     * @param  string  $tramite
     * @return \Illuminate\Http\Response
     */
    public function getDocumentosPorTramite($tramite)
    {
        // Buscar el trámite por el campo "tramite" y cargar la relación de documentos
        $folder = Folder::with('documents')
            ->where('tramite', $tramite)
            ->first();

        // Verificar si el trámite existe
        if (!$folder) {
            return response()->json([
                'message' => 'No se encontró el trámite especificado.',
            ], 404);
        }

        // Retornar solo los campos document_id, tipo_documento y archivo
        return response()->json([
            'tramite_CICI' => $folder->tramite, // Nombre del trámite
            'documentos_CICI' => $folder->documents->map(function ($document) {
                return [
                    'id_documento_CICI' => $document->document_id,
                    'tipo_documento_CICI' => $document->tipo_documento,
                    'archivo_CICI' => $document->archivo,
                ];
            }),
        ], 200);
    }

    /**
     * Obtener los emails de propietario e ingeniero asociados a un trámite basado en el campo "tramite".
     *
     * @param  string  $tramite
     * @return \Illuminate\Http\Response
     */
    public function getEmailsPorTramite($tramite)
    {
        // Buscar la carpeta por el campo "tramite"
        $folder = Folder::where('tramite', $tramite)->first();

        // Verificar si el trámite (carpeta) existe
        if (!$folder) {
            return response()->json([
                'message' => 'No se encontró el trámite especificado.',
            ], 404);
        }

        // Retornar los emails
        return response()->json([
            'tramite' => $folder->tramite, // Nombre del trámite
            'emails_CICI' => [
                'email_propietario_CICI' => $folder->email_propietario ?? null, // Devuelve null si es nulo en la BD
                'email_ingeniero_CICI' => $folder->email_ingeniero ?? null,   // Devuelve null si es nulo en la BD
            ],
        ], 200);
    }
    
    
}