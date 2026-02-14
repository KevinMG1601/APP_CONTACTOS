import { Router } from 'express';
import { query } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const contactos = await query(
      'SELECT id, nombre, telefono FROM contactos ORDER BY nombre ASC'
    );
    res.json(contactos);
  } catch (err) {
    console.error('Error al listar contactos:', err.message);
    res.status(500).json({
      error: 'Error al obtener los contactos',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    if (!nombre || !telefono) {
      return res.status(400).json({
        error: 'Faltan campos requeridos',
        requeridos: ['nombre', 'telefono'],
      });
    }
    const result = await query(
      'INSERT INTO contactos (nombre, telefono) VALUES (?, ?)',
      [String(nombre).trim(), String(telefono).trim()]
    );
    res.status(201).json({
      id: result.insertId,
      nombre: String(nombre).trim(),
      telefono: String(telefono).trim(),
    });
  } catch (err) {
    console.error('Error al crear contacto:', err.message);
    res.status(500).json({
      error: 'Error al crear el contacto',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
      return res.status(400).json({ error: 'ID invalido' });
    }
    const result = await query('DELETE FROM contactos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar contacto:', err.message);
    res.status(500).json({
      error: 'Error al eliminar el contacto',
      detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

export default router;
