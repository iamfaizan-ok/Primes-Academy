# ---- Build stage -------------------------------------------------
FROM python:3.12-slim AS builder
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN python -m pip install --upgrade pip && pip install --user -r requirements.txt

# ---- Runtime stage ------------------------------------------------
FROM python:3.12-slim
WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy the backend source code
COPY backend/ .

# Expose Django port
EXPOSE 8000

# Run migrations on container start (optional – could use release command)
# CMD ["/bin/sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]
# Use Gunicorn to serve the app
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

