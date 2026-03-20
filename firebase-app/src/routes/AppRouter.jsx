import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProtectedRoute } from '../hooks/useProtectedRoute'
import Login from '../pages/Login'
import Register from '../pages/Register'
import TaskDetail from '../pages/TaskDetail'
import TaskForm from '../pages/TaskForm'
import Tasks from '../pages/Tasks'


function PrivateLayout() {
  const { isLoading, isAuthenticated, redirectTo, state } = useProtectedRoute()

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center gap-3 px-8 py-8 text-app-muted"
        role="status"
      >
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-border border-t-app-accent"
          aria-hidden
        />
        Cargando sesión…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={state} replace />
  }

  return <Outlet />
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/tasks'

  if (loading) {
    return (
      <div
        className="flex items-center justify-center gap-3 px-8 py-8 text-app-muted"
        role="status"
      >
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-border border-t-app-accent"
          aria-hidden
        />
        Cargando…
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />

      <Route element={<PrivateLayout />}>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/new" element={<TaskForm />} />
        <Route path="/tasks/:id/edit" element={<TaskForm />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
      </Route>

      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  )
}
