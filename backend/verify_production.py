#!/usr/bin/env python
"""
Production Deployment Verification Script
Tests the backend endpoints after Render deployment
"""
import urllib.request
import urllib.error
import json
import sys
from datetime import datetime

def test_endpoint(name, method, url, data=None):
    """Test a single endpoint"""
    print(f"\n🔍 Testing: {name}")
    print(f"   URL: {url}")
    print(f"   Method: {method}")
    
    try:
        if method == 'GET':
            request = urllib.request.Request(url, method='GET')
        else:
            payload = json.dumps(data).encode('utf-8')
            request = urllib.request.Request(
                url,
                data=payload,
                headers={'Content-Type': 'application/json'},
                method=method
            )
        
        response = urllib.request.urlopen(request, timeout=15)
        response_data = json.loads(response.read().decode())
        
        print(f"   ✅ Status: {response.status} OK")
        print(f"   Response: {json.dumps(response_data, indent=6)}")
        return True
        
    except urllib.error.HTTPError as e:
        print(f"   ❌ HTTP Error {e.code}: {e.reason}")
        try:
            error_data = json.loads(e.read().decode())
            print(f"   Error: {json.dumps(error_data, indent=6)}")
        except:
            pass
        return False
        
    except urllib.error.URLError as e:
        print(f"   ❌ Connection Error: {e.reason}")
        return False
        
    except Exception as e:
        print(f"   ❌ Error: {type(e).__name__}: {str(e)}")
        return False

def main():
    """Run all tests"""
    backend_url = "https://hr-payslip-backend.onrender.com"
    
    print("=" * 70)
    print("PRODUCTION BACKEND VERIFICATION")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    tests = [
        ("Health Check", "GET", f"{backend_url}/api/health", None),
        ("Employee List", "GET", f"{backend_url}/api/employees", None),
        ("Send Test Email", "POST", f"{backend_url}/api/test-email-payslip", {"email": "test@example.com"}),
        ("Email History", "GET", f"{backend_url}/api/email-history/TEST001", None),
    ]
    
    results = []
    for name, method, url, data in tests:
        results.append(test_endpoint(name, method, url, data))
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nTests Passed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED - Backend is running successfully in production!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed - Backend may not be fully operational")
        return 1

if __name__ == "__main__":
    sys.exit(main())
