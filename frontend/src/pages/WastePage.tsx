import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Waste {
  id: string
  tipo: string
  quantidade: number
  unidade: string
  origem: string
  destino: string
  data_coleta: string
  responsavel: string
  status: string
  numero_manifesto: string
}

const WastePage: React.FC = () => {
  const [waste, setWaste] = useState<Waste[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWaste = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/waste`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setWaste(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados de resíduos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWaste()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Gestão de Resíduos</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">♻️ Gestão de Resíduos</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Novo Resíduo
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destino
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Coleta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {waste.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.tipo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.quantidade} {item.unidade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.origem}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.destino}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.data_coleta).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Coletado' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'Processado'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'Aguardando'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900">Total Coletado (Mês)</h3>
          <p className="text-2xl font-bold text-blue-600">
            {waste.reduce((acc, item) => acc + item.quantidade, 0).toLocaleString()} kg
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900">Tipos de Resíduo</h3>
          <p className="text-2xl font-bold text-green-600">
            {new Set(waste.map(item => item.tipo)).size}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-900">Manifestes</h3>
          <p className="text-2xl font-bold text-purple-600">
            {waste.filter(item => item.numero_manifesto).length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WastePage