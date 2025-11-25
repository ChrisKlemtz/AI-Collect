import { useState, useCallback } from 'react'
import { Message, AIProvider } from '../types'
import { AIServiceManager } from '../services/ai.service'

interface UseCompareChatOptions {
  provider1: AIProvider
  provider2: AIProvider
  apiKey1: string
  apiKey2: string
}

interface CompareMessages {
  provider1: Message[]
  provider2: Message[]
}

export function useCompareChat({ provider1, provider2, apiKey1, apiKey2 }: UseCompareChatOptions) {
  const [messages, setMessages] = useState<CompareMessages>({
    provider1: [],
    provider2: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ provider1: string | null; provider2: string | null }>({
    provider1: null,
    provider2: null,
  })
  const [streamingMessages, setStreamingMessages] = useState<{ provider1: string; provider2: string }>({
    provider1: '',
    provider2: '',
  })

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setErrors({ provider1: null, provider2: null })
      setStreamingMessages({ provider1: '', provider2: '' })

      // Add user message
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        provider: provider1, // Doesn't matter which provider for user messages
      }

      setMessages((prev) => ({
        provider1: [...prev.provider1, userMessage],
        provider2: [...prev.provider2, userMessage],
      }))

      setIsLoading(true)

      // Send to both providers in parallel
      await Promise.allSettled([
        // Provider 1
        (async () => {
          try {
            let content1 = ''
            const response1 = await AIServiceManager.sendMessage(
              provider1,
              apiKey1,
              [...messages.provider1, userMessage],
              (chunk) => {
                content1 += chunk
                setStreamingMessages((prev) => ({ ...prev, provider1: content1 }))
              }
            )

            const assistantMessage1: Message = {
              id: `msg_${Date.now()}_1`,
              role: 'assistant',
              content: response1,
              timestamp: new Date(),
              provider: provider1,
            }

            setMessages((prev) => ({
              ...prev,
              provider1: [...prev.provider1, assistantMessage1],
            }))
            setStreamingMessages((prev) => ({ ...prev, provider1: '' }))
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setErrors((prev) => ({ ...prev, provider1: errorMessage }))
          }
        })(),

        // Provider 2
        (async () => {
          try {
            let content2 = ''
            const response2 = await AIServiceManager.sendMessage(
              provider2,
              apiKey2,
              [...messages.provider2, userMessage],
              (chunk) => {
                content2 += chunk
                setStreamingMessages((prev) => ({ ...prev, provider2: content2 }))
              }
            )

            const assistantMessage2: Message = {
              id: `msg_${Date.now()}_2`,
              role: 'assistant',
              content: response2,
              timestamp: new Date(),
              provider: provider2,
            }

            setMessages((prev) => ({
              ...prev,
              provider2: [...prev.provider2, assistantMessage2],
            }))
            setStreamingMessages((prev) => ({ ...prev, provider2: '' }))
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setErrors((prev) => ({ ...prev, provider2: errorMessage }))
          }
        })(),
      ])

      setIsLoading(false)
    },
    [provider1, provider2, apiKey1, apiKey2, messages, isLoading]
  )

  const clearChats = useCallback(() => {
    setMessages({ provider1: [], provider2: [] })
    setErrors({ provider1: null, provider2: null })
    setStreamingMessages({ provider1: '', provider2: '' })
  }, [])

  return {
    messages,
    isLoading,
    errors,
    streamingMessages,
    sendMessage,
    clearChats,
  }
}
