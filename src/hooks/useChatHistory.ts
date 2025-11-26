import { useState, useEffect, useCallback } from 'react'
import { ChatHistoryItem, AIProvider, Message } from '../types'
import { chatsApi } from '../services/api'

interface UseChatHistoryOptions {
  email: string
  provider: AIProvider
}

export function useChatHistory({ email, provider }: UseChatHistoryOptions) {
  const [chats, setChats] = useState<ChatHistoryItem[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Load chat history from backend
  useEffect(() => {
    loadChats()
  }, [provider])

  const loadChats = async () => {
    try {
      setIsLoading(true)
      const response = await chatsApi.getAll(provider)
      const chatsWithDates = response.chats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      }))
      setChats(chatsWithDates)
    } catch (error) {
      console.error('Error loading chat history:', error)
      setChats([])
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new chat
  const createNewChat = useCallback(async () => {
    const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      await chatsApi.create(newChatId, 'Neuer Chat', provider)

      const newChat: ChatHistoryItem = {
        id: newChatId,
        title: 'Neuer Chat',
        provider,
        lastMessage: '',
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setChats((prevChats) => [newChat, ...prevChats])
      setCurrentChatId(newChatId)

      return newChatId
    } catch (error) {
      console.error('Error creating chat:', error)
      return ''
    }
  }, [provider])

  // Update chat with new messages
  const updateChatMessages = useCallback(
    async (chatId: string, messages: Message[]) => {
      try {
        await chatsApi.updateMessages(chatId, messages)

        const userMessages = messages.filter((m) => m.role === 'user')
        const lastUserMessage = userMessages[userMessages.length - 1]

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id === chatId) {
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
        )

        // If title was auto-generated, update it in the backend
        const chat = chats.find((c) => c.id === chatId)
        if (chat?.title === 'Neuer Chat' && userMessages.length > 0) {
          const firstMessage = userMessages[0].content
          const newTitle = firstMessage.length > 40 ? firstMessage.substring(0, 40) + '...' : firstMessage
          await chatsApi.rename(chatId, newTitle)
        }
      } catch (error) {
        console.error('Error updating chat messages:', error)
      }
    },
    [chats]
  )

  // Rename a chat
  const renameChat = useCallback(async (chatId: string, newTitle: string) => {
    try {
      await chatsApi.rename(chatId, newTitle)

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                title: newTitle,
                updatedAt: new Date(),
              }
            : chat
        )
      )
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }, [])

  // Delete a chat
  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        await chatsApi.delete(chatId)

        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId))

        // If deleting current chat, switch to first available or create new
        if (chatId === currentChatId) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId)
          if (remainingChats.length > 0) {
            setCurrentChatId(remainingChats[0].id)
          } else {
            createNewChat()
          }
        }
      } catch (error) {
        console.error('Error deleting chat:', error)
      }
    },
    [chats, currentChatId, createNewChat]
  )

  // Initialize with a new chat if none exist
  useEffect(() => {
    if (!isLoading && chats.length === 0) {
      createNewChat()
    } else if (!isLoading && !currentChatId && chats.length > 0) {
      setCurrentChatId(chats[0].id)
    }
  }, [isLoading, chats.length, currentChatId])

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    renameChat,
    deleteChat,
    isLoading,
  }
}
