# MediCare+ Admin — PWA Clínica

![logo](/pwa_app/src/assets/logo.png)

Progressive Web App (PWA) en React para el personal administrativo de la clinica. Permite gestionar pacientes, asignar turnos y armar resumenes de atencion diaria.

## Herramientas
- **React 19** + **Vite 7**
- **React Router** (rutas protegidas)
- **Tailwind CSS v4** (estilos)
- **vite-plugin-pwa** (Service Worker, PWA)

## Instalacion
1. clonar el repositorio.
```
git clone "https://github.com/KevinMG1601/APP_CONTACTOS/tree/parcial-01"
```
2. verificar la rama **parcial-01**.
```
git branch 
```
3. instalar dependencias.
```
npm install
```

## Scripts

| Comando      | Descripción                    |
|--------------|--------------------------------|
| `npm run dev`    | Servidor de desarrollo        |
| `npm run build`  | Build de produccion y PWA     |
| `npm run preview`| Preview del build (probar PWA)|

## Credenciales de Prueba
- **Medico**
  - medico@clinica.com
  - 123456
- **Recepcionista**
  - recepcion@clinica.com
  - 123456

## Imagenes de la APP
### LOGIN
![Login page](/pwa_app/src/assets/img/login.png)

### MEDICO PAGE
![medico page](/pwa_app/src/assets/img/doctor_dashboard.png)

### RECEPCIONISTA PAGE 
![recepcionista page](/pwa_app/src/assets/img/recepcionista_dashboard.png)

### PERFIL COMPONENT
![perfil page](/pwa_app/src/assets/img/perfil_component.png)





## Estructura principal

```
src/
├── App.jsx              # Rutas, sesion (localStorage), layout
├── main.jsx             # Punto de entrada, registro del SW
├── components/
│   ├── Layout.jsx       # Header (avatar/iniciales, logout)
│   └── pacientes/
│       ├── FormularioPaciente.jsx   # Alta y edicion
│       └── TablaPacientes.jsx       # Listado, editar, eliminar
└── pages/
    ├── login/login.jsx      # Login con validacion local
    ├── dashboard/Dashboard.jsx  # Panel segun rol
    └── perfil/PerfilUsuario.jsx # Avatar, datos del usuario
```

## PWA

El **Cachefirst** es util para la app porque guarda las imagenes y archivos y eso sirve para que la aplicacion carge rapido pero es bueno solo para elementos o datos que no cambien constantemente, esto no nos serviria para base de datos que tiene la informacion de citas diarias, registro de citas y demas cosas,
Para datos con cambios contastes hay dos opciones:
1. **NetworkFirst:** es bueno porque siempre va a tener los datos actualizados desde la red, pero podria ser lento la carga de esos datos.
2. **Stale while revalidate:** esta seria una muy buena opcion porque lo que hace es cargar los datos que tiene en cache y en segundo plano va trayendo los datos actualizados de la red, asi mejoramos la velocidad de la app y mantenemos los datos actualizados.

## **AUTHOR**
<table style="border-collapse: collapse; border: none;">
  <tr>
    <td align="center" width="150" style="border: none;">
      <a href="https://github.com/KevinMG1601">
        <img src="https://avatars.githubusercontent.com/u/143461336?v=4" width="100px" alt="Kevin Muñoz"/><br />
        <span style="color: black; font-weight: bold;">Kevin Muñoz</span>
      </a>
    </td>
    <td style="border: none; vertical-align: top;">
      Created by <b>Kevin Muñoz</b>. I would like to know your opinion about this project. You can write me by <a href="mailto:kevin.andres2636@gmail.com">email</a> or connect with me on <a href="https://www.linkedin.com/in/kevin-mu%C3%B1oz-231b80303/">LinkedIn</a>.
    </td>
  </tr>
</table>