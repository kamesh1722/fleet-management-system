const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export async function api(path, options = {}) {
  const response = await fetch(`${API}/api/${path}`, { ...options, headers: { 'Content-Type':'application/json', ...options.headers } });
  const body = await response.json().catch(()=>null);
  if (!response.ok) throw new Error(body?.message || 'Request failed');
  return body;
}
