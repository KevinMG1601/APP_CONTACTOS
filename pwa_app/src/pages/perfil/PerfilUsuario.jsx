import { useState, useRef } from 'react'

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

export default function PerfilUsuario({ user, onUpdateUser }) {
  const [preview, setPreview] = useState(user?.avatar || null)
  const inputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setPreview(dataUrl)
      const usuarioActualizado = { ...user, avatar: dataUrl }
      onUpdateUser(usuarioActualizado)
    }
    reader.readAsDataURL(file)
  }

  const iniciales = getIniciales(user?.nombre)
  const colorCircle = getColorPorNombre(user?.nombre)

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Mi perfil</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-slate-600">Avatar</p>
          {preview ? (
            <img
              src={preview}
              alt="Vista previa"
              className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
            />
          ) : (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold text-2xl ${colorCircle}`}
            >
              {iniciales}
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Cambiar foto
          </button>
        </div>

        <div>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Nombre:</span> {user?.nombre}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Email:</span> {user?.email}
          </p>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Rol:</span> {user?.rol}
          </p>
        </div>
      </div>
    </div>
  )
}
