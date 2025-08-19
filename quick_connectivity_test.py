#!/usr/bin/env python3
"""
Quick Connectivity Test for GaiaSystem Backend
Tests specific endpoints after PWA corrections
"""

import requests
import json
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://career-retome.preview.emergentagent.com')
BASE_URL = f"{BACKEND_URL}/api"
TENANT_ID = "gaia_demo"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def test_health_check():
    """Test the health check endpoint (root API endpoint)"""
    print(f"\n{Colors.BOLD}Testing Health Check: GET /api/{Colors.ENDC}")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "GaiaSystem API" in data.get("message", ""):
                print_success(f"Health check OK: {data['message']}")
                return True
            else:
                print_error(f"Unexpected response: {data}")
                return False
        else:
            print_error(f"Health check failed - Status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Health check connection failed: {str(e)}")
        return False

def test_dashboard_stats():
    """Test dashboard statistics endpoint"""
    print(f"\n{Colors.BOLD}Testing Dashboard Stats: GET /api/dashboard/stats{Colors.ENDC}")
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/stats?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["licenses_total", "projects_total", "inspections_total", 
                             "licenses_active", "compliance_score", "esg_score"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print_error(f"Missing fields: {missing_fields}")
                return False
            
            print_success("Dashboard stats OK")
            print_info(f"Licenses: {data['licenses_total']} total, {data['licenses_active']} active")
            print_info(f"Projects: {data['projects_total']}, Inspections: {data['inspections_total']}")
            print_info(f"Compliance: {data['compliance_score']}%, ESG: {data['esg_score']}%")
            return True
        else:
            print_error(f"Dashboard stats failed - Status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Dashboard stats connection failed: {str(e)}")
        return False

def test_licenses():
    """Test licenses endpoint"""
    print(f"\n{Colors.BOLD}Testing Licenses: GET /api/licenses{Colors.ENDC}")
    
    try:
        response = requests.get(f"{BASE_URL}/licenses?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            licenses = response.json()
            print_success(f"Licenses endpoint OK - Retrieved {len(licenses)} licenses")
            
            if licenses:
                license = licenses[0]
                print_info(f"Sample: {license.get('company', 'N/A')} - {license.get('number', 'N/A')}")
                print_info(f"Status: {license.get('status', 'N/A')}")
            
            return True
        else:
            print_error(f"Licenses failed - Status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Licenses connection failed: {str(e)}")
        return False

def run_quick_test():
    """Run quick connectivity test"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("🚀 GAIASYSTEM QUICK CONNECTIVITY TEST")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    
    print_info(f"Backend URL: {BASE_URL}")
    print_info(f"Tenant ID: {TENANT_ID}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Dashboard Stats", test_dashboard_stats),
        ("Licenses", test_licenses)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results[test_name] = result
        except Exception as e:
            print_error(f"Test {test_name} crashed: {str(e)}")
            results[test_name] = False
    
    # Print summary
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print("📊 QUICK TEST SUMMARY")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        if result:
            print_success(f"{test_name}")
            passed += 1
        else:
            print_error(f"{test_name}")
    
    print(f"\n{Colors.BOLD}")
    if passed == total:
        print(f"{Colors.GREEN}🎉 ALL CONNECTIVITY TESTS PASSED! ({passed}/{total}){Colors.ENDC}")
        print_info("Backend is responding correctly after PWA corrections")
    else:
        print(f"{Colors.YELLOW}⚠️  CONNECTIVITY ISSUES: {passed}/{total} passed{Colors.ENDC}")
    
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 60)
    print(f"{Colors.ENDC}")
    
    return passed == total

if __name__ == "__main__":
    success = run_quick_test()
    sys.exit(0 if success else 1)