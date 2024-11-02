<?php

namespace App\Http\Controllers;

use App\Models\Correction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CorrectionController extends Controller
{
    public function index()
    {
        
        $correction = Correction::all();
        return Inertia::render('Corrections/index',[
            'corrections'=> $correction
        ]);
    }

    public function store(Request $request)
    {
        // Validar los datos del formulario
        $validatedData = $request->validate([
            'estado_corrección' => 'required|string|max:255',
            'fecha_corrección' => 'required|date',
        ]);

        // Crear un nuevo documento
        $correction = Correction::create([
            'estado_corrección' => $validatedData['estado_corrección'],
            'fecha_corrección' => $validatedData['fecha_corrección'],
        ]);

        // Obtener la lista actualizada de carpetas
        $corrections = Correction::all();

        // Devolver la vista de carpetas con los datos actualizados usando Inertia
        return Inertia::render('Corrections/index', [
            'observations' => $corrections,
            'success' => 'Correccion creada exitosamente.'
        ]);
    }

    public function update(Request $request, Correction $correction)
    {
        $validatedData = $request->validate([
            'estado_corrección' => 'required|string|max:255',
            'fecha_corrección' => 'required|date',
        ]);

        $correction->update($validatedData);

        return Inertia::render('Corrections/index', [
            'corrections' => Correction::all(),
            'success' => 'Correccion actualizado exitosamente.'
        ]);
    }

    public function destroy(Correction $correction)
    {
        $correction->delete();

        return Inertia::render('Corrections/index');
    }
}
