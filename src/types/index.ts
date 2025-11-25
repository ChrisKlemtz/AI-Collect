// User Types
export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

// AI Provider Types
export type AIProvider = 'chatgpt' | 'claude' | 'deepseek';

export interface AIService {
  id: AIProvider;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  apiKey?: string;
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider: AIProvider;
}

export interface Chat {
  id: string;
  title: string;
  provider: AIProvider;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  selectedEmail: string | null;
}

// API Key Types
export interface APIKeyConfig {
  provider: AIProvider;
  apiKey: string;
  isValid: boolean;
}
