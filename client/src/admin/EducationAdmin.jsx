import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const EducationAdmin = () => {
  const [formData, setFormData] = useState({ degree: "", institution: "", year: "" });
  const [educationList, setEducationList] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchEducation = async () => {
    try {
      const res = await axiosInstance.get("/education");
      const data = res.data?.data ?? res.data;
      setEducationList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setEducationList([]);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axiosInstance.put(`/education/${editId}`, formData);
      } else {
        await axiosInstance.post("/education", formData);
      }
      setFormData({ degree: "", institution: "", year: "" });
      setEditId(null);
      fetchEducation();
    } catch (err) {
      console.error("Submit error:", err?.response?.data || err.message);
      alert("Failed to save. Are you authenticated?");
    }
  };

  const handleEdit = (item) => {
    setFormData({ degree: item.degree, institution: item.institution, year: item.year });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axiosInstance.delete(`/education/${id}`);
        fetchEducation();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{editId ? "Edit" : "Add"} Education</h2>
      <div className="space-y-2 mb-6">
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="Degree" className="border p-2 w-full" />
        <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="Institution" className="border p-2 w-full" />
        <input type="text" name="year" value={formData.year} onChange={handleChange} placeholder="Year" className="border p-2 w-full" />
        <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">
          {editId ? "Update" : "Add"}
        </button>
      </div>
      {educationList.map((edu) => (
        <div key={edu._id} className="bg-gray-100 p-3 rounded mb-2 flex justify-between">
          <div>
            <h4 className="font-bold">{edu.degree}</h4>
            <p>{edu.institution} - {edu.year}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => handleEdit(edu)} className="text-blue-500">Edit</button>
            <button onClick={() => handleDelete(edu._id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationAdmin;
