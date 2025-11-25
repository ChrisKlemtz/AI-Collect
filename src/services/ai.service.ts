import { AIProvider, Message } from '../types'
import { ChatGPTService } from './chatgpt.service'
import { ClaudeService } from './claude.service'
import { DeepSeekService } from './deepseek.service'

export class AIServiceManager {
  private static instances: Map<string, ChatGPTService | ClaudeService | DeepSeekService> = new Map()

  static getService(provider: AIProvider, apiKey: string) {
    const key = `${provider}-${apiKey}`

    if (!this.instances.has(key)) {
      switch (provider) {
        case 'chatgpt':
          this.instances.set(key, new ChatGPTService(apiKey))
          break
        case 'claude':
          this.instances.set(key, new ClaudeService(apiKey))
          break
        case 'deepseek':
          this.instances.set(key, new DeepSeekService(apiKey))
          break
        default:
          throw new Error(`Unknown provider: ${provider}`)
      }
    }

    return this.instances.get(key)!
  }

  static async sendMessage(
    provider: AIProvider,
    apiKey: string,
    messages: Message[],
    onStream?: (chunk: string) => void
  ): Promise<string> {
    const service = this.getService(provider, apiKey)
    return service.sendMessage(messages, onStream)
  }

  static async testConnection(provider: AIProvider, apiKey: string): Promise<boolean> {
    try {
      const service = this.getService(provider, apiKey)
      return await service.testConnection()
    } catch {
      return false
    }
  }
}
