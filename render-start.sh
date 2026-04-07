#!/usr/bin/env sh
set -e

# Render sets $PORT for you. We'll default for local Docker runs.
PORT="${PORT:-8080}"

# Run migrations/seeds only when explicitly enabled.
# This prevents Docker image builds/deploys from failing due to missing dev deps (e.g., Faker).
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  php artisan migrate --force
fi

if [ "${RUN_SEED:-false}" = "true" ]; then
  php artisan db:seed --force
fi

exec php artisan serve --host=0.0.0.0 --port="$PORT"

