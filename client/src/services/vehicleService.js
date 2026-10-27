const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vehicles`;

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || 'Vehicle request failed');
  return data;
}

export const getVehicles = () => request();
export const createVehicle = (vehicle) => request('', { method: 'POST', body: JSON.stringify(vehicle) });
export const updateVehicle = (id, vehicle) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(vehicle) });
export const deleteVehicle = (id) => request(`/${id}`, { method: 'DELETE' });
