import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 GaiaSystem
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema de Gestão Ambiental Digital
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Controle completo de licenças, projetos, vistorias e monitoramento ambiental
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Entrar no Sistema
            </Link>
            <Link 
              to="/dashboard"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage