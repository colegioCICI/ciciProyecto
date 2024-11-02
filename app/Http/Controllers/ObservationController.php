<?php

namespace App\Http\Controllers;

use App\Models\Observation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ObservationController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $observation = Observation::getObservationDetails();
        $usuariosRoles = User::getPermissionAuthUser();
        return Inertia::render('Observations/index',[
            'observations'=> $observation,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI, 
        ]);
    }

    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'nombre_observacion' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        // Crear un nuevo documento
        $observation = Observation::create([
            'nombre_observacion' => $validatedData['nombre_observacion'],
            'descripcion' => $validatedData['descripcion'],
        ]);

        // Obtener la lista actualizada de carpetas
        $observations = Observation::all();

        // Devolver la vista de carpetas con los datos actualizados usando Inertia
        return Inertia::render('Documents/index', [
            'observations' => $observations,
            'success' => 'Observacion creada exitosamente.'
        ]);
    }

    public function update(Request $request, Observation $observation)
    {
        $validatedData = $request->validate([
            'nombre_observacion' => 'required|string|max:255',
            'descripcion' => 'required|string',
        ]);

        $observation->update($validatedData);

        return Inertia::render('Observations/index', [
            'observations' => Observation::all(),
            'success' => 'Observacion actualizado exitosamente.'
        ]);
    }


    public function destroy(Observation $observation)
    {
        $observation->delete();

        return Inertia::render('Observations/index');
    }
}
