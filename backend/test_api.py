import requests
import json

print("Testing API...")
try:
    resp = requests.get('http://localhost:8000/api/employees')
    print(f'Status: {resp.status_code}')
    data = resp.json()
    print(f'Count: {len(data)}')
    if data:
        print(f'First employee: {json.dumps(data[0], indent=2)}')
except Exception as e:
    print(f'Error: {e}')
