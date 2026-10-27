import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, trim: true, unique: true },
  registrationNumber: { type: String, required: true, trim: true, unique: true },
  vehicleType: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  fuelType: { type: String, required: true, trim: true },
  mileage: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, required: true },
  status: { type: String, required: true, trim: true },
  assignedDriver: { type: String, default: '', trim: true },
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
