import { useState, useEffect } from 'react'
import FormularioPaciente from '../../components/pacientes/FormularioPaciente.jsx'
import TablaPacientes from '../../components/pacientes/TablaPacientes.jsx'

const STORAGE_PACIENTES = 'medicare_pacientes'

/*
  BuscadorPacientes: el texto de búsqueda vive en Dashboard (estado textoBusqueda).
  La lista filtrada se calcula aquí y se pasa como prop a TablaPacientes.
  Justificación: el estado de búsqueda vive en Dashboard y no en TablaPacientes porque
  Dashboard es el dueño del dato (pacientes en localStorage) y del flujo: la búsqueda
  filtra la lista antes de mostrarla. TablaPacientes es un componente presentacional
  que solo muestra lo que recibe; si el filtro estuviera dentro de TablaPacientes,
  tendríamos que pasarle toda la lista y duplicar la lógica de persistencia. Centralizar
  el estado en Dashboard permite una sola fuente de verdad y que la tabla solo reciba
  "pacientes ya filtrados".
*/

function filtrarPacientes(pacientes, texto) {
  if (!texto.trim()) return pacientes
  const t = texto.trim().toLowerCase()
  return pacientes.filter(
    (p) =>
      (p.nombre && p.nombre.toLowerCase().includes(t)) ||
      (p.apellido && p.apellido.toLowerCase().includes(t)) ||
      (p.dni && p.dni.includes(t))
  )
}

export default function Dashboard({ user }) {
  const [pacientes, setPacientes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PACIENTES)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [pacienteAEditar, setPacienteAEditar] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(pacientes))
  }, [pacientes])

  const pacientesFiltrados = filtrarPacientes(pacientes, textoBusqueda)

  const handleGuardarPaciente = (paciente) => {
    if (paciente.id != null) {
      setPacientes((prev) => prev.map((p) => (p.id === paciente.id ? { ...p, ...paciente } : p)))
    } else {
      setPacientes((prev) => [...prev, { ...paciente, id: Date.now() }])
    }
    setPacienteAEditar(null)
  }

  const handleEditar = (paciente) => {
    setPacienteAEditar(paciente)
  }

  const handleEliminar = (id) => {
    setPacientes((prev) => prev.filter((p) => p.id !== id))
    if (pacienteAEditar?.id === id) setPacienteAEditar(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-800">
        Dashboard — Hola, {user?.nombre}
      </h1>

      {user?.rol !== 'recepcionista' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Estadisticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-3xl font-bold text-indigo-600">24</p>
              <p className="text-slate-600 text-sm">Turnos hoy</p>
            </div>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-3xl font-bold text-emerald-600">12</p>
              <p className="text-slate-600 text-sm">Atendidos</p>
            </div>
            <div className="bg-slate-100 rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-600">5</p>
              <p className="text-slate-600 text-sm">En espera</p>
            </div>
          </div>
        </section>
      )}

      {user?.rol !== 'medico' && (
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-medium text-slate-700 mb-4">
            {pacienteAEditar ? 'Editar paciente' : 'Alta de paciente'}
          </h2>
          <FormularioPaciente
            pacienteAEditar={pacienteAEditar}
            onGuardar={handleGuardarPaciente}
          />
        </section>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-700 mb-4">Pacientes</h2>
        <div className="mb-4">
          <input
            type="search"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full max-w-md border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <TablaPacientes
          pacientes={pacientesFiltrados}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-700 mb-4">Resumen de atencion diaria</h2>
        <p className="text-slate-600 text-sm">
          Aquí iria la lista de turnos del dia y el resumen (comun a todos los roles).
        </p>
      </section>
    </div>
  )
}
