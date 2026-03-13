import { useState } from "react";
import API from "../api/axios";

function StatisticsPage(){

const [year,setYear] = useState(new Date().getFullYear());
const [stats,setStats] = useState(null);

const loadStats = async () => {

try{

const res = await API.get(`/jammat/statistics/${year}`);

setStats(res.data);

}catch(err){

console.log(err);

}

};

return(

<div className="p-4 max-w-md mx-auto">

<h1 className="text-xl font-bold mb-4">
Year Statistics
</h1>

<div className="flex gap-2 mb-4">

<input
type="number"
value={year}
className="border p-2 w-full"
onChange={(e)=>setYear(e.target.value)}
/>

<button
onClick={loadStats}
className="bg-blue-500 text-white px-4 rounded"
>
Load
</button>

</div>

{stats && (

<div className="space-y-2">

<div className="bg-white p-3 rounded shadow">
Total Jammat: {stats.totalJammat}
</div>

<div className="bg-white p-3 rounded shadow">
Masturat Jammat: {stats.masturatTotal}
</div>

<div className="bg-white p-3 rounded shadow">
Ramzan Jammat: {stats.ramzanTotal}
</div>

<h2 className="font-semibold mt-4">
Jammat Types
</h2>

{stats.typeStats.map((t)=>(
<div
key={t._id}
className="bg-white p-3 rounded shadow"
>
{t._id} : {t.count}
</div>
))}

</div>

)}

</div>

);

}

export default StatisticsPage;