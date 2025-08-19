import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { User, AuthCredentials, License, Project, Inspection, DashboardStats, NavigationItem } from './types';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context Types
interface AuthContextType {
  user: User | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  currentTenant: string;
  setCurrentTenant: (tenant: string) => void;
}

// Context para autenticação e tenant
const AuthContext = createContext<AuthContextType | null>(null);
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Component Props Types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

// Componentes de UI modernos
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', onClick, className = '', ...props }) => {
  const variants: Record<string, string> = {
    primary: 'btn-gaia-primary',
    secondary: 'btn-gaia-secondary',
    outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300'
  };
  
  return (
    <button 
      className={`${variants[variant]} ${className} transition-all duration-300 transform hover:scale-105`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`glass-card rounded-2xl ${className}`}>
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
    <input 
      className={`input-premium w-full ${error ? 'border-red-400' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

const Select: React.FC<SelectProps> = ({ label, children, error, className = '', ...props }) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
    <select 
      className={`input-premium w-full ${error ? 'border-red-400' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

// Ícones melhorados com emoji
const HomeIcon = () => <span className="text-2xl">🏠</span>;
const FileTextIcon = () => <span className="text-2xl">📋</span>;
const FolderIcon = () => <span className="text-2xl">🌿</span>;
const CheckIcon = () => <span className="text-2xl">✅</span>;
const BarChartIcon = () => <span className="text-2xl">📊</span>;
const DropletIcon = () => <span className="text-2xl">💧</span>;
const TrashIcon = () => <span className="text-2xl">♻️</span>;
const SearchIcon = () => <span className="text-xl">🔍</span>;
const StarIcon = () => <span className="text-xl">⭐</span>;
const ShieldIcon = () => <span className="text-xl">🛡️</span>;
const LeafIcon = () => <span className="text-xl">🍃</span>;

// Layout moderno
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigation: NavigationItem[] = [
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Premium */}
      <header className="header-premium sticky top-0 z-50">
        <div className="mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <LeafIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  GaiaSystem
                </h1>
                <span className="text-xs text-gray-500 font-medium">Gestão Ambiental v2.2</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Olá, {user?.name}</div>
                  <div className="text-xs text-gray-500">Administrador</div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="hidden md:block">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Premium */}
        <aside className="w-72 nav-modern min-h-screen sticky top-20">
          <nav className="mt-8">
            <div className="px-6 mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Navegação Principal
              </h3>
            </div>
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`nav-item-modern ${
                        isActive ? 'nav-item-active' : 'nav-item-inactive'
                      }`}
                    >
                      <Icon />
                      <span className="ml-4 font-medium">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Quick Stats na Sidebar */}
            <div className="mx-4 mt-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100">
              <h4 className="font-semibold text-gray-900 mb-3">Status Rápido</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Compliance</span>
                  <span className="text-sm font-bold text-emerald-600">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Licenças Ativas</span>
                  <span className="text-sm font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vistorias</span>
                  <span className="text-sm font-bold text-purple-600">8</span>
                </div>
              </div>
            </div>
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

// Landing Page Premium
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header Premium */}
      <header className="header-premium relative z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                <LeafIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  GaiaSystem
                </h1>
                <span className="text-xs text-gray-500 font-medium">Gestão Ambiental Digital</span>
              </div>
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

      {/* Hero Section Premium */}
      <section className="hero-section flex items-center">
        <div className="hero-content w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center animate-fadeInUp">
              <div className="mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 border border-emerald-200">
                  <StarIcon />
                  <span className="ml-2">Plataforma Líder em Gestão Ambiental</span>
                </span>
              </div>
              
              <h1 className="hero-title mb-8 animate-fadeInUp">
                Transforme sua
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestão Ambiental
                </span>
              </h1>
              
              <p className="hero-subtitle mb-12 animate-fadeInUp">
                Plataforma completa para licenciamento, monitoramento e compliance ambiental. 
                Automatize processos, reduza riscos e garanta conformidade com a legislação brasileira.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12 animate-fadeInUp">
                <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-4">
                  🚀 Começar Gratuitamente
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={() => {}}>
                  📹 Ver Demonstração
                </Button>
              </div>
              
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 animate-slideInRight">
                <div className="flex items-center">
                  <ShieldIcon />
                  <span className="ml-2 font-medium">Segurança Total</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon />
                  <span className="ml-2 font-medium">Compliance Garantido</span>
                </div>
                <div className="flex items-center">
                  <LeafIcon />
                  <span className="ml-2 font-medium">Sustentabilidade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Premium */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-blue-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Resultados que Impressionam
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais de 1.200 organizações confiam no GaiaSystem para sua gestão ambiental
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="stat-card animate-fadeInUp">
              <div className="stat-number">18,500+</div>
              <div className="stat-label">Licenças Processadas</div>
              <div className="mt-2 text-sm text-emerald-600 font-medium">↗ +24% este ano</div>
            </div>
            <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Organizações Ativas</div>
              <div className="mt-2 text-sm text-blue-600 font-medium">↗ +18% este ano</div>
            </div>
            <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime Garantido</div>
              <div className="mt-2 text-sm text-purple-600 font-medium">🛡️ SLA Premium</div>
            </div>
            <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Suporte Especializado</div>
              <div className="mt-2 text-sm text-orange-600 font-medium">📞 Sempre disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Premium */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Soluções Completas para Gestão Ambiental
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para gerenciar licenças, projetos e compliance ambiental em uma única plataforma
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card animate-fadeInUp">
              <div className="feature-icon">
                <FileTextIcon />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Licenças Ambientais</h3>
              <p className="text-gray-600 mb-6">
                Gestão completa de LP, LI, LO e AAF com controle automático de prazos, 
                renovações e integração com órgãos ambientais.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>✅ Controle de vencimentos</li>
                <li>✅ Integração CETESB/INEA</li>
                <li>✅ Alertas automáticos</li>
              </ul>
            </div>
            
            <div className="feature-card animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <div className="feature-icon">
                <CheckIcon />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Vistorias Digitais</h3>
              <p className="text-gray-600 mb-6">
                Checklists inteligentes, evidências fotograficas geo-referenciadas e 
                relatórios de conformidade em tempo real.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>✅ Checklists personalizáveis</li>
                <li>✅ Fotos geo-localizadas</li>
                <li>✅ Relatórios automáticos</li>
              </ul>
            </div>
            
            <div className="feature-card animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">
                <DropletIcon />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Monitoramento Hídrico</h3>
              <p className="text-gray-600 mb-6">
                Controle completo da qualidade da água, análises laboratoriais e 
                compliance com legislação hídrica brasileira.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>✅ Análises laboratoriais</li>
                <li>✅ Conformidade ANA</li>
                <li>✅ Dashboards em tempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section Premium */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Revolucionar sua Gestão Ambiental?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
            Junte-se a mais de 1.200 organizações que já transformaram seus processos ambientais
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl"
            >
              🚀 Começar Gratuitamente
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-4"
              onClick={() => {}}
            >
              📞 Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
              <LeafIcon />
            </div>
            <div>
              <h3 className="text-2xl font-bold">GaiaSystem</h3>
              <p className="text-gray-400 text-sm">Gestão Ambiental Digital</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            © 2024 GaiaSystem - Plataforma de Gestão Ambiental Digital
          </p>
          <p className="text-sm text-gray-500">
            Versão 2.2 - Última atualização: Janeiro 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

// Login Page Premium
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<AuthCredentials>({ email: 'admin@gaia.com.br', password: '123456' });
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular loading
    await login(credentials);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LeafIcon />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
              GaiaSystem
            </h1>
            <p className="text-gray-600 font-medium">Entre na sua conta</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
              className="text-lg"
            />
            <Input
              label="Senha"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              className="text-lg"
            />
            <Button 
              type="submit" 
              className="w-full text-lg py-4" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner-premium mr-3"></div>
                  Entrando...
                </div>
              ) : (
                '🚀 Entrar no Sistema'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Dados demo: admin@gaia.com.br / 123456
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Dashboard Premium
const Dashboard: React.FC = () => {
  const { currentTenant } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loading-premium">
          <div className="loading-spinner-premium"></div>
          Carregando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Visão geral da sua gestão ambiental</p>
        </div>
        <div className="animate-slideInRight">
          <Button className="shadow-lg" onClick={() => {}}>
            ✨ Nova Licença
          </Button>
        </div>
      </div>

      {/* Stats Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card animate-fadeInUp">
          <div className="flex items-center justify-between mb-4">
            <FileTextIcon />
            <span className="text-sm font-medium text-gray-500">Total</span>
          </div>
          <div className="stat-number text-blue-600">{stats?.licenses_total || 0}</div>
          <div className="stat-label">Licenças Ambientais</div>
          <div className="mt-3 text-sm text-emerald-600 font-medium">
            ✅ {stats?.licenses_active || 0} Ativas
          </div>
        </div>
        
        <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-4">
            <FolderIcon />
            <span className="text-sm font-medium text-gray-500">Ativos</span>
          </div>
          <div className="stat-number text-emerald-600">{stats?.projects_total || 0}</div>
          <div className="stat-label">Projetos Ambientais</div>
          <div className="mt-3 text-sm text-blue-600 font-medium">
            🚀 Em Andamento
          </div>
        </div>
        
        <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-4">
            <CheckIcon />
            <span className="text-sm font-medium text-gray-500">Este Mês</span>
          </div>
          <div className="stat-number text-purple-600">{stats?.inspections_total || 0}</div>
          <div className="stat-label">Vistorias Realizadas</div>
          <div className="mt-3 text-sm text-purple-600 font-medium">
            📋 Compliance OK
          </div>
        </div>
        
        <div className="stat-card animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-4">
            <ShieldIcon />
            <span className="text-sm font-medium text-gray-500">Score</span>
          </div>
          <div className="stat-number text-orange-600">{stats?.compliance_score || 0}%</div>
          <div className="stat-label">Compliance Ambiental</div>
          <div className="mt-3 text-sm text-emerald-600 font-medium">
            📈 Excelente
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ESG Score Card Premium */}
        <div className="lg:col-span-2">
          <Card className="esg-card animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Score ESG</h3>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {stats?.esg_score || 92}%
                </span>
                <StarIcon />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="font-semibold text-gray-900">Ambiental (E)</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">95%</span>
                </div>
                <div className="esg-bar bg-gray-200">
                  <div className="esg-bar-environmental h-full rounded-full" style={{width: '95%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="font-semibold text-gray-900">Social (S)</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">88%</span>
                </div>
                <div className="esg-bar bg-gray-200">
                  <div className="esg-bar-social h-full rounded-full" style={{width: '88%'}}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="font-semibold text-gray-900">Governança (G)</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">92%</span>
                </div>
                <div className="esg-bar bg-gray-200">
                  <div className="esg-bar-governance h-full rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Premium */}
        <div>
          <Card className="p-8 animate-slideInRight">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start p-4 text-left" onClick={() => {}}>
                <FileTextIcon />
                <div className="ml-4">
                  <div className="font-semibold">Nova Licença</div>
                  <div className="text-sm text-gray-500">Cadastrar licença ambiental</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start p-4 text-left" onClick={() => {}}>
                <CheckIcon />
                <div className="ml-4">
                  <div className="font-semibold">Agendar Vistoria</div>
                  <div className="text-sm text-gray-500">Nova inspeção de campo</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start p-4 text-left" onClick={() => {}}>
                <BarChartIcon />
                <div className="ml-4">
                  <div className="font-semibold">Gerar Relatório</div>
                  <div className="text-sm text-gray-500">Análise detalhada</div>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start p-4 text-left" onClick={() => {}}>
                <DropletIcon />
                <div className="ml-4">
                  <div className="font-semibold">Monitoramento</div>
                  <div className="text-sm text-gray-500">Qualidade da água</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Premium */}
      <Card className="p-8 animate-fadeInUp">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h3>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Licença LP001/2024-SP aprovada</h4>
                <span className="badge-premium badge-active">Aprovada</span>
              </div>
              <p className="text-gray-600 mt-1">Indústria Brasileira S.A. - CETESB</p>
              <p className="text-sm text-gray-500 mt-1">há 2 horas</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Vistoria concluída com 87% de conformidade</h4>
                <span className="badge-premium" style={{background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.3)'}}>
                  Concluída
                </span>
              </div>
              <p className="text-gray-600 mt-1">Complexo Industrial - São Bernardo do Campo, SP</p>
              <p className="text-sm text-gray-500 mt-1">há 4 horas</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FolderIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Projeto Mata Ciliar - Progresso 75%</h4>
                <span className="badge-premium" style={{background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)', color: '#7c3aed', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                  Em Andamento
                </span>
              </div>
              <p className="text-gray-600 mt-1">Recuperação de 50 hectares - Rio Tietê</p>
              <p className="text-sm text-gray-500 mt-1">há 1 dia</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Licenses Page Premium
const LicensesPage: React.FC = () => {
  const { currentTenant } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
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

  const getStatusBadge = (status: License['status']) => {
    const statusConfig: Record<License['status'], { class: string; icon: string }> = {
      'Ativa': { class: 'badge-active', icon: '✅' },
      'Vencida': { class: 'badge-expired', icon: '❌' },
      'Pendente': { class: 'badge-pending', icon: '⏳' },
      'Suspensa': { class: 'badge-premium', icon: '⏸️' }
    };
    const config = statusConfig[status];
    return { class: `badge-premium ${config.class}`, icon: config.icon };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Licenças Ambientais</h1>
          <p className="text-lg text-gray-600">Gestão completa do seu portfólio de licenças</p>
        </div>
        <div className="animate-slideInRight">
          <Button className="shadow-lg" onClick={() => {}}>
            ✨ Nova Licença
          </Button>
        </div>
      </div>

      {/* Filtros Premium */}
      <Card className="filter-section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Select
            label="📋 Status da Licença"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">Todos os Status</option>
            <option value="Ativa">✅ Ativa</option>
            <option value="Vencida">❌ Vencida</option>
            <option value="Pendente">⏳ Pendente</option>
            <option value="Suspensa">⏸️ Suspensa</option>
          </Select>
          
          <Select
            label="📄 Tipo de Licença"
            value={filters.type}
            onChange={(e) => setFilters({...filters, type: e.target.value})}
          >
            <option value="">Todos os Tipos</option>
            <option value="LP">🟢 LP - Licença Prévia</option>
            <option value="LI">🔵 LI - Licença de Instalação</option>
            <option value="LO">🟡 LO - Licença de Operação</option>
            <option value="AAF">🟣 AAF - Autorização Ambiental</option>
          </Select>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">🔍 Busca Rápida</label>
            <Input placeholder="Buscar por empresa ou número..." />
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => {}}>
              <SearchIcon />
              <span className="ml-2">Filtrar</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela Premium */}
      <Card className="table-premium">
        {loading ? (
          <div className="loading-premium p-12">
            <div className="loading-spinner-premium"></div>
            Carregando licenças...
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma licença encontrada</h3>
            <p className="text-gray-600 mb-6">Comece criando sua primeira licença ambiental</p>
            <Button onClick={() => {}}>✨ Criar Primeira Licença</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header-premium">
                  <th className="text-left py-6 px-6 font-bold text-gray-900">📋 Licença</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-900">🏢 Empresa</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-900">📊 Status</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-900">📅 Vencimento</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-900">🏛️ Órgão</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-900">⚡ Ações</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => {
                  const statusBadge = getStatusBadge(license.status);
                  return (
                    <tr key={license.id} className="table-row-premium">
                      <td className="table-cell-premium">
                        <div>
                          <div className="font-bold text-emerald-600 text-lg">{license.number}</div>
                          <div className="text-gray-600 font-medium">{license.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                              {license.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell-premium">
                        <div>
                          <div className="font-semibold text-gray-900">{license.company}</div>
                          <div className="text-sm text-gray-500 font-mono">{license.cnpj}</div>
                          <div className="text-xs text-gray-400">{license.activity_type}</div>
                        </div>
                      </td>
                      <td className="table-cell-premium">
                        <span className={statusBadge.class}>
                          {statusBadge.icon} {license.status}
                        </span>
                      </td>
                      <td className="table-cell-premium">
                        <div className="font-medium text-gray-900">{license.expiry_date}</div>
                        <div className="text-sm text-gray-500">Emissão: {license.issue_date}</div>
                      </td>
                      <td className="table-cell-premium">
                        <div className="font-medium text-gray-900">{license.issuing_body}</div>
                      </td>
                      <td className="table-cell-premium">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {}}>👁️ Ver</Button>
                          <Button variant="outline" size="sm" onClick={() => {}}>✏️ Editar</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

// Outras páginas com design melhorado
const ProjectsPage: React.FC = () => {
  const { currentTenant } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
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
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Projetos Ambientais</h1>
          <p className="text-lg text-gray-600">Gestão de projetos sustentáveis e recuperação ambiental</p>
        </div>
        <Button className="shadow-lg animate-slideInRight" onClick={() => {}}>
          🌱 Novo Projeto
        </Button>
      </div>

      <Card className="p-8">
        {loading ? (
          <div className="loading-premium">
            <div className="loading-spinner-premium"></div>
            Carregando projetos...
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="feature-card">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="feature-icon">
                      <FolderIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                    </div>
                  </div>
                  <span className={`badge-premium ${
                    project.status === 'Em Andamento' ? 'badge-active' : 'badge-premium'
                  }`}>
                    {project.status === 'Em Andamento' ? '🚀' : '📋'} {project.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-600">R$ {project.budget?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 font-medium">Orçamento</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">{project.manager}</div>
                    <div className="text-sm text-gray-600 font-medium">Gerente</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-600">{project.location}</div>
                    <div className="text-sm text-gray-600 font-medium">Localização</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <div className="text-lg font-bold text-orange-600">{project.start_date}</div>
                    <div className="text-sm text-gray-600 font-medium">Início</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-2">🌍 Impacto Ambiental</div>
                  <p className="text-gray-700">{project.environmental_impact}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const InspectionsPage: React.FC = () => {
  const { currentTenant } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
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
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="animate-fadeInUp">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vistorias Ambientais</h1>
          <p className="text-lg text-gray-600">Inspeções digitais com checklists inteligentes</p>
        </div>
        <Button className="shadow-lg animate-slideInRight" onClick={() => {}}>
          🔍 Nova Vistoria
        </Button>
      </div>

      <Card className="p-8">
        {loading ? (
          <div className="loading-premium">
            <div className="loading-spinner-premium"></div>
            Carregando vistorias...
          </div>
        ) : (
          <div className="space-y-6">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="feature-card">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="feature-icon">
                      <CheckIcon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{inspection.title}</h3>
                    </div>
                  </div>
                  <span className={`badge-premium ${
                    inspection.status === 'Concluída' ? 'badge-active' : 'badge-pending'
                  }`}>
                    {inspection.status === 'Concluída' ? '✅' : '⏳'} {inspection.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-lg font-bold text-blue-600">{inspection.location}</div>
                    <div className="text-sm text-gray-600 font-medium">📍 Local da Vistoria</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl">
                    <div className="text-lg font-bold text-emerald-600">{inspection.scheduled_date}</div>
                    <div className="text-sm text-gray-600 font-medium">📅 Data Agendada</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-lg font-bold text-purple-600">{inspection.inspector}</div>
                    <div className="text-sm text-gray-600 font-medium">👤 Inspetor</div>
                  </div>
                </div>
                
                {inspection.conformity_percentage !== null && (
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">📊 Índice de Conformidade</span>
                      <span className="text-3xl font-bold text-emerald-600">{inspection.conformity_percentage}%</span>
                    </div>
                    <div className="progress-bar-premium bg-gray-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          inspection.conformity_percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                        style={{width: `${inspection.conformity_percentage}%`}}
                      ></div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      {inspection.conformity_percentage >= 80 ? '✅ Excelente conformidade' : '⚠️ Necessita atenção'}
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

// Outras páginas simplificadas com novo design
const CommitmentsPage = () => (
  <div className="space-y-8">
    <div className="animate-fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Compromissos Ambientais</h1>
      <p className="text-lg text-gray-600">Gestão de obrigações e compromissos legais</p>
    </div>
    <Card className="p-16 text-center">
      <div className="text-8xl mb-6">⚖️</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Módulo em Desenvolvimento</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Sistema avançado de gestão de compromissos ambientais em breve
      </p>
      <Button>🚀 Notificar quando disponível</Button>
    </Card>
  </div>
);

const WaterMonitoringPage = () => (
  <div className="space-y-8">
    <div className="animate-fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Monitoramento Hídrico</h1>
      <p className="text-lg text-gray-600">Controle de qualidade da água e compliance hídrico</p>
    </div>
    <Card className="p-16 text-center">
      <div className="text-8xl mb-6">💧</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Módulo em Desenvolvimento</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Sistema completo de monitoramento da qualidade da água em breve
      </p>
      <Button>🚀 Notificar quando disponível</Button>
    </Card>
  </div>
);

const WastePage = () => (
  <div className="space-y-8">
    <div className="animate-fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestão de Resíduos</h1>
      <p className="text-lg text-gray-600">Controle completo do ciclo de vida dos resíduos</p>
    </div>
    <Card className="p-16 text-center">
      <div className="text-8xl mb-6">♻️</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Módulo em Desenvolvimento</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Sistema avançado de gestão de resíduos e MTRs em breve
      </p>
      <Button>🚀 Notificar quando disponível</Button>
    </Card>
  </div>
);

const ReportsPage = () => (
  <div className="space-y-8">
    <div className="animate-fadeInUp">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Relatórios e Análises</h1>
      <p className="text-lg text-gray-600">Business Intelligence para gestão ambiental</p>
    </div>
    <Card className="p-16 text-center">
      <div className="text-8xl mb-6">📈</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Módulo em Desenvolvimento</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Sistema avançado de relatórios e dashboards analíticos em breve
      </p>
      <Button>🚀 Notificar quando disponível</Button>
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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials) => {
    const mockUser = {
      id: '1',
      name: 'Administrador',
      email: credentials.email,
      role: 'admin'
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
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