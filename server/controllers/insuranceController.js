import Insurance from '../models/Insurance.js';
import { resourceController } from './resourceController.js';
export default resourceController(Insurance,{vehicleFields:['vehicleId']});
