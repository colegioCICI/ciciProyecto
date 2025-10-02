#!/bin/bash

# Configurar variables desde entorno
APP_URL=${APP_URL:-http://localhost:8001}
ASSET_URL=${ASSET_URL:-http://localhost:8001}
DOMAIN=${DOMAIN:-localhost}

echo "🚀 Iniciando aplicación en: $APP_URL"

# Configurar Git
git config --global --add safe.directory /var/www/html
git config --global --add safe.directory '*'

# Configurar Composer
export COMPOSER_PROCESS_TIMEOUT=600

echo "📦 Instalando dependencias de Composer..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "🔍 Descubriendo paquetes..."
php artisan package:discover --ansi

echo "📦 Instalando dependencias de NPM..."
if [ -f "package.json" ]; then
    npm install --no-audit --no-fund --prefer-offline
    
    echo "🏗️  Construyendo assets..."
    if [ -f "vite.config.js" ] && ([ -f "resources/js/app.jsx" ] || [ -f "resources/js/app.js" ]); then
        export VITE_APP_URL="$APP_URL"
        npm run build
    else
        echo "⚠️  No se encontraron archivos de entrada de Vite"
    fi
fi

echo "⚙️  Configurando aplicación Laravel..."
if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
    php artisan key:generate
    echo "✅ Archivo .env creado y key generada"
fi

# Actualizar URLs en .env
sed -i "s|APP_URL=.*|APP_URL=$APP_URL|" .env
sed -i "s|ASSET_URL=.*|ASSET_URL=$ASSET_URL|" .env

# Configurar storage
rm -f public/storage
php artisan storage:link || echo "⚠️  storage:link falló"

# Optimizar
php artisan optimize:clear || echo "⚠️  optimize:clear falló"
php artisan config:cache
php artisan route:cache

# Obtener puerto desde APP_URL
PORT=$(echo $APP_URL | grep -oE '[0-9]+$')

echo "🚀 Iniciando servidor Laravel en 0.0.0.0:${PORT:-8001}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8001}