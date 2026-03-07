export interface Paciente {
  id: string;
  nombre: string;
  documento?: string;
  telefono?: string;
  email?: string;
}

export const PACIENTES_STORAGE_KEY = 'medicare_pacientes';

function nextId(): string {
  return `pac-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function crearPaciente(partial: Omit<Paciente, 'id'>): Paciente {
  return {
    id: nextId(),
    nombre: partial.nombre,
    documento: partial.documento ?? '',
    telefono: partial.telefono ?? '',
    email: partial.email ?? '',
  };
}

export function cargarPacientes(): Paciente[] {
  try {
    const raw = localStorage.getItem(PACIENTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Paciente[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function guardarPacientes(pacientes: Paciente[]): void {
  localStorage.setItem(PACIENTES_STORAGE_KEY, JSON.stringify(pacientes));
}
