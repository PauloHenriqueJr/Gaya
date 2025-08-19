
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Database, 
  Download,
  Trash2,
  Key,
  Smartphone,
  Mail
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência no GaiaSystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a interface do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha entre claro, escuro ou automático
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label>Idioma</Label>
              <Select defaultValue="pt-BR">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Fuso Horário</Label>
              <Select defaultValue="america-sao_paulo">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america-sao_paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="america-rio_branco">Rio Branco (GMT-5)</SelectItem>
                  <SelectItem value="america-manaus">Manaus (GMT-4)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">
                  Habilitar animações da interface
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer ser notificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações por e-mail
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Push
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificações push no navegador
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Tipos de Notificação</h4>
              
              <div className="flex items-center justify-between">
                <Label>Vencimento de Licenças</Label>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Prazos de Projetos</Label>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Vistorias Pendentes</Label>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Relatórios Mensais</Label>
                <Switch />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Antecedência dos Alertas</Label>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 dias</SelectItem>
                  <SelectItem value="15">15 dias</SelectItem>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança da conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Autenticação de Dois Fatores (2FA)</Label>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Tempo de Sessão</Label>
              <Select defaultValue="8">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="8">8 horas</SelectItem>
                  <SelectItem value="24">24 horas</SelectItem>
                  <SelectItem value="never">Nunca expirar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Logout Automático</Label>
                <p className="text-sm text-muted-foreground">
                  Sair automaticamente por inatividade
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <Button variant="outline" className="w-full">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Dados e Privacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dados e Privacidade
            </CardTitle>
            <CardDescription>
              Gerencie seus dados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Exportar Dados</h4>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia de todos os seus dados
              </p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Solicitar Exportação
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Backup Automático</h4>
              <div className="flex items-center justify-between">
                <Label>Backup semanal dos dados</Label>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Análise de Uso</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Permitir análise anônima</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajude-nos a melhorar o produto
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-destructive">Zona de Perigo</h4>
              <p className="text-sm text-muted-foreground">
                Ações irreversíveis que afetam sua conta
              </p>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Versão</p>
              <p className="text-muted-foreground">v2.2.0</p>
            </div>
            <div>
              <p className="font-medium">Última Atualização</p>
              <p className="text-muted-foreground">Janeiro 2025</p>
            </div>
            <div>
              <p className="font-medium">Servidor</p>
              <p className="text-muted-foreground">Brasil (São Paulo)</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-green-600 font-medium">Online</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}