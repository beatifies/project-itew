FROM php:8.2-cli

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libsqlite3-dev

# Install MongoDB extension
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

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

# Don't run migrations/seeders at image build time.
# Render (and most hosts) build images without dev dependencies (e.g., Faker),
# and database access during build is unreliable.

# Expose port
EXPOSE 8080

# Start Laravel
RUN chmod +x /app/render-start.sh
CMD ["/app/render-start.sh"]