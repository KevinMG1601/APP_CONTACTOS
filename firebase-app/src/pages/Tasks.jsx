import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sileo } from 'sileo'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { formatTaskDate } from '../utils/formatDate'

export default function Tasks() {
  const { user, logout } = useAuth()
  const { tasks, loading, error, deleteTask } = useTasks()
  const [deletingId, setDeletingId] = useState(null)

  async function handleLogout() {
    try {
      await logout()
      sileo.success({
        title: 'Sesión cerrada',
        description: 'Has salido de la cuenta correctamente.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    } catch {
      sileo.error({
        title: 'Error al cerrar sesión',
        description: 'Vuelve a intentarlo.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    }
  }

  async function handleDelete(id, e) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('¿Eliminar esta tarea?')) return
    setDeletingId(id)
    try {
      await deleteTask(id)
      sileo.success({
        title: 'Tarea eliminada',
        description: 'Se eliminó de tu lista.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    } catch (err) {
      sileo.error({
        title: 'No se pudo eliminar',
        description:
          err?.message || 'Comprueba tu conexión e inténtalo de nuevo.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <h1 className="mt-1 text-xl font-semibold text-app-text">Tareas</h1>
          <p className="text-sm text-app-muted">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/tasks/new"
            className="btn-primary no-underline hover:no-underline"
          >
            Nueva tarea
          </Link>
          <button type="button" className="btn-ghost" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        {loading && (
          <p className="flex items-center justify-center gap-3 py-8 text-app-muted">
            <span
              className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-border border-t-app-accent"
              aria-hidden
            />
            Cargando tareas…
          </p>
        )}

        {error && (
          <p
            className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            role="alert"
          >
            {error.message || 'Error al cargar tareas.'}
          </p>
        )}

        {!loading && tasks.length === 0 && !error && (
          <p className="px-4 py-8 text-center text-app-muted">
            No hay tareas aún.{' '}
            <Link to="/tasks/new" className="text-app-accent hover:underline">
              Crea la primera
            </Link>
            .
          </p>
        )}

        <ul className="flex flex-col gap-3">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-stretch gap-2">
              <Link
                to={`/tasks/${t.id}`}
                className="flex flex-1 flex-col gap-1 rounded-xl border border-app-border bg-app-surface p-4 text-inherit no-underline transition-colors hover:border-app-accent hover:bg-app-card-hover"
              >
                <strong className="text-app-text">{t.title}</strong>
                <span className="text-sm text-app-muted">
                  {formatTaskDate(t.createdAt)}
                </span>
                <p className="line-clamp-2 text-sm text-app-muted">
                  {t.description || <em>Sin descripción</em>}
                </p>
              </Link>
              <button
                type="button"
                className="btn-danger-sm self-center"
                disabled={deletingId === t.id}
                onClick={(e) => handleDelete(t.id, e)}
                aria-label={`Eliminar ${t.title}`}
              >
                {deletingId === t.id ? '…' : 'Eliminar'}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
