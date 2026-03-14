import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function EditJammat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/jammat/${id}`);

      setForm(res.data);
    };

    load();
  }, [id]);

 const handleChange = (e) => {

const { name, value, type, checked } = e.target;

setForm({
  ...form,
  [name]: type === "checkbox" ? checked : value
});

};

  const removeMember = (groupIndex, nameIndex) => {
    const updatedMembers = [...form.members];

    updatedMembers[groupIndex].names.splice(nameIndex, 1);

    setForm({
      ...form,
      members: updatedMembers,
    });
  };

  const removeMasjidGroup = (groupIndex) => {
    const updatedMembers = [...form.members];

    updatedMembers.splice(groupIndex, 1);

    setForm({
      ...form,
      members: updatedMembers,
    });
  };

  const handleMemberNameChange = (groupIndex, nameIndex, value) => {
    const updatedMembers = [...form.members];

    updatedMembers[groupIndex].names[nameIndex] = value;

    setForm({
      ...form,
      members: updatedMembers,
    });
  };

  const handleMasjidChange = (groupIndex, value) => {
    const updatedMembers = [...form.members];

    updatedMembers[groupIndex].masjid = value;

    setForm({
      ...form,
      members: updatedMembers,
    });
  };

  const addMember = (groupIndex) => {
    const updatedMembers = [...form.members];

    updatedMembers[groupIndex].names.push("");

    setForm({
      ...form,
      members: updatedMembers,
    });
  };

  const addMasjidGroup = () => {
    setForm({
      ...form,
      members: [...form.members, { masjid: "", names: [""] }],
    });
  };

  const update = async () => {
    const token = localStorage.getItem("token");

    await API.put(`/jammat/${id}`, form, {
      headers: { Authorization: token },
    });

    alert("Updated");

    navigate(`/jammat/${id}`);
  };

  if (!form) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Jammat</h1>

        {/* Year */}
        <label className="block mb-1 font-medium">Year</label>
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Month */}
        <label className="block mb-1 font-medium">Month</label>
        <input
          name="month"
          value={form.month}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Category */}
<label className="block mb-1 font-medium">Category</label>

<select
name="category"
value={form.category || "men"}
onChange={handleChange}
className="border p-2 w-full mb-3 rounded"
>

<option value="men">Men Jammat</option>
<option value="masturat">Masturat Jammat</option>

</select>


        {/* Jammat No */}
        <label className="block mb-1 font-medium">Jammat No</label>
        <input
          name="jammatNo"
          value={form.jammatNo}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Type */}
        <label className="block mb-1 font-medium">Type</label>
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Masjid */}
        <label className="block mb-1 font-medium">Masjid Name</label>
        <input
          name="masjidName"
          value={form.masjidName}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Ameer */}
        <label className="block mb-1 font-medium">Ameer</label>
        <input
          name="ameer"
          value={form.ameer}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Saathi */}
        <label className="block mb-1 font-medium">Saathi</label>
        <input
          name="saathi"
          value={form.saathi}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Ramzan Jammat */}
<label className="block mb-1 font-medium">Ramzan Jammat</label>

<div className="flex items-center mb-4 gap-2">

<input
type="checkbox"
name="isRamzan"
checked={form.isRamzan || false}
onChange={handleChange}
className="w-4 h-4"
/>

<span className="text-gray-700">
Is this a Ramzan Jammat?
</span>

</div>

        {/* Note */}
        <label className="block mb-1 font-medium">Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        {/* Members Section */}
        <h2 className="text-xl font-semibold mt-6 mb-3">Members</h2>

        {(form.members || []).map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="border rounded-lg p-4 mb-4 bg-gray-50"
          >
            {/* Masjid Header */}
            <div className="flex justify-between items-center mb-3">
              <input
                value={group.masjid}
                onChange={(e) => handleMasjidChange(groupIndex, e.target.value)}
                placeholder="Masjid Name"
                className="border p-2 rounded w-full mr-2"
              />

              <button
                onClick={() => removeMasjidGroup(groupIndex)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>

            {/* Member Names */}
            {group.names.map((name, nameIndex) => (
              <div key={nameIndex} className="flex gap-2 mb-2">
                <input
                  value={name}
                  onChange={(e) =>
                    handleMemberNameChange(
                      groupIndex,
                      nameIndex,
                      e.target.value,
                    )
                  }
                  placeholder="Member Name"
                  className="border p-2 w-full rounded"
                />

                <button
                  onClick={() => removeMember(groupIndex, nameIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded"
                >
                  X
                </button>
              </div>
            ))}

            <button
              onClick={() => addMember(groupIndex)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              Add Member
            </button>
          </div>
        ))}

        <button
          onClick={addMasjidGroup}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mb-6"
        >
          Add Masjid Group
        </button>

        <button
          onClick={update}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded"
        >
          Update Jammat
        </button>
      </div>
    </div>
  );
}

export default EditJammat;
