import { useState, useEffect } from 'react'

const DNI_REGEX = /^\d{7,8}$/

export default function FormularioPaciente({ pacienteAEditar, onGuardar }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [telefono, setTelefono] = useState('')
  const [errores, setErrores] = useState({})

  useEffect(() => {
    if (pacienteAEditar) {
      setNombre(pacienteAEditar.nombre ?? '')
      setApellido(pacienteAEditar.apellido ?? '')
      setDni(String(pacienteAEditar.dni ?? ''))
      setTelefono(pacienteAEditar.telefono ?? '')
    } else {
      setNombre('')
      setApellido('')
      setDni('')
      setTelefono('')
    }
    setErrores({})
  }, [pacienteAEditar])

  const validar = () => {
    const err = {}
    if (!nombre.trim()) err.nombre = 'El nombre es obligatorio'
    if (!apellido.trim()) err.apellido = 'El apellido es obligatorio'
    if (!dni.trim()) {
      err.dni = 'El DNI es obligatorio'
    } else if (!DNI_REGEX.test(dni.trim())) {
      err.dni = 'El DNI debe tener entre 7 y 8 caracteres numericos'
    }
    setErrores(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validar()) return

    const paciente = {
      ...(pacienteAEditar?.id != null && { id: pacienteAEditar.id }),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
      telefono: telefono.trim()
    }
    onGuardar(paciente)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre*</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className={`w-full border rounded-lg px-3 py-2 ${errores.nombre ? 'border-red-500' : 'border-slate-300'}`}
        />
        {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Apellido*</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Apellido"
          className={`w-full border rounded-lg px-3 py-2 ${errores.apellido ? 'border-red-500' : 'border-slate-300'}`}
        />
        {errores.apellido && <p className="text-red-600 text-sm mt-1">{errores.apellido}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">DNI*</label>
        <input
          type="text"
          inputMode="numeric"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
          placeholder="7 u 8 dígitos"
          maxLength={8}
          className={`w-full border rounded-lg px-3 py-2 ${errores.dni ? 'border-red-500' : 'border-slate-300'}`}
        />
        {errores.dni && <p className="text-red-600 text-sm mt-1">{errores.dni}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Telefono (opcional)</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Telefono"
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
        />
      </div>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
        {pacienteAEditar ? 'Guardar cambios' : 'Dar de alta'}
      </button>
    </form>
  )
}
