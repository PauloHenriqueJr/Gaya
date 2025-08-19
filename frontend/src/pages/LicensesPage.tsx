import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  RefreshCw,
  Calendar,
  Building,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface License {
  id: string
  numero: string
  orgao_emissor: string
  empresa: string
  cnpj: string
  tipo: string
  status: string
  data_emissao: string
  data_validade: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    'Ativa': { variant: 'default' as const, icon: CheckCircle, color: 'text-emerald-600' },
    'Vencida': { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
    'Pendente': { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
  }
  
  const config = variants[status as keyof typeof variants] || variants['Pendente']
  const Icon = config.icon
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

const LicensesPage: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchLicenses = async () => {
    try {
      setLoading(true)
      setError(null)
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const response = await axios.get(`${backendUrl}/api/licenses`, {
        params: { tenant_id: user.tenant_id || 'gaia_demo' }
      })
      setLicenses(response.data)
      setFilteredLicenses(response.data)
      toast.success('Licenças carregadas com sucesso!')
    } catch (error) {
      console.error('Erro ao buscar licenças:', error)
      setError('Erro ao carregar licenças')
      toast.error('Falha ao carregar licenças')
    } finally {
      setLoading(false)
    }
  }

  // Filter licenses based on search and status
  useEffect(() => {
    let filtered = licenses

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(license => 
        license.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.cnpj.includes(searchTerm) ||
        license.tipo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(license => license.status === statusFilter)
    }

    setFilteredLicenses(filtered)
  }, [licenses, searchTerm, statusFilter])

  useEffect(() => {
    fetchLicenses()
  }, [])

  const getStatusCounts = () => {
    return {
      total: licenses.length,
      ativa: licenses.filter(l => l.status === 'Ativa').length,
      vencida: licenses.filter(l => l.status === 'Vencida').length,
      pendente: licenses.filter(l => l.status === 'Pendente').length,
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Licenças Ambientais
          </h1>
          <p className="text-muted-foreground">
            Gerencie e monitore todas as licenças ambientais
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={fetchLicenses} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nova Licença
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{statusCounts.ativa}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.vencida}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pendente}</div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, empresa, CNPJ ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativa">Ativas</SelectItem>
                  <SelectItem value="Vencida">Vencidas</SelectItem>
                  <SelectItem value="Pendente">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Licenças Cadastradas
            <Badge variant="outline">{filteredLicenses.length} resultados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLicenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== 'all' ? 
                'Nenhuma licença encontrada com os filtros aplicados.' :
                'Nenhuma licença cadastrada.'
              }
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Validade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow key={license.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{license.numero}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          {license.empresa}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          CNPJ: {license.cnpj}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{license.tipo}</Badge>
                    </TableCell>
                    <TableCell>{license.orgao_emissor}</TableCell>
                    <TableCell>
                      <StatusBadge status={license.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(license.data_validade).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LicensesPage