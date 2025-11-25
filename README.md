# 🤖 Multi-AI Hub

<div align="center">

**[🇩🇪 Deutsch](#) | [🇬🇧 English](./README.en.md)**

</div>

> **Eine zentrale Plattform für alle deine KI-Assistenten**
> Greife auf ChatGPT, Claude und DeepSeek über ein einziges Interface zu und vergleiche ihre Antworten in Echtzeit.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

---

## 📑 Inhaltsverzeichnis

- [✨ Features](#-features)
- [🎯 Demo & Screenshots](#-demo--screenshots)
- [🚀 Quick Start](#-quick-start)
- [📖 Verwendung](#-verwendung)
- [🛠️ Technologie-Stack](#️-technologie-stack)
- [📁 Projektstruktur](#-projektstruktur)
- [🔧 Entwicklung](#-entwicklung)
- [📊 Projekt-Status](#-projekt-status)
- [🤝 Contributing](#-contributing)
- [📄 Lizenz](#-lizenz)

---

## ✨ Features

### 🎨 Benutzeroberfläche
- **Dark/Light Mode** - Umschaltbares Theme auf allen Seiten
- **Minimalistisches Design** - Fokus auf das Wesentliche
- **Responsive Layout** - Funktioniert auf Desktop, Tablet und Mobil
- **Smooth Animations** - Fade-In-Effekte und Live-Streaming-Cursor

### 💬 Chat-Funktionen
- **Multi-Provider Support** - ChatGPT, Claude und DeepSeek
- **Streaming Responses** - Live-Antworten in Echtzeit
- **Split-View Modus** - Zwei KIs parallel vergleichen
- **Chat-Historie** - Automatisches Speichern und Laden
- **Provider-Wechsel** - Dropdown zur Auswahl im Compare-Mode

### 🔐 Verwaltung
- **API-Key Management** - Sichere lokale Verwaltung
- **Multi-Email Support** - Mehrere Accounts verwalten
- **Session-Persistenz** - Theme und Chats bleiben erhalten

---

## 🎯 Demo & Screenshots

### Single Chat Mode
Chatte mit einer KI deiner Wahl und erhalte Live-Streaming-Antworten.

### Compare Mode (Split-View)
Stelle die gleiche Frage an zwei verschiedene KIs und vergleiche deren Antworten Side-by-Side.

**Verfügbare KI-Modelle:**
- 🤖 **ChatGPT** - GPT-4o-mini (OpenAI)
- 🧠 **Claude** - Sonnet 3.5 (Anthropic)
- 🔍 **DeepSeek** - DeepSeek Chat

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js (v18 oder höher)
- npm oder yarn
- API-Keys für gewünschte KI-Dienste

### Installation

```bash
# Repository klonen
git clone https://github.com/dein-username/multi-ai-hub.git
cd multi-ai-hub

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft jetzt auf `http://localhost:3000`

### Production Build

```bash
# Build erstellen
npm run build

# Build testen
npm run preview
```

---

## 📖 Verwendung

### 1️⃣ Erste Schritte

1. **Login** - Gib eine E-Mail und Passwort ein (aktuell nur Platzhalter)
2. **E-Mail wählen** - Wähle oder füge E-Mail-Adressen hinzu
3. **API-Keys einrichten** - Klicke auf eine KI-Karte und gib deinen API-Key ein
4. **Loslegen** - Starte einen Chat oder vergleiche KIs

### 2️⃣ API-Keys erhalten

Du benötigst API-Keys von den jeweiligen Anbietern:

| Anbieter | Link | Beschreibung |
|----------|------|--------------|
| **ChatGPT** | [OpenAI Platform](https://platform.openai.com/api-keys) | Erstelle einen API-Key in deinem OpenAI Account |
| **Claude** | [Anthropic Console](https://console.anthropic.com/account/keys) | Generiere einen Key in der Anthropic Console |
| **DeepSeek** | [DeepSeek Platform](https://platform.deepseek.com/api_keys) | Erstelle einen Key im DeepSeek Dashboard |

### 3️⃣ Single Chat Mode

1. Wähle eine KI auf der AI-Selection-Seite
2. Schreibe deine Nachricht
3. Erhalte Live-Streaming-Antworten
4. Chat-Historie wird automatisch gespeichert

**Tastenkombinationen:**
- `Enter` - Nachricht senden
- `Theme Toggle` (oben rechts) - Dark/Light Mode

### 4️⃣ Compare Mode (Split-View)

1. Richte **mindestens 2 KIs** mit API-Keys ein
2. Klicke auf **"KIs vergleichen"** Button
3. Wähle in jedem Panel eine KI aus
4. Stelle eine Frage - beide KIs antworten parallel!

**Features im Compare Mode:**
- Dropdown zum Wechseln der KI-Provider
- Parallele Streaming-Antworten
- Individuelle Fehlerbehandlung pro AI
- Beide Chats gleichzeitig löschen

---

## 🛠️ Technologie-Stack

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
Custom Variables  - Konsistentes Design-System
Dark/Light Theme  - Context-basiertes Theming
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

## 📁 Projektstruktur

```
multi-ai-hub/
├── src/
│   ├── components/         # Wiederverwendbare Komponenten
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.scss
│   ├── contexts/           # React Contexts
│   │   └── ThemeContext.tsx
│   ├── hooks/              # Custom Hooks
│   │   ├── useChat.ts
│   │   └── useCompareChat.ts
│   ├── pages/              # Seiten-Komponenten
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
│   ├── styles/             # Globale Styles
│   │   ├── variables.scss
│   │   └── global.scss
│   ├── types/              # TypeScript Types
│   │   └── index.ts
│   ├── App.tsx             # Root Component
│   └── main.tsx            # Entry Point
├── public/                 # Statische Assets
├── index.html              # HTML Template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Wichtige Dateien

| Datei | Beschreibung |
|-------|--------------|
| `src/services/ai.service.ts` | Zentrale AI-Service-Verwaltung |
| `src/hooks/useChat.ts` | Hook für Single-Chat-Management |
| `src/hooks/useCompareChat.ts` | Hook für Split-View-Management |
| `src/contexts/ThemeContext.tsx` | Theme-State & Persistenz |
| `src/types/index.ts` | TypeScript Interfaces |

---

## 🔧 Entwicklung

### Development Server

```bash
# Server mit Hot-Reload starten
npm run dev
```

### TypeScript Checking

```bash
# Type-Check ohne Build
npm run lint
```

### Build für Production

```bash
# Optimierten Build erstellen
npm run build

# Build lokal testen
npm run preview
```

### Code-Struktur Guidelines

**Components:**
- Verwende funktionale Komponenten mit Hooks
- Ein File pro Komponente
- Co-located SCSS files

**Services:**
- Eine Klasse pro AI-Provider
- Einheitliches Interface
- Error Handling

**Hooks:**
- Custom Hooks für wiederverwendbare Logik
- Klare Input/Output Interfaces
- useCallback für Performance

---

## 📊 Projekt-Status

### ✅ Phase 1 - Projekt-Setup (Abgeschlossen)
- [x] Vite + React + TypeScript Setup
- [x] Routing mit React Router
- [x] SCSS-Variablen-System
- [x] Basis-UI (Login, E-Mail-Auswahl, KI-Auswahl)

### ✅ Phase 2 - Chat-Funktionalität (Abgeschlossen)
- [x] API-Integration (ChatGPT, Claude, DeepSeek)
- [x] Streaming-Unterstützung
- [x] Chat-Historie mit localStorage
- [x] useChat Hook
- [x] Service-Layer-Architektur

### ✅ Phase 3 - Dark/Light Mode (Abgeschlossen)
- [x] Theme Context
- [x] Theme Toggle Component
- [x] Theme-Persistenz
- [x] Responsive Theme-Umschaltung

### ✅ Phase 4 - Multi-Chat Split-View (Abgeschlossen)
- [x] useCompareChat Hook
- [x] CompareChatPage Component
- [x] Split-Screen Layout
- [x] Provider-Auswahl Dropdowns
- [x] Parallele Message-Verarbeitung
- [x] Compare-Button auf AI-Selection

### 🚧 Phase 5 - UI Enhancements (Geplant)
- [ ] Prompt-Presets (gespeicherte Prompts)
- [ ] Chat-Historie-Sidebar
- [ ] Hotkeys (Ctrl+K, Ctrl+Enter, etc.)
- [ ] Markdown-Rendering in Antworten
- [ ] Code-Syntax-Highlighting

### 🔮 Phase 6 - Backend (Zukünftig)
- [ ] Node.js + Express Backend
- [ ] SQLite Datenbank
- [ ] Echte Authentifizierung
- [ ] Session-Management
- [ ] API-Key-Verschlüsselung

---

## 🤝 Contributing

Contributions sind willkommen! Bitte beachte:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Changes (`git commit -m 'Add AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

### Development Guidelines
- Halte Code-Qualität mit TypeScript
- Folge der bestehenden Ordner-Struktur
- Schreibe klare Commit-Messages
- Teste vor dem PR

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.

---

## 🙏 Danksagungen

- **OpenAI** - ChatGPT API
- **Anthropic** - Claude API
- **DeepSeek** - DeepSeek API
- **React Team** - Awesome Framework
- **Vite Team** - Lightning-fast Build Tool

---

## 📞 Kontakt & Support

- **Issues**: [GitHub Issues](https://github.com/dein-username/multi-ai-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dein-username/multi-ai-hub/discussions)

---

<p align="center">
  Gebaut mit ❤️ und <a href="https://claude.com/claude-code">Claude Code</a>
</p>
