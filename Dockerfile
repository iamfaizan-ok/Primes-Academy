# ---- Build stage -------------------------------------------------
FROM python:3.12-slim AS builder
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (cached layer)
COPY backend/requirements.txt .
RUN python -m pip install --upgrade pip && pip install --user -r requirements.txt

# ---- Runtime stage ------------------------------------------------
FROM python:3.12-slim
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy the backend source code (includes config folder)
COPY backend/ .

# Create non‑root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

# Collect static files (required for WhiteNoise)
RUN python manage.py collectstatic --noinput

# Expose the port that Fly will map (use $PORT at runtime)
EXPOSE 8080

# Gunicorn command – binds to the port provided by Fly via $PORT (defaults to 8080)
CMD ["sh", "-c", "gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8080}"]

