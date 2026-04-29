FROM php:8.3-cli
# Force fresh build v2.3 - Optimized extension installer

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    ca-certificates \
    && update-ca-certificates

# Install PHP extensions using the high-performance installer script
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions mongodb bcmath intl zip

# Verify MongoDB extension is loaded
RUN php -m | grep -i mongodb && php --ri mongodb | head -10

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Install Laravel dependencies with increased memory limit
# We skip scripts to avoid running migrations during build.
# We ignore platform requirements for ext-mongodb because it's installed via pecl.
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts --ignore-platform-req=ext-mongodb

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