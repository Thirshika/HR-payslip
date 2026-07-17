#!/usr/bin/env python
import urllib.request
import urllib.error
import json
import sys

print("=" * 60)
print("PRODUCTION BACKEND VERIFICATION")
print("=" * 60)

backends = [
    ("Health Check", "https://hr-payslip-backend.onrender.com/api/health"),
    ("Employee List", "https://hr-payslip-backend.onrender.com/api/employees"),
]

for name, url in backends:
    print(f"\n🔍 Testing: {name}")
    print(f"   URL: {url}")
    try:
        request = urllib.request.Request(url, method='GET')
        response = urllib.request.urlopen(request, timeout=15)
        data = json.loads(response.read().decode())
        print(f"   ✅ Status: {response.status}")
        print(f"   Response: {json.dumps(data, indent=6)}")
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP Error {e.code}: {e.reason}")
        try:
            error_data = json.loads(e.read().decode())
            print(f"   Response: {json.dumps(error_data, indent=6)}")
        except:
            print(f"   Response: {e.read().decode()}")
    except urllib.error.URLError as e:
        print(f"   ❌ Connection Error: {e.reason}")
    except Exception as e:
        print(f"   ❌ Error: {type(e).__name__}: {str(e)}")

# Test email endpoint
print("\n" + "=" * 60)
print("TESTING EMAIL ENDPOINTS")
print("=" * 60)

email_url = "https://hr-payslip-backend.onrender.com/api/test-email-payslip"
print(f"\n🔍 Testing: Send Test Email")
print(f"   URL: {email_url}")
print(f"   Method: POST")

payload = json.dumps({"email": "test@example.com"}).encode('utf-8')

try:
    request = urllib.request.Request(
        email_url,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    response = urllib.request.urlopen(request, timeout=30)
    data = json.loads(response.read().decode())
    print(f"   ✅ Status: {response.status}")
    print(f"   Response: {json.dumps(data, indent=6)}")
except urllib.error.HTTPError as e:
    print(f"   ⚠️  HTTP Error {e.code}: {e.reason}")
    try:
        error_data = json.loads(e.read().decode())
        print(f"   Response: {json.dumps(error_data, indent=6)}")
    except:
        print(f"   Response: {e.read().decode()}")
except urllib.error.URLError as e:
    print(f"   ❌ Connection Error: {e.reason}")
except Exception as e:
    print(f"   ❌ Error: {type(e).__name__}: {str(e)}")

print("\n" + "=" * 60)
