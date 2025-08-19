import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Commitment {
  id: string
  titulo: string
  descricao: string
  prazo: string
  status: string
  responsavel: string
  categoria: string
  prioridade: string
}

const CommitmentsPage: React.FC = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCommitments = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/commitments`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setCommitments(response.data)
      } catch (error) {
        console.error('Erro ao buscar compromissos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommitments()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Compromissos</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Compromissos Ambientais</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Novo Compromisso
        </button>
      </div>
      
      <div className="space-y-4">
        {commitments.map((commitment) => (
          <div key={commitment.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold">{commitment.titulo}</h3>
              <div className="flex gap-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  commitment.prioridade === 'Alta' 
                    ? 'bg-red-100 text-red-800' 
                    : commitment.prioridade === 'Média'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {commitment.prioridade}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  commitment.status === 'Concluído' 
                    ? 'bg-green-100 text-green-800' 
                    : commitment.status === 'Em andamento'
                    ? 'bg-blue-100 text-blue-800'
                    : commitment.status === 'Atrasado'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {commitment.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{commitment.descricao}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">📅 Prazo:</span> {new Date(commitment.prazo).toLocaleDateString('pt-BR')}
              </div>
              <div>
                <span className="font-medium">👤 Responsável:</span> {commitment.responsavel}
              </div>
              <div>
                <span className="font-medium">🏷️ Categoria:</span> {commitment.categoria}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommitmentsPage