import { useState } from 'react'
import { ChatHistoryItem, AIProvider } from '../types'
import './ChatHistorySidebar.scss'

interface ChatHistorySidebarProps {
  chats: ChatHistoryItem[]
  currentChatId: string
  provider: AIProvider
  isOpen: boolean
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onRenameChat: (chatId: string, newTitle: string) => void
  onDeleteChat: (chatId: string) => void
  onClose: () => void
}

function ChatHistorySidebar({
  chats,
  currentChatId,
  provider,
  isOpen,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onClose,
}: ChatHistorySidebarProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const providerChats = chats.filter((chat) => chat.provider === provider)

  const getProviderIcon = (provider: AIProvider) => {
    switch (provider) {
      case 'chatgpt':
        return '🤖'
      case 'claude':
        return '🧠'
      case 'deepseek':
        return '🔍'
      default:
        return '💬'
    }
  }

  const handleStartRename = (chat: ChatHistoryItem) => {
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveRename = (chatId: string) => {
    if (editTitle.trim()) {
      onRenameChat(chatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleCancelRename = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Gerade eben'
    if (hours < 24) return `Vor ${hours}h`
    if (days === 1) return 'Gestern'
    if (days < 7) return `Vor ${days} Tagen`

    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`chat-history-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span className="provider-icon">{getProviderIcon(provider)}</span>
            <h3>Chat-Verlauf</h3>
          </div>
          <button className="close-btn" onClick={onClose} title="Schließen">
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

        <button className="new-chat-btn" onClick={onNewChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Neuer Chat
        </button>

        <div className="chats-list">
          {providerChats.length === 0 ? (
            <div className="empty-state">
              <p>Noch keine Chats vorhanden</p>
            </div>
          ) : (
            providerChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                onClick={() => chat.id !== currentChatId && onSelectChat(chat.id)}
              >
                {editingChatId === chat.id ? (
                  <div className="chat-rename" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(chat.id)
                        if (e.key === 'Escape') handleCancelRename()
                      }}
                      autoFocus
                      maxLength={50}
                    />
                    <div className="rename-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveRename(chat.id)}
                        title="Speichern"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="16"
                          height="16"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={handleCancelRename}
                        title="Abbrechen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="16"
                          height="16"
                        >
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="chat-info">
                      <div className="chat-title">{chat.title}</div>
                      <div className="chat-meta">
                        <span className="message-count">{chat.messageCount} Nachrichten</span>
                        <span className="chat-date">{formatDate(chat.updatedAt)}</span>
                      </div>
                      {chat.lastMessage && (
                        <div className="chat-preview">{chat.lastMessage}</div>
                      )}
                    </div>
                    <div className="chat-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="action-btn"
                        onClick={() => handleStartRename(chat)}
                        title="Umbenennen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="16"
                          height="16"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => {
                          if (confirm('Möchtest du diesen Chat wirklich löschen?')) {
                            onDeleteChat(chat.id)
                          }
                        }}
                        title="Löschen"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="16"
                          height="16"
                        >
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default ChatHistorySidebar
