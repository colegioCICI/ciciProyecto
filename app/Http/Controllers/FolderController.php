<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use App\Models\Factura;
use App\Models\User;
use App\Services\RabbitMQService;
use Inertia\Inertia;

use Illuminate\Http\Request;

class FolderController extends Controller
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
        $users = User::all();
        $usuariosRoles = User::getPermissionAuthUser();

        return Inertia::render('Folders/index', [
            'folders' => $folders,
            'users' => $users,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI,
        ]);
    }


    public function store(Request $request)
    {
        //Definir mensajes para validación de campos
        $messages = [

            'tramite.required' => 'El numero interno es obligatorio',
            'tramite.string' => 'El numero interno debe ser texto',

            'tramite_ca.required' => 'El tramite CAE es obligatorio',
            'tramite_ca.string' => 'El tramite CAE debe ser texto',

            'numero_ingreso.required' => 'El número de ingreso es obligatorio',
            'numero_ingreso.integer' => 'El número de ingreso debe ser un número entero',
            'numero_ingreso.min' => 'El número de ingreso debe ser mayor o igual a 1',

            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria',
            'fecha_ingreso.date' => 'La fecha de ingreso debe ser una fecha válida',

            'tramite_factura.required' => 'El número de trámite de la factura es obligatorio',
            'tramite_factura.integer' => 'El número de trámite de la factura debe ser un número entero',

            'nombre_propietario.required' => 'El nombre del propietario es obligatorio',
            'nombre_propietario.string' => 'El nombre del propietario debe ser texto',
            'nombre_propietario.max' => 'El nombre del propietario no debe exceder los 255 caracteres',

            'ficha.required' => 'El número de ficha es obligatorio',
            'ficha.integer' => 'El número de ficha debe ser un número entero',
            'ficha.min' => 'El número de ficha debe ser mayor o igual a 1',

            'cedula.required' => 'El número de cédula es obligatorio',
            'cedula.string' => 'El número de cédula debe ser texto',
            'cedula.max' => 'El número de cédula no debe exceder los 255 caracteres',

            'nombre_quiendeja.required' => 'El nombre de quien deja es obligatorio',
            'nombre_quiendeja.string' => 'El nombre de quien deja debe ser texto',
            'nombre_quiendeja.max' => 'El nombre de quien deja no debe exceder los 255 caracteres',

            'estado_carpeta.required' => 'El estado de la carpeta es obligatorio',
            'estado_carpeta.string' => 'El estado de la carpeta debe ser texto',
            'estado_carpeta.max' => 'El estado de la carpeta no debe exceder los 255 caracteres',

            'email_propietario.required' => 'Ingrese el correo electronico del propietario',
            'email_ingeniero.required' => 'Ingrese el correo electronico del ingeniero',
            'email_propietario.email' => 'El email del propietario debe ser una dirección de correo válida',
            'email_ingeniero.email' => 'El email del ingeniero debe ser una dirección de correo válida',

            'nombre_quienretira.string' => 'El nombre de quien retira debe ser texto',
            'nombre_quienretira.max' => 'El nombre de quien retira no debe exceder los 255 caracteres',

            'fecha_retiro.date' => 'La fecha de retiro debe ser una fecha válida',

            'user_id.exists' => 'Asigne a un responsable',

            'documents.required' => 'Debe proporcionar al menos un documento',
            'documents.array' => 'Los documentos deben ser proporcionados en forma de lista',
            'documents.*.required' => 'Cada documento en la lista es obligatorio',
            'documents.*.string' => 'Cada documento debe ser una cadena de texto',
        ];

        // Validar los datos del formulario, incluyendo los documentos seleccionados
        $validatedData = $request->validate([
            'fecha_ingreso' => 'required|date',
            'tramite' => 'required|string',
            'tramite_ca' => 'required|string',
            'tramite_factura' => 'required|integer',
            'nombre_propietario' => 'required|string|max:255',
            'ficha' => 'required|integer|min:1',
            'cedula' => 'required|string|max:255',
            'nombre_quiendeja' => 'required|string|max:255',
            'estado_carpeta' => 'required|string|max:255',
            'email_propietario' => 'required|email',
            'email_ingeniero' => 'required|email',
            'nombre_quienretira' => 'nullable|string|max:255',
            'fecha_retiro' => 'nullable|date',
            'numero_ingreso' => 'required|integer|min:1',
            'user_id' => 'nullable|exists:users,id',
            'documents' => 'required|array',
            'documents.*' => 'required|string',
        ], $messages);

        $folder = Folder::create([
            'fecha_ingreso' => $validatedData['fecha_ingreso'],
            'tramite' => $validatedData['tramite'],
            'tramite_ca' => $validatedData['tramite_ca'],
            'nombre_propietario' => $validatedData['nombre_propietario'],
            'ficha' => $validatedData['ficha'],
            'cedula' => $validatedData['cedula'],
            'nombre_quiendeja' => $validatedData['nombre_quiendeja'],
            'estado_carpeta' => $validatedData['estado_carpeta'],
            'email_propietario' => $validatedData['email_propietario'] ?? null,
            'email_ingeniero' => $validatedData['email_ingeniero'] ?? null,
            'nombre_quienretira' => $validatedData['nombre_quienretira'] ?? null,
            'fecha_retiro' => $validatedData['fecha_retiro'] ?? null,
            'numero_ingreso' => $validatedData['numero_ingreso'],
            'user_id' => $validatedData['user_id'],
        ]);

        $factura = Factura::create([
            'folder_id' => $folder->folder_id,
            'tramite_factura' => $validatedData['tramite_factura'],
        ]);

        foreach ($validatedData['documents'] as $documentType) {
            Document::create([
                'folder_id' => $folder->folder_id,
                'tipo_documento' => $documentType,
                'fecha_subida' => $folder->fecha_ingreso,
            ]);
        }

        // 📤 Evento para INNOVA-EP - CARPETA CREADA
        $this->rabbitMQService->publish('innovaepp_events', 'cici.carpeta.creada', [
            'event' => 'carpeta.creada',
            'sistema_origen' => 'CICI',
            'entidad' => 'CARPETA',
            'accion' => 'CREACION',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'folder_id' => $folder->folder_id,
                'tramite' => $folder->tramite,
                'tramite_ca' => $folder->tramite_ca,
                'nombre_propietario' => $folder->nombre_propietario,
                'cedula' => $folder->cedula,
                'estado_carpeta' => $folder->estado_carpeta,
                'fecha_ingreso' => $folder->fecha_ingreso,
                'email_propietario' => $folder->email_propietario,
                'email_ingeniero' => $folder->email_ingeniero,
                'numero_ingreso' => $folder->numero_ingreso,
                'documentos_asociados' => count($validatedData['documents'])
            ],
            'relaciones' => [
                'tramite_caei' => $folder->tramite_ca,
                'tiene_factura' => true
            ]
        ]);

        return Inertia::render('Folders/index', [
            'folders' => Folder::with('user')->get(),
            'success' => 'Carpeta y documentos creados exitosamente.'
        ]);
    }
    public function update(Request $request,  $id)
    {

        $folder = Folder::findOrFail($id);
        $estadoAnterior = $folder->estado_carpeta;

        //Definir mensajes para validación de campos
        $messages = [

            'fecha_ingreso.date' => 'La fecha de ingreso debe ser una fecha válida',

            'tramite.required' => 'El numero interno es obligatorio',
            'tramite.string' => 'El numero interno debe ser texto',

            'tramite_ca.required' => 'El tramite CAE es obligatorio',
            'tramite_ca.string' => 'El tramite CAE debe ser texto',

            'numero_ingreso.required' => 'El número de ingreso es obligatorio',
            'numero_ingreso.integer' => 'El número de ingreso debe ser un número entero',
            'numero_ingreso.min' => 'El número de ingreso debe ser mayor o igual a 1',

            'fecha_ingreso.required' => 'La fecha de ingreso es obligatoria',

            'tramite_factura.required' => 'El número de trámite es obligatorio',
            'tramite_factura.integer' => 'Ingrese correctamente el número de trámite',

            'nombre_propietario.required' => 'El nombre del propietario es obligatorio',
            'nombre_propietario.string' => 'El nombre del propietario debe ser texto',
            'nombre_propietario.max' => 'El nombre del propietario no debe exceder los 255 caracteres',

            'ficha.required' => 'El número de ficha es obligatorio',
            'ficha.integer' => 'El número de ficha debe ser un número entero',

            'cedula.required' => 'El número de cédula es obligatorio',
            'cedula.string' => 'El número de cédula debe ser texto',
            'cedula.max' => 'El número de cédula no debe exceder los 255 caracteres',

            'nombre_quiendeja.required' => 'El nombre de quien deja es obligatorio',
            'nombre_quiendeja.string' => 'El nombre de quien deja debe ser texto',
            'nombre_quiendeja.max' => 'El nombre de quien deja no debe exceder los 255 caracteres',

            'estado_carpeta.required' => 'El estado de la carpeta es obligatorio',
            'estado_carpeta.string' => 'El estado de la carpeta debe ser texto',
            'estado_carpeta.max' => 'El estado de la carpeta no debe exceder los 255 caracteres',

            'email_propietario.required' => 'Ingrese el correo electronico del propietario',
            'email_ingeniero.required' => 'Ingrese el correo electronico del ingeniero',
            'email_propietario.email' => 'El email del propietario debe ser una dirección de correo válida',
            'email_ingeniero.email' => 'El email del ingeniero debe ser una dirección de correo válida',

            'nombre_quienretira.string' => 'El nombre de quien retira debe ser texto',
            'nombre_quienretira.max' => 'El nombre de quien retira no debe exceder los 255 caracteres',

            'fecha_retiro.date' => 'La fecha de retiro debe ser una fecha válida',

            'user_id.exists' => 'Asigne a un responsable',

            'documents.required' => 'Debe proporcionar al menos un documento',
            'documents.array' => 'Los documentos deben ser proporcionados en forma de lista',
            'documents.*.required' => 'Cada documento en la lista es obligatorio',
            'documents.*.string' => 'Cada documento debe ser una cadena de texto',
        ];

        // Validar los datos del formulario, incluyendo los documentos seleccionados
        $validatedData = $request->validate([
            'fecha_ingreso' => 'required|date',
            'tramite' => 'required|string',
            'tramite_ca' => 'required|string',
            'tramite_factura' => 'required|integer',
            'nombre_propietario' => 'required|string|max:255',
            'ficha' => 'required|integer',
            'cedula' => 'required|string|max:255',
            'nombre_quiendeja' => 'required|string|max:255',
            'estado_carpeta' => 'required|string|max:255',
            'email_propietario' => 'required|email',
            'email_ingeniero' => 'required|email',
            'nombre_quienretira' => 'nullable|string|max:255',
            'fecha_retiro' => 'nullable|date',
            'numero_ingreso' => 'required|integer|min:1',
            'user_id' => 'nullable|exists:users,id',
            'documents' => 'required|array',
            'documents.*' => 'required|string',
        ], $messages);

        $folder->update([
            'fecha_ingreso' => $validatedData['fecha_ingreso'],
            'tramite' => $validatedData['tramite'],
            'tramite_ca' => $validatedData['tramite_ca'],
            'nombre_propietario' => $validatedData['nombre_propietario'],
            'ficha' => $validatedData['ficha'],
            'cedula' => $validatedData['cedula'],
            'nombre_quiendeja' => $validatedData['nombre_quiendeja'],
            'estado_carpeta' => $validatedData['estado_carpeta'],
            'email_propietario' => $validatedData['email_propietario'] ?? null,
            'email_ingeniero' => $validatedData['email_ingeniero'] ?? null,
            'nombre_quienretira' => $validatedData['nombre_quienretira'] ?? null,
            'fecha_retiro' => $validatedData['fecha_retiro'] ?? null,
            'numero_ingreso' => $validatedData['numero_ingreso'],
            'user_id' => $validatedData['user_id'],
        ]);

        // Buscar la factura existente relacionada con la carpeta o crear una nueva si no existe
        $factura = Factura::updateOrCreate(
            ['folder_id' => $folder->folder_id], // Criterio de búsqueda: folder_id
            ['tramite_factura' => $validatedData['tramite_factura']] // Valor a actualizar o crear
        );

        // Actualización de los documentos relacionados
        $documents = $validatedData['documents'];
        foreach ($documents as $documentType) {
            Document::updateOrCreate(
                ['folder_id' => $folder->folder_id, 'tipo_documento' => $documentType], // Criterio de búsqueda
                ['fecha_subida' => $folder->fecha_ingreso] // Información a actualizar o crear
            );
        }

        // Obtener la lista actualizada de carpetas
        $folders = Folder::with('user')->get();
        // 📤 Evento para INNOVA-EP - CARPETA ACTUALIZADA
        $this->rabbitMQService->publish('innovaepp_events', 'cici.carpeta.actualizada', [
            'event' => 'carpeta.actualizada',
            'sistema_origen' => 'CICI',
            'entidad' => 'CARPETA',
            'accion' => 'ACTUALIZACION',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'folder_id' => $folder->folder_id,
                'tramite' => $folder->tramite,
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $folder->estado_carpeta,
                'fecha_retiro' => $folder->fecha_retiro,
                'nombre_quienretira' => $folder->nombre_quienretira
            ],
            'cambios_significativos' => [
                'estado_carpeta' => $estadoAnterior !== $folder->estado_carpeta,
                'fecha_retiro' => !is_null($folder->fecha_retiro)
            ]
        ]);

        return Inertia::render('Folders/index', [
            'folders' => Folder::with('user')->get(),
            'success' => 'Carpeta y documentos actualizados exitosamente.'
        ]);
    }



    public function destroy($id)
    {
        $folder = Folder::find($id);

        // 📤 Evento para INNOVA-EP - CARPETA ELIMINADA
        $this->rabbitMQService->publish('innovaepp_events', 'cici.carpeta.eliminada', [
            'event' => 'carpeta.eliminada',
            'sistema_origen' => 'CICI',
            'entidad' => 'CARPETA',
            'accion' => 'ELIMINACION',
            'timestamp' => now()->toISOString(),
            'datos' => [
                'folder_id' => $folder->folder_id,
                'tramite' => $folder->tramite,
                'tramite_ca' => $folder->tramite_ca,
                'nombre_propietario' => $folder->nombre_propietario,
                'estado_carpeta' => $folder->estado_carpeta
            ]
        ]);

        $folder->delete();
        return Inertia::render('Folders/index');
    }

    public function show($folder_id)
    {
        $folder = Folder::with(['documents', 'user', 'facturas'])->find($folder_id);
        if (!$folder) {
            return response()->json(['error' => 'Carpeta no encontrada'], 404);
        }
        return response()->json($folder);
    }
}
