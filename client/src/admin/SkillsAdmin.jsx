import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useToast } from "../context/ToastContext";

export default function SkillsAdmin() {
  const toastCtx = useToast?.();
  const push = (opts) =>
    toastCtx?.pushToast ? toastCtx.pushToast(opts) : alert(opts.message);

  const [skills, setSkills] = useState([]);
  // "isTop" field add kiya hai (default false)
  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "Intermediate",
    icon: "",
    isTop: false,
  });
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

  useEffect(() => {
    fetch();
  }, []);

  const reset = () => {
    setForm({
      name: "",
      category: "",
      level: "Intermediate",
      icon: "",
      isTop: false,
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category)
      return push({ type: "error", message: "Name & Category required" });
    setLoading(true);
    try {
      // API call karte waqt form data bheja jayega (isme ab isTop bhi hai)
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
      isTop: skill.isTop || false, // Edit karte waqt existing value set karein
    });
  };

  return (
    // Dark mode text color fix (text-gray-900 dark:text-white)
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Skills Management</h2>

      {/* Dark mode background fix (bg-white dark:bg-gray-800) */}
      <div className="bg-white dark:bg-gray-800 p-4 shadow rounded mb-6 transition-colors duration-200">
        <div className="grid md:grid-cols-4 gap-3">
          <input
            name="name"
            placeholder="Skill (e.g., React)"
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({ ...p, name: e.target.value }))
            }
            // Input styling for dark mode
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            name="category"
            placeholder="Category (e.g., Frontend)"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <select
            value={form.level}
            onChange={(e) =>
              setForm((p) => ({ ...p, level: e.target.value }))
            }
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input
            name="icon"
            placeholder="Icon URL (optional)"
            value={form.icon}
            onChange={(e) =>
              setForm((p) => ({ ...p, icon: e.target.value }))
            }
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* New Feature: Top Skill Checkbox */}
        <div className="mt-4 flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isTop}
              onChange={(e) =>
                setForm((p) => ({ ...p, isTop: e.target.checked }))
              }
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm font-medium">Top Skill (Show on Home)</span>
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? "Saving..." : editId ? "Update Skill" : "Add Skill"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {skills.map((s) => (
          // List item styling for dark mode (bg-gray-50 dark:bg-gray-700)
          <div
            key={s._id}
            className="bg-gray-50 dark:bg-gray-700 p-3 rounded flex justify-between items-center shadow-sm"
          >
            <div>
              <div className="font-bold flex items-center gap-2">
                {s.name}
                <span className="text-sm text-gray-600 dark:text-gray-300 font-normal">
                  ({s.level})
                </span>
                {/* Top Badge */}
                {s.isTop && (
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-2 py-0.5 rounded-full border border-yellow-200 dark:border-yellow-800">
                    ⭐ Top
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Category: {s.category}
              </div>
              {s.icon && (
                <img
                  src={s.icon}
                  alt={s.name}
                  className="w-8 h-8 mt-1 object-contain"
                />
              )}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(s)}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}