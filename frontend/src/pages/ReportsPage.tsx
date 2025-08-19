import React, { useState } from 'react'

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedType, setSelectedType] = useState('all')

  const reportTypes = [
    { id: 'all', name: 'Todos os Relatórios', icon: '📊' },
    { id: 'licenses', name: 'Licenças', icon: '📄' },
    { id: 'projects', name: 'Projetos', icon: '🚀' },
    { id: 'inspections', name: 'Vistorias', icon: '🔍' },
    { id: 'water', name: 'Monitoramento Hídrico', icon: '💧' },
    { id: 'waste', name: 'Gestão de Resíduos', icon: '♻️' },
    { id: 'commitments', name: 'Compromissos', icon: '📋' }
  ]

  const periods = [
    { id: 'week', name: 'Última Semana' },
    { id: 'month', name: 'Último Mês' },
    { id: 'quarter', name: 'Último Trimestre' },
    { id: 'year', name: 'Último Ano' }
  ]

  const handleGenerateReport = (type: string, format: string) => {
    // Mock function - in real app would generate actual reports
    alert(`Gerando relatório de ${type} em formato ${format}...`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📈 Relatórios</h1>
      
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.filter(type => selectedType === 'all' || type.id === selectedType).map(type => (
          <div key={type.id} className="bg-white rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="text-lg font-semibold">{type.name}</h3>
              <p className="text-sm text-gray-600">
                Relatório completo de {type.name.toLowerCase()}
              </p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => handleGenerateReport(type.name, 'PDF')}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                📄 Gerar PDF
              </button>
              <button
                onClick={() => handleGenerateReport(type.name, 'Excel')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                📊 Gerar Excel
              </button>
              <button
                onClick={() => handleGenerateReport(type.name, 'Visualizar')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                👁️ Visualizar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Estatísticas Rápidas */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Estatísticas do Período</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-sm text-gray-600">Licenças Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Projetos em Andamento</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-sm text-gray-600">Vistorias Realizadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">96%</div>
            <div className="text-sm text-gray-600">Taxa de Conformidade</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage