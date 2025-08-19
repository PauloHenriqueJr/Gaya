import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Home,
  FileText,
  Briefcase,
  ClipboardCheck,
  Droplets,
  Trash2,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Shield,
  Leaf
} from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Licenças', href: '/licenses', icon: FileText, badge: '12' },
    { name: 'Projetos', href: '/projects', icon: Briefcase, badge: '8' },
    { name: 'Vistorias', href: '/inspections', icon: ClipboardCheck },
    { name: 'Monitoramento', href: '/monitoring', icon: Droplets },
    { name: 'Resíduos', href: '/waste', icon: Trash2 },
    { name: 'Compromissos', href: '/commitments', icon: Calendar },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  ]

  const secondaryNavigation: NavigationItem[] = [
    { name: 'Documentação', href: '/documentation', icon: HelpCircle },
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Configurações', href: '/settings', icon: Settings },
    { name: 'Suporte', href: '/support', icon: Shield },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                GaiaSystem
              </h1>
              <p className="text-xs text-muted-foreground">Gestão Ambiental v2.2</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
            
            <ThemeToggle />
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-blue-500 text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">{user?.name || 'Usuário'}</div>
                <div className="text-xs text-muted-foreground">Administrador</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden w-64 shrink-0 border-r bg-background md:block h-[calc(100vh-4rem)]">
          <div className="flex h-full flex-col overflow-y-auto py-6">
            <div className="px-6 mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Navegação Principal
              </h3>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`mr-3 h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        {item.name}
                      </div>
                      {item.badge && (
                        <Badge variant={active ? 'default' : 'secondary'} className="h-5 w-5 p-0 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <Separator className="mx-6 mb-6" />

            <div className="px-6 mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Sistema
              </h3>
              <nav className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className={`mr-3 h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="mx-6 mt-auto">
              <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <h4 className="font-semibold mb-3">Status Rápido</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance</span>
                    <span className="font-semibold text-emerald-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Licenças Ativas</span>
                    <span className="font-semibold text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vistorias</span>
                    <span className="font-semibold text-purple-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}