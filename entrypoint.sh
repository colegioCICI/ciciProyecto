#!/bin/bash

# Asegurar permisos correctos
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Generar la clave de la aplicación si no existe
if [ ! -f .env ]; then
    cp .env.example .env
fi
php artisan key:generate

# ---- LÍNEAS AÑADIDAS ----
# Limpiar cachés para asegurar que no haya conflictos después de un build
php artisan config:clear
php artisan view:clear
php artisan route:clear
php artisan cache:clear
php artisan package:discover --force # ¡La línea clave!

# Ejecutar migraciones
php artisan migrate --force

# Crear el enlace simbólico para el almacenamiento público
php artisan storage:link

# Iniciar Apache en primer plano
exec apache2-foreground