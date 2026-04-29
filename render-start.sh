#!/usr/bin/env sh
set -e

# Render sets $PORT for you. We'll default for local Docker runs.
PORT="${PORT:-8080}"

# Clear ALL cached config first to avoid stale values from previous deploys
php artisan optimize:clear

# Re-cache configurations at runtime (not build time)
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Debug: Show MongoDB URI (masked password)
if [ -n "$MONGODB_URI" ]; then
  echo "MongoDB URI is set"
  echo "$MONGODB_URI" | sed 's/:\([^@]*\)@/:****@/g'
else
  echo "WARNING: MONGODB_URI is not set!"
fi

# Run migrations/seeds only when explicitly enabled.
# This prevents Docker image builds/deploys from failing due to missing dev deps (e.g., Faker).
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  echo "Running migrations..."
  php artisan migrate --force --verbose
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  php artisan db:seed --force
fi

exec php artisan serve --host=0.0.0.0 --port="$PORT"

