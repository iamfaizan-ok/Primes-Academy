import json, sys
import requests
url = 'http://localhost:8000/api/auth/admin/login/'
payload = {'email': 'primes@academyadmin.com', 'password': 'admin12345'}
try:
    resp = requests.post(url, json=payload, timeout=5)
    print('Status:', resp.status_code)
    print('Response:', resp.text)
except Exception as e:
    print('Error:', e)
    sys.exit(1)

