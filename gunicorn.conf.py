import os
import multiprocessing

# Bind address and port
bind = f"0.0.0.0:{os.environ.get('PORT', '8080')}"

# Concurrency & Worker Model for High Load & Load Balancing
# Formula: (2 * CPU_CORES) + 1 with multithreaded workers
default_workers = max(2, min(multiprocessing.cpu_count() * 2 + 1, 8))
workers = int(os.environ.get('WEB_CONCURRENCY', default_workers))
threads = int(os.environ.get('GUNICORN_THREADS', '4'))
worker_class = 'gthread'
worker_connections = 1000

# Connection timeouts
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '60'))
keepalive = int(os.environ.get('GUNICORN_KEEPALIVE', '5'))

# Memory leak prevention: recycle workers smoothly
max_requests = int(os.environ.get('GUNICORN_MAX_REQUESTS', '1200'))
max_requests_jitter = int(os.environ.get('GUNICORN_MAX_REQUESTS_JITTER', '100'))

# Preload app to share memory across workers via copy-on-write
preload_app = True

# Output logging
loglevel = os.environ.get('GUNICORN_LOG_LEVEL', 'info')
accesslog = '-'
errorlog = '-'
