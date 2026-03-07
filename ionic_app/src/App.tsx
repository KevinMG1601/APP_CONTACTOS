import { useState, useMemo } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LoginPage from './pages/LoginPage';
import Tabs from './components/Tabs';
import type { Visita } from './types/visita';
import { cargarVisitas, guardarVisitas } from './types/visita';
import type { Paciente } from './types/paciente';
import { cargarPacientes, guardarPacientes } from './types/paciente';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { setupIonicReact } from '@ionic/react';

setupIonicReact();

const STORAGE_KEY = 'usuario';

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
  avatar: string | null;
}

interface AppRoutesProps {
  usuario: Usuario | null;
  visitas: Visita[];
  pacientes: Paciente[];
  onUpdateVisitas: (v: Visita[]) => void;
  onUpdatePacientes: (p: Paciente[]) => void;
  onLogin: (u: Usuario) => void;
  onLogout: () => void;
  onUpdateUser: (u: Usuario) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ usuario, visitas, pacientes, onUpdateVisitas, onUpdatePacientes, onLogin, onLogout, onUpdateUser }) => {
  const pendientesCount = useMemo(() => visitas.filter((v) => v.estado === 'pendiente').length, [visitas]);

  return (
    <IonRouterOutlet>
      <Route exact path="/login">
        {usuario ? <Redirect to="/visitas" /> : <LoginPage onLogin={onLogin} />}
      </Route>
      <Route path="/visitas">
        {!usuario ? <Redirect to="/login" /> : <Tabs usuario={usuario} visitas={visitas} pacientes={pacientes} onUpdateVisitas={onUpdateVisitas} onUpdatePacientes={onUpdatePacientes} pendientesCount={pendientesCount} onUpdateUser={onUpdateUser} onLogout={onLogout} />}
      </Route>
      <Route path="/pacientes">
        {!usuario ? <Redirect to="/login" /> : <Tabs usuario={usuario} visitas={visitas} pacientes={pacientes} onUpdateVisitas={onUpdateVisitas} onUpdatePacientes={onUpdatePacientes} pendientesCount={pendientesCount} onUpdateUser={onUpdateUser} onLogout={onLogout} />}
      </Route>
      <Route path="/perfil">
        {!usuario ? <Redirect to="/login" /> : <Tabs usuario={usuario} visitas={visitas} pacientes={pacientes} onUpdateVisitas={onUpdateVisitas} onUpdatePacientes={onUpdatePacientes} pendientesCount={pendientesCount} onUpdateUser={onUpdateUser} onLogout={onLogout} />}
      </Route>
      <Route exact path="/">
        <Redirect to={usuario ? '/visitas' : '/login'} />
      </Route>
    </IonRouterOutlet>
  );
};

const App: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const [visitas, setVisitas] = useState<Visita[]>(cargarVisitas);
  const [pacientes, setPacientes] = useState<Paciente[]>(cargarPacientes);

  const handleUpdateVisitas = (nuevas: Visita[]) => {
    setVisitas(nuevas);
    guardarVisitas(nuevas);
  };

  const handleUpdatePacientes = (nuevos: Paciente[]) => {
    setPacientes(nuevos);
    guardarPacientes(nuevos);
  };

  const handleLogin = (u: Usuario) => {
    setUsuario(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    // Recarga para que IonRouterOutlet actualice la vista (bug conocido de Ionic)
    window.location.replace('/visitas');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
    // Recarga para que IonRouterOutlet actualice la vista (bug conocido de Ionic)
    window.location.replace('/login');
  };

  const handleUpdateUser = (nuevoUsuario: Usuario) => {
    setUsuario(nuevoUsuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoUsuario));
  };

  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes
          usuario={usuario}
          visitas={visitas}
          pacientes={pacientes}
          onUpdateVisitas={handleUpdateVisitas}
          onUpdatePacientes={handleUpdatePacientes}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
