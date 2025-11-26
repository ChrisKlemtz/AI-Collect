import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AIProvider, Message } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { apiKeysApi } from '../services/api'
import { AIServiceManager } from '../services/ai.service'
import ThemeToggle from '../components/ThemeToggle'
import MarkdownMessage from '../components/MarkdownMessage'
import './ComparePage.scss'

interface AIResponse {
  provider: AIProvider
  message: string
  isStreaming: boolean
  error: string | null
}

function ComparePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [inputMessage, setInputMessage] = useState('')
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [activeProviders, setActiveProviders] = useState<AIProvider[]>([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const providerInfo = {
    chatgpt: { name: 'ChatGPT', icon: '🤖', color: '#10a37f' },
    claude: { name: 'Claude', icon: '🧠', color: '#764ba2' },
    deepseek: { name: 'DeepSeek', icon: '🔍', color: '#4f46e5' },
  }

  // Check authentication and load API keys
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadAPIKeys()
  }, [isAuthenticated, navigate])

  const loadAPIKeys = async () => {
    try {
      setIsLoadingKeys(true)
      const response = await apiKeysApi.getAll()
      const keys = response.apiKeys || {}

      const active = Object.keys(keys).filter((provider) => keys[provider]) as AIProvider[]

      if (active.length < 2) {
        alert('Du benötigst mindestens 2 aktive KI-Dienste für den Vergleichsmodus')
        navigate('/ai-selection')
        return
      }

      setApiKeys(keys)
      setActiveProviders(active)
    } catch (error) {
      console.error('Failed to load API keys:', error)
      navigate('/ai-selection')
    } finally {
      setIsLoadingKeys(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, responses])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      provider: 'chatgpt', // Default provider
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Initialize responses for all active providers
    const initialResponses: AIResponse[] = activeProviders.map((provider) => ({
      provider,
      message: '',
      isStreaming: true,
      error: null,
    }))
    setResponses(initialResponses)

    // Send message to all providers concurrently
    const promises = activeProviders.map(async (provider, index) => {
      try {
        const response = await AIServiceManager.sendMessage(
          provider,
          apiKeys[provider],
          [...messages, userMessage],
          (chunk) => {
            setResponses((prev) => {
              const updated = [...prev]
              updated[index] = {
                ...updated[index],
                message: updated[index].message + chunk,
              }
              return updated
            })
          }
        )

        setResponses((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            message: response,
            isStreaming: false,
          }
          return updated
        })
      } catch (error) {
        console.error(`Error from ${provider}:`, error)
        setResponses((prev) => {
          const updated = [...prev]
          updated[index] = {
            ...updated[index],
            isStreaming: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
          return updated
        })
      }
    })

    await Promise.all(promises)
    setIsLoading(false)

    // Add all responses as assistant messages
    const assistantMessages: Message[] = responses.map((resp, index) => ({
      id: `msg_${Date.now()}_${index}`,
      role: 'assistant',
      content: resp.message,
      timestamp: new Date(),
      provider: resp.provider,
    }))

    setMessages((prev) => [...prev, ...assistantMessages])
  }

  const handleClearChat = () => {
    if (confirm('Möchtest du den Chat wirklich löschen?')) {
      setMessages([])
      setResponses([])
    }
  }

  if (isLoadingKeys) {
    return (
      <div className="compare-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Lade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/ai-selection')}>
            ← Zurück zur Auswahl
          </button>
        </div>
        <div className="compare-title">
          <h2>🔄 KI-Vergleichsmodus</h2>
          <span className="user-email">{user?.email}</span>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          {messages.length > 0 && (
            <button className="clear-btn" onClick={handleClearChat}>
              Chat löschen
            </button>
          )}
        </div>
      </div>

      <div className="compare-container">
        <div className="compare-messages">
          {messages.length === 0 && responses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>
              <h3>Vergleiche KI-Antworten!</h3>
              <p>Stelle eine Frage und erhalte Antworten von {activeProviders.length} verschiedenen KIs</p>
              <div className="active-providers">
                {activeProviders.map((provider) => (
                  <div key={provider} className="provider-badge">
                    <span className="provider-icon">{providerInfo[provider].icon}</span>
                    <span className="provider-name">{providerInfo[provider].name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="compare-message-group">
                  {message.role === 'user' ? (
                    <div className="user-message">
                      <div className="message-content">{message.content}</div>
                      <div className="message-timestamp">
                        {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}

              {/* Show streaming responses */}
              {responses.length > 0 && (
                <div className="responses-grid">
                  {responses.map((response, index) => (
                    <div
                      key={response.provider}
                      className="response-card"
                      style={{ borderTopColor: providerInfo[response.provider].color }}
                    >
                      <div className="response-header">
                        <span className="response-icon">{providerInfo[response.provider].icon}</span>
                        <span className="response-name">{providerInfo[response.provider].name}</span>
                        {response.isStreaming && <div className="streaming-indicator">●</div>}
                      </div>
                      <div className="response-content">
                        {response.error ? (
                          <div className="error-message">⚠️ {response.error}</div>
                        ) : response.message ? (
                          <>
                            <MarkdownMessage content={response.message} />
                            {response.isStreaming && <span className="cursor">▋</span>}
                          </>
                        ) : (
                          <div className="loading-dots">
                            <span>●</span>
                            <span>●</span>
                            <span>●</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="compare-input-container">
          <form className="compare-input-form" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Frage an alle KIs..."
              className="compare-input"
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={!inputMessage.trim() || isLoading}>
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ComparePage
