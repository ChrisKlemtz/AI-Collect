import { AIProvider } from '../types'
import { useAuth } from '../contexts/AuthContext'
import './APIKeyGuideModal.scss'

interface APIKeyGuideModalProps {
  provider: AIProvider | null
  onClose: () => void
}

const getApiKeyGuides = (userEmail: string) => ({
  chatgpt: {
    name: 'ChatGPT / OpenAI',
    steps: [
      {
        text: `Melde dich mit deiner Email (${userEmail}) bei OpenAI an oder erstelle einen neuen Account`,
      },
      {
        text: 'Gehe zur API Keys Seite',
        link: 'https://platform.openai.com/api-keys',
      },
      {
        text: 'Klicke auf "Create new secret key"',
      },
      {
        text: 'Gib dem Key einen Namen (z.B. "Multi-AI Hub")',
      },
      {
        text: 'Kopiere den generierten API-Key sofort (er wird nur einmal angezeigt!)',
      },
      {
        text: 'Füge den Key hier in die Anwendung ein',
      },
    ],
    notes: [
      'Der API-Key beginnt mit "sk-"',
      'Bewahre den Key sicher auf - er wird nur einmal angezeigt',
      'Kosten: Pay-as-you-go Modell, ca. $0.002/1K Tokens (GPT-3.5-turbo)',
      'Neue Accounts erhalten oft $5 Startguthaben',
    ],
    pricing: 'https://openai.com/api/pricing/',
  },
  claude: {
    name: 'Claude / Anthropic',
    steps: [
      {
        text: 'Gehe zur Anthropic Console',
        link: 'https://console.anthropic.com/',
      },
      {
        text: `Melde dich mit deiner Email (${userEmail}) an oder erstelle einen Account`,
      },
      {
        text: 'Klicke auf "Get API keys" oder navigiere zu den Einstellungen',
        link: 'https://console.anthropic.com/settings/keys',
      },
      {
        text: 'Klicke auf "Create Key"',
      },
      {
        text: 'Gib dem Key einen Namen (z.B. "Multi-AI Hub")',
      },
      {
        text: 'Kopiere den generierten API-Key',
      },
      {
        text: 'Füge den Key hier in die Anwendung ein',
      },
    ],
    notes: [
      'Der API-Key beginnt mit "sk-ant-"',
      'Neue Accounts erhalten oft $5 kostenloses Guthaben',
      'Kosten: ca. $3/$15 pro Million Tokens (Claude 3.5 Sonnet)',
      'Claude ist bekannt für längere, detailliertere Antworten',
    ],
    pricing: 'https://www.anthropic.com/pricing#anthropic-api',
  },
  deepseek: {
    name: 'DeepSeek',
    steps: [
      {
        text: 'Gehe zur DeepSeek Platform',
        link: 'https://platform.deepseek.com/',
      },
      {
        text: `Melde dich mit deiner Email (${userEmail}) an oder erstelle einen Account`,
      },
      {
        text: 'Navigiere zu "API Keys" im Dashboard',
        link: 'https://platform.deepseek.com/api_keys',
      },
      {
        text: 'Klicke auf "Create API Key"',
      },
      {
        text: 'Gib dem Key einen Namen (z.B. "Multi-AI Hub")',
      },
      {
        text: 'Kopiere den generierten API-Key',
      },
      {
        text: 'Füge den Key hier in die Anwendung ein',
      },
    ],
    notes: [
      'Der API-Key beginnt mit "sk-"',
      'DeepSeek bietet sehr günstige Preise',
      'Kosten: ca. $0.14/$0.28 pro Million Tokens',
      'Spezialisiert auf Code-Generierung und technische Aufgaben',
    ],
    pricing: 'https://platform.deepseek.com/api-docs/pricing/',
  },
})

export default function APIKeyGuideModal({ provider, onClose }: APIKeyGuideModalProps) {
  const { user } = useAuth()

  if (!provider) return null

  const guide = getApiKeyGuides(user?.email || '')[provider]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content api-key-guide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔑 API-Key für {guide.name} erhalten</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="guide-section">
            <h3>Schritt-für-Schritt Anleitung:</h3>
            <ol className="steps-list">
              {guide.steps.map((step, index) => (
                <li key={index}>
                  {step.link ? (
                    <>
                      {step.text}
                      <br />
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        → {step.link}
                      </a>
                      {step.emailInfo && (
                        <>
                          <br />
                          <span className="email-info">✓ {step.emailInfo}</span>
                        </>
                      )}
                    </>
                  ) : (
                    step.text
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="guide-section notes">
            <h3>📝 Wichtige Hinweise:</h3>
            <ul>
              {guide.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="guide-section pricing">
            <h3>💰 Preise:</h3>
            <a
              href={guide.pricing}
              target="_blank"
              rel="noopener noreferrer"
              className="pricing-link"
            >
              Aktuelle Preisübersicht ansehen →
            </a>
          </div>

          <div className="guide-footer">
            <button className="btn-primary" onClick={onClose}>
              Verstanden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
