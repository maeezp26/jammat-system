import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import jsPDF from "jspdf";

function MonthPage() {
  const { year, month } = useParams();
  const navigate = useNavigate();

  const [jammats, setJammats] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportPDF = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(`${month} ${year} Jammat Report`, 20, 20);

let y = 35;

jammats.forEach((j, index) => {

doc.setFontSize(14);
doc.text(`Jammat ${j.jammatNo}`, 20, y);
y += 7;

doc.setFontSize(11);

doc.text(`Type: ${j.type}`, 20, y);
y += 6;

doc.text(`Masjid: ${j.masjidName}`, 20, y);
y += 6;

doc.text(`Route: ${j.route.join(" → ")}`, 20, y);
y += 6;

doc.text(`Saathi: ${j.saathi}`, 20, y);
y += 6;

doc.text("Members:", 20, y);
y += 6;

j.members.forEach(group => {

doc.text(`${group.masjid}`, 25, y);
y += 5;

group.names.forEach(name => {

doc.text(`- ${name}`, 30, y);
y += 5;

});

});

y += 8;

});

doc.save(`${month}_${year}_jammat_report.pdf`);

};

  useEffect(() => {
    const fetchJammats = async () => {
      try {
        const res = await API.get(`/jammat/month/${year}/${month}`);

        setJammats(res.data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchJammats();
  }, [year, month]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {month} {year}
      </h1>

     <div className="flex gap-2 mb-4">

<button
onClick={() => navigate(`/statistics/${year}/${month}`)}
className="flex-1 bg-purple-500 text-white p-3 rounded"
>
Statistics
</button>

<button
onClick={exportPDF}
className="flex-1 bg-blue-500 text-white p-3 rounded"
>
Download PDF
</button>

</div>

      {jammats.length === 0 && <p>No Jammat found</p>}

      <div className="space-y-4">
        {jammats.map((j) => {
          const start = new Date(j.startDate).getDate();
          const end = new Date(j.endDate).getDate();

          return (
            <div
              key={j._id}
              onClick={() => navigate(`/jammat/${j._id}`)}
              className="bg-white p-4 rounded-lg shadow-md active:scale-95 transition flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-lg">
                  {start}-{end}
                </div>
          
                <div className="text-sm text-gray-600">
                  {j.category === "masturat" ? "Masturat " : ""}
                  Jammat {j.jammatNo}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold">{j.type}</div>

                <div className="text-xs text-gray-500">{j.masjidName}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthPage;
