import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver em um campo de input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? event.metaKey : event.ctrlKey

      // Atalhos globais
      if (modifier) {
        switch (event.key.toLowerCase()) {
          case 'n':
            event.preventDefault()
            navigate('/licenses/new')
            break
          case '/':
            event.preventDefault()
            navigate('/search')
            break
          case '1':
            event.preventDefault()
            navigate('/')
            break
          case '2':
            event.preventDefault()
            navigate('/licenses')
            break
          case '3':
            event.preventDefault()
            navigate('/projects')
            break
          case '4':
            event.preventDefault()
            navigate('/inspections')
            break
          case '5':
            event.preventDefault()
            navigate('/monitoring')
            break
          case '6':
            event.preventDefault()
            navigate('/waste')
            break
          case '7':
            event.preventDefault()
            navigate('/commitments')
            break
        }
      }

      // Atalhos sem modificador
      switch (event.key) {
        case 'h':
          if (!modifier) {
            event.preventDefault()
            navigate('/')
          }
          break
        case 'l':
          if (!modifier) {
            event.preventDefault()
            navigate('/licenses')
          }
          break
        case 'p':
          if (!modifier) {
            event.preventDefault()
            navigate('/projects')
          }
          break
        case 'i':
          if (!modifier) {
            event.preventDefault()
            navigate('/inspections')
          }
          break
        case '?':
          event.preventDefault()
          navigate('/documentation')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])
}