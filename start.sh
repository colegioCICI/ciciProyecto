# # #!/bin/bash

# # # Configurar variables desde entorno
# # APP_URL=${APP_URL:-http://localhost:8001}
# # ASSET_URL=${ASSET_URL:-http://localhost:8001}
# # DOMAIN=${DOMAIN:-localhost}

# # echo "🚀 Iniciando aplicación en: $APP_URL"

# # # Configurar Git
# # git config --global --add safe.directory /var/www/html
# # git config --global --add safe.directory '*'

# # # Configurar Composer
# # export COMPOSER_PROCESS_TIMEOUT=600

# # echo "📦 Instalando dependencias de Composer..."
# # composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# # echo "🔍 Descubriendo paquetes..."
# # php artisan package:discover --ansi

# # echo "📦 Instalando dependencias de NPM..."
# # if [ -f "package.json" ]; then
# #     npm install --no-audit --no-fund --prefer-offline
    
# #     echo "🏗️  Construyendo assets..."
# #     if [ -f "vite.config.js" ] && ([ -f "resources/js/app.jsx" ] || [ -f "resources/js/app.js" ]); then
# #         export VITE_APP_URL="$APP_URL"
# #         npm run build
# #     else
# #         echo "⚠️  No se encontraron archivos de entrada de Vite"
# #     fi
# # fi

# # echo "⚙️  Configurando aplicación Laravel..."
# # if [ ! -f .env ] && [ -f .env.example ]; then
# #     cp .env.example .env
# #     php artisan key:generate
# #     echo "✅ Archivo .env creado y key generada"
# # fi

# # # Actualizar URLs en .env
# # sed -i "s|APP_URL=.*|APP_URL=$APP_URL|" .env
# # sed -i "s|ASSET_URL=.*|ASSET_URL=$ASSET_URL|" .env

# # # Configurar storage
# # rm -f public/storage
# # php artisan storage:link || echo "⚠️  storage:link falló"

# # # Optimizar
# # php artisan optimize:clear || echo "⚠️  optimize:clear falló"
# # php artisan config:cache
# # php artisan route:cache

# # # Obtener puerto desde APP_URL
# # PORT=$(echo $APP_URL | grep -oE '[0-9]+$')

# # echo "🚀 Iniciando servidor Laravel en 0.0.0.0:${PORT:-8001}..."
# # exec php artisan serve --host=0.0.0.0 --port=${PORT:-8001}

# #!/bin/bash

# # Configurar variables desde entorno
# APP_URL=${APP_URL:-http://localhost:8001}
# ASSET_URL=${ASSET_URL:-http://localhost:8001}

# echo "🚀 Iniciando aplicación en: $APP_URL"

# # Configurar Git
# git config --global --add safe.directory /var/www/html
# git config --global --add safe.directory '*'

# # Esperar a que la base de datos esté lista (opcional)
# # echo "⏳ Esperando a que la base de datos esté lista..."
# # while ! nc -z $DB_HOST $DB_PORT; do
# #   sleep 1
# # done
# # echo "✅ Base de datos lista"

# # # echo "📦 Instalando dependencias de Composer..."
# # # composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# # # echo "🔍 Descubriendo paquetes..."
# # # php artisan package:discover --ansi

# # # echo "📦 Instalando dependencias de NPM..."
# # # if [ -f "package.json" ]; then
# # #     npm install --no-audit --no-fund --prefer-offline
    
# # #     echo "🏗️  Construyendo assets..."
# # #     if [ -f "vite.config.js" ] && ([ -f "resources/js/app.jsx" ] || [ -f "resources/js/app.js" ]); then
# # #         export VITE_APP_NAME="${APP_NAME}"
# # #         export VITE_APP_URL="$APP_URL"
# # #         npm run build
# # #     else
# # #         echo "⚠️  No se encontraron archivos de entrada de Vite"
# # #     fi
# # # fi

# # # echo "⚙️  Configurando aplicación Laravel..."
# # # if [ ! -f .env ]; then
# # #     if [ -f .env.example ]; then
# # #         cp .env.example .env
# # #         echo "✅ Archivo .env creado desde .env.example"
# # #     else
# # #         echo "❌ No se encontró .env.example"
# # #         exit 1
# # #     fi
# # # fi

# # # # Actualizar URLs en .env
# # # sed -i "s|APP_URL=.*|APP_URL=$APP_URL|g" .env
# # # sed -i "s|ASSET_URL=.*|ASSET_URL=$ASSET_URL|g" .env

# # # # Actualizar configuración de base de datos
# # # if [ ! -z "$DB_HOST" ]; then
# # #     sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" .env
# # # fi
# # # if [ ! -z "$DB_PORT" ]; then
# # #     sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" .env
# # # fi
# # # if [ ! -z "$DB_DATABASE" ]; then
# # #     sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|g" .env
# # # fi

# # # # Actualizar RabbitMQ
# # # if [ ! -z "$RABBITMQ_HOST" ]; then
# # #     sed -i "s|RABBITMQ_HOST=.*|RABBITMQ_HOST=$RABBITMQ_HOST|g" .env
# # # fi
# # # if [ ! -z "$RABBITMQ_PORT" ]; then
# # #     sed -i "s|RABBITMQ_PORT=.*|RABBITMQ_PORT=$RABBIT_PORT|g" .env
# # # fi

# # # # Generar key si no existe
# # # if ! grep -q "APP_KEY=base64:" .env; then
# # #     php artisan key:generate
# # #     echo "✅ Key de aplicación generada"
# # # fi

# # # # Configurar storage
# # # php artisan storage:link || echo "⚠️  storage:link falló"

# # # # Ejecutar migraciones (opcional - comentar en producción)
# # # # php artisan migrate --force || echo "⚠️  Las migraciones fallaron"

# # # # Optimizar
# # # php artisan config:clear
# # # php artisan route:clear
# # # php artisan cache:clear
# # # php artisan config:cache
# # # php artisan route:cache

# # # # Obtener puerto desde APP_URL
# # # PORT=$(echo $APP_URL | grep -oE '[0-9]+$' || echo "8001")

# # # echo "🚀 Iniciando servidor Laravel en 0.0.0.0:${PORT}..."
# # # exec php artisan serve --host=0.0.0.0 --port=${PORT}

# #!/bin/bash

# # Configurar variables desde entorno
# #!/bin/bash

# # Configurar variables desde entorno
# APP_URL=${APP_URL:-http://localhost:8001}
# ASSET_URL=${ASSET_URL:-http://localhost:8001}

# echo "🚀 Iniciando aplicación en: $APP_URL"

# # Configurar Git
# git config --global --add safe.directory /var/www/html
# git config --global --add safe.directory '*'

# # Crear directorios necesarios para Laravel
# echo "📁 Creando directorios de cache..."
# mkdir -p storage/framework/cache/data
# mkdir -p storage/framework/sessions
# mkdir -p storage/framework/views
# mkdir -p storage/logs
# mkdir -p bootstrap/cache
# mkdir -p node_modules

# # Configurar permisos
# chmod -R 775 storage
# chmod -R 775 bootstrap/cache
# chmod -R 775 node_modules

# echo "📦 Instalando dependencias de Composer..."
# composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# echo "🔍 Descubriendo paquetes..."
# php artisan package:discover --ansi

# echo "📦 Instalando dependencias de NPM..."
# if [ -f "package.json" ]; then
#     # Limpiar node_modules existente si hay problemas de permisos
#     rm -rf node_modules/*
    
#     # Instalar npm como root temporalmente para evitar problemas de permisos
#     sudo npm install --no-audit --no-fund --prefer-offline --unsafe-perm
    
#     echo "🏗️  Construyendo assets de Vite..."
#     if [ -f "vite.config.js" ] && ([ -f "resources/js/app.jsx" ] || [ -f "resources/js/app.js" ]); then
#         export VITE_APP_NAME="${APP_NAME}"
#         export VITE_APP_URL="$APP_URL"
#         # Construir como root para evitar problemas de permisos
#         sudo npm run build
#         echo "✅ Assets construidos correctamente"
#     else
#         echo "⚠️  No se encontraron archivos de entrada de Vite"
#     fi
# fi

# echo "⚙️  Configurando aplicación Laravel..."
# if [ ! -f .env ]; then
#     if [ -f .env.example ]; then
#         cp .env.example .env
#         echo "✅ Archivo .env creado desde .env.example"
#     else
#         echo "❌ No se encontró .env.example"
#         exit 1
#     fi
# fi

# # Actualizar URLs en .env
# sed -i "s|APP_URL=.*|APP_URL=$APP_URL|g" .env
# sed -i "s|ASSET_URL=.*|ASSET_URL=$ASSET_URL|g" .env

# # Actualizar configuración de base de datos
# if [ ! -z "$DB_HOST" ]; then
#     sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" .env
# fi
# if [ ! -z "$DB_PORT" ]; then
#     sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" .env
# fi
# if [ ! -z "$DB_DATABASE" ]; then
#     sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|g" .env
# fi

# # Actualizar RabbitMQ
# if [ ! -z "$RABBITMQ_HOST" ]; then
#     sed -i "s|RABBITMQ_HOST=.*|RABBITMQ_HOST=$RABBITMQ_HOST|g" .env
# fi
# if [ ! -z "$RABBITMQ_PORT" ]; then
#     sed -i "s|RABBITMQ_PORT=.*|RABBITMQ_PORT=$RABBITMQ_PORT|g" .env
# fi

# # Generar key si no existe
# if ! grep -q "APP_KEY=base64:" .env; then
#     php artisan key:generate
#     echo "✅ Key de aplicación generada"
# fi

# # Configurar storage (eliminar enlace existente si hay problemas)
# echo "🔗 Configurando storage link..."
# rm -f public/storage
# php artisan storage:link

# # Limpiar cache
# php artisan config:clear
# php artisan route:clear
# php artisan cache:clear
# php artisan view:clear

# # Optimizar para producción
# php artisan config:cache
# php artisan route:cache
# php artisan view:cache

# # Obtener puerto desde APP_URL
# PORT=$(echo $APP_URL | grep -oE '[0-9]+$' || echo "8001")

# echo "🚀 Iniciando servidor Laravel en 0.0.0.0:${PORT}..."
# exec php artisan serve --host=0.0.0.0 --port=${PORT}

#!/bin/bash

# Configurar variables desde entorno
APP_URL=${APP_URL:-http://localhost:8001}
ASSET_URL=${ASSET_URL:-http://localhost:8001}

echo "🚀 Iniciando aplicación en: $APP_URL"

# Configurar Git
git config --global --add safe.directory /var/www/html
git config --global --add safe.directory '*'

# Crear directorios necesarios para Laravel
echo "📁 Creando directorios de cache..."
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache
mkdir -p node_modules
mkdir -p public/build

# Configurar permisos
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chmod -R 775 node_modules
chmod -R 775 public/build

echo "📦 Instalando dependencias de Composer..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

echo "🔍 Descubriendo paquetes..."
php artisan package:discover --ansi

echo "📦 Instalando dependencias de NPM..."
if [ -f "package.json" ]; then
    # Limpiar node_modules existente si hay problemas
    rm -rf node_modules/*
    
    # Instalar npm
    npm install --no-audit --no-fund --prefer-offline --unsafe-perm
    
    echo "🏗️  Construyendo assets de Vite..."
    if [ -f "vite.config.js" ] && ([ -f "resources/js/app.jsx" ] || [ -f "resources/js/app.js" ]); then
        export VITE_APP_NAME="${APP_NAME}"
        export VITE_APP_URL="$APP_URL"
        # Construir assets
        npm run build
        echo "✅ Assets construidos correctamente"
        
        # Verificar que el manifest existe
        if [ -f "public/build/manifest.json" ]; then
            echo "✅ Manifest de Vite encontrado"
        else
            echo "❌ ERROR: Manifest de Vite no encontrado después de build"
            ls -la public/build/ || echo "No existe directorio build"
        fi
    else
        echo "⚠️  No se encontraron archivos de entrada de Vite"
    fi
fi

echo "⚙️  Configurando aplicación Laravel..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado desde .env.example"
    else
        echo "❌ No se encontró .env.example"
        exit 1
    fi
fi

# Actualizar URLs en .env
sed -i "s|APP_URL=.*|APP_URL=$APP_URL|g" .env
sed -i "s|ASSET_URL=.*|ASSET_URL=$ASSET_URL|g" .env

# Actualizar configuración de base de datos
if [ ! -z "$DB_HOST" ]; then
    sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" .env
fi
if [ ! -z "$DB_PORT" ]; then
    sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" .env
fi
if [ ! -z "$DB_DATABASE" ]; then
    sed -i "s|DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|g" .env
fi

# Actualizar RabbitMQ
if [ ! -z "$RABBITMQ_HOST" ]; then
    sed -i "s|RABBITMQ_HOST=.*|RABBITMQ_HOST=$RABBITMQ_HOST|g" .env
fi
if [ ! -z "$RABBITMQ_PORT" ]; then
    sed -i "s|RABBITMQ_PORT=.*|RABBITMQ_PORT=$RABBITMQ_PORT|g" .env
fi

# Generar key si no existe
if ! grep -q "APP_KEY=base64:" .env; then
    php artisan key:generate
    echo "✅ Key de aplicación generada"
fi

# Configurar storage (eliminar enlace existente si hay problemas)
echo "🔗 Configurando storage link..."
rm -f public/storage
php artisan storage:link

# Limpiar cache
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Obtener puerto desde APP_URL
PORT=$(echo $APP_URL | grep -oE '[0-9]+$' || echo "8001")

echo "🚀 Iniciando servidor Laravel en 0.0.0.0:${PORT}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT}