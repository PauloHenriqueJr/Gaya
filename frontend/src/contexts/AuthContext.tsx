import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthCredentials {
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  login: (credentials: AuthCredentials) => Promise<void>
  logout: () => void
  currentTenant: string
  setCurrentTenant: (tenant: string) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [currentTenant, setCurrentTenant] = useState('gaia_demo')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const BACKEND_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL
  const API = `${BACKEND_URL}/api`

  useEffect(() => {
    // Check for saved user on app load
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: AuthCredentials): Promise<void> => {
    setIsLoading(true)
    try {
      // Mock authentication - in production this would be a real API call
      const mockUser: User = {
        id: '1',
        name: 'Ana Silva',
        email: credentials.email,
        role: 'admin',
      }

      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))

      // Initialize demo data
      try {
        await axios.post(`${API}/seed-data?tenant_id=${currentTenant}`)
      } catch (error) {
        console.error('Error creating demo data:', error)
      }

      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    navigate('/')
  }

  const value = {
    user,
    login,
    logout,
    currentTenant,
    setCurrentTenant,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}