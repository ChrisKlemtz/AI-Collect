# 🤖 Multi-AI Hub

<div align="center">

**[🇩🇪 Deutsch](./README.md) | [🇬🇧 English](#)**

</div>

> **A central platform for all your AI assistants**
> Access ChatGPT, Claude, and DeepSeek through a single interface and compare their responses in real-time.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🎯 Demo & Screenshots](#-demo--screenshots)
- [🚀 Quick Start](#-quick-start)
- [📖 Usage](#-usage)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [📊 Project Status](#-project-status)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎨 User Interface
- **Dark/Light Mode** - Switchable theme on all pages
- **Minimalist Design** - Focus on the essentials
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Fade-in effects and live streaming cursor

### 💬 Chat Features
- **Multi-Provider Support** - ChatGPT, Claude, and DeepSeek
- **Streaming Responses** - Live answers in real-time
- **Split-View Mode** - Compare two AIs side-by-side
- **Chat History** - Automatic saving and loading
- **Provider Switching** - Dropdown selection in compare mode

### 🔐 Management
- **API Key Management** - Secure local storage
- **Multi-Email Support** - Manage multiple accounts
- **Session Persistence** - Theme and chats remain saved

---

## 🎯 Demo & Screenshots

### Single Chat Mode
Chat with an AI of your choice and receive live streaming responses.

### Compare Mode (Split-View)
Ask the same question to two different AIs and compare their answers side-by-side.

**Available AI Models:**
- 🤖 **ChatGPT** - GPT-4o-mini (OpenAI)
- 🧠 **Claude** - Sonnet 3.5 (Anthropic)
- 🔍 **DeepSeek** - DeepSeek Chat

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API keys for desired AI services

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/multi-ai-hub.git
cd multi-ai-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

The app now runs on `http://localhost:3000`

### Production Build

```bash
# Create build
npm run build

# Test build
npm run preview
```

---

## 📖 Usage

### 1️⃣ Getting Started

1. **Login** - Enter an email and password (currently placeholder only)
2. **Select Email** - Choose or add email addresses
3. **Setup API Keys** - Click on an AI card and enter your API key
4. **Start** - Begin a chat or compare AIs

### 2️⃣ Getting API Keys

You need API keys from the respective providers:

| Provider | Link | Description |
|----------|------|-------------|
| **ChatGPT** | [OpenAI Platform](https://platform.openai.com/api-keys) | Create an API key in your OpenAI account |
| **Claude** | [Anthropic Console](https://console.anthropic.com/account/keys) | Generate a key in the Anthropic Console |
| **DeepSeek** | [DeepSeek Platform](https://platform.deepseek.com/api_keys) | Create a key in the DeepSeek Dashboard |

### 3️⃣ Single Chat Mode

1. Select an AI on the AI selection page
2. Write your message
3. Receive live streaming responses
4. Chat history is automatically saved

**Keyboard Shortcuts:**
- `Enter` - Send message
- `Theme Toggle` (top right) - Dark/Light mode

### 4️⃣ Compare Mode (Split-View)

1. Setup **at least 2 AIs** with API keys
2. Click the **"Compare AIs"** button
3. Select an AI in each panel
4. Ask a question - both AIs respond in parallel!

**Compare Mode Features:**
- Dropdown to switch AI providers
- Parallel streaming responses
- Individual error handling per AI
- Clear both chats simultaneously

---

## 🛠️ Tech Stack

### Frontend
```
React 19.x        - UI Framework
TypeScript 5.x    - Type Safety
Vite 7.x          - Build Tool & Dev Server
React Router 7.x  - Client-Side Routing
```

### Styling
```
SCSS              - CSS Preprocessor
Custom Variables  - Consistent Design System
Dark/Light Theme  - Context-based Theming
```

### AI Integration
```
OpenAI SDK        - ChatGPT Integration
Anthropic SDK     - Claude Integration
Axios             - DeepSeek HTTP Requests
```

### State Management
```
React Hooks       - Local State
Context API       - Global Theme State
localStorage      - Data Persistence
```

---

## 📁 Project Structure

```
multi-ai-hub/
├── src/
│   ├── components/         # Reusable Components
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.scss
│   ├── contexts/           # React Contexts
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom Hooks
│   │   ├── useChat.ts
│   │   └── useCompareChat.ts
│   ├── pages/              # Page Components
│   │   ├── LoginPage.tsx
│   │   ├── EmailSelectionPage.tsx
│   │   ├── AISelectionPage.tsx
│   │   ├── ChatPage.tsx
│   │   └── CompareChatPage.tsx
│   ├── services/           # API Services
│   │   ├── ai.service.ts
│   │   ├── chatgpt.service.ts
│   │   ├── claude.service.ts
│   │   └── deepseek.service.ts
│   ├── styles/             # Global Styles
│   │   ├── variables.scss
│   │   └── global.scss
│   ├── types/              # TypeScript Types
│   │   └── index.ts
│   ├── App.tsx             # Root Component
│   └── main.tsx            # Entry Point
├── public/                 # Static Assets
├── index.html              # HTML Template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Important Files

| File | Description |
|------|-------------|
| `src/services/ai.service.ts` | Central AI service management |
| `src/hooks/useChat.ts` | Hook for single chat management |
| `src/hooks/useCompareChat.ts` | Hook for split-view management |
| `src/contexts/ThemeContext.tsx` | Theme state & persistence |
| `src/types/index.ts` | TypeScript interfaces |

---

## 🔧 Development

### Development Server

```bash
# Start server with hot reload
npm run dev
```

### TypeScript Checking

```bash
# Type-check without build
npm run lint
```

### Production Build

```bash
# Create optimized build
npm run build

# Test build locally
npm run preview
```

### Code Structure Guidelines

**Components:**
- Use functional components with hooks
- One file per component
- Co-located SCSS files

**Services:**
- One class per AI provider
- Consistent interface
- Error handling

**Hooks:**
- Custom hooks for reusable logic
- Clear input/output interfaces
- useCallback for performance

---

## 📊 Project Status

### ✅ Phase 1 - Project Setup (Completed)
- [x] Vite + React + TypeScript setup
- [x] Routing with React Router
- [x] SCSS variables system
- [x] Base UI (Login, Email Selection, AI Selection)

### ✅ Phase 2 - Chat Functionality (Completed)
- [x] API integration (ChatGPT, Claude, DeepSeek)
- [x] Streaming support
- [x] Chat history with localStorage
- [x] useChat hook
- [x] Service layer architecture

### ✅ Phase 3 - Dark/Light Mode (Completed)
- [x] Theme context
- [x] Theme toggle component
- [x] Theme persistence
- [x] Responsive theme switching

### ✅ Phase 4 - Multi-Chat Split-View (Completed)
- [x] useCompareChat hook
- [x] CompareChatPage component
- [x] Split-screen layout
- [x] Provider selection dropdowns
- [x] Parallel message processing
- [x] Compare button on AI selection

### 🚧 Phase 5 - UI Enhancements (Planned)
- [ ] Prompt presets (saved prompts)
- [ ] Chat history sidebar
- [ ] Hotkeys (Ctrl+K, Ctrl+Enter, etc.)
- [ ] Markdown rendering in responses
- [ ] Code syntax highlighting

### 🔮 Phase 6 - Backend (Future)
- [ ] Node.js + Express backend
- [ ] SQLite database
- [ ] Real authentication
- [ ] Session management
- [ ] API key encryption

---

## 🤝 Contributing

Contributions are welcome! Please note:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

### Development Guidelines
- Maintain code quality with TypeScript
- Follow the existing folder structure
- Write clear commit messages
- Test before submitting PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenAI** - ChatGPT API
- **Anthropic** - Claude API
- **DeepSeek** - DeepSeek API
- **React Team** - Awesome Framework
- **Vite Team** - Lightning-fast Build Tool

---

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-username/multi-ai-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/multi-ai-hub/discussions)

---

<p align="center">
  Built with ❤️ and <a href="https://claude.com/claude-code">Claude Code</a>
</p>
