# Challenge 5

Aplicación de tareas con autenticación por correo/contraseña y datos en Firestore.

## Herramientas

- Node.js 18+
- Firebase con **Authentication** (Email/Password) y **Firestore** habilitados
- Tailwind
- Sileo
- React

## Scripts

| Comando    | Descripción        |
| ---------- | ------------------ |
| `npm run dev`     | Servidor de desarrollo |
| `npm run build`   | Build de producción    |
| `npm run preview` | Vista previa del build |
| `npm run deploy`  | Build + subida a **Firebase Hosting** |

## Aplicación en producción

- **URL (Firebase Hosting):** [https://challegue5.web.app/](https://challegue5.web.app/)

### Cuenta de prueba

| Campo        | Valor                         |
| ------------ | ----------------------------- |
| Correo       | `kevin.andres2636@gmail.com`  |
| Contraseña   | `123456`                      |

## Estructura principal

- `src/context/` — `AuthContext`, `TasksContext`
- `src/hooks/` — `useAuth`, `useTasks`, `useProtectedRoute`
- `src/pages/` — pantallas y formularios
- `src/routes/AppRouter.jsx` — rutas y rutas protegidas
- `src/firebase/config.js` — inicialización de Firebase


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