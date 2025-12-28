import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  Code,
  FileBadge,
  User,
} from "lucide-react";

const stats = [
  { name: "About", icon: User, color: "bg-blue-100 text-blue-600", value: "Edit", path: "/admin/about" },
  { name: "Skills", icon: Code, color: "bg-green-100 text-green-600", value: "12+", path: "/admin/skills" },
  { name: "Projects", icon: BarChart3, color: "bg-purple-100 text-purple-600", value: "6", path: "/admin/projects" },
  { name: "Experience", icon: Briefcase, color: "bg-orange-100 text-orange-600", value: "3", path: "/admin/experience" },
  { name: "Certificates", icon: FileBadge, color: "bg-pink-100 text-pink-600", value: "8", path: "/admin/certificates" },
  { name: "Education", icon: BookOpen, color: "bg-indigo-100 text-indigo-600", value: "2", path: "/admin/education" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Overview and quick actions for your portfolio content.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(s.path)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${s.color} mb-3`}
            >
              <s.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {s.value}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent card click
                  navigate(s.path);
                }}
                className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-sm"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity + Quick Links */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2">
            <li>✅ Added a new project "Portfolio Website"</li>
            <li>🎓 Updated education details</li>
            <li>🏆 Uploaded new certificate "React Advanced"</li>
            <li>✏️ Edited About Me section</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/admin/projects")}
              className="py-2 px-3 bg-indigo-600 text-white rounded-lg"
            >
              Create Project
            </button>
            <button
              onClick={() => navigate("/admin/skills")}
              className="py-2 px-3 bg-green-600 text-white rounded-lg"
            >
              Add Skill
            </button>
            <button
              onClick={() => navigate("/admin/certificates")}
              className="py-2 px-3 bg-yellow-500 text-white rounded-lg"
            >
              Upload Certificate
            </button>
            <button
              onClick={() => navigate("/admin/about")}
              className="py-2 px-3 bg-red-500 text-white rounded-lg"
            >
              Edit About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
