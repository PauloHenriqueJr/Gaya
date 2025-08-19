
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Shield,
  Edit,
  Save,
  Camera,
  Award,
  Clock
} from 'lucide-react'

export default function ProfilePage() {
  const userProfile = {
    name: 'Ana Silva',
    email: 'ana.silva@empresa.com.br',
    phone: '+55 (11) 99999-9999',
    position: 'Gestora Ambiental',
    company: 'EcoTech Solutions',
    cnpj: '12.345.678/0001-90',
    location: 'São Paulo, SP',
    joinDate: 'Janeiro 2023',
    avatar: '/api/placeholder/150/150',
    bio: 'Especialista em gestão ambiental com 8 anos de experiência em licenciamento, auditorias e sustentabilidade corporativa.',
    certifications: [
      'ISO 14001 Lead Auditor',
      'Gestão de Resíduos Sólidos',
      'Licenciamento Ambiental'
    ],
    recentActivity: [
      { action: 'Criou nova licença ambiental', date: '2 dias atrás' },
      { action: 'Completou vistoria da Unidade SP-01', date: '5 dias atrás' },
      { action: 'Atualizou projeto de reflorestamento', date: '1 semana atrás' },
      { action: 'Enviou relatório mensal', date: '2 semanas atrás' }
    ]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Informações do Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize seus dados pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                  <p className="text-muted-foreground">{userProfile.position}</p>
                  <Badge variant="secondary">{userProfile.company}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" defaultValue={userProfile.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id="position" defaultValue={userProfile.position} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue={userProfile.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue={userProfile.phone} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Fale um pouco sobre sua experiência..."
                  defaultValue={userProfile.bio}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" defaultValue={userProfile.company} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue={userProfile.cnpj} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input id="location" defaultValue={userProfile.location} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Ingresso</Label>
                  <Input disabled defaultValue={userProfile.joinDate} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Informações Adicionais */}
        <div className="space-y-6">
          {/* Certificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userProfile.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="w-full justify-start">
                    {cert}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Adicionar Certificação
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">85</div>
                  <div className="text-xs text-muted-foreground">Licenças Ativas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-xs text-muted-foreground">Projetos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">142</div>
                  <div className="text-xs text-muted-foreground">Vistorias</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-xs text-muted-foreground">Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userProfile.recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{activity.date}</p>
                    {index < userProfile.recentActivity.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}