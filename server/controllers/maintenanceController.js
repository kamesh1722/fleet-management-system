import Maintenance from '../models/Maintenance.js';
import { resourceController } from './resourceController.js';
export default resourceController(Maintenance,{vehicleFields:['vehicleId']});
