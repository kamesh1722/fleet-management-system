import Expense from '../models/Expense.js';
import { resourceController } from './resourceController.js';
export default resourceController(Expense,{vehicleFields:['vehicleId']});
