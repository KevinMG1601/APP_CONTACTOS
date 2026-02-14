import express from 'express';
import cors from 'cors';
import contactosRoutes from './routes/contactos.js';
import { query } from './config/db.js';

const app = express();
const PORT = "3001";

app.use(cors());
app.use(express.json());

app.use('/api/contactos', contactosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API de contactos funcionando' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

async function start() {
  try {
    await query('SELECT 1');
    console.log('Conexion a MySQL correcta');
  } catch (err) {
    console.error('No se pudo conectar a MySQL:', err.message);
    console.error('Revisa HOST, DB, USER, PASSWORD y que la base de datos exista');
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
