import mongoose from 'mongoose';
const schema = new mongoose.Schema({ vehicleId:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle',required:true}, serviceType:{type:String,required:true}, serviceDate:{type:Date,required:true}, nextServiceDate:{type:Date}, description:String, partsReplaced:String, mechanic:String, cost:{type:Number,required:true,min:0}, status:{type:String,enum:['Scheduled','Completed','Overdue'],default:'Scheduled'} },{timestamps:true});
export default mongoose.model('Maintenance',schema);
