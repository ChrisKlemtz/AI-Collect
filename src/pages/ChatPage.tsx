import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AIProvider } from '../types'
import { useChat } from '../hooks/useChat'
import './ChatPage.scss'

function ChatPage() {
  const { provider } = useParams<{ provider: AIProvider }>()
  const navigate = useNavigate()
  const [inputMessage, setInputMessage] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatId = `${selectedEmail}_${provider}`
  const { messages, isLoading, error, streamingMessage, sendMessage, clearChat } = useChat({
    provider: provider as AIProvider,
    apiKey,
    chatId,
  })

  useEffect(() => {
    const email = localStorage.getItem('selectedEmail')
    if (!email) {
      navigate('/emails')
      return
    }
    setSelectedEmail(email)

    // Check if API key exists
    const storedKeys = localStorage.getItem(`apiKeys_${email}`)
    if (storedKeys) {
      const keys = JSON.parse(storedKeys)
      if (!keys[provider as string]) {
        navigate('/ai-selection')
      } else {
        setApiKey(keys[provider as string])
      }
    } else {
      navigate('/ai-selection')
    }
  }, [provider, navigate])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    await sendMessage(inputMessage)
    setInputMessage('')
  }

  const getProviderName = () => {
    switch (provider) {
      case 'chatgpt':
        return 'ChatGPT'
      case 'claude':
        return 'Claude'
      case 'deepseek':
        return 'DeepSeek'
      default:
        return provider
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/ai-selection')}>
          ← Zurück zur Auswahl
        </button>
        <div className="chat-title">
          <h2>{getProviderName()}</h2>
          <span className="user-email">{selectedEmail}</span>
        </div>
        {messages.length > 0 && (
          <button className="clear-btn" onClick={clearChat}>
            Chat löschen
          </button>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && !streamingMessage ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Bereit zum Chatten!</h3>
              <p>Schreibe eine Nachricht an {getProviderName()}</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString('de-DE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              {streamingMessage && (
                <div className="message assistant-message streaming">
                  <div className="message-content">
                    {streamingMessage}
                    <span className="cursor">▋</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Nachricht an ${getProviderName()}...`}
              className="chat-input"
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

export default ChatPage
