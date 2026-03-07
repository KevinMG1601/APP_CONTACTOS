import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  useIonViewWillLeave,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/react';
import { addOutline, trashOutline } from 'ionicons/icons';
import type { Visita, EstadoVisita, MedicamentoReceta } from '../types/visita';

function nuevoMedicamentoId(): string {
  return `med-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface DetalleVisitaPageProps {
  visitas: Visita[];
  onUpdateVisitas: (v: Visita[]) => void;
}

const DetalleVisitaPage: React.FC<DetalleVisitaPageProps> = ({ visitas, onUpdateVisitas }) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const visita = visitas.find((v) => v.id === id);

  const [formMed, setFormMed] = useState({ nombre: '', dosis: '', indicaciones: '' });

  useIonViewWillLeave(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  const receta = visita?.receta ?? [];
  const puedeEditar = visita && visita.estado !== 'finalizada' && visita.estado !== 'cancelada';

  const agregarMedicamento = () => {
    if (!visita) return;
    const nombre = formMed.nombre.trim();
    if (!nombre) return;
    const nuevo: MedicamentoReceta = {
      id: nuevoMedicamentoId(),
      nombre,
      dosis: formMed.dosis.trim(),
      indicaciones: formMed.indicaciones.trim(),
    };
    const nuevaReceta = [...receta, nuevo];
    const nuevasVisitas = visitas.map((v) => (v.id === visita.id ? { ...v, receta: nuevaReceta } : v));
    onUpdateVisitas(nuevasVisitas);
    setFormMed({ nombre: '', dosis: '', indicaciones: '' });
  };

  const quitarMedicamento = (medId: string) => {
    if (!visita) return;
    const nuevaReceta = receta.filter((m) => m.id !== medId);
    const nuevasVisitas = visitas.map((v) => (v.id === visita.id ? { ...v, receta: nuevaReceta } : v));
    onUpdateVisitas(nuevasVisitas);
  };

  const finalizarVisita = () => {
    if (!visita) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const nuevasVisitas = visitas.map((v) =>
      v.id === visita.id ? { ...v, estado: 'finalizada' as EstadoVisita } : v
    );
    onUpdateVisitas(nuevasVisitas);
    history.replace('/visitas');
  };

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>
            <IonTitle>Visita no encontrada</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>No se encontró la visita.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/visitas" />
          </IonButtons>
          <IonTitle>Registrar atención</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <section style={{ marginBottom: '1.5rem' }}>
          <h2>{visita.paciente}</h2>
          <p><strong>Hora:</strong> {visita.hora}</p>
          <p><strong>Estado:</strong> {visita.estado}</p>
          {visita.motivoCancelacion && (
            <p><strong>Motivo cancelación:</strong> {visita.motivoCancelacion}</p>
          )}
        </section>

        <h3>Receta (prescripciones)</h3>
        {receta.length > 0 && (
          <IonList>
            {receta.map((m) => (
              <IonItemSliding key={m.id}>
                <IonItem>
                  <IonLabel>
                    <h2>{m.nombre}</h2>
                    <p>{m.dosis && `Dosis: ${m.dosis}`}</p>
                    <p>{m.indicaciones && `Indicaciones: ${m.indicaciones}`}</p>
                  </IonLabel>
                </IonItem>
                {puedeEditar && (
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => quitarMedicamento(m.id)}>
                      <IonIcon icon={trashOutline} slot="start" />
                      Quitar
                    </IonItemOption>
                  </IonItemOptions>
                )}
              </IonItemSliding>
            ))}
          </IonList>
        )}
        {receta.length === 0 && !puedeEditar && (
          <p style={{ color: 'var(--ion-color-medium)' }}>Sin medicamentos en esta visita.</p>
        )}

        {puedeEditar && (
          <>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--ion-color-light)', borderRadius: 8 }}>
              <IonItem lines="none">
                <IonLabel position="stacked">Medicamento</IonLabel>
                <IonInput
                  value={formMed.nombre}
                  onIonInput={(e) => setFormMed((f) => ({ ...f, nombre: e.detail.value ?? '' }))}
                  placeholder="Nombre del medicamento"
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Dosis</IonLabel>
                <IonInput
                  value={formMed.dosis}
                  onIonInput={(e) => setFormMed((f) => ({ ...f, dosis: e.detail.value ?? '' }))}
                  placeholder="Ej: 1 tableta cada 8 horas"
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Indicaciones</IonLabel>
                <IonInput
                  value={formMed.indicaciones}
                  onIonInput={(e) => setFormMed((f) => ({ ...f, indicaciones: e.detail.value ?? '' }))}
                  placeholder="Instrucciones de uso"
                />
              </IonItem>
              <IonButton expand="block" fill="outline" onClick={agregarMedicamento} disabled={!formMed.nombre.trim()}>
                <IonIcon icon={addOutline} slot="start" />
                Agregar a la receta
              </IonButton>
            </div>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={finalizarVisita}
            >
              Finalizar visita
            </IonButton>
          </>
        )}

        {(visita.estado === 'finalizada' || visita.estado === 'cancelada') && (
          <p style={{ marginTop: '1rem', color: 'var(--ion-color-medium)' }}>
            {visita.estado === 'finalizada' ? 'Visita finalizada.' : 'Visita cancelada.'}
          </p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetalleVisitaPage;
