import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Context para autenticação e tenant
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// Context para UI/Theme
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// Componentes de UI base
const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${error ? 'border-red-300' : 'border-gray-300'}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

const Select = ({ label, children, error, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${error ? 'border-red-300' : 'border-gray-300'}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

// Ícones simples usando CSS
const ChevronRightIcon = () => <span className="text-gray-400">›</span>;
const HomeIcon = () => <span className="w-5 h-5">🏠</span>;
const FileTextIcon = () => <span className="w-5 h-5">📄</span>;
const FolderIcon = () => <span className="w-5 h-5">📁</span>;
const CheckIcon = () => <span className="w-5 h-5">✓</span>;
const BarChartIcon = () => <span className="w-5 h-5">📊</span>;
const DropletIcon = () => <span className="w-5 h-5">💧</span>;
const TrashIcon = () => <span className="w-5 h-5">🗑️</span>;
const SearchIcon = () => <span className="w-5 h-5">🔍</span>;

// Layout principal
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Licenças', href: '/licenses', icon: FileTextIcon },
    { name: 'Projetos', href: '/projects', icon: FolderIcon },
    { name: 'Compromissos', href: '/commitments', icon: CheckIcon },
    { name: 'Vistorias', href: '/inspections', icon: CheckIcon },
    { name: 'Monitoramento Hídrico', href: '/water-monitoring', icon: DropletIcon },
    { name: 'Gestão de Resíduos', href: '/waste', icon: TrashIcon },
    { name: 'Relatórios', href: '/reports', icon: BarChartIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-emerald-600">GaiaSystem</h1>
              <span className="ml-2 text-sm text-gray-500">v2.2</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Páginas
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-600">GaiaSystem</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/login')}>
                Começar Gratuitamente
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestão Ambiental Digital
            <span className="block text-emerald-600">Inteligente e Sustentável</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma PWA completa para gestão de licenças ambientais, projetos sustentáveis, 
            vistorias digitais e monitoramento em tempo real. Soberania de dados garantida.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              Começar Gratuitamente
            </Button>
            <Button variant="outline" size="lg">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">18,500+</div>
              <div className="text-gray-600">Licenças Processadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">1,200+</div>
              <div className="text-gray-600">Organizações Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">99.9%</div>
              <div className="text-gray-600">Uptime Garantido</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">24/7</div>
              <div className="text-gray-600">Suporte Especializado</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Soluções Completas para Gestão Ambiental
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <FileTextIcon />
              <h3 className="text-lg font-semibold mb-2 mt-4">Licenças Ambientais</h3>
              <p className="text-gray-600">Gestão completa de LP, LI, LO e AAF com controle de prazos e renovações automáticas.</p>
            </Card>
            <Card>
              <CheckIcon />
              <h3 className="text-lg font-semibold mb-2 mt-4">Vistorias Digitais</h3>
              <p className="text-gray-600">Checklists inteligentes, evidências fotográficas e relatórios de conformidade em tempo real.</p>
            </Card>
            <Card>
              <DropletIcon />
              <h3 className="text-lg font-semibold mb-2 mt-4">Monitoramento Hídrico</h3>
              <p className="text-gray-600">Controle de qualidade da água, análises laboratoriais e compliance com legislação.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: 'admin@gaia.com.br', password: '123456' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-600 mb-2">GaiaSystem</h1>
          <p className="text-gray-600">Entre na sua conta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { currentTenant } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [currentTenant]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats?tenant_id=${currentTenant}`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button>Nova Licença</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.licenses_total || 0}</div>
          <div className="text-gray-600">Total de Licenças</div>
          <div className="text-sm text-emerald-600 mt-1">{stats?.licenses_active || 0} Ativas</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats?.projects_total || 0}</div>
          <div className="text-gray-600">Projetos Ativos</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-purple-600">{stats?.inspections_total || 0}</div>
          <div className="text-gray-600">Vistorias</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats?.compliance_score || 0}%</div>
          <div className="text-gray-600">Score de Compliance</div>
        </Card>
      </div>

      {/* ESG Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Score ESG</h3>
          <div className="flex items-center justify-between mb-2">
            <span>Ambiental (E)</span>
            <span className="font-semibold">95%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-emerald-600 h-2 rounded-full" style={{width: '95%'}}></div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span>Social (S)</span>
            <span className="font-semibold">88%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{width: '88%'}}></div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span>Governança (G)</span>
            <span className="font-semibold">92%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileTextIcon />
              <span className="ml-2">Nova Licença Ambiental</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CheckIcon />
              <span className="ml-2">Agendar Vistoria</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChartIcon />
              <span className="ml-2">Gerar Relatório</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium">Licença LP001/2024-SP aprovada</div>
                <div className="text-sm text-gray-500">Indústria Brasileira S.A. - há 2 horas</div>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Aprovada</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="font-medium">Vistoria concluída com 87% de conformidade</div>
                <div className="text-sm text-gray-500">Complexo Industrial - há 4 horas</div>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Concluída</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const LicensesPage = () => {
  const { currentTenant } = useAuth();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '' });

  useEffect(() => {
    fetchLicenses();
  }, [currentTenant, filters]);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ tenant_id: currentTenant });
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      
      const response = await axios.get(`${API}/licenses?${params}`);
      setLicenses(response.data);
    } catch (error) {
      console.error('Erro ao carregar licenças:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Ativa': 'bg-emerald-100 text-emerald-700',
      'Vencida': 'bg-red-100 text-red-700',
      'Pendente': 'bg-yellow-100 text-yellow-700',
      'Suspensa': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Licenças Ambientais</h1>
        <Button>Nova Licença</Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">Todos os Status</option>
            <option value="Ativa">Ativa</option>
            <option value="Vencida">Vencida</option>
            <option value="Pendente">Pendente</option>
            <option value="Suspensa">Suspensa</option>
          </Select>
          
          <Select
            label="Tipo"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">Todos os Tipos</option>
            <option value="LP">LP - Licença Prévia</option>
            <option value="LI">LI - Licença de Instalação</option>
            <option value="LO">LO - Licença de Operação</option>
            <option value="AAF">AAF - Autorização Ambiental</option>
          </Select>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <SearchIcon />
              <span className="ml-2">Buscar</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela de Licenças */}
      <Card>
        {loading ? (
          <div className="text-center py-8">Carregando licenças...</div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma licença encontrada. <Button variant="outline" size="sm">Criar primeira licença</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Órgão</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-emerald-600">{license.number}</div>
                      <div className="text-sm text-gray-500">{license.title}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium">{license.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{license.company}</div>
                      <div className="text-sm text-gray-500">{license.cnpj}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(license.status)}`}>
                        {license.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {license.expiry_date}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {license.issuing_body}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// Página de Projetos
const ProjectsPage = () => {
  const { currentTenant } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [currentTenant]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects?tenant_id=${currentTenant}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Projetos Ambientais</h1>
        <Button>Novo Projeto</Button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8">Carregando projetos...</div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    project.status === 'Em Andamento' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Orçamento:</span>
                    <div className="font-medium">R$ {project.budget?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Gerente:</span>
                    <div className="font-medium">{project.manager}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Local:</span>
                    <div className="font-medium">{project.location}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Início:</span>
                    <div className="font-medium">{project.start_date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// Página de Vistorias
const InspectionsPage = () => {
  const { currentTenant } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspections();
  }, [currentTenant]);

  const fetchInspections = async () => {
    try {
      const response = await axios.get(`${API}/inspections?tenant_id=${currentTenant}`);
      setInspections(response.data);
    } catch (error) {
      console.error('Erro ao carregar vistorias:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vistorias Ambientais</h1>
        <Button>Nova Vistoria</Button>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-8">Carregando vistorias...</div>
        ) : (
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{inspection.title}</h3>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    inspection.status === 'Concluída' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {inspection.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-gray-500 text-sm">Local:</span>
                    <div className="font-medium">{inspection.location}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Data:</span>
                    <div className="font-medium">{inspection.scheduled_date}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Inspetor:</span>
                    <div className="font-medium">{inspection.inspector}</div>
                  </div>
                </div>
                {inspection.conformity_percentage !== null && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Conformidade</span>
                      <span className="font-semibold text-lg">{inspection.conformity_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${inspection.conformity_percentage >= 80 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                        style={{width: `${inspection.conformity_percentage}%`}}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// Outras páginas simplificadas
const CommitmentsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Compromissos Ambientais</h1>
    <Card>
      <div className="text-center py-8 text-gray-500">
        Módulo de Compromissos em desenvolvimento
      </div>
    </Card>
  </div>
);

const WaterMonitoringPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Monitoramento Hídrico</h1>
    <Card>
      <div className="text-center py-8 text-gray-500">
        Módulo de Monitoramento Hídrico em desenvolvimento
      </div>
    </Card>
  </div>
);

const WastePage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Gestão de Resíduos</h1>
    <Card>
      <div className="text-center py-8 text-gray-500">
        Módulo de Gestão de Resíduos em desenvolvimento
      </div>
    </Card>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
    <Card>
      <div className="text-center py-8 text-gray-500">
        Módulo de Relatórios em desenvolvimento
      </div>
    </Card>
  </div>
);

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Provider de autenticação
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentTenant, setCurrentTenant] = useState('demo-tenant');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials) => {
    // Simulação de login
    const mockUser = {
      id: '1',
      name: 'Administrador',
      email: credentials.email,
      role: 'admin'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Criar dados de exemplo após login
    try {
      await axios.post(`${API}/seed-data?tenant_id=${currentTenant}`);
    } catch (error) {
      console.error('Erro ao criar dados de exemplo:', error);
    }
    
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      currentTenant, 
      setCurrentTenant 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente principal da aplicação
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/licenses" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LicensesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProjectsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/inspections" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <InspectionsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/commitments" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CommitmentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/water-monitoring" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <WaterMonitoringPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/waste" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <WastePage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;