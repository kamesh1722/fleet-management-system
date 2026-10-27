import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Vehicles from './pages/Vehicles.jsx';
import Drivers from './pages/Drivers.jsx';
import Maintenance from './pages/Maintenance.jsx';
import Insurance from './pages/Insurance.jsx';
import Expenses from './pages/Expenses.jsx';
import VehicleHealth from './pages/VehicleHealth.jsx';
import Alerts from './pages/Alerts.jsx';
import Reports from './pages/Reports.jsx';
import VehicleDetails from './pages/VehicleDetails.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './services/api.js';

const pages = [
  ['/', 'Dashboard', Dashboard], ['/vehicles', 'Vehicles', Vehicles],
  ['/drivers', 'Drivers', Drivers], ['/maintenance', 'Maintenance', Maintenance],
  ['/insurance', 'Insurance', Insurance], ['/expenses', 'Expenses', Expenses],
  ['/vehicle-health', 'Vehicle Health', VehicleHealth], ['/alerts', 'Alerts', Alerts],
  ['/reports', 'Reports', Reports],
];

export default function App() {
  const [alertCount, setAlertCount] = useState(0);
  useEffect(() => { api('alerts').then((alerts) => setAlertCount(alerts.length)).catch(() => {}); }, []);
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand">Fleet<span>Flow</span></div><nav aria-label="Main navigation">
      {pages.map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>{label}{label === 'Alerts' && alertCount > 0 ? ` (${alertCount})` : ''}</NavLink>)}
    </nav></aside>
    <main className="main-content"><header><span>Fleet Vehicle Management</span><Link to="/alerts">Alerts {alertCount ? `(${alertCount})` : ''}</Link></header>
      <Routes>{pages.map(([path, label, Page]) => <Route key={path} path={path} element={<Page title={label} />} />)}<Route path="/dashboard" element={<Dashboard />} /><Route path="/vehicles/:id" element={<VehicleDetails />} /></Routes>
    </main>
  </div>;
}
