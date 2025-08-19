from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="GaiaSystem API", version="2.2")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class LicenseType(str, Enum):
    LP = "LP"  # Licença Prévia
    LI = "LI"  # Licença de Instalação
    LO = "LO"  # Licença de Operação
    LA = "LA"  # Licença Ambiental
    AAF = "AAF"  # Autorização Ambiental de Funcionamento

class LicenseStatus(str, Enum):
    ACTIVE = "Ativa"
    EXPIRED = "Vencida"
    SUSPENDED = "Suspensa" 
    PENDING = "Pendente"
    CANCELLED = "Cancelada"

class ProjectStatus(str, Enum):
    PLANNING = "Planejamento"
    IN_PROGRESS = "Em Andamento"
    COMPLETED = "Concluído"
    SUSPENDED = "Suspenso"
    CANCELLED = "Cancelado"

class InspectionStatus(str, Enum):
    SCHEDULED = "Agendada"
    IN_PROGRESS = "Em Andamento"
    COMPLETED = "Concluída"
    CANCELLED = "Cancelada"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    role: str
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class License(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    number: str
    type: LicenseType
    title: str
    company: str
    cnpj: str
    status: LicenseStatus
    issue_date: str
    expiry_date: str
    issuing_body: str
    activity_type: str
    description: Optional[str] = None
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    status: ProjectStatus
    start_date: str
    end_date: Optional[str] = None
    budget: float
    manager: str
    location: str
    environmental_impact: str
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Inspection(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    location: str
    scheduled_date: str
    inspector: str
    status: InspectionStatus
    conformity_percentage: Optional[float] = 0
    checklist_items: List[Dict] = Field(default_factory=list)
    observations: Optional[str] = None
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WaterMonitoring(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    location: str
    collection_date: str
    ph_level: float
    turbidity: float
    dissolved_oxygen: float
    temperature: float
    conductivity: float
    status: str
    observations: Optional[str] = None
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Commitment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    due_date: str
    responsible: str
    status: str
    priority: str
    progress: int = 0
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WasteManagement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    waste_type: str
    classification: str  # Classe I, IIA, IIB
    quantity: float
    unit: str
    collection_date: str
    destination: str
    transport_company: str
    mtr_number: str
    status: str
    tenant_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Create models for requests
class LicenseCreate(BaseModel):
    number: str
    type: LicenseType
    title: str
    company: str
    cnpj: str
    status: LicenseStatus
    issue_date: str
    expiry_date: str
    issuing_body: str
    activity_type: str
    description: Optional[str] = None
    tenant_id: str

class ProjectCreate(BaseModel):
    name: str
    description: str
    status: ProjectStatus
    start_date: str
    end_date: Optional[str] = None
    budget: float
    manager: str
    location: str
    environmental_impact: str
    tenant_id: str

# Auth and Dashboard endpoints
@api_router.get("/")
async def root():
    return {"message": "GaiaSystem API v2.2 - Gestão Ambiental Digital"}

@api_router.get("/dashboard/stats")
async def get_dashboard_stats(tenant_id: str = Query(...)):
    try:
        licenses_count = await db.licenses.count_documents({"tenant_id": tenant_id})
        projects_count = await db.projects.count_documents({"tenant_id": tenant_id})
        inspections_count = await db.inspections.count_documents({"tenant_id": tenant_id})
        active_licenses = await db.licenses.count_documents({"tenant_id": tenant_id, "status": "Ativa"})
        
        return {
            "licenses_total": licenses_count,
            "projects_total": projects_count,
            "inspections_total": inspections_count,
            "licenses_active": active_licenses,
            "compliance_score": 85.7,
            "esg_score": 92.3
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# License endpoints
@api_router.post("/licenses", response_model=License)
async def create_license(license_data: LicenseCreate):
    try:
        license_obj = License(**license_data.dict())
        await db.licenses.insert_one(license_obj.dict())
        return license_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/licenses", response_model=List[License])
async def get_licenses(tenant_id: str = Query(...), status: Optional[str] = None, type: Optional[str] = None):
    try:
        query = {"tenant_id": tenant_id}
        if status:
            query["status"] = status
        if type:
            query["type"] = type
            
        licenses = await db.licenses.find(query).to_list(1000)
        return [License(**license) for license in licenses]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/licenses/{license_id}", response_model=License)
async def get_license(license_id: str, tenant_id: str = Query(...)):
    try:
        license_data = await db.licenses.find_one({"id": license_id, "tenant_id": tenant_id})
        if not license_data:
            raise HTTPException(status_code=404, detail="Licença não encontrada")
        return License(**license_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Project endpoints
@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate):
    try:
        project_obj = Project(**project_data.dict())
        await db.projects.insert_one(project_obj.dict())
        return project_obj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/projects", response_model=List[Project])
async def get_projects(tenant_id: str = Query(...), status: Optional[str] = None):
    try:
        query = {"tenant_id": tenant_id}
        if status:
            query["status"] = status
            
        projects = await db.projects.find(query).to_list(1000)
        return [Project(**project) for project in projects]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Inspection endpoints
@api_router.get("/inspections", response_model=List[Inspection])
async def get_inspections(tenant_id: str = Query(...)):
    try:
        inspections = await db.inspections.find({"tenant_id": tenant_id}).to_list(1000)
        return [Inspection(**inspection) for inspection in inspections]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Water monitoring endpoints
@api_router.get("/water-monitoring", response_model=List[WaterMonitoring])
async def get_water_monitoring(tenant_id: str = Query(...)):
    try:
        data = await db.water_monitoring.find({"tenant_id": tenant_id}).to_list(1000)
        return [WaterMonitoring(**item) for item in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Waste management endpoints
@api_router.get("/waste", response_model=List[WasteManagement])
async def get_waste_management(tenant_id: str = Query(...)):
    try:
        data = await db.waste_management.find({"tenant_id": tenant_id}).to_list(1000)
        return [WasteManagement(**item) for item in data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Commitments endpoints
@api_router.get("/commitments", response_model=List[Commitment])
async def get_commitments(tenant_id: str = Query(...)):
    try:
        commitments = await db.commitments.find({"tenant_id": tenant_id}).to_list(1000)
        return [Commitment(**commitment) for commitment in commitments]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Seed data endpoint for development
@api_router.post("/seed-data")
async def seed_data(tenant_id: str = Query("demo-tenant")):
    try:
        # Clear existing data for tenant
        await db.licenses.delete_many({"tenant_id": tenant_id})
        await db.projects.delete_many({"tenant_id": tenant_id})
        await db.inspections.delete_many({"tenant_id": tenant_id})
        
        # Sample Brazilian licenses
        sample_licenses = [
            {
                "id": str(uuid.uuid4()),
                "number": "LP001/2024-SP",
                "type": "LP",
                "title": "Licença Prévia - Complexo Industrial",
                "company": "Indústria Brasileira S.A.",
                "cnpj": "12.345.678/0001-90",
                "status": "Ativa",
                "issue_date": "2024-01-15",
                "expiry_date": "2025-01-15",
                "issuing_body": "CETESB",
                "activity_type": "Indústria Química",
                "description": "Licenciamento para instalação de complexo industrial químico",
                "tenant_id": tenant_id,
                "created_at": datetime.now(timezone.utc)
            },
            {
                "id": str(uuid.uuid4()),
                "number": "LO089/2023-RJ",
                "type": "LO",
                "title": "Licença de Operação - Refinaria",
                "company": "Petróleo do Brasil Ltda",
                "cnpj": "98.765.432/0001-10",
                "status": "Ativa",
                "issue_date": "2023-06-20",
                "expiry_date": "2028-06-20",
                "issuing_body": "INEA",
                "activity_type": "Refino de Petróleo",
                "description": "Operação de refinaria de petróleo",
                "tenant_id": tenant_id,
                "created_at": datetime.now(timezone.utc)
            }
        ]
        
        # Sample projects
        sample_projects = [
            {
                "id": str(uuid.uuid4()),
                "name": "Recuperação de Mata Ciliar - Rio Tietê",
                "description": "Projeto de recuperação de 50 hectares de mata ciliar",
                "status": "Em Andamento",
                "start_date": "2024-03-01",
                "end_date": "2024-12-31",
                "budget": 2500000.00,
                "manager": "Dr. Maria Silva",
                "location": "São Paulo, SP",
                "environmental_impact": "Recuperação de biodiversidade aquática",
                "tenant_id": tenant_id,
                "created_at": datetime.now(timezone.utc)
            }
        ]
        
        # Sample inspections
        sample_inspections = [
            {
                "id": str(uuid.uuid4()),
                "title": "Vistoria Trimestral - Tratamento de Efluentes",
                "location": "Complexo Industrial - São Bernardo do Campo, SP",
                "scheduled_date": "2024-07-20",
                "inspector": "Eng. João Santos",
                "status": "Concluída",
                "conformity_percentage": 87.5,
                "checklist_items": [
                    {"item": "Funcionamento da ETE", "status": "Conforme", "evidence": ""},
                    {"item": "Qualidade do efluente", "status": "Conforme", "evidence": ""},
                    {"item": "Documentação atualizada", "status": "Não Conforme", "evidence": ""}
                ],
                "observations": "Necessário atualizar certidões de destinação de resíduos",
                "tenant_id": tenant_id,
                "created_at": datetime.now(timezone.utc)
            }
        ]
        
        # Insert sample data
        await db.licenses.insert_many(sample_licenses)
        await db.projects.insert_many(sample_projects)
        await db.inspections.insert_many(sample_inspections)
        
        return {"message": "Dados de exemplo criados com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()