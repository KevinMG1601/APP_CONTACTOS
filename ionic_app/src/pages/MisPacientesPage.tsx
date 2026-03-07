import { useState } from 'react';
import {
  useIonViewWillLeave,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonButton,
  IonModal,
  IonInput,
  IonIcon,
  IonAlert,
  IonFab,
  IonFabButton,
} from '@ionic/react';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';
import type { Paciente } from '../types/paciente';
import { crearPaciente } from '../types/paciente';

interface MisPacientesPageProps {
  pacientes: Paciente[];
  onUpdatePacientes: (p: Paciente[]) => void;
}

const MisPacientesPage: React.FC<MisPacientesPageProps> = ({ pacientes, onUpdatePacientes }) => {
  useIonViewWillLeave(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [eliminarPaciente, setEliminarPaciente] = useState<Paciente | null>(null);
  const [form, setForm] = useState({ nombre: '', documento: '', telefono: '', email: '' });

  const abrirNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', documento: '', telefono: '', email: '' });
    setModalAbierto(true);
  };

  const abrirEditar = (p: Paciente) => {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      documento: p.documento ?? '',
      telefono: p.telefono ?? '',
      email: p.email ?? '',
    });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
  };

  const guardar = () => {
    const nombre = form.nombre.trim();
    if (!nombre) return;

    if (editando) {
      const nuevas = pacientes.map((x) =>
        x.id === editando.id
          ? { ...x, nombre, documento: form.documento.trim() || undefined, telefono: form.telefono.trim() || undefined, email: form.email.trim() || undefined }
          : x
      );
      onUpdatePacientes(nuevas);
    } else {
      const nuevo = crearPaciente({
        nombre,
        documento: form.documento.trim() || undefined,
        telefono: form.telefono.trim() || undefined,
        email: form.email.trim() || undefined,
      });
      onUpdatePacientes([...pacientes, nuevo]);
    }
    cerrarModal();
  };

  const confirmarEliminar = () => {
    if (!eliminarPaciente) return;
    onUpdatePacientes(pacientes.filter((p) => p.id !== eliminarPaciente.id));
    setEliminarPaciente(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Pacientes</IonTitle>
          <IonButton slot="end" fill="clear" onClick={abrirNuevo}>
            <IonIcon icon={addOutline} slot="start" />
            Nuevo
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {pacientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ion-color-medium)' }}>
            <p>No hay pacientes registrados.</p>
            <IonButton onClick={abrirNuevo}>Agregar primer paciente</IonButton>
          </div>
        ) : (
          <IonList>
            {pacientes.map((p) => (
              <IonItemSliding key={p.id}>
                <IonItem>
                  <IonLabel>
                    <h2>{p.nombre}</h2>
                    <p>
                      {[p.documento, p.telefono, p.email].filter(Boolean).join(' · ') || 'Sin datos adicionales'}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="start">
                  <IonItemOption color="primary" onClick={() => abrirEditar(p)}>
                    <IonIcon icon={createOutline} slot="start" />
                    Editar
                  </IonItemOption>
                </IonItemOptions>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => setEliminarPaciente(p)}>
                    <IonIcon icon={trashOutline} slot="start" />
                    Eliminar
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonModal isOpen={modalAbierto} onDidDismiss={cerrarModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editando ? 'Editar paciente' : 'Nuevo paciente'}</IonTitle>
              <IonButton slot="end" fill="clear" onClick={cerrarModal}>
                Cerrar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Nombre *</IonLabel>
              <IonInput
                value={form.nombre}
                onIonInput={(e) => setForm((f) => ({ ...f, nombre: e.detail.value ?? '' }))}
                placeholder="Nombre completo"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Documento</IonLabel>
              <IonInput
                value={form.documento}
                onIonInput={(e) => setForm((f) => ({ ...f, documento: e.detail.value ?? '' }))}
                placeholder="DNI / Cédula"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Teléfono</IonLabel>
              <IonInput
                type="tel"
                value={form.telefono}
                onIonInput={(e) => setForm((f) => ({ ...f, telefono: e.detail.value ?? '' }))}
                placeholder="Teléfono"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={form.email}
                onIonInput={(e) => setForm((f) => ({ ...f, email: e.detail.value ?? '' }))}
                placeholder="Correo electrónico"
              />
            </IonItem>
            <div className="ion-padding">
              <IonButton expand="block" onClick={guardar} disabled={!form.nombre.trim()}>
                {editando ? 'Guardar cambios' : 'Crear paciente'}
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={!!eliminarPaciente}
          onDidDismiss={() => setEliminarPaciente(null)}
          header="Eliminar paciente"
          message={eliminarPaciente ? `¿Eliminar a ${eliminarPaciente.nombre}?` : ''}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Eliminar', role: 'destructive', handler: confirmarEliminar },
          ]}
        />

        {pacientes.length > 0 && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={abrirNuevo}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;
