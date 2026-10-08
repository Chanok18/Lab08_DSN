const API_URL = 'http://localhost:3000';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('techstore_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('techstore_token');
        localStorage.removeItem('techstore_user');
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
      const error = new Error(data.message || 'Error en la petición al servidor');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = 'No se pudo conectar con el servidor backend (http://localhost:3000). Verifique que esté encendido.';
    }
    throw error;
  }
}
