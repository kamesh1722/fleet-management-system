import { Router } from 'express';
import { createVehicle, deleteVehicle, getVehicle, listVehicles, updateVehicle } from '../controllers/vehicleController.js';

const router = Router();
router.route('/').get(listVehicles).post(createVehicle);
router.route('/:id').get(getVehicle).put(updateVehicle).delete(deleteVehicle);
export default router;
