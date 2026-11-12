# ---- Build stage -------------------------------------------------
FROM python:3.12-slim AS builder
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Create virtual environment in /opt/venv
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies into the virtual environment
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage ------------------------------------------------
FROM python:3.12-slim
WORKDIR /app

# Install runtime PostgreSQL library
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Ensure the virtual environment's bin directory is first in PATH
ENV PATH="/opt/venv/bin:$PATH"

# Python and Django environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV PORT=8080

# Copy backend source code
COPY backend/ .

# Collect static files for WhiteNoise
RUN python manage.py collectstatic --noinput

# Create non-root user and adjust ownership for security
RUN useradd -m appuser && chown -R appuser:appuser /app /opt/venv
USER appuser

# Expose Fly application port
EXPOSE 8080

# Run database migrations and start Gunicorn with multi-worker concurrency and load balancing config
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn -c gunicorn.conf.py config.wsgi:application"]
