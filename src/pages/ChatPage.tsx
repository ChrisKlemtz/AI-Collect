import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AIProvider } from '../types'
import './ChatPage.scss'

function ChatPage() {
  const { provider } = useParams<{ provider: AIProvider }>()
  const navigate = useNavigate()
  const [inputMessage, setInputMessage] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<string>('')

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
      }
    } else {
      navigate('/ai-selection')
    }
  }, [provider, navigate])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    // TODO: Implement actual API call
    console.log('Sending message to', provider, ':', inputMessage)
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
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>Bereit zum Chatten!</h3>
            <p>Schreibe eine Nachricht an {getProviderName()}</p>
          </div>
        </div>

        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Nachricht an ${getProviderName()}...`}
              className="chat-input"
            />
            <button type="submit" className="send-btn" disabled={!inputMessage.trim()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
