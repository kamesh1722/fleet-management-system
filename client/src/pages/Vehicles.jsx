import { useCallback, useEffect, useState } from 'react';
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from '../services/vehicleService.js';

const fields = [
  ['vehicleNumber', 'Vehicle number'], ['registrationNumber', 'Registration number'],
  ['vehicleType', 'Vehicle type'], ['brand', 'Brand'], ['model', 'Model'],
  ['year', 'Year', 'number'], ['fuelType', 'Fuel type'], ['mileage', 'Mileage', 'number'],
  ['purchaseDate', 'Purchase date', 'date'], ['status', 'Status'], ['assignedDriver', 'Assigned driver'],
];
const emptyVehicle = () => Object.fromEntries(fields.map(([key]) => [key, '']));

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyVehicle);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try { setVehicles(await getVehicles()); setError(''); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  function startEdit(vehicle) {
    setEditingId(vehicle._id);
    setForm(Object.fromEntries(fields.map(([key]) => [key, key === 'purchaseDate' ? vehicle[key]?.slice(0, 10) || '' : vehicle[key] ?? ''])));
  }
  function cancelEdit() { setEditingId(null); setForm(emptyVehicle()); }
  async function submit(event) {
    event.preventDefault();
    const payload = { ...form, year: Number(form.year), mileage: Number(form.mileage) };
    try {
      if (editingId) await updateVehicle(editingId, payload);
      else await createVehicle(payload);
      cancelEdit(); await refresh();
    } catch (e) { setError(e.message); }
  }
  async function remove(id) {
    if (!window.confirm('Delete this vehicle?')) return;
    try { await deleteVehicle(id); await refresh(); }
    catch (e) { setError(e.message); }
  }

  return <section className="page">
    <h1>Vehicles</h1>
    {error && <p role="alert">{error}</p>}
    <form onSubmit={submit}>
      <div className="vehicle-form">
        {fields.map(([key, label, type]) => <label key={key}>{label}
          <input required type={type || 'text'} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />
        </label>)}
      </div>
      <button type="submit">{editingId ? 'Save vehicle' : 'Add vehicle'}</button>
      {editingId && <button type="button" onClick={cancelEdit}>Cancel</button>}
    </form>
    {loading ? <p>Loading vehicles…</p> : <div style={{ overflowX: 'auto', marginTop: 24 }}>
      <table><thead><tr>{fields.map(([, label]) => <th key={label}>{label}</th>)}<th>Actions</th></tr></thead>
        <tbody>{vehicles.map((vehicle) => <tr key={vehicle._id}>
          {fields.map(([key]) => <td key={key}>{key === 'purchaseDate' ? vehicle[key]?.slice(0, 10) : vehicle[key]}</td>)}
          <td><button type="button" onClick={() => startEdit(vehicle)}>Edit</button> <button type="button" onClick={() => remove(vehicle._id)}>Delete</button></td>
        </tr>)}
        {!vehicles.length && <tr><td colSpan={fields.length + 1}>No vehicles found.</td></tr>}</tbody>
      </table>
    </div>}
  </section>;
}
