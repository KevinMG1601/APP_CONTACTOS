# App Contactos 

Aplicacion de contactos con frontend en React + Vite y backend en Node.js + Express + MySQL.

---

## Pasos para iniciar la app

### Requisitos

- **Node.js** (v18 o superior)
- **MySQL** (o MariaDB) instalado y en ejecución

### 1. Base de datos

Crea la base de datos y la tabla de contactos:

```bash
mysql -u root -p 
```

En MySQL:

```sql
CREATE DATABASE contactos;
USE contactos;
CREATE TABLE IF NOT EXISTS contactos (
    ->   id INT AUTO_INCREMENT PRIMARY KEY,
    ->   nombre VARCHAR(255) NOT NULL,
    ->   telefono VARCHAR(50) NOT NULL
    -> );
```

### 2. Variables de entorno

Copia la plantilla y completa con tus credenciales de MySQL. Puedes usar el `.env` en la **raíz del proyecto** o en `backend/`:

```bash
copy .env.example .env

cd backend
copy .env.example .env
```

Edita `.env` y rellena al menos:

- `DB=contactos` (nombre de la base)
- `USER=root` (tu usuario MySQL)
- `PASSWORD=tu_contraseña` (o vacío si no usas contraseña)

### 3. Instalar dependencias

**Backend:**

```bash
cd backend
npm install
```

**Frontend** (en otra terminal, desde la raíz del proyecto):

```bash
cd app-contactos
npm install
```

### 4. Iniciar la aplicación

Necesitas **dos terminales**: una para el backend y otra para el frontend.

**Terminal 1 – Backend (API):**

```bash
cd backend
npm run dev
```

Deberias ver: `Conexión a MySQL correcta` y `Servidor escuchando en http://localhost:3001`.

**Terminal 2 – Frontend** (desde la raíz del proyecto, donde está el `package.json` del frontend):

```bash
npm run dev
```
---

## Estructura de carpetas

```
app-contactos/
├── backend/                 # Servidor API
│   ├── config/
│   │   └── db.js            # Conexion a MySQL
│   ├── routes/
│   │   └── contactos.js     # Rutas GET/POST/DELETE contactos
│   ├── database/
│   │   └── schema.sql       # Script para crear tabla contactos
│   ├── .env.example         # Plantilla de variables de entorno
│   ├── .env                 # Tus credenciales
│   ├── package.json
│   └── server.js            # Entrada del servidor Express
├── src/                     # Frontend React
│   ├── api/
│   │   └── contactos.js     # Cliente para llamar al API
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js           # Incluye proxy /api → backend
├── .env                     # Opcional (frontend)
└── README.md
```
