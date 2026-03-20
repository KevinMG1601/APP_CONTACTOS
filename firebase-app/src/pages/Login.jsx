import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sileo } from 'sileo'
import { useAuth } from '../hooks/useAuth'
import { formatFirebaseError } from '../utils/formatFirebaseError'

export default function Login() {
  const { login, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/tasks'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    clearError()
    setSubmitting(true)
    try {
      await login(email, password)
      sileo.success({
        title: 'Sesión iniciada',
        description: 'Has entrado correctamente.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
      navigate(from, { replace: true })
    } catch (e) {
      sileo.error({
        title: 'No se pudo iniciar sesión',
        description: formatFirebaseError(e),
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#1e3a5f_0%,#0f1419_55%)] p-6">
      <div className="w-full max-w-[400px] rounded-xl border border-app-border bg-app-surface p-8 shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
        <h1 className="mb-2 text-2xl font-semibold text-app-text">
          Iniciar sesión
        </h1>
        <p className="mb-6 text-sm text-app-muted">
          Accede con tu correo y contraseña.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-app-muted">Correo</span>
            <input
              type="email"
              autoComplete="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-app-muted">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={submitting}
            />
          </label>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-app-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-app-accent hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
