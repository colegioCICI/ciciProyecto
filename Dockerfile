# ---- Etapa 1: Constructor de Frontend ----
# Usamos una imagen de Node.js para compilar los assets de frontend.
FROM node:20 AS frontend-builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de definición de paquetes y instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos del frontend
COPY . .

# Usamos 'build' en lugar de 'dev' para generar los archivos estáticos para producción
RUN npm run build

# ---- Etapa 2: Entorno de PHP con Apache ----
# Usamos una imagen oficial de PHP 8.2 con Apache.
FROM php:8.2-apache

# Instalar dependencias del sistema y extensiones de PHP necesarias para Laravel
# CORRECCIÓN: Se añaden libpq-dev (para PostgreSQL) y la extensión bcmath.
# Se reemplaza pdo_mysql por pdo_pgsql.
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libpng-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copiar la utilidad Composer desde su imagen oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar Apache
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# ---- Etapa 3: Ensamblaje Final ----
# Copiar el código fuente y las dependencias de Composer
COPY . /var/www/html
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Copiar los archivos de frontend compilados desde la etapa anterior
COPY --from=frontend-builder /app/public /var/www/html/public

# Establecer los permisos correctos para las carpetas de Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copiar y dar permisos al script de entrada
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Exponer el puerto 80 y definir el punto de entrada
EXPOSE 80
ENTRYPOINT ["entrypoint.sh"]