import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface DashboardStats {
  licenses_total: number
  projects_total: number
  inspections_total: number
  licenses_active: number
  compliance_score: number
  esg_score: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
          params: { tenant_id: user.tenant_id || 'gaia_demo' }
        })
        setStats(response.data)
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🌍 Dashboard GaiaSystem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">📄 Total de Licenças</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.licenses_total || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">🚀 Projetos</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.projects_total || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">🔍 Vistorias</h3>
          <p className="text-3xl font-bold text-orange-600">{stats?.inspections_total || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">✅ Licenças Ativas</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.licenses_active || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">📊 Score de Conformidade</h3>
          <p className="text-3xl font-bold text-emerald-600">{stats?.compliance_score || 0}%</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">🌱 Score ESG</h3>
          <p className="text-3xl font-bold text-teal-600">{stats?.esg_score || 0}%</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
        <p className="text-gray-600">
          Bem-vindo ao GaiaSystem - sua plataforma completa para gestão ambiental.
          Monitore licenças, projetos e mantenha a conformidade ambiental de forma eficiente.
        </p>
      </div>
    </div>
  )
}

export default Dashboard