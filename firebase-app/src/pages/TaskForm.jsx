import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { sileo } from 'sileo'
import { useTasks } from '../hooks/useTasks'


export default function TaskForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { createTask, updateTask, getTask, loading: ctxLoading, error } =
    useTasks()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loadingTask, setLoadingTask] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setLoadingTask(true)
    getTask(id)
      .then((task) => {
        if (cancelled || !task) {
          if (!cancelled && !task) navigate('/tasks', { replace: true })
          return
        }
        setTitle(task.title ?? '')
        setDescription(task.description ?? '')
      })
      .catch((e) => {
        sileo.error({
          title: 'No se pudo cargar la tarea',
          description:
            e.message || 'Vuelve al listado e inténtalo de nuevo.',
          fill: 'black',
          styles: {
            description: '!text-white',
          },
          duration: 4200,
        })
      })
      .finally(() => {
        if (!cancelled) setLoadingTask(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, isEdit, getTask, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateTask(id, { title, description })
        sileo.success({
          title: 'Cambios guardados',
          description: 'La tarea se actualizó correctamente.',
          fill: 'black',
          styles: {
            description: '!text-white',
          },
          duration: 4200,
        })
        navigate(`/tasks/${id}`, { replace: true })
      } else {
        const newId = await createTask({ title, description })
        sileo.success({
          title: 'Tarea creada',
          description: 'Ya está en tu lista.',
          fill: 'black',
          styles: {
            description: '!text-white',
          },
          duration: 4200,
        })
        navigate(`/tasks/${newId}`, { replace: true })
      }
    } catch (e) {
      sileo.error({
        title: isEdit ? 'No se pudo guardar' : 'No se pudo crear la tarea',
        description: e.message || 'Revisa los datos e inténtalo de nuevo.',
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

  const ctxErr = error?.message || (error ? String(error) : null)

  if (isEdit && loadingTask) {
    return (
      <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
        <div className="flex items-center justify-center gap-3 py-8 text-app-muted">
          <span
            className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-border border-t-app-accent"
            aria-hidden
          />
          Cargando tarea…
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-[900px] px-4 pb-8 pt-5">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-app-border pb-4">
        <div>
          <Link
            to={isEdit ? `/tasks/${id}` : '/tasks'}
            className="mb-2 inline-block text-sm text-app-muted no-underline hover:text-app-accent hover:underline"
          >
            ← Volver
          </Link>
          <h1 className="text-xl font-semibold text-app-text">
            {isEdit ? 'Editar tarea' : 'Nueva tarea'}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-[560px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-app-muted">Título</span>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              disabled={submitting || ctxLoading}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-app-muted">Descripción</span>
            <textarea
              className="textarea-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              maxLength={5000}
              disabled={submitting || ctxLoading}
            />
          </label>

          {ctxErr && (
            <p
              className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {ctxErr}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || ctxLoading}
            >
              {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear'}
            </button>
            <Link
              to={isEdit ? `/tasks/${id}` : '/tasks'}
              className="btn-ghost no-underline hover:no-underline"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
