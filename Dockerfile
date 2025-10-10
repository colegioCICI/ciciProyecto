FROM php:8.2-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    nodejs \
    npm \
    sudo

# Instalar Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar Git para ignorar verificaciones de ownership
RUN git config --global --add safe.directory /var/www/html
RUN git config --global --add safe.directory '*'

# Instalar extensiones de PHP
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario de aplicación
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Crear directorios necesarios con permisos adecuados
RUN mkdir -p /var/www/html
RUN chown -R www:www /var/www/html

WORKDIR /var/www/html

# Copiar aplicación completa manteniendo ownership
COPY --chown=www:www . /var/www/html

# Crear directorios necesarios con permisos adecuados
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    node_modules \
    public/build

# Configurar permisos
RUN chown -R www:www /var/www/html
RUN chmod -R 775 storage bootstrap/cache
RUN chmod -R 775 node_modules public/build

# Copiar script de inicio
COPY --chown=www:www start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Cambiar al usuario www
USER www

# Exponer puerto
EXPOSE 8001

CMD ["/usr/local/bin/start.sh"]