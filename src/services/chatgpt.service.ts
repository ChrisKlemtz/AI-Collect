import OpenAI from 'openai'
import { Message } from '../types'

export class ChatGPTService {
  private client: OpenAI | null = null
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.initClient()
  }

  private initClient() {
    if (!this.apiKey) {
      throw new Error('ChatGPT API key is required')
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true, // For development - should use backend in production
    })
  }

  async sendMessage(
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.client) {
      throw new Error('ChatGPT client not initialized')
    }

    try {
      const formattedMessages = messages.map((msg) => ({
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
      }))

      if (onStream) {
        // Streaming response
        const stream = await this.client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
          stream: true,
        })

        let fullResponse = ''
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            onStream(content)
          }
        }
        return fullResponse
      } else {
        // Non-streaming response
        const response = await this.client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
        })

        return response.choices[0]?.message?.content || ''
      }
    } catch (error) {
      console.error('ChatGPT API Error:', error)
      throw new Error(`ChatGPT Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
          provider: 'chatgpt',
        },
      ])
      return true
    } catch {
      return false
    }
  }
}
