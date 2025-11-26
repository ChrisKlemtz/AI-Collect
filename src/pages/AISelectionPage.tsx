import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiKeysApi } from '../services/api'
import { AIService, AIProvider } from '../types'
import ThemeToggle from '../components/ThemeToggle'
import './AISelectionPage.scss'

const availableAIs: AIService[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI GPT-4 und GPT-3.5 Modelle',
    icon: '🤖',
    isActive: false,
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic Claude 3 Modelle',
    icon: '🧠',
    isActive: false,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek AI Modelle',
    icon: '🔍',
    isActive: false,
  },
]

function AISelectionPage() {
  const [aiServices, setAiServices] = useState<AIService[]>(availableAIs)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadAPIKeys()
  }, [isAuthenticated, navigate])

  const loadAPIKeys = async () => {
    try {
      setIsLoading(true)
      const response = await apiKeysApi.getAll()
      const keys = response.apiKeys || {}

      setAiServices(prev =>
        prev.map(service => ({
          ...service,
          isActive: !!keys[service.id],
          apiKey: keys[service.id] || undefined,
        }))
      )
    } catch (error) {
      console.error('Failed to load API keys:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIClick = (provider: AIProvider) => {
    const service = aiServices.find(s => s.id === provider)
    if (service?.isActive) {
      navigate(`/chat/${provider}`)
    } else {
      // Show API key input
      const apiKey = prompt(`Bitte gib deinen API-Key für ${service?.name} ein:`)
      if (apiKey) {
        saveAPIKey(provider, apiKey)
      }
    }
  }

  const saveAPIKey = async (provider: AIProvider, apiKey: string) => {
    try {
      await apiKeysApi.save(provider, apiKey)

      setAiServices(prev =>
        prev.map(service =>
          service.id === provider
            ? { ...service, isActive: true, apiKey }
            : service
        )
      )
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Speichern des API-Keys')
    }
  }

  const handleRemoveAPIKey = async (provider: AIProvider, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('API-Key wirklich entfernen?')) {
      try {
        await apiKeysApi.delete(provider)

        setAiServices(prev =>
          prev.map(service =>
            service.id === provider
              ? { ...service, isActive: false, apiKey: undefined }
              : service
          )
        )
      } catch (error) {
        console.error('Failed to delete API key:', error)
      }
    }
  }

  const handleLogout = async () => {
    if (confirm('Wirklich abmelden?')) {
      await logout()
      navigate('/login')
    }
  }

  const handleCompareMode = () => {
    const activeServices = aiServices.filter(s => s.isActive)
    if (activeServices.length >= 2) {
      navigate('/chat/compare')
    } else {
      alert('Du benötigst mindestens 2 aktive KI-Dienste für den Vergleichsmodus')
    }
  }

  if (isLoading) {
    return (
      <div className="ai-selection-page">
        <div className="loading">Lädt...</div>
      </div>
    )
  }

  return (
    <div className="ai-selection-page">
      <ThemeToggle />

      <div className="ai-selection-container">
        <div className="ai-selection-header">
          <div>
            <h1>Wähle deinen KI-Dienst</h1>
            <p className="user-email">{user?.email}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Abmelden
          </button>
        </div>

        <div className="ai-grid">
          {aiServices.map((service) => (
            <div
              key={service.id}
              className={`ai-card ${service.isActive ? 'active' : 'inactive'}`}
              onClick={() => handleAIClick(service.id)}
            >
              <div className="ai-icon">{service.icon}</div>
              <div className="ai-info">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <div className="ai-status">
                {service.isActive ? (
                  <>
                    <span className="status-badge active">✓ Aktiv</span>
                    <button
                      className="remove-btn"
                      onClick={(e) => handleRemoveAPIKey(service.id, e)}
                      title="API-Key entfernen"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <span className="status-badge inactive">API-Key hinzufügen</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button
            className="compare-btn"
            onClick={handleCompareMode}
            disabled={aiServices.filter(s => s.isActive).length < 2}
          >
            🔄 Vergleichsmodus
          </button>
        </div>
      </div>
    </div>
  )
}

export default AISelectionPage
