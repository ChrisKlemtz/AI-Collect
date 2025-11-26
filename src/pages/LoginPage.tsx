import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authApi } from '../services/api'
import ThemeToggle from '../components/ThemeToggle'
import './LoginPage.scss'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const navigate = useNavigate()
  const { login, register, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ai-selection')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowResendVerification(false)

    // Validate password confirmation in register mode
    if (isRegisterMode) {
      if (password !== passwordConfirm) {
        setError('Die Passwörter stimmen nicht überein')
        return
      }
      if (password.length < 6) {
        setError('Passwort muss mindestens 6 Zeichen lang sein')
        return
      }
    }

    setIsLoading(true)

    try {
      if (isRegisterMode) {
        await register(email, password, passwordConfirm)
        setError('Registrierung erfolgreich! Bitte überprüfe deine E-Mail, um deinen Account zu verifizieren.')
      } else {
        await login(email, password)
        navigate('/ai-selection')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Ein Fehler ist aufgetreten'
      setError(errorMessage)

      // Show resend verification option if email not verified
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setShowResendVerification(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setError('Bitte gib deine E-Mail-Adresse ein')
      return
    }

    setIsResending(true)
    try {
      await authApi.resendVerification(email)
      setError('Verifizierungs-E-Mail wurde erneut gesendet. Bitte überprüfe dein Postfach.')
      setShowResendVerification(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Versenden der E-Mail')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="login-page">
      <ThemeToggle />
      <div className="login-container">
        <div className="login-header">
          <h1>Multi-AI Hub</h1>
          <p>Zugriff auf alle deine KI-Dienste an einem Ort</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
            />
            {isRegisterMode && (
              <small>Mindestens 6 Zeichen</small>
            )}
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label htmlFor="passwordConfirm">Passwort bestätigen</label>
              <input
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isLoading}
              />
              <small>Bitte gib das gleiche Passwort erneut ein</small>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Lädt...' : isRegisterMode ? 'Registrieren' : 'Anmelden'}
          </button>

          {showResendVerification && (
            <button
              type="button"
              className="btn-resend"
              onClick={handleResendVerification}
              disabled={isResending}
            >
              {isResending ? 'Wird gesendet...' : '📧 Verifizierungs-E-Mail erneut senden'}
            </button>
          )}
        </form>

        <div className="login-footer">
          <p>
            {isRegisterMode ? 'Bereits ein Account? ' : 'Noch kein Account? '}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              setIsRegisterMode(!isRegisterMode);
              setError('');
              setPasswordConfirm('');
              setShowResendVerification(false);
            }}>
              {isRegisterMode ? 'Anmelden' : 'Registrieren'}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
