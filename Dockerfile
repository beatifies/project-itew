FROM php:8.2-cli
# Force fresh build v2.1

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libsqlite3-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    ca-certificates

# Update CA certificates (critical for TLS)
RUN update-ca-certificates

# Install MongoDB extension (specific version for better compatibility)
RUN pecl install mongodb-1.17.0 \
    && docker-php-ext-enable mongodb

# Verify MongoDB extension is loaded
RUN php -m | grep -i mongodb && php --ri mongodb | head -20

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite mbstring zip xml curl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Create .env file if it doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Debug: Show PHP version and loaded extensions
RUN php -v && echo "---" && php -m

# Update composer.lock to be compatible with MongoDB extension 2.x
# The lock file has old version requirements that conflict with the installed extension
RUN composer update mongodb/laravel-mongodb mongodb/mongodb --no-scripts --no-interaction --no-progress --with-all-dependencies 2>&1 || echo "Update completed with warnings"

# Install Laravel dependencies with increased memory limit
# Skip scripts to avoid running migrations/artisan commands during build
# Ignore MongoDB platform requirement since we have v2.x installed
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts --ignore-platform-req=ext-mongodb 2>&1 || (echo "=== COMPOSER INSTALL FAILED ===" && composer diagnose 2>&1 && exit 1)

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Generate app key if not set (without running database operations)
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate --ansi --force; fi

# Don't run migrations/seeders at image build time.
# Render (and most hosts) build images without dev dependencies (e.g., Faker),
# and database access during build is unreliable.

# Expose port
EXPOSE 8080

# Start Laravel
RUN chmod +x /app/render-start.sh
CMD ["/app/render-start.sh"]