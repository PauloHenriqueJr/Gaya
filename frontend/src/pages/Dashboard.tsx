import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  FileText, 
  Briefcase, 
  ClipboardCheck, 
  Shield, 
  TrendingUp, 
  Leaf,
  RefreshCw,
  AlertCircle 
} from 'lucide-react'

interface DashboardStats {
  licenses_total: number
  projects_total: number
  inspections_total: number
  licenses_active: number
  compliance_score: number
  esg_score: number
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  description?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
)

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
        params: { tenant_id: user.tenant_id || 'gaia_demo' }
      })
      setStats(response.data)
      toast.success('Dashboard atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      setError('Erro ao carregar dados do dashboard')
      toast.error('Falha ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            Dashboard GaiaSystem
          </h1>
          <p className="text-muted-foreground">
            Visão geral da sua gestão ambiental
          </p>
        </div>
        
        <Button onClick={fetchStats} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Licenças"
          value={stats?.licenses_total || 0}
          icon={FileText}
          color="text-blue-600"
          description="Licenças registradas no sistema"
        />
        
        <StatCard
          title="Projetos Ativos"
          value={stats?.projects_total || 0}
          icon={Briefcase}
          color="text-green-600"
          description="Projetos em andamento"
        />
        
        <StatCard
          title="Vistorias Realizadas"
          value={stats?.inspections_total || 0}
          icon={ClipboardCheck}
          color="text-orange-600"
          description="Total de inspeções"
        />
        
        <StatCard
          title="Licenças Ativas"
          value={stats?.licenses_active || 0}
          icon={Shield}
          color="text-purple-600"
          description="Licenças válidas e ativas"
        />
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Conformidade</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold">{stats?.compliance_score || 0}%</div>
            <Progress value={stats?.compliance_score || 0} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {(stats?.compliance_score || 0) >= 90 ? 'Excelente' : 
               (stats?.compliance_score || 0) >= 70 ? 'Bom' : 'Requer atenção'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score ESG</CardTitle>
            <Leaf className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats?.esg_score || 0}%</span>
              <Badge variant={(stats?.esg_score || 0) >= 90 ? 'default' : 'secondary'}>
                {(stats?.esg_score || 0) >= 90 ? 'Sustentável' : 'Melhorando'}
              </Badge>
            </div>
            <Progress value={stats?.esg_score || 0} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Impacto ambiental e social
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Bem-vindo ao <span className="font-semibold">GaiaSystem</span> - sua plataforma completa para gestão ambiental digital.
            Monitore licenças, projetos e mantenha a conformidade ambiental de forma eficiente e inteligente.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-emerald-600">
              <Leaf className="mr-1 h-3 w-3" />
              Sustentabilidade
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              <Shield className="mr-1 h-3 w-3" />
              Compliance
            </Badge>
            <Badge variant="outline" className="text-purple-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              Analytics
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard