# MediCare+ Visitas - Ionic App

![logo](/pwa_app/src/assets/logo.png)

Aplicacion movil para medicos que gestionan visitas del dia, registran la atencion, prescriben medicamentos y finalizan visitas. Desarrollada con **Ionic React**, **TypeScript** y **Vite**.

## Caracteristicas

### Autenticacion
- Login con credenciales mockeadas
- Mostrar/ocultar contrasena
- Persistencia de sesion en `localStorage`
- IonToast para errores y IonLoading durante la verificacion

### Visitas del dia
- **Lista de visitas** con filtro por estado: Todas, Pendientes, En curso, Finalizadas
- **IonItemSliding** por visita:
  - Deslizar izquierda: "En camino" (cambia estado) o "Cancelar" (con motivo en IonAlert)
  - Deslizar derecha: "Ver detalle"
- **Reordenar** visitas pendientes con IonReorderGroup (arrastrar)
- **Badge** en la tab Visitas con cantidad de pendientes

### Registrar atencion
- Seleccionar una visita y ver su detalle
- **Carrito de prescripciones**: agregar medicamentos (nombre, dosis, indicaciones)
- Quitar medicamentos de la receta
- **Finalizar visita** → marca como finalizada y guarda la receta

### Pacientes
- Crear, editar y eliminar pacientes
- Campos: nombre, documento, telefono, email
- Modal para crear/editar, IonAlert para confirmar eliminacion

### Perfil
- Avatar con IonAvatar (foto o iniciales con color)
- Cambiar foto de perfil
- Cerrar sesion

## Tecnologias

- **Ionic 8** + React
- **TypeScript**
- **Vite**
- **React Router 5**
- **Capacitor** (listo para compilar a iOS/Android)
- **localStorage** para persistencia

## Requisitos

- Node.js 18+
- npm o pnpm

## Instalacion
1. clonar el repositorio.
```
git clone "https://github.com/KevinMG1601/APP_CONTACTOS/tree/parcial-01"
```
2. verificar la rama **parcial-01**.
```
git branch 
```
3. Acceder a la carpeta **ionic_app**.
```
cd ionic_app
```
4. instalar dependencias.
```
npm install
```

## Scripts

| Comando      | Descripcion                    |
|--------------|--------------------------------|
| `npm run dev`    | Servidor de desarrollo        |
| `npm run build`  | Build de produccion |

## Credenciales de Prueba
- **Medico**
  - medico@clinica.com
  - 123456

## Imagenes de la APP
### LOGIN
![Login page](/ionic_app/src/assets/login.png)

### VISITAS PAGE
![visitas page](/ionic_app/src/assets/tab1.png)

### DETALLE VISITA PAGE 
![descrpcion](/ionic_app/src/assets/tab1.1.png)

### PACIENTES PAGE
![pacientes](/ionic_app/src/assets/tab2.png)

### PERFIL
![perfil page](/ionic_app/src/assets/tab3.png)

## Estructura del proyecto

```
ionic_app/
├── public/              # Assets estaticos
├── src/
│   ├── components/      # Tabs, etc.
│   ├── pages/           # LoginPage, VisitasPage, DetalleVisitaPage, MisPacientesPage, PerfilMedicoPage
│   ├── types/           # visita.ts, paciente.ts
│   ├── theme/           # variables.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── package.json
```

## Persistencia

Los datos se guardan en `localStorage` bajo las claves:

- `usuario` — sesion del usuario
- `medicare_visitas` — visitas y recetas
- `medicare_pacientes` — pacientes

## **AUTHOR**
<table style="border-collapse: collapse; border: none;">
  <tr>
    <td align="center" width="150" style="border: none;">
      <a href="https://github.com/KevinMG1601">
        <img src="https://avatars.githubusercontent.com/u/143461336?v=4" width="100px" alt="Kevin Munoz"/><br />
        <span style="color: black; font-weight: bold;">Kevin Munoz</span>
      </a>
    </td>
    <td style="border: none; vertical-align: top;">
      Created by <b>Kevin Munoz</b>. I would like to know your opinion about this project. You can write me by <a href="mailto:kevin.andres2636@gmail.com">email</a> or connect with me on <a href="https://www.linkedin.com/in/kevin-mu%C3%B1oz-231b80303/">LinkedIn</a>.
    </td>
  </tr>
</table>
