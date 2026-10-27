import { Router } from 'express';
import { getHealth, listHealth, saveHealth, updateHealth } from '../controllers/healthController.js';
const router=Router();
router.get('/',listHealth);router.post('/',saveHealth);router.get('/:vehicleId',getHealth);router.put('/:vehicleId',updateHealth);
export default router;
