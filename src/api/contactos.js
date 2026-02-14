const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.detalle || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getContactos() {
  return request('/contactos');
}

export async function crearContacto(nombre, telefono) {
  return request('/contactos', {
    method: 'POST',
    body: { nombre, telefono },
  });
}

export async function eliminarContacto(id) {
  return request(`/contactos/${id}`, { method: 'DELETE' });
}
