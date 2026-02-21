import { useState, useEffect, useCallback } from 'react'
import { getContactos, crearContacto, eliminarContacto } from './api/contactos'
import './App.css'
import logo from './assets/logo.png'

function App() {
  const [contactos, setContactos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const cargarContactos = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await getContactos()
      setContactos(data)
    } catch (err) {
      setError(err.message || 'Error al cargar contactos')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarContactos()
  }, [cargarContactos])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const n = nombre.trim()
    const t = telefono.trim()
    if (!n || !t) return
    setError(null)
    try {
      await crearContacto(n, t)
      setNombre('')
      setTelefono('')
      setMostrarForm(false)
      await cargarContactos()
    } catch (err) {
      setError(err.message || 'Error al agregar contacto')
    }
  }

  const abrirConfirmarEliminar = (id, nombre) => setConfirmarEliminar({ id, nombre })

  const cerrarConfirmarEliminar = () => setConfirmarEliminar(null)

  const handleConfirmarEliminar = async () => {
    if (!confirmarEliminar) return
    const { id } = confirmarEliminar
    setError(null)
    cerrarConfirmarEliminar()
    try {
      await eliminarContacto(id)
      await cargarContactos()
    } catch (err) {
      setError(err.message || 'Error al eliminar')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <img className="logo" src={logo} alt="Logo" width="100" /> 
        <button
          type="button"
          className="btn-add"
          onClick={() => setMostrarForm(!mostrarForm)}
          aria-label={mostrarForm ? 'Cerrar formulario' : 'Agregar contacto'}
        >
          {mostrarForm ? 'x' : '+'}
        </button>
      </header>

      {error && (
        <div className="mensaje-error" role="alert">
          {error}
        </div>
      )}
      <h1 className='title'>LISTA DE CONTACTOS</h1>

      <div className="buscador">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="input-busqueda"
          aria-label="Buscar contactos"
        />
      </div>

      {mostrarForm && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="grupo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              autoComplete="name"
              required
            />
          </div>
          <div className="grupo">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Teléfono"
              autoComplete="tel"
              required
            />
          </div>
          <button type="submit" className="btn-guardar">Guardar</button>
        </form>
      )}

      <section className="lista" aria-busy={cargando}>
        {cargando ? (
          <p className="cargando">Cargando contactos…</p>
        ) : contactos.length === 0 ? (
          <p className="sin-contactos">No hay contactos.</p>
        ) : (() => {
          const texto = busqueda.trim().toLowerCase()
          const filtrados = texto
            ? contactos.filter(
                (c) =>
                  c.nombre.toLowerCase().includes(texto) ||
                  (c.telefono && c.telefono.includes(busqueda.trim()))
              )
            : contactos
          return filtrados.length === 0 ? (
            <p className="sin-contactos">Ningun contacto encontrado</p>
          ) : (
          <ul className="lista-contactos">
            {filtrados.map((c) => (
              <li key={c.id} className="item-contacto">
                <div className="info-contacto">
                  <span className="nombre-contacto">{c.nombre}</span>
                  <span className="telefono-contacto">{c.telefono}</span>
                </div>
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => abrirConfirmarEliminar(c.id, c.nombre)}
                  aria-label={`Eliminar ${c.nombre}`}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          );
        })()}
      </section>

      {confirmarEliminar && (
        <div className="modal-overlay" onClick={cerrarConfirmarEliminar} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 id="modal-titulo" className="modal-titulo">Eliminar contacto</h2>
            <p className="modal-texto">
              ¿Quieres eliminar a <strong>{confirmarEliminar.nombre}</strong>?
            </p>
            <div className="modal-acciones">
              <button type="button" className="modal-btn modal-btn-cancelar" onClick={cerrarConfirmarEliminar}>
                Cancelar
              </button>
              <button type="button" className="modal-btn modal-btn-eliminar" onClick={handleConfirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
