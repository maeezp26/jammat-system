import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

function YearStatistics(){

const { year } = useParams();

const [stats,setStats] = useState(null);

const exportPDF = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(`${year} Jammat Statistics`, 20, 20);

let y = 40;

doc.setFontSize(12);

doc.text(`3 Days Jammat: ${stats.typeStats["3days"] || 0}`, 20, y);
y += 10;

doc.text(`10 Days Jammat: ${stats.typeStats["10days"] || 0}`, 20, y);
y += 10;

doc.text(`40 Days Jammat: ${stats.typeStats["40days"] || 0}`, 20, y);
y += 10;

doc.text(`4 Months Jammat: ${stats.typeStats["4months"] || 0}`, 20, y);
y += 10;

doc.text(`Masturat Jammat: ${stats.masturatTotal}`, 20, y);
y += 10;

doc.text(`Ramzan Jammat: ${stats.ramzanTotal}`, 20, y);
y += 10;

doc.text(`Total Members Participated: ${stats.totalMembers}`, 20, y);

doc.save(`${year}_statistics.pdf`);

};

useEffect(()=>{

const load = async()=>{

const res = await API.get(`/jammat/statistics/${year}`);

setStats(res.data);

};

load();

},[year]);

if(!stats){
return <div className="p-4">Loading...</div>;
}

return(

<div className="p-4 max-w-md mx-auto">

<h1 className="text-xl font-bold mb-4">
{year} Effort Statistics
</h1>
    <button
onClick={exportPDF}
className="w-full bg-blue-600 text-white p-3 rounded mb-4"
>
Export PDF
</button>
<div className="space-y-3">

<div className="bg-white p-3 rounded shadow">
3 Days Jammat: {stats.typeStats["3days"] || 0}
</div>

<div className="bg-white p-3 rounded shadow">
10 Days Jammat: {stats.typeStats["10days"] || 0}
</div>

<div className="bg-white p-3 rounded shadow">
40 Days Jammat: {stats.typeStats["40days"] || 0}
</div>

<div className="bg-white p-3 rounded shadow">
4 Months Jammat: {stats.typeStats["4months"] || 0}
</div>

<div className="bg-white p-3 rounded shadow">
Masturat Jammat: {stats.masturatTotal}
</div>

<div className="bg-white p-3 rounded shadow">
Ramzan Jammat: {stats.ramzanTotal}
</div>

<div className="bg-green-500 text-white p-3 rounded">
Total Members Participated: {stats.totalMembers}
</div>

</div>

</div>

);

}

export default YearStatistics;