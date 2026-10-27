import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, phone:{type:String,required:true,trim:true}, email:{type:String,trim:true,lowercase:true}, licenseNumber:{type:String,required:true,trim:true,unique:true}, licenseExpiry:{type:Date,required:true}, assignedVehicle:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle',default:null}, joiningDate:{type:Date,required:true}, status:{type:String,required:true,default:'Active'} },{timestamps:true});
export default mongoose.model('Driver',schema);
