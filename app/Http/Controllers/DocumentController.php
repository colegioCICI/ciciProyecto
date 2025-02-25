<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class DocumentController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
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
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'tipo_documento' => 'required|string|max:255',
            'fecha_subida' => 'required|date',
        ]);

        // Crear un nuevo documento
        $notification = Document::create([
            'tipo_documento' => $validatedData['tipo_documento'],
            'fecha_subida' => $validatedData['fecha_subida'],
        ]);

        // Obtener la lista actualizada de carpetas
        $documents = Document::all();

        // Devolver la vista de carpetas con los datos actualizados usando Inertia
        return Inertia::render('Documents/index', [
            'documents' => $documents,
            'success' => 'Documento creado exitosamente.'
        ]);
    }

    public function uploadFile(Request $request) {
        $request->validate([
            'file' => 'required|file|max:10240', // Máximo 10MB
            'document_id' => 'required|exists:documents,document_id'
        ]);
        
        $document = Document::findOrFail($request->document_id);
            
        // Ruta de almacenamiento en el disco C:
        $storagePath = 'C:\\DocumentosCICI\\';
        
        // Guardar el archivo
        $file = $request->file('file');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        
        // Configurar la zona horaria de Ecuador
        $timestamp = now()->setTimezone('America/Guayaquil')->format('YmdHis');
        
        $fileName = $originalName . '_' . $timestamp . '.' . $extension;
        $file->move($storagePath, $fileName);
        
        // Guardar la ruta en la base de datos
        $document->update([
            'archivo' => $storagePath . $fileName
        ]);
        
        return redirect()->back()->with('success', 'Archivo subido correctamente');
    }

    
 

    public function viewFile($id) {
        $document = Document::findOrFail($id);

    if (empty($document->archivo) || !file_exists($document->archivo)) {
        abort(404, 'Archivo no encontrado.');
    }

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
        'archivo' => 'nullable|file' // Opcional, solo si se sube un nuevo archivo
    ]);

        $document->update($validatedData);

    return redirect()->back()->with('success', 'Documento actualizado exitosamente.');
}


    public function destroy(Document $document)
    {
        $document->delete();

        return Inertia::render('Documents/index');
    }
}
