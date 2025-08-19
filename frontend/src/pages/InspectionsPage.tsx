import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Inspection {
  id: string
  local: string
  data_vistoria: string
  responsavel: string
  tipo: string
  status: string
  conformidade_percentual: number
  observacoes: string
  checklist: string[]
}

const InspectionsPage: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/inspections`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setInspections(response.data)
      } catch (error) {
        console.error('Erro ao buscar vistorias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Vistorias</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🔍 Vistorias</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nova Vistoria
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inspections.map((inspection) => (
          <div key={inspection.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{inspection.local}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                inspection.status === 'Concluída' 
                  ? 'bg-green-100 text-green-800' 
                  : inspection.status === 'Em andamento'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {inspection.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm mb-4">
              <div>
                <span className="font-medium">📅 Data:</span> {new Date(inspection.data_vistoria).toLocaleDateString('pt-BR')}
              </div>
              <div>
                <span className="font-medium">👤 Responsável:</span> {inspection.responsavel}
              </div>
              <div>
                <span className="font-medium">📋 Tipo:</span> {inspection.tipo}
              </div>
              <div className="flex items-center">
                <span className="font-medium">📊 Conformidade:</span>
                <div className="ml-2 flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        inspection.conformidade_percentual >= 80 
                          ? 'bg-green-500'
                          : inspection.conformidade_percentual >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${inspection.conformidade_percentual}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs font-medium">{inspection.conformidade_percentual}%</span>
                </div>
              </div>
            </div>
            
            {inspection.observacoes && (
              <div className="mb-4">
                <span className="font-medium text-sm">📝 Observações:</span>
                <p className="text-sm text-gray-600 mt-1">{inspection.observacoes}</p>
              </div>
            )}
            
            {inspection.checklist && inspection.checklist.length > 0 && (
              <div>
                <span className="font-medium text-sm">✅ Checklist:</span>
                <ul className="text-sm text-gray-600 mt-1 space-y-1">
                  {inspection.checklist.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                  {inspection.checklist.length > 3 && (
                    <li className="text-gray-500 italic">
                      +{inspection.checklist.length - 3} itens adicionais
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InspectionsPage