# FROM php:8.2-fpm

# # Instalar dependencias del sistema
# RUN apt-get update && apt-get install -y \
#     git \
#     curl \
#     libpng-dev \
#     libonig-dev \
#     libxml2-dev \
#     zip \
#     unzip \
#     libpq-dev \
#     nodejs \
#     npm

# # Limpiar cache
# RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# # Configurar Git para ignorar verificaciones de ownership
# RUN git config --global --add safe.directory /var/www/html
# RUN git config --global --add safe.directory '*'

# # Instalar extensiones de PHP
# RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# # Instalar Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # Crear usuario de aplicación
# RUN groupadd -g 1000 www
# RUN useradd -u 1000 -ms /bin/bash -g www www

# # Copiar aplicación completa
# COPY . /var/www/html

# # Copiar script de inicio
# COPY start.sh /usr/local/bin/start.sh

# # Configurar permisos
# RUN chown -R www:www /var/www/html
# RUN chmod -R 755 /var/www/html/storage
# RUN chmod -R 755 /var/www/html/bootstrap/cache
# RUN chmod +x /usr/local/bin/start.sh

# # Cambiar al usuario www
# USER www

# WORKDIR /var/www/html

# # Exponer puerto 8002 para INNOVA
# EXPOSE 8002

# CMD ["/usr/local/bin/start.sh"]
# # FROM php:8.2-fpm

# # # Instalar dependencias del sistema
# # RUN apt-get update && apt-get install -y \
# #     git \
# #     curl \
# #     libpng-dev \
# #     libonig-dev \
# #     libxml2-dev \
# #     zip \
# #     unzip \
# #     libpq-dev \
# #     nodejs \
# #     npm

# # # Instalar Node.js 18 (asegurar versión compatible)
# # RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
# # RUN apt-get install -y nodejs

# # # Limpiar cache
# # RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# # # Configurar Git para ignorar verificaciones de ownership
# # RUN git config --global --add safe.directory /var/www/html
# # RUN git config --global --add safe.directory '*'

# # # Instalar extensiones de PHP
# # RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# # # Instalar Composer
# # COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# # # Crear usuario de aplicación
# # RUN groupadd -g 1000 www
# # RUN useradd -u 1000 -ms /bin/bash -g www www

# # # Crear directorios necesarios
# # RUN mkdir -p /var/www/html/storage/framework/cache/data
# # RUN mkdir -p /var/www/html/storage/framework/sessions
# # RUN mkdir -p /var/www/html/storage/framework/views
# # RUN mkdir -p /var/www/html/bootstrap/cache
# # RUN mkdir -p /var/www/html/node_modules

# # # Copiar aplicación completa
# # COPY . /var/www/html

# # # Copiar script de inicio
# # COPY start.sh /usr/local/bin/start.sh

# # # Configurar permisos CORREGIDOS
# # RUN chown -R www:www /var/www/html
# # RUN chmod -R 775 /var/www/html/storage
# # RUN chmod -R 775 /var/www/html/bootstrap/cache
# # RUN chmod -R 775 /var/www/html/node_modules
# # RUN chmod +x /usr/local/bin/start.sh

# # # Cambiar al usuario www
# # USER www

# # WORKDIR /var/www/html

# # # Exponer puerto
# # EXPOSE 8001

# # CMD ["/usr/local/bin/start.sh"]

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
    npm

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

# Crear directorios necesarios
RUN mkdir -p /var/www/html/storage/framework/cache/data
RUN mkdir -p /var/www/html/storage/framework/sessions
RUN mkdir -p /var/www/html/storage/framework/views
RUN mkdir -p /var/www/html/bootstrap/cache
RUN mkdir -p /var/www/html/node_modules

# Copiar aplicación completa
COPY . /var/www/html

# Copiar script de inicio
COPY start.sh /usr/local/bin/start.sh

# Configurar permisos
RUN chown -R www:www /var/www/html
RUN chmod -R 775 /var/www/html/storage
RUN chmod -R 775 /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/node_modules
RUN chmod +x /usr/local/bin/start.sh

# Cambiar al usuario www
USER www

WORKDIR /var/www/html

# Exponer puerto
EXPOSE 8001

CMD ["/usr/local/bin/start.sh"]