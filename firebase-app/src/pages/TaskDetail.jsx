import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { sileo } from 'sileo'
import { useTasks } from '../hooks/useTasks'
import { formatTaskDate } from '../utils/formatDate'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, deleteTask } = useTasks()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getTask(id)
      .then((t) => {
        if (cancelled) return
        if (!t) {
          navigate('/tasks', { replace: true })
          return
        }
        setTask(t)
      })
      .catch((e) => {
        const msg = e.message || 'Error al cargar.'
        setError(msg)
        sileo.error({
          title: 'No se pudo cargar la tarea',
          description: msg,
          fill: 'black',
          styles: {
            description: '!text-white',
          },
          duration: 4200,
        })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, getTask, navigate])

  async function handleDelete() {
    if (!window.confirm('¿Eliminar esta tarea de forma permanente?')) return
    setDeleting(true)
    try {
      await deleteTask(id)
      sileo.success({
        title: 'Tarea eliminada',
        description: 'Se eliminó correctamente.',
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
      navigate('/tasks', { replace: true })
    } catch (e) {
      const msg = e.message || 'No se pudo eliminar.'
      setError(msg)
      sileo.error({
        title: 'No se pudo eliminar',
        description: msg,
        fill: 'black',
        styles: {
          description: '!text-white',
        },
        duration: 4200,
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
        <div className="flex items-center justify-center gap-3 py-8 text-app-muted">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-border border-t-app-accent"
            aria-hidden
          />
          Cargando…
        </div>
      </div>
    )
  }

  if (error && !task) {
    return (
      <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
        <main className="py-8 text-app-muted">
          <p className="mb-4 text-sm">
            Revisa la notificación o vuelve al listado.
          </p>
          <Link to="/tasks" className="text-app-accent hover:underline">
            Volver al listado
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <Link
            to="/tasks"
            className="mb-2 inline-block text-sm text-app-muted no-underline hover:text-app-accent hover:underline"
          >
            ← Tareas
          </Link>
          <h1 className="text-xl font-semibold text-app-text">{task?.title}</h1>
          <p className="text-sm text-app-muted">
            Creada: {formatTaskDate(task?.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/tasks/${id}/edit`}
            className="btn-primary no-underline hover:no-underline"
          >
            Editar
          </Link>
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </header>

      <main>
        {error && (
          <p className="mb-4 rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        <article className="rounded-xl border border-app-border bg-app-surface p-5">
          <h2 className="sr-only">Descripción</h2>
          <p className="whitespace-pre-wrap break-words text-app-text">
            {task?.description?.trim()
              ? task.description
              : 'Sin descripción.'}
          </p>
        </article>
      </main>
    </div>
  )
}
