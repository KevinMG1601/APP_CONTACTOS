import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sileo'
import { AuthProvider } from './context/AuthContext'
import { TasksProvider } from './context/TasksContext'
import AppRouter from './routes/AppRouter'
import 'sileo/styles.css'

export default function App() {
  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <BrowserRouter>
        <AuthProvider>
          <TasksProvider>
            <AppRouter />
          </TasksProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}
