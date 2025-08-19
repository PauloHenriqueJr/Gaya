import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  Briefcase, 
  ClipboardCheck, 
  Droplets, 
  Trash2, 
  Calendar,
  Users,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react'

const modules = [
  {
    name: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Visão geral das métricas ambientais e compliance',
    features: ['KPIs Ambientais', 'Métricas ESG', 'Alertas de Vencimento', 'Gráficos Interativos']
  },
  {
    name: 'Licenças Ambientais',
    icon: <FileText className="h-5 w-5" />,
    description: 'Gestão completa de licenças e autorizações ambientais',
    features: ['Cadastro de Licenças', 'Controle de Validade', 'Histórico de Renovações', 'Alertas Automáticos']
  },
  {
    name: 'Projetos',
    icon: <Briefcase className="h-5 w-5" />,
    description: 'Acompanhamento de projetos ambientais e sustentabilidade',
    features: ['Gestão de Projetos', 'Cronogramas', 'Orçamentos', 'Relatórios de Progresso']
  },
  {
    name: 'Vistorias',
    icon: <ClipboardCheck className="h-5 w-5" />,
    description: 'Sistema de vistorias e inspeções ambientais',
    features: ['Checklists Digitais', 'Coleta de Evidências', 'Relatórios Técnicos', 'Não Conformidades']
  },
  {
    name: 'Monitoramento Hídrico',
    icon: <Droplets className="h-5 w-5" />,
    description: 'Controle do uso e qualidade dos recursos hídricos',
    features: ['Medições de Consumo', 'Análises de Qualidade', 'Relatórios Mensais', 'Outorgas Hídricas']
  },
  {
    name: 'Gestão de Resíduos',
    icon: <Trash2 className="h-5 w-5" />,
    description: 'Controle completo da gestão de resíduos sólidos',
    features: ['Inventário de Resíduos', 'Destinação Final', 'MTRs Digitais', 'Rastreabilidade']
  },
  {
    name: 'Compromissos',
    icon: <Calendar className="h-5 w-5" />,
    description: 'Agenda e controle de compromissos ambientais',
    features: ['Cronograma de Atividades', 'Lembretes Automáticos', 'Prazos Legais', 'Relatórios de Cumprimento']
  }
]

const quickGuides = [
  {
    title: 'Primeiros Passos',
    description: 'Como começar a usar o GaiaSystem',
    duration: '5 min'
  },
  {
    title: 'Cadastrando sua primeira licença',
    description: 'Tutorial passo a passo para licenças',
    duration: '10 min'
  },
  {
    title: 'Criando uma vistoria',
    description: 'Como realizar vistorias digitais',
    duration: '15 min'
  },
  {
    title: 'Relatórios e Métricas',
    description: 'Extraindo insights dos dados',
    duration: '8 min'
  }
]

export default function DocumentationPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Documentação</h1>
        <p className="text-muted-foreground">
          Guia completo para uso do GaiaSystem - Plataforma de Gestão Ambiental Digital
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guias Rápidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guias Rápidos
            </CardTitle>
            <CardDescription>
              Tutoriais essenciais para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {quickGuides.map((guide, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{guide.title}</h4>
                      <Badge variant="secondary">{guide.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {guide.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
            <CardDescription>
              Detalhes técnicos e versão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Versão:</span>
                <p className="text-muted-foreground">v2.2.0</p>
              </div>
              <div>
                <span className="font-medium">Última Atualização:</span>
                <p className="text-muted-foreground">Janeiro 2025</p>
              </div>
              <div>
                <span className="font-medium">Módulos:</span>
                <p className="text-muted-foreground">7 ativos</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge variant="default">Online</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <span className="font-medium">Funcionalidades PWA:</span>
              <p className="text-sm text-muted-foreground mt-1">
                ✅ Instalável • ✅ Offline • ✅ Notificações • ✅ Responsivo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Módulos do Sistema
          </CardTitle>
          <CardDescription>
            Funcionalidades detalhadas de cada módulo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  {module.icon}
                  <h3 className="font-semibold">{module.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {module.description}
                </p>
                <div className="space-y-1">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atalhos de Teclado */}
      <Card>
        <CardHeader>
          <CardTitle>Atalhos de Teclado</CardTitle>
          <CardDescription>
            Navegue mais rapidamente pelo sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Navegação</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><Badge variant="outline">⌘K</Badge> Command Palette</p>
                <p><Badge variant="outline">H</Badge> Dashboard</p>
                <p><Badge variant="outline">L</Badge> Licenças</p>
                <p><Badge variant="outline">P</Badge> Projetos</p>
                <p><Badge variant="outline">I</Badge> Vistorias</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Ações</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><Badge variant="outline">⌘N</Badge> Nova Licença</p>
                <p><Badge variant="outline">⌘/</Badge> Busca Global</p>
                <p><Badge variant="outline">?</Badge> Ajuda</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}