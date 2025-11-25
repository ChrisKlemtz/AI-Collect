import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import EmailSelectionPage from './pages/EmailSelectionPage'
import AISelectionPage from './pages/AISelectionPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/emails" element={<EmailSelectionPage />} />
        <Route path="/ai-selection" element={<AISelectionPage />} />
        <Route path="/chat/:provider" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
