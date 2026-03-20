import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthContext } from './AuthContext'

const TASKS_COLLECTION = 'tasks'

const TasksContext = createContext(null)

/** Ordena por fecha de creación (más recientes primero). */
function sortByCreatedAtDesc(tasks) {
  return [...tasks].sort((a, b) => {
    const ta = a.createdAt?.seconds ?? a.createdAt?._seconds ?? 0
    const tb = b.createdAt?.seconds ?? b.createdAt?._seconds ?? 0
    return tb - ta
  })
}

export function TasksProvider({ children }) {
  const { user } = useAuthContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = useCallback(() => setError(null), [])

  const getTasks = useCallback(async () => {
    if (!user) {
      setTasks([])
      return []
    }
    setLoading(true)
    setError(null)
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', user.uid)
      )
      const snap = await getDocs(q)
      const list = snap.docs.map((d) => {
        const data = d.data()
        return { id: d.id, ...data }
      })
      const sorted = sortByCreatedAtDesc(list)
      setTasks(sorted)
      return sorted
    } catch (e) {
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      setTasks([])
      return
    }
    getTasks().catch(() => {})
  }, [user, getTasks])

  const createTask = useCallback(
    async ({ title, description }) => {
      if (!user) throw new Error('No autenticado')
      setError(null)
      try {
        const ref = await addDoc(collection(db, TASKS_COLLECTION), {
          title: title.trim(),
          description: (description ?? '').trim(),
          userId: user.uid,
          createdAt: serverTimestamp(),
        })
        await getTasks()
        return ref.id
      } catch (e) {
        setError(e)
        throw e
      }
    },
    [user, getTasks]
  )

  const updateTask = useCallback(
    async (id, { title, description }) => {
      if (!user) throw new Error('No autenticado')
      setError(null)
      try {
        const ref = doc(db, TASKS_COLLECTION, id)
        const snap = await getDoc(ref)
        if (!snap.exists()) throw new Error('Tarea no encontrada')
        const data = snap.data()
        if (data.userId !== user.uid) throw new Error('No autorizado')
        await updateDoc(ref, {
          title: title.trim(),
          description: (description ?? '').trim(),
        })
        await getTasks()
      } catch (e) {
        setError(e)
        throw e
      }
    },
    [user, getTasks]
  )

  const deleteTask = useCallback(
    async (id) => {
      if (!user) throw new Error('No autenticado')
      setError(null)
      try {
        const ref = doc(db, TASKS_COLLECTION, id)
        const snap = await getDoc(ref)
        if (!snap.exists()) throw new Error('Tarea no encontrada')
        if (snap.data().userId !== user.uid) throw new Error('No autorizado')
        await deleteDoc(ref)
        await getTasks()
      } catch (e) {
        setError(e)
        throw e
      }
    },
    [user, getTasks]
  )

  const getTask = useCallback(
    async (id) => {
      if (!user) return null
      setError(null)
      try {
        const ref = doc(db, TASKS_COLLECTION, id)
        const snap = await getDoc(ref)
        if (!snap.exists()) return null
        const data = snap.data()
        if (data.userId !== user.uid) return null
        return { id: snap.id, ...data }
      } catch (e) {
        setError(e)
        throw e
      }
    },
    [user]
  )

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      clearError,
      getTasks,
      createTask,
      updateTask,
      deleteTask,
      getTask,
    }),
    [
      tasks,
      loading,
      error,
      clearError,
      getTasks,
      createTask,
      updateTask,
      deleteTask,
      getTask,
    ]
  )

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  )
}

export function useTasksContext() {
  const ctx = useContext(TasksContext)
  if (!ctx) {
    throw new Error('useTasksContext debe usarse dentro de TasksProvider')
  }
  return ctx
}
