import { useState, useEffect, useCallback } from 'react'
import { ChatHistoryItem, AIProvider, Message } from '../types'

interface UseChatHistoryOptions {
  email: string
  provider: AIProvider
}

export function useChatHistory({ email, provider }: UseChatHistoryOptions) {
  const [chats, setChats] = useState<ChatHistoryItem[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>('')

  const storageKey = `chatHistory_${email}_${provider}`

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        const chatsWithDates = parsed.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        }))
        setChats(chatsWithDates)
      } catch (error) {
        console.error('Error loading chat history:', error)
        setChats([])
      }
    }
  }, [storageKey])

  // Save chat history to localStorage
  const saveChats = useCallback(
    (updatedChats: ChatHistoryItem[]) => {
      localStorage.setItem(storageKey, JSON.stringify(updatedChats))
      setChats(updatedChats)
    },
    [storageKey]
  )

  // Create a new chat
  const createNewChat = useCallback(() => {
    const newChat: ChatHistoryItem = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'Neuer Chat',
      provider,
      lastMessage: '',
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedChats = [newChat, ...chats]
    saveChats(updatedChats)
    setCurrentChatId(newChat.id)

    return newChat.id
  }, [chats, provider, saveChats])

  // Update chat with new messages
  const updateChatMessages = useCallback(
    (chatId: string, messages: Message[]) => {
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          const userMessages = messages.filter((m) => m.role === 'user')
          const lastUserMessage = userMessages[userMessages.length - 1]

          // Generate title from first user message if still "Neuer Chat"
          let title = chat.title
          if (title === 'Neuer Chat' && userMessages.length > 0) {
            const firstMessage = userMessages[0].content
            title = firstMessage.length > 40 ? firstMessage.substring(0, 40) + '...' : firstMessage
          }

          return {
            ...chat,
            title,
            lastMessage: lastUserMessage?.content || '',
            messageCount: messages.length,
            updatedAt: new Date(),
          }
        }
        return chat
      })

      saveChats(updatedChats)
    },
    [chats, saveChats]
  )

  // Rename a chat
  const renameChat = useCallback(
    (chatId: string, newTitle: string) => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: newTitle,
              updatedAt: new Date(),
            }
          : chat
      )
      saveChats(updatedChats)
    },
    [chats, saveChats]
  )

  // Delete a chat
  const deleteChat = useCallback(
    (chatId: string) => {
      const updatedChats = chats.filter((chat) => chat.id !== chatId)
      saveChats(updatedChats)

      // Delete chat messages from localStorage
      localStorage.removeItem(`chat_${chatId}`)

      // If deleting current chat, switch to first available or create new
      if (chatId === currentChatId) {
        if (updatedChats.length > 0) {
          setCurrentChatId(updatedChats[0].id)
        } else {
          createNewChat()
        }
      }
    },
    [chats, currentChatId, saveChats, createNewChat]
  )

  // Initialize with a new chat if none exist
  useEffect(() => {
    if (chats.length === 0) {
      const newChatId = createNewChat()
      setCurrentChatId(newChatId)
    } else if (!currentChatId) {
      setCurrentChatId(chats[0].id)
    }
  }, []) // Run only once on mount

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    renameChat,
    deleteChat,
  }
}
