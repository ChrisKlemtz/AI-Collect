import axios from 'axios'
import { Message } from '../types'

export class DeepSeekService {
  private apiKey: string
  private baseURL = 'https://api.deepseek.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async sendMessage(
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is required')
    }

    try {
      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      if (onStream) {
        // Streaming response
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: formattedMessages,
            stream: true,
          }),
        })

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n').filter((line) => line.trim() !== '')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    fullResponse += content
                    onStream(content)
                  }
                } catch (e) {
                  console.error('Error parsing DeepSeek chunk:', e)
                }
              }
            }
          }
        }

        return fullResponse
      } else {
        // Non-streaming response
        const response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: 'deepseek-chat',
            messages: formattedMessages,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
          }
        )

        return response.data.choices?.[0]?.message?.content || ''
      }
    } catch (error) {
      console.error('DeepSeek API Error:', error)
      throw new Error(`DeepSeek Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage([
        {
          id: 'test',
          role: 'user',
          content: 'Hi',
          timestamp: new Date(),
          provider: 'deepseek',
        },
      ])
      return true
    } catch {
      return false
    }
  }
}
