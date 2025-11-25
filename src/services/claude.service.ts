import Anthropic from '@anthropic-ai/sdk'
import { Message } from '../types'

export class ClaudeService {
  private client: Anthropic | null = null
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.initClient()
  }

  private initClient() {
    if (!this.apiKey) {
      throw new Error('Claude API key is required')
    }

    this.client = new Anthropic({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true, // For development - should use backend in production
    })
  }

  async sendMessage(
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Claude client not initialized')
    }

    try {
      // Filter out system messages and format for Claude
      const userMessages = messages.filter((msg) => msg.role !== 'system')
      const systemMessage = messages.find((msg) => msg.role === 'system')

      const formattedMessages = userMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }))

      if (onStream) {
        // Streaming response
        const stream = await this.client.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          system: systemMessage?.content,
          messages: formattedMessages,
        })

        let fullResponse = ''
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const content = chunk.delta.text
            fullResponse += content
            onStream(content)
          }
        }
        return fullResponse
      } else {
        // Non-streaming response
        const response = await this.client.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          system: systemMessage?.content,
          messages: formattedMessages,
        })

        const textContent = response.content.find((c) => c.type === 'text')
        return textContent && textContent.type === 'text' ? textContent.text : ''
      }
    } catch (error) {
      console.error('Claude API Error:', error)
      throw new Error(`Claude Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
          provider: 'claude',
        },
      ])
      return true
    } catch {
      return false
    }
  }
}
