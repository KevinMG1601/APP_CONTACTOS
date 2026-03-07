import { useState } from 'react'

export default function TablaPacientes({ pacientes, onEditar, onEliminar }) {
  const [modalEliminar, setModalEliminar] = useState(null)

  const handleConfirmarEliminar = () => {
    if (modalEliminar) {
      onEliminar(modalEliminar.id)
      setModalEliminar(null)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 text-slate-700 font-medium">Nombre completo</th>
              <th className="text-left px-4 py-3 text-slate-700 font-medium">DNI</th>
              <th className="text-left px-4 py-3 text-slate-700 font-medium">Teléfono</th>
              <th className="text-left px-4 py-3 text-slate-700 font-medium w-32">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No hay pacientes para mostrar.
                </td>
              </tr>
            ) : (
              pacientes.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-800">
                    {[p.nombre, p.apellido].filter(Boolean).join(' ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.dni || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{p.telefono || '—'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEditar(p)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalEliminar({ id: p.id, nombreCompleto: [p.nombre, p.apellido].filter(Boolean).join(' ') || 'este paciente' })}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Confirmar eliminacion</h3>
            <p className="text-slate-600 text-sm mb-4">
              ¿Eliminar a <strong>{modalEliminar.nombreCompleto}</strong>? Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setModalEliminar(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarEliminar}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
