import { useState } from "react";
import API from "../api/axios";

function AddJammat() {

const [form,setForm] = useState({
year:"",
month:"",
category:"men",
jammatNo:"",
type:"3days",
masjidName:"",
route:"",
startDate:"",
endDate:"",
saathi:"",
note:"",
isRamzan:false,
 ameer:""

});

const masjidList = [
"Jumma Masjid",
"Noorani Masjid",
"Ayesha Masjid",
"Fatima Masjid",
"Bilal Masjid",
"Medina Masjid",
"Elaahi Masjid",
"Bajipura",
"Buhari"
];

const months = [
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const [members,setMembers] = useState([]);

const saathiCount = members.filter(m=>m.name.trim() !== "").length;

const handleChange = (e) => {

const { name, value, type, checked } = e.target;

let updatedForm = {
...form,
[name]: type === "checkbox" ? checked : value
};

if(name === "startDate"){

const date = new Date(value);

if(!isNaN(date)){
updatedForm.month = months[date.getMonth()];
updatedForm.year = date.getFullYear();
}

}

setForm(updatedForm);

};

const submit = async ()=>{

const token = localStorage.getItem("token");

try{

await API.post("/jammat",{

...form,
saathi:saathiCount,
route:form.route.split(",").map(r=>r.trim()),

members:Object.values(

members.reduce((acc,m)=>{

if(!m.name.trim()) return acc;

if(!acc[m.masjid]){
acc[m.masjid] = {masjid:m.masjid,names:[]};
}

acc[m.masjid].names.push(m.name);

return acc;

},{})
)

},{
headers:{Authorization:token}
});

alert("Jammat Added Successfully");

setForm({
year:"",
month:"",
category:"men",
jammatNo:"",
type:"3days",
masjidName:"",
route:"",
startDate:"",
endDate:"",
saathi:"",
note:"",
isRamzan:false
});

setMembers([]);

}catch(err){

alert("Error adding jammat");

}

};

const addMember = (masjid)=>{
setMembers([...members,{masjid,name:""}]);
};

const updateMember = (index,value)=>{
const updated=[...members];
updated[index].name=value;
setMembers(updated);
};

const removeMember = (index)=>{
const updated=[...members];
updated.splice(index,1);
setMembers(updated);
};

return(

<div className="min-h-screen bg-gray-100 p-4">

<div className="max-w-md mx-auto">

{/* Header */}
<div className="bg-blue-600 text-white p-4 rounded-lg shadow mb-4 text-center">

<h1 className="text-xl font-bold">
Valod Jamaat Management
</h1>

<p className="text-sm opacity-90">
Add New Jamaat Record
</p>

</div>

{/* Form Card */}
<div className="bg-white rounded-lg shadow p-4 space-y-4">

<h2 className="font-semibold text-lg">
Jamaat Details
</h2>

<input
name="year"
value={form.year}
readOnly
placeholder="Year"
className="border rounded p-2 w-full bg-gray-100"
/>

<input
name="month"
value={form.month}
readOnly
placeholder="Month (Auto)"
className="border rounded p-2 w-full bg-gray-100"
/>

<select
name="category"
className="border rounded p-2 w-full"
onChange={handleChange}
>
<option value="men">Men Jamaat</option>
<option value="masturat">Masturat Jamaat</option>
</select>

<input
name="jammatNo"
placeholder="Jamaat Number"
className="border rounded p-2 w-full"
onChange={handleChange}
/>

<select
name="type"
className="border rounded p-2 w-full"
onChange={handleChange}
>
<option value="3days">3 Days</option>
<option value="10days">10 Days</option>
<option value="40days">40 Days</option>
<option value="2months">2 Months</option>
<option value="4months">4 Months</option>
</select>

<input
name="masjidName"
placeholder="Masjid Name"
className="border rounded p-2 w-full"
onChange={handleChange}
/>

<input
name="route"
placeholder="Route (comma separated)"
className="border rounded p-2 w-full"
onChange={handleChange}
/>

<div className="grid grid-cols-2 gap-2">

<input
type="date"
name="startDate"
className="border rounded p-2"
onChange={handleChange}
/>

<input
type="date"
name="endDate"
className="border rounded p-2"
onChange={handleChange}
/>

</div>

<div>

<label className="text-sm text-gray-600">
Saathi Count
</label>

<input
value={saathiCount}
readOnly
className="border rounded p-2 w-full bg-gray-100"
/>

</div>

<textarea
name="note"
placeholder="Note (optional)"
className="border rounded p-2 w-full"
onChange={handleChange}
/>

<label className="flex items-center gap-2">
<input type="checkbox" name="isRamzan" onChange={handleChange}/>
Ramzan Jamaat
</label>

</div>

{/* Members Section */}



<div className="bg-white rounded-lg shadow p-4 mt-4">

<h2 className="font-semibold text-lg mb-3">
Members
</h2>

{masjidList.map(masjid=>(
<div key={masjid} className="mb-3">

<h3 className="font-semibold text-blue-600">
{masjid}
</h3>

{members.map((m,i)=>
m.masjid===masjid &&(

<div key={i} className="flex gap-2 mb-2">

<div className="flex items-center gap-2 w-full">

<input
type="radio"
name="ameer"
checked={form.ameer === m.name}
onChange={()=>setForm({...form,ameer:m.name})}
/>

<input
placeholder="Member Name"
className="border p-2 w-full"
value={m.name}
onChange={(e)=>updateMember(i,e.target.value)}
/>

</div>

<button
type="button"
className="text-red-500"
onClick={()=>removeMember(i)}
>
❌
</button>

</div>

)
)}

<button
type="button"
className="text-blue-600 text-sm"
onClick={()=>addMember(masjid)}
>
+ Add Member
</button>

</div>
))}

</div>

<button
onClick={submit}
className="w-full bg-green-600 text-white p-3 rounded mt-4 font-semibold"
>
Save Jamaat
</button>

</div>

</div>

);

}

export default AddJammat;