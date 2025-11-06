<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class StorageService
{
    private string $basePath;
    private string $appName;

    public function __construct(string $appName)
    {
        $this->appName = $appName;
        $this->basePath = env('SHARED_STORAGE_PATH', '/shared-documents') . '/' . $appName;

        $this->ensureDirectoryExists();
    }

    private function ensureDirectoryExists(): void
    {
        if (!file_exists($this->basePath)) {
            if (!mkdir($this->basePath, 0777, true)) {
                Log::error("No se pudo crear el directorio base: {$this->basePath}");
                throw new \Exception("No se pudo crear el directorio de almacenamiento");
            }
            Log::info("Directorio creado: {$this->basePath}");
        }
    }

    /**
     * CORREGIDO: parámetro nullable explícito
     */
    public function storeFile(UploadedFile $file, $entityId, ?string $entityName = null): string
    {
        try {
            $entityName = $entityName ?: 'default';

            // Limpiar nombres para seguridad
            $cleanEntityName = $this->sanitizeFileName($entityName);
            $cleanEntityId = $this->sanitizeFileName((string) $entityId);

            $entityPath = $this->basePath . DIRECTORY_SEPARATOR . $cleanEntityName . DIRECTORY_SEPARATOR . $cleanEntityId;

            Log::info('Creando directorio:', ['path' => $entityPath]);

            if (!file_exists($entityPath)) {
                if (!mkdir($entityPath, 0777, true)) {
                    throw new \Exception("No se pudo crear el directorio: {$entityPath}");
                }
                Log::info('Directorio creado exitosamente');
            }

            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $timestamp = now()->setTimezone('America/Guayaquil')->format('YmdHis');

            $cleanName = $this->sanitizeFileName($originalName);
            $filename = "{$cleanName}_{$timestamp}.{$extension}";

            $fullPath = $entityPath . DIRECTORY_SEPARATOR . $filename;

            Log::info('Intentando mover archivo:', [
                'from' => $file->getPathname(),
                'to' => $fullPath,
                'temp_exists' => file_exists($file->getPathname())
            ]);

            // ✅ CORREGIDO: Usar move con verificación
            $moved = $file->move($entityPath, $filename);

            if (!$moved) {
                throw new \Exception("No se pudo mover el archivo a: {$fullPath}");
            }

            // Verificar que se movió correctamente
            if (!file_exists($fullPath)) {
                throw new \Exception("El archivo no se movió correctamente a: {$fullPath}");
            }

            Log::info("Archivo almacenado exitosamente: {$fullPath}");
            Log::info("Tamaño del archivo movido: " . filesize($fullPath));

            return $fullPath;
        } catch (\Exception $e) {
            Log::error('Error en StorageService storeFile: ' . $e->getMessage(), [
                'entityId' => $entityId,
                'entityName' => $entityName,
                'fileName' => $file->getClientOriginalName(),
                'tempPath' => $file->getPathname(),
                'tempExists' => file_exists($file->getPathname())
            ]);
            throw $e;
        }
    }

    /**
     * Eliminar un archivo
     */

    public function deleteFile(string $filePath): bool
    {
        try {
            if (file_exists($filePath)) {
                $result = unlink($filePath);
                if ($result) {
                    Log::info("Archivo eliminado: {$filePath}");
                }
                return $result;
            }
            Log::warning("Archivo no encontrado para eliminar: {$filePath}");
            return true;
        } catch (\Exception $e) {
            Log::error('Error eliminando archivo: ' . $e->getMessage(), [
                'filePath' => $filePath
            ]);
            return false;
        }
    }

    public function fileExists(string $filePath): bool
    {
        return file_exists($filePath);
    }

    public function getFileSize(string $filePath): ?int
    {
        return file_exists($filePath) ? filesize($filePath) : null;
    }

    public function getFileMimeType(string $filePath): ?string
    {
        if (file_exists($filePath)) {
            return mime_content_type($filePath);
        }
        return null;
    }

    /**
     * CORREGIDO: parámetro nullable explícito
     */
    public function sanitizeFileName(?string $filename): string
    {
        if ($filename === null) {
            return 'sin_nombre';
        }

        $cleanName = preg_replace('/[^A-Za-z0-9_-]/', '_', $filename);

        return empty($cleanName) ? 'sin_nombre' : $cleanName;
    }

    public function getBasePath(): string
    {
        return $this->basePath;
    }

    public function listFiles(string $directory): array
    {
        $fullPath = $this->basePath . DIRECTORY_SEPARATOR . $directory;

        if (!file_exists($fullPath)) {
            return [];
        }

        $files = scandir($fullPath);
        return array_filter($files, function ($file) {
            return $file !== '.' && $file !== '..';
        });
    }

    public function getFileInfo(string $filePath): ?array
    {
        if (!file_exists($filePath)) {
            return null;
        }

        return [
            'path' => $filePath,
            'size' => filesize($filePath),
            'mime_type' => mime_content_type($filePath),
            'modified' => filemtime($filePath),
            'name' => basename($filePath)
        ];
    }

    /**
     * CORREGIDO: parámetros nullable explícitos
     */
    public function generateSafeEntityName(?string $entityName, ?string $default = null): string
    {
        $default = $default ?: 'default';
        return $this->sanitizeFileName($entityName ?: $default);
    }
}
