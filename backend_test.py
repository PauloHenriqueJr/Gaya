#!/usr/bin/env python3
"""
Backend Test Suite for GaiaSystem API
Tests all environmental management endpoints with Brazilian data
"""

import requests
import json
import sys
from datetime import datetime
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

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Testing: {test_name}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠️  {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  {message}{Colors.ENDC}")

def test_health_check():
    """Test the root health check endpoint"""
    print_test_header("Health Check - GET /api/")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "GaiaSystem API" in data.get("message", ""):
                print_success(f"Health check passed: {data['message']}")
                return True
            else:
                print_error(f"Unexpected response message: {data}")
                return False
        else:
            print_error(f"Health check failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Health check request failed: {str(e)}")
        return False

def test_seed_data():
    """Test creating seed data"""
    print_test_header("Seed Data Creation - POST /api/seed-data")
    
    try:
        response = requests.post(f"{BASE_URL}/seed-data?tenant_id={TENANT_ID}", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if "sucesso" in data.get("message", "").lower():
                print_success(f"Seed data created successfully: {data['message']}")
                return True
            else:
                print_error(f"Unexpected seed data response: {data}")
                return False
        else:
            print_error(f"Seed data creation failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Seed data request failed: {str(e)}")
        return False

def test_dashboard_stats():
    """Test dashboard statistics endpoint"""
    print_test_header("Dashboard Statistics - GET /api/dashboard/stats")
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/stats?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["licenses_total", "projects_total", "inspections_total", 
                             "licenses_active", "compliance_score", "esg_score"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print_error(f"Missing required fields in dashboard stats: {missing_fields}")
                return False
            
            print_success("Dashboard stats structure is correct")
            print_info(f"Licenses Total: {data['licenses_total']}")
            print_info(f"Projects Total: {data['projects_total']}")
            print_info(f"Inspections Total: {data['inspections_total']}")
            print_info(f"Active Licenses: {data['licenses_active']}")
            print_info(f"Compliance Score: {data['compliance_score']}%")
            print_info(f"ESG Score: {data['esg_score']}%")
            
            return True
        else:
            print_error(f"Dashboard stats failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Dashboard stats request failed: {str(e)}")
        return False

def test_licenses():
    """Test licenses endpoints"""
    print_test_header("Licenses Management - GET /api/licenses")
    
    try:
        # Test getting all licenses
        response = requests.get(f"{BASE_URL}/licenses?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            licenses = response.json()
            print_success(f"Retrieved {len(licenses)} licenses")
            
            if licenses:
                # Validate license structure
                license = licenses[0]
                required_fields = ["id", "number", "type", "title", "company", "cnpj", 
                                 "status", "issue_date", "expiry_date", "issuing_body", 
                                 "activity_type", "tenant_id"]
                
                missing_fields = [field for field in required_fields if field not in license]
                if missing_fields:
                    print_error(f"Missing required fields in license: {missing_fields}")
                    return False
                
                # Validate Brazilian data
                if not license["cnpj"] or len(license["cnpj"]) < 14:
                    print_error(f"Invalid CNPJ format: {license['cnpj']}")
                    return False
                
                print_success("License structure validation passed")
                print_info(f"Sample license: {license['company']} - {license['number']}")
                print_info(f"CNPJ: {license['cnpj']}")
                print_info(f"Status: {license['status']}")
                print_info(f"Issuing Body: {license['issuing_body']}")
                
                # Test filtering by status
                print_info("Testing license filtering by status...")
                active_response = requests.get(f"{BASE_URL}/licenses?tenant_id={TENANT_ID}&status=Ativa", timeout=10)
                if active_response.status_code == 200:
                    active_licenses = active_response.json()
                    print_success(f"Status filter works: {len(active_licenses)} active licenses")
                else:
                    print_warning("Status filtering may not be working properly")
                
                # Test filtering by type
                print_info("Testing license filtering by type...")
                lp_response = requests.get(f"{BASE_URL}/licenses?tenant_id={TENANT_ID}&type=LP", timeout=10)
                if lp_response.status_code == 200:
                    lp_licenses = lp_response.json()
                    print_success(f"Type filter works: {len(lp_licenses)} LP licenses")
                else:
                    print_warning("Type filtering may not be working properly")
                
            return True
        else:
            print_error(f"Licenses request failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Licenses request failed: {str(e)}")
        return False

def test_projects():
    """Test projects endpoints"""
    print_test_header("Projects Management - GET /api/projects")
    
    try:
        response = requests.get(f"{BASE_URL}/projects?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            projects = response.json()
            print_success(f"Retrieved {len(projects)} projects")
            
            if projects:
                # Validate project structure
                project = projects[0]
                required_fields = ["id", "name", "description", "status", "start_date", 
                                 "budget", "manager", "location", "environmental_impact", "tenant_id"]
                
                missing_fields = [field for field in required_fields if field not in project]
                if missing_fields:
                    print_error(f"Missing required fields in project: {missing_fields}")
                    return False
                
                # Validate Brazilian location data
                if "SP" not in project["location"] and "RJ" not in project["location"] and "Brasil" not in project["location"]:
                    print_warning(f"Project location may not be Brazilian: {project['location']}")
                
                print_success("Project structure validation passed")
                print_info(f"Sample project: {project['name']}")
                print_info(f"Manager: {project['manager']}")
                print_info(f"Location: {project['location']}")
                print_info(f"Budget: R$ {project['budget']:,.2f}")
                print_info(f"Environmental Impact: {project['environmental_impact']}")
                
            return True
        else:
            print_error(f"Projects request failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Projects request failed: {str(e)}")
        return False

def test_inspections():
    """Test inspections endpoints"""
    print_test_header("Inspections Management - GET /api/inspections")
    
    try:
        response = requests.get(f"{BASE_URL}/inspections?tenant_id={TENANT_ID}", timeout=10)
        
        if response.status_code == 200:
            inspections = response.json()
            print_success(f"Retrieved {len(inspections)} inspections")
            
            if inspections:
                # Validate inspection structure
                inspection = inspections[0]
                required_fields = ["id", "title", "location", "scheduled_date", "inspector", 
                                 "status", "tenant_id"]
                
                missing_fields = [field for field in required_fields if field not in inspection]
                if missing_fields:
                    print_error(f"Missing required fields in inspection: {missing_fields}")
                    return False
                
                print_success("Inspection structure validation passed")
                print_info(f"Sample inspection: {inspection['title']}")
                print_info(f"Inspector: {inspection['inspector']}")
                print_info(f"Location: {inspection['location']}")
                print_info(f"Status: {inspection['status']}")
                
                if "conformity_percentage" in inspection:
                    print_info(f"Conformity: {inspection['conformity_percentage']}%")
                
                if "checklist_items" in inspection and inspection["checklist_items"]:
                    print_info(f"Checklist items: {len(inspection['checklist_items'])}")
                
            return True
        else:
            print_error(f"Inspections request failed with status {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Inspections request failed: {str(e)}")
        return False

def test_additional_endpoints():
    """Test additional endpoints like water monitoring, waste, commitments"""
    print_test_header("Additional Endpoints Testing")
    
    endpoints = [
        ("water-monitoring", "Water Monitoring"),
        ("waste", "Waste Management"),
        ("commitments", "Commitments")
    ]
    
    results = []
    
    for endpoint, name in endpoints:
        try:
            print_info(f"Testing {name} endpoint...")
            response = requests.get(f"{BASE_URL}/{endpoint}?tenant_id={TENANT_ID}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print_success(f"{name}: Retrieved {len(data)} records")
                results.append(True)
            else:
                print_warning(f"{name}: Status {response.status_code} - {response.text}")
                results.append(False)
                
        except requests.exceptions.RequestException as e:
            print_error(f"{name} request failed: {str(e)}")
            results.append(False)
    
    return all(results)

def test_tenant_isolation():
    """Test that tenant isolation works correctly"""
    print_test_header("Tenant Isolation Testing")
    
    try:
        # Test with different tenant_id
        different_tenant = "different-tenant"
        response = requests.get(f"{BASE_URL}/licenses?tenant_id={different_tenant}", timeout=10)
        
        if response.status_code == 200:
            licenses = response.json()
            if len(licenses) == 0:
                print_success("Tenant isolation working correctly - no data for different tenant")
                return True
            else:
                print_warning(f"Tenant isolation may not be working - found {len(licenses)} licenses for different tenant")
                return False
        else:
            print_error(f"Tenant isolation test failed with status {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print_error(f"Tenant isolation test failed: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print("🌍 GAIASYSTEM BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"{Colors.ENDC}")
    
    print_info(f"Testing backend at: {BASE_URL}")
    print_info(f"Using tenant_id: {TENANT_ID}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Seed Data Creation", test_seed_data),
        ("Dashboard Statistics", test_dashboard_stats),
        ("Licenses Management", test_licenses),
        ("Projects Management", test_projects),
        ("Inspections Management", test_inspections),
        ("Additional Endpoints", test_additional_endpoints),
        ("Tenant Isolation", test_tenant_isolation)
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
    print("=" * 80)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 80)
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
        print(f"{Colors.GREEN}🎉 ALL TESTS PASSED! ({passed}/{total}){Colors.ENDC}")
    else:
        print(f"{Colors.YELLOW}⚠️  SOME TESTS FAILED: {passed}/{total} passed{Colors.ENDC}")
    
    print(f"{Colors.BOLD}{Colors.BLUE}")
    print("=" * 80)
    print(f"{Colors.ENDC}")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)