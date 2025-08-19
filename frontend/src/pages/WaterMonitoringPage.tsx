import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface WaterData {
  id: string
  local: string
  data_coleta: string
  ph: number
  turbidez: number
  oxigenio_dissolvido: number
  temperatura: number
  status: string
  observacoes: string
}

const WaterMonitoringPage: React.FC = () => {
  const [waterData, setWaterData] = useState<WaterData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWaterData = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/water-monitoring`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setWaterData(response.data)
      } catch (error) {
        console.error('Erro ao buscar dados hídricos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWaterData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800'
      case 'Atenção': return 'bg-yellow-100 text-yellow-800'
      case 'Crítico': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Monitoramento Hídrico</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">💧 Monitoramento Hídrico</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nova Coleta
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {waterData.map((data) => (
          <div key={data.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{data.local}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(data.status)}`}>
                {data.status}
              </span>
            </div>
            
            <div className="text-sm mb-4">
              <span className="font-medium">📅 Data da Coleta:</span> {new Date(data.data_coleta).toLocaleDateString('pt-BR')}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.ph}</div>
                <div className="text-xs text-gray-600">pH</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{data.turbidez}</div>
                <div className="text-xs text-gray-600">Turbidez (NTU)</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.oxigenio_dissolvido}</div>
                <div className="text-xs text-gray-600">O₂ Dissolvido (mg/L)</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.temperatura}°C</div>
                <div className="text-xs text-gray-600">Temperatura</div>
              </div>
            </div>
            
            {data.observacoes && (
              <div>
                <span className="font-medium text-sm">📝 Observações:</span>
                <p className="text-sm text-gray-600 mt-1">{data.observacoes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WaterMonitoringPage