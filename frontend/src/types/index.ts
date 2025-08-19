// User and Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
}

export interface AuthCredentials {
  email: string;
  password: string;
}

// License types
export interface License {
  id: string;
  number: string;
  title: string;
  company: string;
  cnpj: string;
  status: 'Ativa' | 'Vencida' | 'Pendente' | 'Suspensa';
  type: 'LP' | 'LI' | 'LO' | 'AAF';
  activity_type: string;
  expiry_date: string;
  issue_date: string;
  issuing_body: string;
  tenant_id: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  manager: string;
  location: string;
  start_date: string;
  environmental_impact: string;
  tenant_id: string;
}

// Inspection types
export interface Inspection {
  id: string;
  title: string;
  location: string;
  scheduled_date: string;
  inspector: string;
  status: 'Concluída' | 'Pendente' | 'Em Andamento';
  conformity_percentage?: number;
  tenant_id: string;
}

// Dashboard Stats
export interface DashboardStats {
  licenses_total: number;
  projects_total: number;
  inspections_total: number;
  licenses_active: number;
  compliance_score: number;
  esg_score: number;
}

// Common API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Navigation
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType;
}
