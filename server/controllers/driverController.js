import Driver from '../models/Driver.js';
import { resourceController } from './resourceController.js';
export default resourceController(Driver,{vehicleFields:['assignedVehicle'],populate:'assignedVehicle'});
