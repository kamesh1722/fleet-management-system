import mongoose from 'mongoose';
const schema = new mongoose.Schema({ vehicleId:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle',required:true}, category:{type:String,enum:['Fuel','Maintenance','Repair','Insurance','Other'],required:true}, amount:{type:Number,required:true,min:0}, date:{type:Date,required:true}, description:String, createdBy:String },{timestamps:true});
export default mongoose.model('Expense',schema);
