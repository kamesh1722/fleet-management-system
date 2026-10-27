import Vehicle from '../models/Vehicle.js';

function handleError(error, res) {
  if (error.code === 11000) return res.status(409).json({ message: 'Vehicle number or registration number already exists' });
  if (error.name === 'ValidationError' || error.name === 'CastError') return res.status(400).json({ message: error.message });
  return res.status(500).json({ message: 'Server error' });
}

export async function listVehicles(_req, res) {
  try { res.json(await Vehicle.find().sort({ createdAt: -1 })); }
  catch (error) { handleError(error, res); }
}

export async function getVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) { handleError(error, res); }
}

export async function createVehicle(req, res) {
  try { res.status(201).json(await Vehicle.create(req.body)); }
  catch (error) { handleError(error, res); }
}

export async function updateVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) { handleError(error, res); }
}

export async function deleteVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (error) { handleError(error, res); }
}
