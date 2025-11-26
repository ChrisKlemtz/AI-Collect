import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

export class AIValidator {
  static async validateChatGPT(apiKey: string): Promise<{ valid: boolean; message: string }> {
    try {
      const client = new OpenAI({
        apiKey,
      });

      // Try a simple API call
      await client.models.list();

      return {
        valid: true,
        message: 'ChatGPT API-Key ist gültig',
      };
    } catch (error: any) {
      console.error('ChatGPT validation error:', error);

      if (error?.status === 401) {
        return {
          valid: false,
          message: 'Ungültiger API-Key',
        };
      }

      return {
        valid: false,
        message: error?.message || 'Fehler bei der Validierung',
      };
    }
  }

  static async validateClaude(apiKey: string): Promise<{ valid: boolean; message: string }> {
    try {
      const client = new Anthropic({
        apiKey,
      });

      // Try a minimal API call
      await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      });

      return {
        valid: true,
        message: 'Claude API-Key ist gültig',
      };
    } catch (error: any) {
      console.error('Claude validation error:', error);

      if (error?.status === 401 || error?.status === 403) {
        return {
          valid: false,
          message: 'Ungültiger API-Key',
        };
      }

      return {
        valid: false,
        message: error?.message || 'Fehler bei der Validierung',
      };
    }
  }

  static async validateDeepSeek(apiKey: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 10,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status === 200) {
        return {
          valid: true,
          message: 'DeepSeek API-Key ist gültig',
        };
      }

      return {
        valid: false,
        message: 'Unerwartete Antwort vom DeepSeek-Server',
      };
    } catch (error: any) {
      console.error('DeepSeek validation error:', error);

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return {
          valid: false,
          message: 'Ungültiger API-Key',
        };
      }

      return {
        valid: false,
        message: error?.response?.data?.error?.message || error?.message || 'Fehler bei der Validierung',
      };
    }
  }

  static async validateProvider(provider: string, apiKey: string): Promise<{ valid: boolean; message: string }> {
    switch (provider) {
      case 'chatgpt':
        return this.validateChatGPT(apiKey);
      case 'claude':
        return this.validateClaude(apiKey);
      case 'deepseek':
        return this.validateDeepSeek(apiKey);
      default:
        return {
          valid: false,
          message: 'Unbekannter Provider',
        };
    }
  }
}
