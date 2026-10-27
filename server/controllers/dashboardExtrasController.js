import Expense from '../models/Expense.js';
export async function recentExpenses(_req,res){try{res.json(await Expense.find().sort({date:-1}).limit(10).populate('vehicleId','vehicleNumber'));}catch{res.status(500).json({message:'Server error'});}}
