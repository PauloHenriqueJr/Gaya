import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import {
  Home,
  FileText,
  Briefcase,
  ClipboardCheck,
  Droplets,
  Trash2,
  Calendar,
  Settings,
  User,
  HelpCircle,
  Shield,
  BarChart3,
  Search,
  Plus,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

interface Command {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  group: string
  shortcut?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const commands: Command[] = [
    // Navegação Principal
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      action: () => navigate('/'),
      group: 'Navegação',
    },
    {
      id: 'licenses',
      label: 'Licenças Ambientais',
      icon: <FileText className="h-4 w-4" />,
      action: () => navigate('/licenses'),
      group: 'Navegação',
    },
    {
      id: 'projects',
      label: 'Projetos',
      icon: <Briefcase className="h-4 w-4" />,
      action: () => navigate('/projects'),
      group: 'Navegação',
    },
    {
      id: 'inspections',
      label: 'Vistorias',
      icon: <ClipboardCheck className="h-4 w-4" />,
      action: () => navigate('/inspections'),
      group: 'Navegação',
    },
    {
      id: 'monitoring',
      label: 'Monitoramento Hídrico',
      icon: <Droplets className="h-4 w-4" />,
      action: () => navigate('/monitoring'),
      group: 'Navegação',
    },
    {
      id: 'waste',
      label: 'Gestão de Resíduos',
      icon: <Trash2 className="h-4 w-4" />,
      action: () => navigate('/waste'),
      group: 'Navegação',
    },
    {
      id: 'commitments',
      label: 'Compromissos',
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigate('/commitments'),
      group: 'Navegação',
    },

    // Ações Rápidas
    {
      id: 'new-license',
      label: 'Nova Licença',
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate('/licenses/new'),
      group: 'Ações Rápidas',
      shortcut: '⌘N'
    },
    {
      id: 'new-project',
      label: 'Novo Projeto',
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate('/projects/new'),
      group: 'Ações Rápidas',
    },
    {
      id: 'new-inspection',
      label: 'Nova Vistoria',
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate('/inspections/new'),
      group: 'Ações Rápidas',
    },
    {
      id: 'search-all',
      label: 'Busca Global',
      icon: <Search className="h-4 w-4" />,
      action: () => navigate('/search'),
      group: 'Ações Rápidas',
      shortcut: '⌘/'
    },

    // Configurações e Perfil
    {
      id: 'profile',
      label: 'Meu Perfil',
      icon: <User className="h-4 w-4" />,
      action: () => navigate('/profile'),
      group: 'Conta',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
      action: () => navigate('/settings'),
      group: 'Conta',
    },
    {
      id: 'documentation',
      label: 'Documentação',
      icon: <HelpCircle className="h-4 w-4" />,
      action: () => navigate('/documentation'),
      group: 'Ajuda',
    },
    {
      id: 'support',
      label: 'Suporte',
      icon: <Shield className="h-4 w-4" />,
      action: () => navigate('/support'),
      group: 'Ajuda',
    },

    // Relatórios
    {
      id: 'reports',
      label: 'Relatórios',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => navigate('/reports'),
      group: 'Relatórios',
    },

    // Temas
    {
      id: 'theme-light',
      label: 'Tema Claro',
      icon: <Sun className="h-4 w-4" />,
      action: () => setTheme('light'),
      group: 'Tema',
    },
    {
      id: 'theme-dark',
      label: 'Tema Escuro',
      icon: <Moon className="h-4 w-4" />,
      action: () => setTheme('dark'),
      group: 'Tema',
    },
    {
      id: 'theme-system',
      label: 'Tema do Sistema',
      icon: <Monitor className="h-4 w-4" />,
      action: () => setTheme('system'),
      group: 'Tema',
    },
  ]

  const runCommand = React.useCallback((command: Command) => {
    setOpen(false)
    command.action()
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou pesquise..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          {/* Agrupar comandos por categoria */}
          {['Navegação', 'Ações Rápidas', 'Relatórios', 'Conta', 'Ajuda', 'Tema'].map((group) => {
            const groupCommands = commands.filter((cmd) => cmd.group === group)
            if (groupCommands.length === 0) return null

            return (
              <React.Fragment key={group}>
                <CommandGroup heading={group}>
                  {groupCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => runCommand(command)}
                      className="flex items-center gap-2"
                    >
                      {command.icon}
                      <span>{command.label}</span>
                      {command.shortcut && (
                        <CommandShortcut>{command.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}