import { Link, Outlet } from 'react-router-dom'

function getIniciales(nombre) {
  if (!nombre || !nombre.trim()) return '?'
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorPorNombre(nombre) {
  const colores = [
    'bg-indigo-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-violet-600'
  ]
  let hash = 0
  for (let i = 0; i < (nombre || '').length; i++) hash += nombre.charCodeAt(i)
  return colores[Math.abs(hash) % colores.length]
}

export default function Layout({ usuario, onLogout }) {
  const iniciales = getIniciales(usuario?.nombre)
  const colorCircle = getColorPorNombre(usuario?.nombre)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-semibold text-slate-800">
            Clínica
          </Link>
          <nav className="flex gap-4">
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600">
              Dashboard
            </Link>
            <Link to="/perfil" className="text-slate-600 hover:text-indigo-600">
              Perfil
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* Avatar: si hay imagen la mostramos en círculo; si no, iniciales en círculo de color */}
          {usuario?.avatar ? (
            <img
              src={usuario.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${colorCircle}`}
              title={usuario?.nombre}
            >
              {iniciales}
            </div>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="text-sm text-slate-600 hover:text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
