# Multi-AI Hub

Eine webbasierte Plattform, die Zugriff auf mehrere KI-Dienste von einem zentralen Ort aus ermöglicht.

## Features

- **Single Sign-On**: Einmalige Anmeldung für alle KI-Dienste
- **Multi-Email Support**: Verwaltung mehrerer E-Mail-Adressen
- **KI-Integration**: ChatGPT (GPT-4o-mini), Claude (Sonnet 3.5), DeepSeek
- **Streaming Responses**: Live-Antworten von allen KI-Diensten
- **Chat-Verwaltung**: Automatisches Speichern & Laden von Chats
- **Dark/Light Mode**: Umschaltbar mit Theme Toggle auf allen Seiten
- **API-Key Management**: Sichere lokale Verwaltung von API-Keys

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# Preview Build
npm run preview
```

## Technologie-Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: SCSS mit Variablen-System
- **Routing**: React Router
- **AI SDKs**: OpenAI SDK, Anthropic SDK, Axios
- **Storage**: localStorage (Backend mit SQLite geplant)

## Projekt-Status

### Phase 1 (✅ Abgeschlossen):
- Projekt-Setup mit Vite + React + TypeScript
- Basis-UI (Login, E-Mail-Auswahl, KI-Auswahl)
- Routing-Struktur
- SCSS-Styling-System

### Phase 2 (✅ Abgeschlossen):
- Chat-Interface mit Message-Display
- API-Integration für ChatGPT, Claude & DeepSeek
- Streaming-Unterstützung für Live-Antworten
- Chat-History mit localStorage-Persistenz
- useChat Hook für State-Management
- Service-Layer-Architektur

### Phase 3 (✅ Abgeschlossen):
- Dark/Light Mode mit Theme Context
- Theme Toggle Button auf allen Seiten
- Theme-Persistenz in localStorage
- Responsive Theme-Umschaltung

### Phase 4 (Geplant):
- Backend mit Node.js + Express
- SQLite Datenbank
- Authentifizierung & Session-Management
- Prompt-Presets
- Multi-Chat-Fenster (Split-View)
- Hotkeys

## Verwendung

1. Registriere dich auf der Login-Seite
2. Wähle deine E-Mail-Adresse
3. Füge API-Keys für die gewünschten KI-Dienste hinzu
4. Starte einen Chat mit der KI deiner Wahl

**API-Keys benötigt:**
- ChatGPT: [OpenAI API Key](https://platform.openai.com/api-keys)
- Claude: [Anthropic API Key](https://console.anthropic.com/account/keys)
- DeepSeek: [DeepSeek API Key](https://platform.deepseek.com/api_keys)

## Entwicklung

Das Projekt wird aktiv entwickelt. Contributions sind willkommen!
