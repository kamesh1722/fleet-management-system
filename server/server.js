import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(currentDirectory, '../.env') });

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use((_req, res) => res.status(404).json({ message: 'API route not found' }));
app.use((error, _req, res, _next) => {
  const status = error instanceof SyntaxError && error.status === 400 ? 400 : 500;
  res.status(status).json({ message: status === 400 ? 'Invalid JSON request body' : 'Server error' });
});

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    console.error('Check that MongoDB is running and MONGO_URI points to the fleet_management database.');
    process.exitCode = 1;
  }
}

startServer();
