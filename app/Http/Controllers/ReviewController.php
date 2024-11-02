<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use App\Models\Review;
use App\Models\Observation;
use App\Models\Correction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $reviews = Review::getObservationWithReview();
        $document = Document::getDocumentsWithFoldersWithReviews();
        $observations = Observation::all();
        $corrections = Correction::all();
        $folders = Folder::getDocumentsWithFolders(); // Usar la función personalizada que incluye documentos y usuarios
        $usuariosRoles = User::getPermissionAuthUser();

        return Inertia::render('Reviews/index', [
            'reviews' => $reviews,
            'folders' => $folders,
            'observations' => $observations,
            'corrections' => $corrections,
            'document' => $document,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI,
        ]);
    }
    //Obtener todas las revisiones que correspondan con el id del documento pasada desde document
    public function show($id)
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $document = Document::where('document_id', $id)->first();  // Obtiene el documento específico
        $reviews = Review::getReviewsByDocumentId($id);  // Obtiene las revisiones relacionadas con el documento
        $observations = Observation::all();
        $corrections = Correction::all();
        $folders = Folder::getDocumentsWithFolders(); // Obtiene las carpetas con documentos
        $usuariosRoles = User::getPermissionAuthUser();

        return Inertia::render('Reviews/index', [
            'document' => $document,
            'observations' => $observations,
            'corrections' => $corrections,
            'folders' => $folders,
            'reviews' => $reviews,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI,
        ]);
    }


    public function store(Request $request)
    {
        //Definir mensajes para validación de campos
        $messages = [
            'fecha_estado.required' => 'La fecha es obligatoria',
            'fecha_estado.date' => 'La fecha debe ser una fecha válida',

            'estado.required' => 'El campo estado es obligatorio',
            'estado.string' => 'El campo estado debe ser texto',
        ];
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'estado' => 'required|string|max:255',
            'fecha_estado' => 'required|date',
            'document_id' => 'required|exists:documents,document_id',  // Validar que 'document_id' existe
            'nombre_observacion' => 'nullable|string|max:255' ?? null,
            'descripcion' => 'nullable|string|max:255' ?? null,
        ], $messages);

        // Crear una nueva revisión y asociarla con el documento
        $review = Review::create([
            'estado' => $validatedData['estado'],
            'fecha_estado' => $validatedData['fecha_estado'],
            'document_id' => $validatedData['document_id'],  // Guardar correctamente el document_id
        ]);
        $observation = Observation::create([
            'nombre_observacion' => $validatedData['nombre_observacion'],
            'descripcion' => $validatedData['descripcion'],
            'review_id' => $review->review_id,
        ]);
        // Redireccionar a la vista de revisiones del documento con el ID del documento
        return Inertia::location(route("reviews.show", $validatedData['document_id']));
    }

    public function update(Request $request, Review $review)
    {
        $messages = [
            'fecha_estado.required' => 'La fecha es obligatoria',
            'fecha_estado.date' => 'La fecha debe ser una fecha válida',

            'estado.required' => 'El campo estado es obligatorio',
            'estado.string' => 'El campo estado debe ser texto',
        ];

        // Validar los datos entrantes
        $validatedData = $request->validate([
            'estado' => 'required|string|max:255',
            'fecha_estado' => 'required|date',
            'nombre_observacion' => 'nullable|string|max:255' ?? null,
            'descripcion' => 'nullable|string|max:255' ?? null,
        ], $messages);

        // Actualizar la revisión con los datos validados
        $review->update([
            'estado' => $validatedData['estado'],
            'fecha_estado' => $validatedData['fecha_estado'],
        ]);

        // Buscar la observación asociada con la revisión, si existe
        $observation = Observation::where('review_id', $review->review_id)->first();

        // Verificar si ambos campos están vacíos o son null
        $bothFieldsEmpty = empty($validatedData['nombre_observacion']) && empty($validatedData['descripcion']);

        if ($bothFieldsEmpty) {
            // Si ambos campos están vacíos y existe una observación, eliminarla
            if ($observation) {
                $observation->delete();
            }
        } else {
            // Si al menos uno de los campos tiene valor
            if ($observation) {
                // Si existe la observación, actualizarla
                $observation->update([
                    'nombre_observacion' => $validatedData['nombre_observacion'],
                    'descripcion' => $validatedData['descripcion'],
                ]);
            } else {
                // Si no existe la observación, crear una nueva
                Observation::create([
                    'nombre_observacion' => $validatedData['nombre_observacion'],
                    'descripcion' => $validatedData['descripcion'],
                    'review_id' => $review->review_id,
                ]);
            }
        }

        // return Inertia::render('Reviews/index');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return Inertia::render('Reviews/index');
    }
}
