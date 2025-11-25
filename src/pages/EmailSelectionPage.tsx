import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './EmailSelectionPage.scss'

function EmailSelectionPage() {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [showAddEmail, setShowAddEmail] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Load stored emails from localStorage
    const userEmail = localStorage.getItem('userEmail')
    const storedEmails = localStorage.getItem('userEmails')

    if (storedEmails) {
      const emailList = JSON.parse(storedEmails)
      setEmails(emailList)
    } else if (userEmail) {
      // If no stored emails, use the login email
      setEmails([userEmail])
      localStorage.setItem('userEmails', JSON.stringify([userEmail]))
    }
  }, [])

  const handleSelectEmail = (email: string) => {
    localStorage.setItem('selectedEmail', email)
    navigate('/ai-selection')
  }

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      const updatedEmails = [...emails, newEmail]
      setEmails(updatedEmails)
      localStorage.setItem('userEmails', JSON.stringify(updatedEmails))
      setNewEmail('')
      setShowAddEmail(false)
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = emails.filter(email => email !== emailToRemove)
    setEmails(updatedEmails)
    localStorage.setItem('userEmails', JSON.stringify(updatedEmails))
  }

  return (
    <div className="email-selection-page">
      <div className="email-selection-container">
        <div className="page-header">
          <h1>Wähle deine E-Mail</h1>
          <p>Mit welcher E-Mail-Adresse möchtest du auf deine KI-Dienste zugreifen?</p>
        </div>

        <div className="email-grid">
          {emails.map((email) => (
            <div key={email} className="email-card">
              <button
                className="email-card-button"
                onClick={() => handleSelectEmail(email)}
              >
                <div className="email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <span className="email-text">{email}</span>
              </button>
              <button
                className="remove-email-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveEmail(email)
                }}
                title="E-Mail entfernen"
              >
                ×
              </button>
            </div>
          ))}

          {!showAddEmail ? (
            <div className="email-card add-email-card">
              <button
                className="email-card-button"
                onClick={() => setShowAddEmail(true)}
              >
                <div className="email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="email-text">Neue E-Mail hinzufügen</span>
              </button>
            </div>
          ) : (
            <div className="email-card add-email-form-card">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="neue@email.de"
                autoFocus
              />
              <div className="add-email-actions">
                <button className="btn-add" onClick={handleAddEmail}>
                  Hinzufügen
                </button>
                <button className="btn-cancel" onClick={() => {
                  setShowAddEmail(false)
                  setNewEmail('')
                }}>
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="btn-logout" onClick={() => navigate('/login')}>
          Abmelden
        </button>
      </div>
    </div>
  )
}

export default EmailSelectionPage
