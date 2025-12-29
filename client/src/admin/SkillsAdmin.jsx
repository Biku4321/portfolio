import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function SkillsAdmin() {
  const toastCtx = useToast?.();
  const push = (opts) => (toastCtx?.pushToast ? toastCtx.pushToast(opts) : alert(opts.message));

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", level: "Intermediate", icon: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      const res = await axiosInstance.get("/skills");
      const data = res.data?.data ?? res.data;
      setSkills(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetch skills", err);
    }
  };

  useEffect(() => { fetch(); }, []);

  const reset = () => {
    setForm({ name: "", category: "", level: "Intermediate", icon: "" });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category) return push({ type: "error", message: "Name & Category required" });
    setLoading(true);
    try {
      if (editId) {
        await axiosInstance.put(`/skills/${editId}`, form);
        push({ type: "success", message: "Skill updated" });
      } else {
        await axiosInstance.post("/skills", form);
        push({ type: "success", message: "Skill added" });
      }
      reset();
      await fetch();
    } catch (err) {
      console.error("save skill", err);
      push({ type: "error", message: "Save failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await axiosInstance.delete(`/skills/${id}`);
      push({ type: "success", message: "Deleted" });
      fetch();
    } catch (err) {
      console.error(err);
      push({ type: "error", message: "Delete failed" });
    }
  };

  const handleEdit = (skill) => {
    setEditId(skill._id);
    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "Intermediate",
      icon: skill.icon || "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Skills Management</h2>

      <div className="bg-white p-4 shadow rounded mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <input name="name" placeholder="Skill (e.g., React)" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="p-2 border rounded" />
          <input name="category" placeholder="Category (e.g., Frontend)" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="p-2 border rounded" />
          <select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))} className="p-2 border rounded">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input name="icon" placeholder="Icon URL (optional)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} className="p-2 border rounded" />
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update" : "Add"}
          </button>
          <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </div>

      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s._id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-bold">{s.name} <span className="text-sm text-gray-600">({s.level})</span></div>
              <div className="text-sm">Category: {s.category}</div>
              {s.icon && <img src={s.icon} alt={s.name} className="w-8 h-8 mt-1" />}
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(s)} className="text-blue-500">Edit</button>
              <button onClick={() => handleDelete(s._id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
