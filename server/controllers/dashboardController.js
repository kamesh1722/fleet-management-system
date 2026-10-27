import Vehicle from '../models/Vehicle.js';
import Maintenance from '../models/Maintenance.js';
import Insurance from '../models/Insurance.js';
import Expense from '../models/Expense.js';
import VehicleHealth from '../models/VehicleHealth.js';
import { buildAlerts } from './alertsController.js';

export async function dashboardStats(_req,res){
 try{
  const [vehicles,maintenance,insurance,expenses,health,alerts]=await Promise.all([Vehicle.find(),Maintenance.find().populate('vehicleId','vehicleNumber'),Insurance.find().populate('vehicleId','vehicleNumber'),Expense.find().populate('vehicleId','vehicleNumber'),VehicleHealth.find().populate('vehicleId','vehicleNumber'),buildAlerts()]);
  const now=new Date(),soon=new Date(now.getTime()+30*86400000),month=new Date(now.getFullYear(),now.getMonth(),1);
  const monthlyExpenseTrend=Array.from({length:6},(_,i)=>{const d=new Date(now.getFullYear(),now.getMonth()-5+i,1);return{month:d.toLocaleString('en',{month:'short'}),total:expenses.filter(e=>e.date.getFullYear()===d.getFullYear()&&e.date.getMonth()===d.getMonth()).reduce((s,e)=>s+e.amount,0)};});
  const countBy=items=>Object.entries(items.reduce((a,x)=>{a[x]=(a[x]||0)+1;return a;},{})).map(([name,value])=>({name,value}));
  const maintenanceStatus=countBy(maintenance.map(m=>m.status==='Completed'?'Completed':m.nextServiceDate<now?'Overdue':'Scheduled'));
  const vehicleStatus=countBy(vehicles.map(v=>v.status));
  const expenseCategories=Object.entries(expenses.reduce((a,e)=>{a[e.category]=(a[e.category]||0)+e.amount;return a;},{})).map(([name,value])=>({name,value}));
  res.json({totalVehicles:vehicles.length,activeVehicles:vehicles.filter(v=>v.status.toLowerCase()==='active').length,vehiclesUnderMaintenance:vehicles.filter(v=>v.status.toLowerCase().includes('maintenance')).length,maintenanceDue:maintenance.filter(m=>m.status!=='Completed'&&m.nextServiceDate&&m.nextServiceDate<=soon).length,insuranceExpiring:insurance.filter(i=>i.expiryDate>=now&&i.expiryDate<=soon).length,expiredInsurance:insurance.filter(i=>i.expiryDate<now).length,monthlyExpenses:expenses.filter(e=>e.date>=month).reduce((s,e)=>s+e.amount,0),averageVehicleHealth:health.length?Math.round(health.reduce((s,h)=>s+h.engine+h.brakes+h.tyres+h.battery+h.oilLevel,0)/(health.length*5)):0,upcomingMaintenance:maintenance.filter(m=>m.status!=='Completed'&&m.nextServiceDate>=now&&m.nextServiceDate<=soon).slice(0,5),insuranceExpiringSoon:insurance.filter(i=>i.expiryDate>=now&&i.expiryDate<=soon).slice(0,5),recentExpenses:expenses.sort((a,b)=>b.date-a.date).slice(0,5),vehicleHealth:health,alerts:alerts.slice(0,5),monthlyExpenseTrend,vehicleStatus,maintenanceStatus,expenseCategories});
 }catch{res.status(500).json({message:'Server error'});}
}
