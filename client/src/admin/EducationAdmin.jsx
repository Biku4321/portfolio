import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const EducationAdmin = () => {
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
  });
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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
    setFormData({
      degree: item.degree,
      institution: item.institution,
      year: item.year,
    });
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

  const inputClass =
    "border p-2 w-full rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h2 className="text-xl font-bold mb-4">
        {editId ? "Edit" : "Add"} Education
      </h2>
      <div className="space-y-2 mb-6 bg-white dark:bg-gray-800 p-4 rounded shadow transition-colors">
        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Degree"
          className={inputClass}
        />
        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
          placeholder="Institution"
          className={inputClass}
        />
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          className={inputClass}
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>
      <div className="space-y-2">
        {educationList.map((edu) => (
          <div
            key={edu._id}
            className="bg-gray-100 dark:bg-gray-700 p-3 rounded flex justify-between items-center shadow-sm"
          >
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {edu.degree}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {edu.institution} - {edu.year}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(edu)}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(edu._id)}
                className="text-red-500 hover:text-red-400 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationAdmin;