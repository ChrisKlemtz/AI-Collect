import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [selectedEmail, setSelectedEmail] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const email = localStorage.getItem('selectedEmail')
    if (!email) {
      navigate('/emails')
      return
    }
    setSelectedEmail(email)

    // Load API keys from localStorage
    const storedKeys = localStorage.getItem(`apiKeys_${email}`)
    if (storedKeys) {
      const keys = JSON.parse(storedKeys)
      setAiServices(prev =>
        prev.map(service => ({
          ...service,
          isActive: !!keys[service.id],
          apiKey: keys[service.id] || undefined,
        }))
      )
    }
  }, [navigate])

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

  const saveAPIKey = (provider: AIProvider, apiKey: string) => {
    const storedKeys = localStorage.getItem(`apiKeys_${selectedEmail}`)
    const keys = storedKeys ? JSON.parse(storedKeys) : {}
    keys[provider] = apiKey
    localStorage.setItem(`apiKeys_${selectedEmail}`, JSON.stringify(keys))

    setAiServices(prev =>
      prev.map(service =>
        service.id === provider
          ? { ...service, isActive: true, apiKey }
          : service
      )
    )
  }

  const handleRemoveAPIKey = (provider: AIProvider, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('API-Key wirklich entfernen?')) {
      const storedKeys = localStorage.getItem(`apiKeys_${selectedEmail}`)
      if (storedKeys) {
        const keys = JSON.parse(storedKeys)
        delete keys[provider]
        localStorage.setItem(`apiKeys_${selectedEmail}`, JSON.stringify(keys))
      }

      setAiServices(prev =>
        prev.map(service =>
          service.id === provider
            ? { ...service, isActive: false, apiKey: undefined }
            : service
        )
      )
    }
  }

  return (
    <div className="ai-selection-page">
      <ThemeToggle />
      <div className="ai-selection-container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/emails')}>
            ← Zurück
          </button>
          <h1>Wähle deine KI</h1>
          <p className="selected-email">Angemeldet als: {selectedEmail}</p>
        </div>

        {aiServices.filter(s => s.isActive).length >= 2 && (
          <div className="compare-section">
            <button className="compare-btn" onClick={() => navigate('/chat/compare')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
              </svg>
              KIs vergleichen
            </button>
          </div>
        )}

        <div className="ai-grid">
          {aiServices.map((service) => (
            <div
              key={service.id}
              className={`ai-card ${service.isActive ? 'active' : ''}`}
              onClick={() => handleAIClick(service.id)}
            >
              <div className="ai-card-content">
                <div className="ai-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                {service.isActive && (
                  <div className="ai-status">
                    <span className="status-badge">Aktiv</span>
                  </div>
                )}
                {!service.isActive && (
                  <div className="ai-status">
                    <span className="setup-badge">API-Key erforderlich</span>
                  </div>
                )}
              </div>
              {service.isActive && (
                <button
                  className="remove-key-btn"
                  onClick={(e) => handleRemoveAPIKey(service.id, e)}
                  title="API-Key entfernen"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AISelectionPage
