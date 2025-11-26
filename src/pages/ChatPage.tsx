import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AIProvider } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { apiKeysApi } from '../services/api'
import { useChat } from '../hooks/useChat'
import { useChatHistory } from '../hooks/useChatHistory'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { usePromptPresets } from '../hooks/usePromptPresets'
import ThemeToggle from '../components/ThemeToggle'
import MarkdownMessage from '../components/MarkdownMessage'
import ChatHistorySidebar from '../components/ChatHistorySidebar'
import { PromptPresetsBar } from '../components/PromptPresetsBar'
import { PromptPresetsModal } from '../components/PromptPresetsModal'
import './ChatPage.scss'

function ChatPage() {
  const { provider } = useParams<{ provider: AIProvider }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [inputMessage, setInputMessage] = useState('')
  const [apiKey, setApiKey] = useState<string>('')
  const [isLoadingKey, setIsLoadingKey] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [showPresetsModal, setShowPresetsModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    renameChat,
    deleteChat,
  } = useChatHistory({
    email: user?.email || '',
    provider: provider as AIProvider,
  })

  const chatId = currentChatId || `${user?.email}_${provider}`
  const { messages, isLoading, error, streamingMessage, sendMessage, clearChat } = useChat({
    provider: provider as AIProvider,
    apiKey,
    chatId,
  })

  const { presets, addPreset, updatePreset, deletePreset, applyPreset } = usePromptPresets()

  // Check authentication and load API key
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadAPIKey()
  }, [isAuthenticated, provider, navigate])

  const loadAPIKey = async () => {
    try {
      setIsLoadingKey(true)
      const response = await apiKeysApi.getAll()
      const keys = response.apiKeys || {}

      if (!keys[provider as string]) {
        // No API key for this provider
        navigate('/ai-selection')
      } else {
        setApiKey(keys[provider as string])
      }
    } catch (error) {
      console.error('Failed to load API key:', error)
      navigate('/ai-selection')
    } finally {
      setIsLoadingKey(false)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Update chat history when messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      updateChatMessages(currentChatId, messages)
    }
  }, [messages, currentChatId, updateChatMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    await sendMessage(inputMessage)
    setInputMessage('')
  }

  const handlePresetSelect = (preset: any) => {
    const presetText = applyPreset(preset)
    setInputMessage(presetText)
    inputRef.current?.focus()
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'k',
        ctrlOrCmd: true,
        description: 'Neuer Chat',
        action: () => {
          const newChatId = createNewChat()
          setCurrentChatId(newChatId)
        },
      },
      {
        key: 'b',
        ctrlOrCmd: true,
        description: 'Chat-Verlauf öffnen/schließen',
        action: () => {
          setIsSidebarOpen((prev) => !prev)
        },
      },
      {
        key: 'l',
        ctrlOrCmd: true,
        description: 'Chat löschen',
        action: () => {
          if (messages.length > 0 && confirm('Möchtest du den aktuellen Chat wirklich löschen?')) {
            clearChat()
          }
        },
      },
      {
        key: 'Enter',
        ctrlOrCmd: true,
        description: 'Nachricht senden',
        action: () => {
          if (inputMessage.trim() && !isLoading) {
            handleSendMessage(new Event('submit') as any)
          }
        },
      },
      {
        key: 'Escape',
        description: 'Input leeren oder Sidebar schließen',
        action: () => {
          if (isSidebarOpen) {
            setIsSidebarOpen(false)
          } else if (inputMessage) {
            setInputMessage('')
          }
        },
        preventDefault: false,
      },
      {
        key: '/',
        ctrlOrCmd: true,
        description: 'Tastenkombinationen anzeigen',
        action: () => {
          setShowShortcutsHelp(true)
        },
      },
    ],
    enabled: true,
  })

  // Show loading state while checking authentication and loading API key
  if (isLoadingKey) {
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Lade...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <ChatHistorySidebar
        chats={chats}
        currentChatId={currentChatId}
        provider={provider as AIProvider}
        isOpen={isSidebarOpen}
        onSelectChat={(chatId) => {
          setCurrentChatId(chatId)
          setIsSidebarOpen(false)
        }}
        onNewChat={() => {
          const newChatId = createNewChat()
          setCurrentChatId(newChatId)
          setIsSidebarOpen(false)
        }}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="chat-header">
        <div className="header-left">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            title="Chat-Verlauf"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <button className="back-btn" onClick={() => navigate('/ai-selection')}>
            ← Zurück zur Auswahl
          </button>
        </div>
        <div className="chat-title">
          <h2>{getProviderName()}</h2>
          <span className="user-email">{user?.email}</span>
        </div>
        <div className="chat-header-actions">
          <button
            className="shortcuts-btn"
            onClick={() => setShowShortcutsHelp(true)}
            title="Tastenkombinationen"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
            </svg>
          </button>
          <ThemeToggle />
          {messages.length > 0 && (
            <button className="clear-btn" onClick={clearChat}>
              Chat löschen
            </button>
          )}
        </div>
      </div>

      {/* Prompt Presets Modal */}
      <PromptPresetsModal
        isOpen={showPresetsModal}
        presets={presets}
        onClose={() => setShowPresetsModal(false)}
        onAdd={addPreset}
        onUpdate={updatePreset}
        onDelete={deletePreset}
      />

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div className="shortcuts-modal-overlay" onClick={() => setShowShortcutsHelp(false)}>
          <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-modal-header">
              <h3>Tastenkombinationen</h3>
              <button className="close-modal-btn" onClick={() => setShowShortcutsHelp(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="20"
                  height="20"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <div className="shortcuts-modal-content">
              <div className="shortcut-item">
                <span className="shortcut-key">
                  {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'} + K
                </span>
                <span className="shortcut-desc">Neuer Chat</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">
                  {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'} + B
                </span>
                <span className="shortcut-desc">Chat-Verlauf öffnen/schließen</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">
                  {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'} + L
                </span>
                <span className="shortcut-desc">Chat löschen</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">
                  {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'} + Enter
                </span>
                <span className="shortcut-desc">Nachricht senden</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">Esc</span>
                <span className="shortcut-desc">Input leeren oder Sidebar schließen</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">
                  {navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'} + /
                </span>
                <span className="shortcut-desc">Diese Hilfe anzeigen</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {streamingMessage && (
                <div className="message assistant-message streaming">
                  <div className="message-content">
                    <MarkdownMessage content={streamingMessage} />
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

        <PromptPresetsBar
          presets={presets}
          onSelectPreset={handlePresetSelect}
          onManagePresets={() => setShowPresetsModal(true)}
        />

        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
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
