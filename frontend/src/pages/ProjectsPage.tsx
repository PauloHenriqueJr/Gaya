import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Project {
  id: string
  nome: string
  descricao: string
  localizacao: string
  orcamento: number
  data_inicio: string
  data_fim_prevista: string
  status: string
  responsavel: string
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/projects`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setProjects(response.data)
      } catch (error) {
        console.error('Erro ao buscar projetos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Projetos Ambientais</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🚀 Projetos Ambientais</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Novo Projeto
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">{project.nome}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{project.descricao}</p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">📍 Localização:</span> {project.localizacao}
              </div>
              <div>
                <span className="font-medium">💰 Orçamento:</span> {project.orcamento.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </div>
              <div>
                <span className="font-medium">👤 Responsável:</span> {project.responsavel}
              </div>
              <div>
                <span className="font-medium">📅 Início:</span> {new Date(project.data_inicio).toLocaleDateString('pt-BR')}
              </div>
              <div>
                <span className="font-medium">⏰ Previsão:</span> {new Date(project.data_fim_prevista).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            <div className="mt-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                project.status === 'Concluído' 
                  ? 'bg-green-100 text-green-800' 
                  : project.status === 'Em andamento'
                  ? 'bg-blue-100 text-blue-800'
                  : project.status === 'Atrasado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectsPage