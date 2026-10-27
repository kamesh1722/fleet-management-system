import mongoose from 'mongoose';
const score={type:Number,required:true,min:0,max:100};
const schema = new mongoose.Schema({ vehicleId:{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle',required:true,unique:true}, engine:score, brakes:score, tyres:score, battery:score, oilLevel:score, lastInspection:{type:Date,required:true}, remarks:String },{timestamps:true});
export default mongoose.model('VehicleHealth',schema);
