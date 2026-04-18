import React from 'react';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MissionsProvider } from './context/MissionsContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Ranking from './pages/Ranking';
import Register from './pages/Register';
import Results from './pages/Results';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const Private: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Redirect to="/login" />;
  return children;
};

const RoutesShell: React.FC = () => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route
          exact
          path="/home"
          render={() => (
            <Private>
              <Home />
            </Private>
          )}
        />
        <Route
          exact
          path="/results"
          render={() => (
            <Private>
              <Results />
            </Private>
          )}
        />
        <Route
          exact
          path="/ranking"
          render={() => (
            <Private>
              <Ranking />
            </Private>
          )}
        />
        <Route exact path="/" render={() => <Redirect to={user ? '/home' : '/login'} />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <MissionsProvider>
        <RoutesShell />
      </MissionsProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
