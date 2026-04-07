FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libsqlite3-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Create SQLite database
RUN touch database/database.sqlite

# Run migrations and seeders
RUN php artisan migrate --force
RUN php artisan db:seed --force

# Expose port
EXPOSE 8080

# Start Laravel
CMD php artisan serve --host=0.0.0.0 --port=$PORT