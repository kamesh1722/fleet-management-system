import CrudPage from '../components/CrudPage.jsx';
const fields=[{key:'vehicleId',label:'Vehicle',type:'select'},{key:'engine',label:'Engine %',type:'number'},{key:'brakes',label:'Brakes %',type:'number'},{key:'tyres',label:'Tyres %',type:'number'},{key:'battery',label:'Battery %',type:'number'},{key:'oilLevel',label:'Oil level %',type:'number'},{key:'lastInspection',label:'Last inspection',type:'date'},{key:'remarks',label:'Remarks',required:false}];
export default function VehicleHealth(){return <CrudPage title="Vehicle Health" endpoint="health" fields={fields} vehicleOptions={false} />;}
