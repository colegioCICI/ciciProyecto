<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::guard('web')->attempt($credentials)) {
        $user = Auth::guard('web')->user();

        if ($user->roles->isEmpty()) {
            Auth::logout();
            return response()->json(['error' => 'Tu cuenta está pendiente de aprobación.'], 403);
        }

        try {
            // Prueba con un usuario recién consultado
            $freshUser = User::find($user->id);
            $token = $freshUser->createToken('API Token')->plainTextToken;
            return response()->json(['token' => $token], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error interno al generar el token.'], 500);
        }
    }

    return response()->json(['error' => 'Credenciales inválidas'], 401);
}


}