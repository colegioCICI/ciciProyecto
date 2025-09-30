<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('Authorization');
        
        // Log para debugging
        Log::info('API Token Middleware - Header recibido', [
            'authorization' => $token,
            'url' => $request->fullUrl(),
            'ip' => $request->ip()
        ]);

        if (!$token) {
            return response()->json([
                'error' => 'Token de API requerido',
                'code' => 'API_TOKEN_REQUIRED'
            ], 401);
        }

        // Extraer token si viene como Bearer token
        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }

        // Verificar contra token configurado
        $validToken = config('services.api_tokens.microservice_token');
        
        if (!$validToken) {
            Log::error('API Token no configurado en servicios');
            return response()->json([
                'error' => 'Configuración de API incompleta',
                'code' => 'API_CONFIG_ERROR'
            ], 500);
        }

        if ($token !== $validToken) {
            Log::warning('Token de API inválido', [
                'token_recibido' => substr($token, 0, 10) . '...', // Solo log primeros caracteres
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'error' => 'Token de API inválido',
                'code' => 'INVALID_API_TOKEN'
            ], 403);
        }

        Log::info('API Token validado correctamente');
        return $next($request);
    }
}