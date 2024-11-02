<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Factura;
use App\Models\User;
use Inertia\Inertia;


class FacturaController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $facturas = Factura::getFacturas();
        $usuariosRoles = User::getPermissionAuthUser();

        return Inertia::render('Facturas/index', [
            'facturas' => $facturas,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI,
        ]);
    }


    /**
     * Actualizar una factura existente.
     */
    public function update(Request $request, $id)
    {
        // Buscar la factura a actualizar
        $factura = Factura::findOrFail($id);

        // Definir mensajes personalizados para la validación de campos en facturas
        $messages = [
            'aprobacion.required' => 'El valor de aprobación es obligatorio.',
            'aprobacion.string' => 'El valor de aprobación debe ser una cadena de texto.',

            'microfilm.required' => 'El campo de microfilm es obligatorio.',
            'microfilm.string' => 'El campo de microfilm debe ser una cadena de texto.',

            'especie.required' => 'El campo de especie es obligatorio.',
            'especie.string' => 'El campo de especie debe ser una cadena de texto.',

            'formularios.required' => 'El campo de formularios es obligatorio.',
            'formularios.string' => 'El campo de formularios debe ser una cadena de texto.',

            'fecha_factura.required' => 'La fecha de la factura es obligatoria.',
            'fecha_factura.date' => 'La fecha de la factura debe ser una fecha válida.',

            'tramite_factura.required' => 'El número de trámite de la factura es obligatorio.',
            'tramite_factura.integer' => 'El número de trámite de la factura debe ser un número entero.',

            'direccion_inmueble.required' => 'La dirección del inmueble es obligatoria.',
            'direccion_inmueble.string' => 'La dirección del inmueble debe ser una cadena de texto.',

            'numero_factura.required' => 'El número de factura es obligatorio.',
            'numero_factura.string' => 'El número de factura debe ser una cadena de texto.',

            'tipo.required' => 'El tipo de factura es obligatorio.',
            'tipo.string' => 'El tipo de factura debe ser una cadena de texto.',
        ];

        // Validar los campos proporcionados por el usuario como cadenas
        $validatedData = $request->validate([
            'aprobacion' => 'required|string',
            'microfilm' => 'required|string',
            'especie' => 'required|string',
            'formularios' => 'required|string',
            'fecha_factura' => 'required|date',
            'tramite_factura' => 'required|integer',
            'direccion_inmueble' => 'required|string',
            'numero_factura' => 'required|string',
            'tipo' => 'required|string',
        ], $messages);


        // Convertir los campos string a decimal
        $aprobacion = $this->convertStringToDecimal($validatedData['aprobacion']);
        $microfilm = $this->convertStringToDecimal($validatedData['microfilm']);
        $especie = $this->convertStringToDecimal($validatedData['especie']);
        $formularios = $this->convertStringToDecimal($validatedData['formularios']);

        // Calcular los valores nuevamente en base a los datos actualizados
        $porcentajeCICI = $aprobacion / 2;
        $total = $porcentajeCICI + $microfilm;
        $valorCobrado = $aprobacion + $microfilm + $especie + $formularios;

        // Actualizar la factura con los nuevos valores
        $factura->update([
            'fecha_factura' => $validatedData['fecha_factura'],
            'tramite_factura' => $validatedData['tramite_factura'],
            'direccion_inmueble' => $validatedData['direccion_inmueble'],
            'numero_factura' => $validatedData['numero_factura'],
            'aprobacion' => $aprobacion,
            'porcentaje_cici' => $porcentajeCICI,
            'microfilm' => $microfilm,
            'total' => $total,
            'especie' => $especie,
            'formularios' => $formularios,
            'valor_cobrado' => $valorCobrado,
            'tipo' => $validatedData['tipo'],
        ]);

        // Obtener la lista actualizada de carpetas
        $facturas = Factura::getFacturas();

        // Devolver la vista de carpetas con los datos actualizados usando Inertia
        return Inertia::render('Facturas/index', [
            'facturas' => $facturas,
            'success' => 'Facturas Actualizadas.'
        ]);
    }

    /**
     * Convertir una cadena de texto a decimal.
     * Si la cadena contiene comas, se reemplazan por puntos y se convierte a decimal.
     *
     * @param string $value
     * @return float
     */
    private function convertStringToDecimal(string $value): float
    {
        // Reemplazar comas por puntos si existen en la cadena
        $formattedValue = str_replace(',', '.', $value);

        // Convertir la cadena a un valor decimal
        return (float) $formattedValue;
    }
}
