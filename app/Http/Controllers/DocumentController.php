<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Document;
use App\Models\User;
use App\Services\RabbitMQService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentController extends Controller
{
    private RabbitMQService $rabbitMQService;

    public function __construct()
    {
        $this->rabbitMQService = new RabbitMQService('producer');
    }


    public function index()
    {
        $logoCICI = asset('CICI.png');
        $folders = Folder::getDocumentsWithFolders();
        $documents = Document::all();
        $usuariosRoles = User::getPermissionAuthUser();
        
        return Inertia::render('Documents/index',[
            'documents'=> $documents,
            'folders'=>$folders,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI, 
        ]);
    }

    public function pdf(){
        $documents = Document::all();
        $usuariosRoles = User::getPermissionAuthUser();
        $pdf = PDF::loadView('pdf.documents', compact('documents'));

        return $pdf->stream();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tipo_documento' => 'required|string|max:255',
            'fecha_subida' => 'required|date',
        ]);

        $document = Document::create([
            'tipo_documento' => $validatedData['tipo_documento'],
            'fecha_subida' => $validatedData['fecha_subida'],
        ]);

        // 📤 Evento para INNOVA-EP - DOCUMENTO CREADO EN CICI
        $this->rabbitMQService->publish('innovaepp_events', 'cici.documento.creado', [
            'event' => 'documento.creado',
            'sistema_origen' => 'CICI',
            'entidad' => 'DOCUMENTO',
            'accion' => 'CREACION',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'document_id' => $document->document_id,
                'tipo_documento' => $document->tipo_documento,
                'fecha_subida' => $document->fecha_subida,
                'folder_id' => $document->folder_id,
            ]
        ]);

        return Inertia::render('Documents/index', [
            'documents' => Document::all(),
            'success' => 'Documento creado exitosamente.'
        ]);
    }

    public function uploadFile(Request $request) 
{
    try {
        $request->validate([
            'file' => 'required|file|max:10240',
            'document_id' => 'required|exists:documents,document_id'
        ]);

        $document = Document::findOrFail($request->document_id);
        $folder_id = $document->folder_id; 
        $Folder = Folder::findOrFail($folder_id);
        $tramites = $Folder->tramite; 

        $storagePath = "C:\\DocumentosCICI\\{$tramites}";

        // Crear directorio si no existe
        if (!file_exists($storagePath)) {
            if (!mkdir($storagePath, 0777, true)) {
                throw new \Exception("No se pudo crear el directorio: {$storagePath}");
            }
        }

        $file = $request->file('file');
        
        // Validar que el archivo sea válido
        if (!$file->isValid()) {
            throw new \Exception("Archivo inválido: " . $file->getError());
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->setTimezone('America/Guayaquil')->format('YmdHis');
        $fileName = "{$originalName}_{$timestamp}.{$extension}";
        
        // 📌 Obtener metadata ANTES de mover el archivo
        $fileSize = $file->getSize();
        $mimeType = $file->getMimeType();

        // Mover archivo
        $file->move($storagePath, $fileName);

        // Verificar que el archivo se movió correctamente
        $fullPath = "{$storagePath}\\{$fileName}";
        if (!file_exists($fullPath)) {
            throw new \Exception("El archivo no se movió correctamente a: {$fullPath}");
        }

        // Actualizar documento en base de datos
        $document->update([
            'archivo' => $fullPath
        ]);

        // 📤 Evento para INNOVA-EP - ARCHIVO SUBIDO EN CICI
        $this->rabbitMQService->publish('innovaepp_events', 'cici.archivo.subido', [
            'event' => 'archivo.subido',
            'sistema_origen' => 'CICI',
            'entidad' => 'ARCHIVO',
            'accion' => 'SUBIDA',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'document_id' => $document->document_id,
                'folder_id' => $document->folder_id,
                'tramite' => $tramites,
                'nombre_archivo' => $fileName,
                'tipo_documento' => $document->tipo_documento,
                'tamaño_archivo' => $fileSize,
                'tipo_mime' => $mimeType,
                'ruta_almacenamiento' => $storagePath,
                'estado' => 'SUBIDA_EXITOSA'
            ]
        ]);

        return redirect()->back()->with('success', 'Archivo subido correctamente');

    } catch (\Exception $e) {
        // 📤 Evento de ERROR para INNOVA-EP
        $this->rabbitMQService->publish('innovaepp_events', 'cici.archivo.error', [
            'event' => 'archivo.error',
            'sistema_origen' => 'CICI',
            'entidad' => 'ARCHIVO',
            'accion' => 'ERROR_SUBIDA',
            'severidad' => 'ALTA',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'document_id' => $request->document_id ?? 'desconocido',
                'error' => $e->getMessage(),
                'archivo_original' => $request->file('file')?->getClientOriginalName() ?? 'desconocido'
            ]
        ]);

        Log::error('Error subiendo archivo en CICI: ' . $e->getMessage(), [
            'document_id' => $request->document_id,
            'user_id' => auth()->id(),
            'error' => $e->getMessage()
        ]);

        return redirect()->back()->with('error', 'Error al subir el archivo: ' . $e->getMessage());
    }
}

    public function viewFile($id) 
    {
        $document = Document::findOrFail($id);

        if (empty($document->archivo) || !file_exists($document->archivo)) {
            abort(404, 'Archivo no encontrado.');
        }

        // 📤 Evento para INNOVA-EP - ARCHIVO DESCARGADO/VISTO
        $this->rabbitMQService->publish('innovaepp_events', 'cici.archivo.descargado', [
            'event' => 'archivo.descargado',
            'sistema_origen' => 'CICI',
            'entidad' => 'ARCHIVO',
            'accion' => 'DESCARGA',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'document_id' => $document->document_id,
                'folder_id' => $document->folder_id,
                'nombre_archivo' => basename($document->archivo),
                'tipo_documento' => $document->tipo_documento
            ]
        ]);

        return response()->download($document->archivo, basename($document->archivo), [
            'Content-Type' => 'application/octet-stream',
            'Content-Disposition' => 'attachment; filename="' . basename($document->archivo) . '"'
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $validatedData = $request->validate([
            'tipo_documento' => 'required|string|max:255',
            'fecha_subida' => 'required|date',
            'archivo' => 'nullable|file'
        ]);

        $tipoDocumentoAnterior = $document->tipo_documento;

        $document->update($validatedData);

        // 📤 Evento para INNOVA-EP - DOCUMENTO ACTUALIZADO EN CICI
        $this->rabbitMQService->publish('innovaepp_events', 'cici.documento.actualizado', [
            'event' => 'documento.actualizado',
            'sistema_origen' => 'CICI',
            'entidad' => 'DOCUMENTO',
            'accion' => 'ACTUALIZACION',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'document_id' => $document->document_id,
                'folder_id' => $document->folder_id,
                'tipo_documento_anterior' => $tipoDocumentoAnterior,
                'tipo_documento_nuevo' => $document->tipo_documento,
                'fecha_actualizacion' => $document->fecha_subida
            ],
            'cambios' => [
                'tipo_documento' => $tipoDocumentoAnterior !== $document->tipo_documento
            ]
        ]);

        return redirect()->back()->with('success', 'Documento actualizado exitosamente.');
    }

    public function destroy(Document $document)
    {
        $documentData = [
            'document_id' => $document->document_id,
            'folder_id' => $document->folder_id,
            'tipo_documento' => $document->tipo_documento,
            'archivo' => $document->archivo
        ];

        $document->delete();

        // 📤 Evento para INNOVA-EP - DOCUMENTO ELIMINADO EN CICI
        $this->rabbitMQService->publish('innovaepp_events', 'cici.documento.eliminado', [
            'event' => 'documento.eliminado',
            'sistema_origen' => 'CICI',
            'entidad' => 'DOCUMENTO',
            'accion' => 'ELIMINACION',
            'timestamp' => now()->toISOString(),
            'datos' => $documentData
        ]);

        return Inertia::render('Documents/index', [
            'documents' => Document::all(),
            'success' => 'Documento eliminado exitosamente.'
        ]);
    }

    public function download($id)
    {
        $document = Document::findOrFail($id);
        $filePath = $document->archivo;

        if (file_exists($filePath)) {
            
            // 📤 Evento para INNOVA-EP - ARCHIVO DESCARGADO
            $this->rabbitMQService->publish('innovaepp_events', 'cici.archivo.descargado', [
                'event' => 'archivo.descargado',
                'sistema_origen' => 'CICI',
                'entidad' => 'ARCHIVO',
                'accion' => 'DESCARGA',
                'timestamp' => now()->toISOString(),
                'datos' => [
                    'document_id' => $document->document_id,
                    'folder_id' => $document->folder_id,
                    'nombre_archivo' => basename($filePath),
                    'tipo_documento' => $document->tipo_documento
                ]
            ]);

            return response()->download($filePath, basename($filePath));
        }

        return response()->json(['error' => 'Archivo no encontrado'], 404);
    }
}