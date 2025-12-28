import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function ExperienceAdmin() {
  const toast = useToast?.();
  const push = (opts) => (toast?.pushToast ? toast.pushToast(opts) : alert(opts.message));

  const [experience, setExperience] = useState([]);
  const [form, setForm] = useState({ role: "", company: "", period: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get("/experience");
      const data = res.data?.data ?? res.data;
      setExperience(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch exp", err);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (!form.role || !form.company) return push({ type: "error", message: "Role & Company required" });
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/experience/${editId}`, form);
        push({ type: "success", message: "Updated" });
      } else {
        await axios.post("/experience", form);
        push({ type: "success", message: "Added" });
      }
      setForm({ role: "", company: "", period: "", description: "" });
      setEditId(null);
      await fetch();
    } catch (err) {
      console.error("save exp", err);
      push({ type: "error", message: "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await axios.delete(`/experience/${id}`);
      push({ type: "success", message: "Deleted" });
      await fetch();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Delete failed" });
    }
  };

  const handleEdit = (e) => {
    setEditId(e._id);
    setForm({ role: e.role || "", company: e.company || "", period: e.period || "", description: e.description || "" });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Experience</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <input placeholder="Role" className="p-2 border rounded mb-2 w-full" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
        <input placeholder="Company" className="p-2 border rounded mb-2 w-full" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
        <input placeholder="Period" className="p-2 border rounded mb-2 w-full" value={form.period} onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))} />
        <textarea placeholder="Description" className="p-2 border rounded mb-2 w-full" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded">{editId ? "Update" : "Add"}</button>
          <button onClick={() => { setForm({ role: "", company: "", period: "", description: "" }); setEditId(null); }} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>

      <div className="space-y-3">
        {experience.map((e) => (
          <div key={e._id} className="bg-gray-50 p-3 rounded flex justify-between items-start">
            <div>
              <div className="font-semibold">{e.role} @ {e.company}</div>
              <div className="text-sm">{e.period}</div>
              <div className="mt-2">{e.description}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(e)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(e._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
