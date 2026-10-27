import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

export function resourceController(Model, { vehicleFields = [], populate = 'vehicleId' } = {}) {
  async function validRefs(body) {
    for (const field of vehicleFields) if (body[field]) {
      if (!mongoose.isValidObjectId(body[field])) return `Invalid ${field}`;
      if (!await Vehicle.exists({ _id: body[field] })) return 'Vehicle not found';
    }
    return '';
  }
  const fail = (error, res) => res.status(error.name === 'ValidationError' || error.name === 'CastError' ? 400 : error.code === 11000 ? 409 : 500).json({ message: error.name === 'ValidationError' || error.name === 'CastError' ? error.message : error.code === 11000 ? 'Record already exists' : 'Server error' });
  return {
    async list(req,res) { try {
      const filter={};
      for (const key of ['status','category','vehicleId']) if(req.query[key]&&!(Model.modelName==='Maintenance'&&key==='status')&&!(Model.modelName==='Insurance'&&key==='status')) filter[key]=req.query[key];
      if(req.query.from || req.query.to) { const field=Model.modelName==='Expense'?'date':Model.modelName==='Maintenance'?'serviceDate':'expiryDate'; filter[field]={}; if(req.query.from) filter[field].$gte=new Date(req.query.from); if(req.query.to) filter[field].$lte=new Date(req.query.to); }
      if(req.query.search) { const rx=new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'); const fields=Object.keys(Model.schema.paths).filter(k=>Model.schema.paths[k].instance==='String'); filter.$or=fields.map(k=>({[k]:rx})); }
      let query=Model.find(filter).sort({createdAt:-1}); if(populate) query=query.populate(populate,'vehicleNumber registrationNumber brand model');
      let rows=await query;
      if(Model.modelName==='Maintenance') rows=rows.map(row=>{ const x=row.toObject(); if(x.status!=='Completed'&&x.nextServiceDate) x.status=new Date(x.nextServiceDate)<new Date()?'Overdue':'Scheduled'; return x; });
      if(Model.modelName==='Maintenance'&&req.query.status) rows=rows.filter(row=>row.status===req.query.status);
      if(Model.modelName==='Insurance') rows=rows.map(row=>{const x=row.toObject();x.status=x.expiryDate<new Date()?'Expired':x.expiryDate<=new Date(Date.now()+30*86400000)?'Expiring Soon':'Active';return x;});
      if(Model.modelName==='Insurance'&&req.query.status) rows=rows.filter(row=>row.status===req.query.status);
      res.json(rows);
    } catch(e){fail(e,res);} },
    async get(req,res){ try { if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid record ID'}); let q=Model.findById(req.params.id); if(populate)q=q.populate(populate,'vehicleNumber registrationNumber brand model'); const row=await q; return row?res.json(row):res.status(404).json({message:`${Model.modelName} not found`}); }catch(e){fail(e,res);} },
    async create(req,res){ try { const err=await validRefs(req.body); if(err)return res.status(err.startsWith('Invalid ')?400:404).json({message:err}); const row=await Model.create(req.body); res.status(201).json(row); }catch(e){fail(e,res);} },
    async update(req,res){ try { if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid record ID'}); const err=await validRefs(req.body); if(err)return res.status(err.startsWith('Invalid ')?400:404).json({message:err}); const row=await Model.findByIdAndUpdate(req.params.id,req.body,{returnDocument:'after',runValidators:true}); return row?res.json(row):res.status(404).json({message:`${Model.modelName} not found`}); }catch(e){fail(e,res);} },
    async remove(req,res){ try { if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid record ID'}); const row=await Model.findByIdAndDelete(req.params.id); return row?res.json({message:'Record deleted'}):res.status(404).json({message:`${Model.modelName} not found`}); }catch(e){fail(e,res);} },
  };
}
