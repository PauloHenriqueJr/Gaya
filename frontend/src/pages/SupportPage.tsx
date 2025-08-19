import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Search,
  Send
} from 'lucide-react'

const faqs = [
  {
    question: 'Como cadastrar uma nova licença ambiental?',
    answer: 'Para cadastrar uma nova licença: 1) Acesse o módulo Licenças, 2) Clique em "Nova Licença", 3) Preencha os dados obrigatórios (número, órgão emissor, validade), 4) Anexe os documentos necessários, 5) Salve a licença. O sistema enviará alertas automáticos próximo ao vencimento.'
  },
  {
    question: 'Como criar uma vistoria digital?',
    answer: 'Para criar uma vistoria: 1) Vá ao módulo Vistorias, 2) Selecione "Nova Vistoria", 3) Escolha o tipo de vistoria e local, 4) Preencha o checklist digital, 5) Adicione fotos e observações, 6) Finalize a vistoria. O relatório será gerado automaticamente.'
  },
  {
    question: 'Como funciona o sistema de alertas?',
    answer: 'O GaiaSystem envia alertas automáticos por e-mail e notificações push para: vencimentos de licenças, prazos de projetos, vistorias pendentes e outros compromissos. Você pode configurar a antecedência dos alertas nas Configurações.'
  },
  {
    question: 'Posso usar o sistema offline?',
    answer: 'Sim! O GaiaSystem é um PWA (Progressive Web App) que funciona parcialmente offline. Você pode visualizar dados já carregados e preencher formulários. Quando a conexão retornar, os dados serão sincronizados automaticamente.'
  },
  {
    question: 'Como exportar relatórios?',
    answer: 'Todos os módulos possuem opções de exportação. Clique no botão "Exportar" na tela desejada e escolha o formato (PDF, Excel). Os relatórios incluem filtros aplicados e dados da sessão atual.'
  },
  {
    question: 'Como funciona a gestão de usuários?',
    answer: 'O sistema suporta múltiplos usuários com diferentes níveis de acesso. Administradores podem convidar novos usuários, definir permissões e controlar o acesso aos módulos através do painel de configurações.'
  }
]

const contactChannels = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: 'E-mail',
    description: 'Resposta em até 24h',
    contact: 'suporte@gaiasystem.com.br',
    available: true
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: 'Telefone',
    description: 'Seg-Sex, 8h às 18h',
    contact: '+55 (11) 3000-0000',
    available: true
  },
  {
    icon: <MessageCircle className="h-5 w-5" />,
    title: 'Chat Online',
    description: 'Resposta imediata',
    contact: 'Iniciar chat',
    available: false
  },
  {
    icon: <Video className="h-5 w-5" />,
    title: 'Videochamada',
    description: 'Agendamento necessário',
    contact: 'Agendar sessão',
    available: true
  }
]

export default function SupportPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Suporte</h1>
        <p className="text-muted-foreground">
          Estamos aqui para ajudar você a aproveitar ao máximo o GaiaSystem
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - FAQ e Contato */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perguntas Frequentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Perguntas Frequentes
              </CardTitle>
              <CardDescription>
                Respostas rápidas para as dúvidas mais comuns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar nas perguntas frequentes..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Fale Conosco
              </CardTitle>
              <CardDescription>
                Não encontrou a resposta? Envie sua dúvida ou feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de solicitação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Reportar Bug</SelectItem>
                    <SelectItem value="feature">Sugerir Funcionalidade</SelectItem>
                    <SelectItem value="help">Dúvida de Uso</SelectItem>
                    <SelectItem value="account">Problema de Conta</SelectItem>
                    <SelectItem value="billing">Questão Financeira</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Nível de prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa - Dúvida geral</SelectItem>
                    <SelectItem value="medium">Média - Problema não crítico</SelectItem>
                    <SelectItem value="high">Alta - Sistema não funcionando</SelectItem>
                    <SelectItem value="urgent">Urgente - Impacto crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message"
                  placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                  rows={5}
                />
              </div>

              <Button className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Canais de Suporte */}
        <div className="space-y-6">
          {/* Canais de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Canais de Suporte</CardTitle>
              <CardDescription>
                Escolha o melhor canal para sua necessidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactChannels.map((channel, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    {channel.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{channel.title}</h4>
                      {channel.available ? (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Em breve
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {channel.description}
                    </p>
                    <p className="text-sm font-medium mt-2">
                      {channel.contact}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Principal</span>
                <Badge variant="default">Operacional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de Dados</span>
                <Badge variant="default">Operacional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificações</span>
                <Badge variant="default">Operacional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Relatórios</span>
                <Badge variant="default">Operacional</Badge>
              </div>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>Última verificação: há 2 minutos</p>
                <p>Uptime: 99.9%</p>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Úteis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recursos Úteis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Documentação
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-2" />
                Tutoriais em Vídeo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Base de Conhecimento
              </Button>
            </CardContent>
          </Card>

          {/* Horário de Atendimento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Segunda - Sexta</span>
                <span className="font-medium">8h às 18h</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span className="font-medium">9h às 14h</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo</span>
                <span className="text-muted-foreground">Fechado</span>
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                Horário de Brasília (UTC-3)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}