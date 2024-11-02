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

    public function update(Request $request, Document $document)
    {
        $validatedData = $request->validate([
            'tipo_documento' => 'required|string|max:255',
            'fecha_subida' => 'required|date',
        ]);

        $document->update($validatedData);

        return Inertia::render('Documents/index', [
            'notifications' => Document::all(),
            'success' => 'Documento actualizado exitosamente.'
        ]);
    }


    public function destroy(Document $document)
    {
        $document->delete();

        return Inertia::render('Documents/index');
    }
}
