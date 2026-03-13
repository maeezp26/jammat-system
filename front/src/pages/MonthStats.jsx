import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import jsPDF from "jspdf";
import API from "../api/axios";

function MonthStats(){

const {year,month} = useParams();

const [stats,setStats] = useState(null);

const exportPDF = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(`${month} ${year} Jammat Statistics`, 20, 20);

let y = 40;

doc.setFontSize(12);

doc.text(`Total Jammat: ${stats.total}`, 20, y);
y += 10;

doc.text(`Masturat Jammat: ${stats.masturat}`, 20, y);
y += 10;

doc.text(`Ramzan Jammat: ${stats.ramzan}`, 20, y);
y += 10;

Object.keys(stats.types).forEach(type => {

doc.text(`${type} Jammat: ${stats.types[type]}`, 20, y);
y += 10;

});

doc.save(`${month}_${year}_statistics.pdf`);

};

useEffect(()=>{

const load = async ()=>{

const res = await API.get(`/jammat/statistics/${year}/${month}`);

setStats(res.data);

};

load();

},[]);

if(!stats) return <div className="p-4">Loading...</div>;

return(

<div className="p-4 max-w-md mx-auto">

<h1 className="text-xl font-bold mb-4">

{month} {year} Statistics

</h1>

<div className="space-y-2">

    <button
onClick={exportPDF}
className="w-full bg-blue-600 text-white p-3 rounded mb-4"
>
Export PDF
</button>

<div className="bg-white p-3 rounded shadow">
Total Jammat: {stats.total}
</div>

<div className="bg-white p-3 rounded shadow">
Masturat: {stats.masturat}
</div>

<div className="bg-white p-3 rounded shadow">
Ramzan: {stats.ramzan}
</div>

<h2 className="font-semibold mt-4">
Types
</h2>

{Object.entries(stats.types).map(([type,count])=>(
<div key={type} className="bg-white p-3 rounded shadow">
{type} : {count}
</div>
))}

</div>

</div>

);

}

export default MonthStats;