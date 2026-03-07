import { Redirect, Route } from 'react-router-dom';
import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { peopleOutline, calendarOutline, personCircleOutline } from 'ionicons/icons';
import VisitasPage from '../pages/VisitasPage';
import DetalleVisitaPage from '../pages/DetalleVisitaPage';
import MisPacientesPage from '../pages/MisPacientesPage';
import PerfilMedicoPage from '../pages/PerfilMedicoPage';
import type { Visita } from '../types/visita';
import type { Paciente } from '../types/paciente';

interface Usuario {
  email: string;
  nombre: string;
  rol: string;
  avatar: string | null;
}

interface TabsProps {
  usuario: Usuario;
  visitas: Visita[];
  pacientes: Paciente[];
  onUpdateVisitas: (v: Visita[]) => void;
  onUpdatePacientes: (p: Paciente[]) => void;
  pendientesCount: number;
  onUpdateUser: (usuario: Usuario) => void;
  onLogout: () => void;
}

const Tabs: React.FC<TabsProps> = ({ usuario, visitas, pacientes, onUpdateVisitas, onUpdatePacientes, pendientesCount, onUpdateUser, onLogout }) => {
  const handleTabsWillChange = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <IonTabs onIonTabsWillChange={handleTabsWillChange}>
      <IonRouterOutlet>
        <Redirect exact path="/" to="/visitas" />
        <Route exact path="/visitas" render={() => <VisitasPage visitas={visitas} onUpdateVisitas={onUpdateVisitas} />} />
        <Route path="/visitas/:id" render={() => <DetalleVisitaPage visitas={visitas} onUpdateVisitas={onUpdateVisitas} />} />
        <Route exact path="/pacientes" render={() => <MisPacientesPage pacientes={pacientes} onUpdatePacientes={onUpdatePacientes} />} />
        <Route exact path="/perfil">
          <PerfilMedicoPage user={usuario} onUpdateUser={onUpdateUser} onLogout={onLogout} />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/visitas">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Visitas</IonLabel>
          {pendientesCount > 0 && <IonBadge color="primary">{pendientesCount}</IonBadge>}
        </IonTabButton>
        <IonTabButton tab="pacientes" href="/pacientes">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/perfil">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
