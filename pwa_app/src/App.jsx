import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import PerfilUsuario from './pages/perfil/PerfilUsuario.jsx'

const STORAGE_KEY = 'usuario'

function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY)
      return guardado ? JSON.parse(guardado) : null
    } catch {
      return null
    }
  })

  const handleLogin = (u) => {
    setUsuario(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUsuario(null)
  }

  const handleUpdateUser = (nuevoUsuario) => {
    setUsuario(nuevoUsuario)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoUsuario))
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={usuario ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          element={
            !usuario ? (
              <Navigate to="/" replace />
            ) : (
              <Layout usuario={usuario} onLogout={handleLogout} />
            )
          }
        >
          <Route path="dashboard" element={<Dashboard user={usuario} />} />
          <Route path="perfil" element={ <PerfilUsuario user={usuario} onUpdateUser={handleUpdateUser} /> } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
