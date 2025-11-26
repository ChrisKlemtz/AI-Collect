import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AIProvider } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { apiKeysApi } from '../services/api'
import { useCompareChat } from '../hooks/useCompareChat'
import ThemeToggle from '../components/ThemeToggle'
import MarkdownMessage from '../components/MarkdownMessage'
import './CompareChatPage.scss'

const availableProviders: { id: AIProvider; name: string; icon: string }[] = [
  { id: 'chatgpt', name: 'ChatGPT', icon: '🤖' },
  { id: 'claude', name: 'Claude', icon: '🧠' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🔍' },
]

function CompareChatPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)

  const [provider1, setProvider1] = useState<AIProvider>('chatgpt')
  const [provider2, setProvider2] = useState<AIProvider>('claude')
  const [inputMessage, setInputMessage] = useState('')

  const messagesEndRef1 = useRef<HTMLDivElement>(null)
  const messagesEndRef2 = useRef<HTMLDivElement>(null)

  const { messages, isLoading, errors, streamingMessages, sendMessage, clearChats } = useCompareChat({
    provider1,
    provider2,
    apiKey1: apiKeys[provider1] || '',
    apiKey2: apiKeys[provider2] || '',
  })

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

      const activeKeys = Object.keys(keys).filter((provider) => keys[provider])

      if (activeKeys.length < 2) {
        alert('Du benötigst mindestens 2 aktive KI-Dienste für den Vergleichsmodus')
        navigate('/ai-selection')
        return
      }

      setApiKeys(keys)

      // Set default providers to first two active keys
      if (activeKeys.length >= 2) {
        setProvider1(activeKeys[0] as AIProvider)
        setProvider2(activeKeys[1] as AIProvider)
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
      navigate('/ai-selection')
    } finally {
      setIsLoadingKeys(false)
    }
  }

  useEffect(() => {
    messagesEndRef1.current?.scrollIntoView({ behavior: 'smooth' })
    messagesEndRef2.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    await sendMessage(inputMessage)
    setInputMessage('')
  }

  const getProviderIcon = (provider: AIProvider) => {
    return availableProviders.find((p) => p.id === provider)?.icon || '🤖'
  }

  const availableProvidersForSelection = availableProviders.filter(
    (p) => apiKeys[p.id]
  )

  if (isLoadingKeys) {
    return (
      <div className="compare-chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Lade API-Keys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-chat-page">
      <div className="compare-header">
        <button className="back-btn" onClick={() => navigate('/ai-selection')}>
          ← Zurück zur Auswahl
        </button>
        <h2>KI-Vergleich</h2>
        <span className="user-email">{user?.email}</span>
        <div className="header-actions">
          <ThemeToggle />
          {(messages.provider1.length > 0 || messages.provider2.length > 0) && (
            <button className="clear-btn" onClick={clearChats}>
              Beide Chats löschen
            </button>
          )}
        </div>
      </div>

      <div className="compare-container">
        {/* Left Chat */}
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="provider-selector">
              <span className="provider-icon">{getProviderIcon(provider1)}</span>
              <select
                value={provider1}
                onChange={(e) => setProvider1(e.target.value as AIProvider)}
                disabled={isLoading}
              >
                {availableProvidersForSelection.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chat-messages">
            {messages.provider1.length === 0 && !streamingMessages.provider1 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Bereit für den Vergleich!</h3>
                <p>Stelle eine Frage an beide KIs</p>
              </div>
            ) : (
              <>
                {messages.provider1.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                  >
                    <div className="message-content">
                      {message.role === 'assistant' ? (
                        <MarkdownMessage content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                {streamingMessages.provider1 && (
                  <div className="message assistant-message streaming">
                    <div className="message-content">
                      <MarkdownMessage content={streamingMessages.provider1} />
                      <span className="cursor">▋</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef1} />
              </>
            )}
          </div>

          {errors.provider1 && (
            <div className="error-message">⚠️ {errors.provider1}</div>
          )}
        </div>

        {/* Right Chat */}
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="provider-selector">
              <span className="provider-icon">{getProviderIcon(provider2)}</span>
              <select
                value={provider2}
                onChange={(e) => setProvider2(e.target.value as AIProvider)}
                disabled={isLoading}
              >
                {availableProvidersForSelection.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="chat-messages">
            {messages.provider2.length === 0 && !streamingMessages.provider2 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Bereit für den Vergleich!</h3>
                <p>Stelle eine Frage an beide KIs</p>
              </div>
            ) : (
              <>
                {messages.provider2.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                  >
                    <div className="message-content">
                      {message.role === 'assistant' ? (
                        <MarkdownMessage content={message.content} />
                      ) : (
                        message.content
                      )}
                    </div>
                    <div className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                {streamingMessages.provider2 && (
                  <div className="message assistant-message streaming">
                    <div className="message-content">
                      <MarkdownMessage content={streamingMessages.provider2} />
                      <span className="cursor">▋</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef2} />
              </>
            )}
          </div>

          {errors.provider2 && (
            <div className="error-message">⚠️ {errors.provider2}</div>
          )}
        </div>
      </div>

      {/* Shared Input */}
      <div className="compare-input-container">
        <form className="compare-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Frage an beide KIs stellen..."
            className="compare-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!inputMessage.trim() || isLoading}
          >
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
  )
}

export default CompareChatPage
