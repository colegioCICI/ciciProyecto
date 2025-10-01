#!/bin/bash

# Esperar a PostgreSQL
echo "⏳ Esperando a PostgreSQL..."
while ! nc -z host.docker.internal 5432; do
  sleep 1
done
echo "✅ PostgreSQL listo"

# Configurar permisos
echo "🔧 Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependencias de Composer
echo "📦 Instalando dependencias de Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# SOLUCIÓN VITE: Manejo mejorado de assets
echo "🔧 Verificando assets..."
if [ -f "package.json" ]; then
    echo "📦 Procesando dependencias Node.js..."
    
    # Limpiar e instalar
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    # Intentar compilar con Vite
    if [ -f "vite.config.js" ]; then
        echo "🏗️ Compilando con Vite..."
        npm run build
    # Intentar compilar con Mix
    elif [ -f "webpack.mix.js" ]; then
        echo "🏗️ Compilando con Mix..."
        npm run production
    else
        echo "⚠️ No se encontró configurador de assets (Vite/Mix)"
    fi
else
    echo "ℹ️ No se encontró package.json"
fi

# Limpiar cachés de Laravel
echo "🧹 Limpiando cachés..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Crear enlace de almacenamiento
echo "🔗 Creando enlace de almacenamiento..."
php artisan storage:link

# Optimizar para producción
echo "⚡ Optimizando Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ejecutar migraciones (opcional)
echo "🔄 Ejecutando migraciones..."
php artisan migrate --force

echo "🚀 Iniciando Apache..."
exec apache2-foreground