# --------------------------------------------------------------
# Dockerfile – Railway deployment (Django + PostgreSQL)
# --------------------------------------------------------------
FROM python:3.12-slim

# Install system deps needed for psycopg2
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies (cached layer)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY backend/ .

# Create a non‑root user (good practice)
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Django settings
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Collect static files (optional, but good for production)
RUN python manage.py collectstatic --noinput

# Railway injects $PORT – use Gunicorn as the WSGI server
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:$PORT"]

