import Driver from '../models/Driver.js';
import Maintenance from '../models/Maintenance.js';
import Insurance from '../models/Insurance.js';
import VehicleHealth from '../models/VehicleHealth.js';
import Vehicle from '../models/Vehicle.js';

export async function buildAlerts(){
 const now=new Date(), soon=new Date(now.getTime()+30*86400000), alerts=[];
 const [services,policies,drivers,health]=await Promise.all([Maintenance.find({status:{$ne:'Completed'}}).populate('vehicleId','vehicleNumber'),Insurance.find().populate('vehicleId','vehicleNumber'),Driver.find().populate('assignedVehicle','vehicleNumber'),VehicleHealth.find().populate('vehicleId','vehicleNumber')]);
 for(const x of services){if(!x.nextServiceDate)continue;const overdue=x.nextServiceDate<now; if(overdue||x.nextServiceDate<=soon)alerts.push({type:overdue?'maintenance-overdue':'maintenance-due',title:overdue?'Maintenance overdue':'Maintenance due',message:`${x.vehicleId?.vehicleNumber||'Vehicle'}: ${x.serviceType}`,severity:overdue?'High':'Medium',vehicleId:x.vehicleId?._id,date:x.nextServiceDate,read:false});}
 for(const x of policies){if(x.expiryDate<now||x.expiryDate<=soon)alerts.push({type:x.expiryDate<now?'insurance-expired':'insurance-expiring',title:x.expiryDate<now?'Insurance expired':'Insurance expiring soon',message:`${x.vehicleId?.vehicleNumber||'Vehicle'}: policy ${x.policyNumber}`,severity:x.expiryDate<now?'High':'Medium',vehicleId:x.vehicleId?._id,date:x.expiryDate,read:false});}
 for(const x of drivers){if(x.licenseExpiry<now||x.licenseExpiry<=soon)alerts.push({type:x.licenseExpiry<now?'license-expired':'license-expiring',title:x.licenseExpiry<now?'License expired':'License expiring soon',message:`${x.name} (${x.assignedVehicle?.vehicleNumber||'unassigned'})`,severity:x.licenseExpiry<now?'High':'Medium',vehicleId:x.assignedVehicle?._id,date:x.licenseExpiry,read:false});}
 for(const x of health){const n=(x.engine+x.brakes+x.tyres+x.battery+x.oilLevel)/5;if(n<60)alerts.push({type:'poor-health',title:'Poor vehicle health',message:`${x.vehicleId?.vehicleNumber||'Vehicle'} health is ${Math.round(n)}%`,severity:n<35?'High':'Medium',vehicleId:x.vehicleId?._id,date:x.updatedAt,read:false});}
 alerts.sort((a,b)=>new Date(b.date)-new Date(a.date));return alerts;
}
export async function getAlerts(_req,res){try{res.json(await buildAlerts());}catch{res.status(500).json({message:'Server error'});}}
