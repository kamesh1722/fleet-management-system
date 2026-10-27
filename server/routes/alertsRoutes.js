import {Router} from 'express';
import {getAlerts} from '../controllers/alertsController.js';
const router=Router();router.get('/',getAlerts);export default router;
