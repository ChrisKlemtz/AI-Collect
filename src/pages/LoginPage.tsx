import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import './LoginPage.scss'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement actual authentication
    // For now, just store email in localStorage and navigate
    if (email && password) {
      localStorage.setItem('userEmail', email)
      navigate('/emails')
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

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
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
            />
          </div>

          <button type="submit" className="btn-primary">
            Anmelden
          </button>
        </form>

        <div className="login-footer">
          <p>Noch kein Account? <a href="#">Registrieren</a></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
