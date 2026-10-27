import {Router} from 'express';
import {dashboardStats} from '../controllers/dashboardController.js';
import {recentExpenses} from '../controllers/dashboardExtrasController.js';
const router=Router();router.get('/stats',dashboardStats);router.get('/recent-expenses',recentExpenses);export default router;
