export type EstadoVisita = 'pendiente' | 'en_camino' | 'finalizada' | 'cancelada';

export interface MedicamentoReceta {
  id: string;
  nombre: string;
  dosis: string;
  indicaciones: string;
}

export interface Visita {
  id: string;
  paciente: string;
  hora: string;
  estado: EstadoVisita;
  motivoCancelacion?: string;
  receta?: MedicamentoReceta[];
}

export const VISITAS_STORAGE_KEY = 'medicare_visitas';

function hoyISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function visitasDelDiaDefault(): Visita[] {
  const hoy = hoyISO();
  return [
    { id: `${hoy}-1`, paciente: 'María García', hora: '08:00', estado: 'pendiente' },
    { id: `${hoy}-2`, paciente: 'Juan Pérez', hora: '09:30', estado: 'pendiente' },
    { id: `${hoy}-3`, paciente: 'Ana López', hora: '10:00', estado: 'pendiente' },
    { id: `${hoy}-4`, paciente: 'Carlos Ruiz', hora: '11:00', estado: 'pendiente' },
  ];
}

export function cargarVisitas(): Visita[] {
  try {
    const raw = localStorage.getItem(VISITAS_STORAGE_KEY);
    if (!raw) return visitasDelDiaDefault();
    const parsed = JSON.parse(raw) as Visita[];
    return Array.isArray(parsed) ? parsed : visitasDelDiaDefault();
  } catch {
    return visitasDelDiaDefault();
  }
}

export function guardarVisitas(visitas: Visita[]): void {
  localStorage.setItem(VISITAS_STORAGE_KEY, JSON.stringify(visitas));
}
