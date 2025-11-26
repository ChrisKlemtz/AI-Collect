import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/api'
import ThemeToggle from '../components/ThemeToggle'
import './VerifyEmailPage.scss'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Kein Verifizierungstoken gefunden')
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await authApi.verifyEmail(token)
      setStatus('success')
      setMessage(response.message || 'E-Mail erfolgreich verifiziert!')

      // Redirect to AI selection after 2 seconds
      setTimeout(() => {
        navigate('/ai-selection')
      }, 2000)
    } catch (error: any) {
      setStatus('error')
      setMessage(error.response?.data?.error || 'Verifizierung fehlgeschlagen')
    }
  }

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsResending(true)
    try {
      const response = await authApi.resendVerification(email)
      alert(response.message || 'Verifizierungs-E-Mail wurde erneut gesendet')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Fehler beim Versenden der E-Mail')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="verify-email-page">
      <ThemeToggle />
      <div className="verify-container">
        <div className="verify-header">
          <h1>Multi-AI Hub</h1>
        </div>

        <div className={`verify-content ${status}`}>
          {status === 'verifying' && (
            <>
              <div className="loading-spinner"></div>
              <h2>E-Mail wird verifiziert...</h2>
              <p>Bitte warten Sie einen Moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>E-Mail erfolgreich verifiziert!</h2>
              <p>{message}</p>
              <p className="redirect-message">
                Du wirst in Kürze weitergeleitet...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">✕</div>
              <h2>Verifizierung fehlgeschlagen</h2>
              <p className="error-message">{message}</p>

              <div className="resend-section">
                <h3>Neuen Verifizierungslink anfordern</h3>
                <form onSubmit={handleResendVerification}>
                  <div className="form-group">
                    <label htmlFor="email">E-Mail-Adresse</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deine@email.de"
                      required
                      disabled={isResending}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isResending}
                  >
                    {isResending ? 'Wird gesendet...' : 'Link erneut senden'}
                  </button>
                </form>
              </div>

              <div className="actions">
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/login')}
                >
                  Zurück zur Anmeldung
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage
