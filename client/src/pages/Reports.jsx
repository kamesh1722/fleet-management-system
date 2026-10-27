import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { formatINR } from '../services/currency.js';

const reports = [['Fleet', 'vehicles'], ['Maintenance', 'maintenance'], ['Insurance', 'insurance'], ['Expenses', 'expenses'], ['Vehicle Health', 'health']];
const monetaryFields = ['amount', 'premium', 'cost', 'price', 'rentalPrice', 'subtotal', 'tax', 'discount', 'total'];

export default function Reports() {
  const [kind, setKind] = useState('vehicles');
  const [rows, setRows] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const statuses = kind === 'maintenance' ? ['Scheduled', 'Completed', 'Overdue'] : kind === 'insurance' ? ['Active', 'Expiring Soon', 'Expired'] : kind === 'health' ? ['Good', 'Attention required'] : kind === 'drivers' ? ['Active', 'Inactive', 'On Leave'] : ['Active', 'Inactive'];

  useEffect(() => { api('vehicles').then(setVehicles).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (vehicleId) params.set('vehicleId', vehicleId);
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (status) params.set('status', status);
    if (kind === 'expenses' && category) params.set('category', category);
    api(`${kind}?${params}`).then(setRows).catch((e) => setError(e.message));
  }, [kind, vehicleId, from, to, status, category]);

  function exportCsv() {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]).filter((key) => key !== '__v');
    const value = (item) => `"${String(item && typeof item === 'object' ? (item.vehicleNumber || item._id || JSON.stringify(item)) : item ?? '').replaceAll('"', '""')}"`;
    const content = [keys.join(','), ...rows.map((row) => keys.map((key) => value(row[key])).join(','))].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv' }));
    link.download = `${kind}-report.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <section className="page">
    <h1>Reports</h1>
    {error && <p role="alert">{error}</p>}
    <div className="toolbar">
      <select value={kind} onChange={(e) => { setKind(e.target.value); setStatus(''); setCategory(''); }}>{reports.map(([name, key]) => <option key={key} value={key}>{name} report</option>)}</select>
      <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}><option value="">All vehicles</option>{vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.vehicleNumber}</option>)}</select>
      <input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      {kind !== 'expenses' && <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>}
      {kind === 'expenses' && <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{['Fuel', 'Maintenance', 'Repair', 'Insurance', 'Other'].map((item) => <option key={item}>{item}</option>)}</select>}
      <button onClick={exportCsv}>Export CSV</button>
    </div>
    <div className="stat-grid">
      <article className="stat-card"><span>Records</span><strong>{rows.length}</strong></article>
      {kind === 'expenses' && <article className="stat-card"><span>Total expenses</span><strong>{formatINR(rows.reduce((sum, row) => sum + row.amount, 0))}</strong></article>}
    </div>
    <div className="table-wrap"><table>
      <thead><tr>{rows[0] && Object.keys(rows[0]).filter((key) => key !== '__v').map((key) => <th key={key}>{key}</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row._id}>{Object.entries(row).filter(([key]) => key !== '__v').map(([key, value]) => <td key={key}>{value && typeof value === 'object' ? value.vehicleNumber || value._id || '' : monetaryFields.includes(key) && typeof value === 'number' ? formatINR(value) : String(value ?? '')}</td>)}</tr>)}
        {!rows.length && <tr><td>No report rows.</td></tr>}
      </tbody>
    </table></div>
  </section>;
}
