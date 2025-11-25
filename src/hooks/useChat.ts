import { useState, useCallback, useEffect } from 'react'
import { Message, AIProvider } from '../types'
import { AIServiceManager } from '../services/ai.service'

interface UseChatOptions {
  provider: AIProvider
  apiKey: string
  chatId?: string
}

export function useChat({ provider, apiKey, chatId }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [streamingMessage, setStreamingMessage] = useState<string>('')

  // Load messages from localStorage on mount
  useEffect(() => {
    if (chatId) {
      const storedMessages = localStorage.getItem(`chat_${chatId}`)
      if (storedMessages) {
        try {
          const parsed = JSON.parse(storedMessages)
          setMessages(parsed)
        } catch (e) {
          console.error('Error loading chat history:', e)
        }
      }
    }
  }, [chatId])

  // Save messages to localStorage when they change
  useEffect(() => {
    if (chatId && messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages))
    }
  }, [chatId, messages])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)
      setStreamingMessage('')

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        provider,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Create assistant message placeholder
        const assistantMessageId = `msg_${Date.now() + 1}`
        let assistantContent = ''

        // Send to AI with streaming
        const response = await AIServiceManager.sendMessage(
          provider,
          apiKey,
          [...messages, userMessage],
          (chunk) => {
            assistantContent += chunk
            setStreamingMessage(assistantContent)
          }
        )

        // Add final assistant message
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          provider,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setStreamingMessage('')
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        console.error('Chat error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [provider, apiKey, messages, isLoading]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    setStreamingMessage('')
    if (chatId) {
      localStorage.removeItem(`chat_${chatId}`)
    }
  }, [chatId])

  return {
    messages,
    isLoading,
    error,
    streamingMessage,
    sendMessage,
    clearChat,
  }
}
