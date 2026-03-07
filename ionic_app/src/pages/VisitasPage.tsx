import { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  useIonViewWillLeave,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonReorderGroup,
  IonReorder,
  IonAlert,
} from '@ionic/react';
import type { Visita, EstadoVisita } from '../types/visita';

type SegmentValue = 'todas' | 'pendientes' | 'en_curso' | 'finalizadas';

interface VisitasPageProps {
  visitas: Visita[];
  onUpdateVisitas: (v: Visita[]) => void;
}

const VisitasPage: React.FC<VisitasPageProps> = ({ visitas, onUpdateVisitas }) => {
  const history = useHistory();
  const [segment, setSegment] = useState<SegmentValue>('todas');
  const [cancelarVisita, setCancelarVisita] = useState<Visita | null>(null);

  useIonViewWillLeave(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });

  const { pendientes, enCamino, finalizadas } = useMemo(() => {
    const p: Visita[] = [];
    const e: Visita[] = [];
    const f: Visita[] = [];
    visitas.forEach((v) => {
      if (v.estado === 'pendiente') p.push(v);
      else if (v.estado === 'en_camino') e.push(v);
      else f.push(v);
    });
    return { pendientes: p, enCamino: e, finalizadas: f };
  }, [visitas]);

  const listadoFiltrado = useMemo(() => {
    if (segment === 'pendientes') return pendientes;
    if (segment === 'en_curso') return enCamino;
    if (segment === 'finalizadas') return finalizadas;
    return [...pendientes, ...enCamino, ...finalizadas];
  }, [segment, pendientes, enCamino, finalizadas]);

  const hayReorderables = segment === 'todas' || segment === 'pendientes';
  const listadoOrdenado = useMemo(() => {
    if (segment === 'todas') return [...pendientes, ...enCamino, ...finalizadas];
    return listadoFiltrado;
  }, [segment, pendientes, enCamino, finalizadas, listadoFiltrado]);

  const handleEnCamino = (v: Visita) => {
    const nuevas = visitas.map((x) => (x.id === v.id ? { ...x, estado: 'en_camino' as EstadoVisita } : x));
    onUpdateVisitas(nuevas);
  };

  const handleReorder = (event: CustomEvent) => {
    const list = [...listadoOrdenado];
    const reordered = event.detail.complete(list) as Visita[];
    if (segment === 'pendientes') {
      onUpdateVisitas([...reordered, ...enCamino, ...finalizadas]);
    } else {
      onUpdateVisitas(reordered);
    }
  };

  const handleVerDetalle = (id: string) => {
    history.push(`/visitas/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del día</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={segment} onIonChange={(e) => setSegment((e.detail.value as SegmentValue) || 'todas')}>
            <IonSegmentButton value="todas">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pendientes">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="en_curso">
              <IonLabel>En curso</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finalizadas">
              <IonLabel>Finalizadas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonReorderGroup disabled={!hayReorderables} onIonItemReorder={handleReorder}>
            {listadoOrdenado.map((v) => (
              <IonItemSliding key={v.id}>
                <IonItem>
                  {hayReorderables && v.estado === 'pendiente' && <IonReorder slot="start" />}
                  <IonLabel>
                    <h2>{v.paciente}</h2>
                    <p>{v.hora} · {v.estado}</p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="start">
                  {v.estado === 'pendiente' && (
                    <>
                      <IonItemOption color="primary" onClick={() => handleEnCamino(v)}>
                        En camino
                      </IonItemOption>
                      <IonItemOption color="danger" onClick={() => setCancelarVisita(v)}>
                        Cancelar
                      </IonItemOption>
                    </>
                  )}
                </IonItemOptions>
                <IonItemOptions side="end">
                  <IonItemOption color="secondary" onClick={() => handleVerDetalle(v.id)}>
                    Ver detalle
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonReorderGroup>
        </IonList>

        <IonAlert
          isOpen={!!cancelarVisita}
          onDidDismiss={() => setCancelarVisita(null)}
          header="Cancelar visita"
          message="Indique el motivo de la cancelación."
          inputs={[
            { name: 'motivo', type: 'textarea', placeholder: 'Motivo' },
          ]}
          buttons={[
            { text: 'Volver', role: 'cancel' },
            {
              text: 'Confirmar',
              handler: (data) => {
                if (cancelarVisita) {
                  const motivo = (data && data.motivo) || '';
                  const nuevas = visitas.map((x) =>
                    x.id === cancelarVisita.id
                      ? { ...x, estado: 'cancelada' as EstadoVisita, motivoCancelacion: motivo }
                      : x
                  );
                  onUpdateVisitas(nuevas);
                }
                setCancelarVisita(null);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default VisitasPage;
