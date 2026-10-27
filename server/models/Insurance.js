import mongoose from 'mongoose';
const schema = new mongoose.Schema({ vehicleId:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle',required:true}, provider:{type:String,required:true}, policyNumber:{type:String,required:true}, policyType:{type:String,required:true}, startDate:{type:Date,required:true}, expiryDate:{type:Date,required:true}, premium:{type:Number,required:true,min:0}, document:String },{timestamps:true});
export default mongoose.model('Insurance',schema);
