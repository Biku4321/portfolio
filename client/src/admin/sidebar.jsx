import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode }  from "jwt-decode";


const Sidebar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // Decode token to extract email
const decoded = token ? jwtDecode(token) : null;


  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-indigo-600 hover:text-white ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-700"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-800 border-r shadow-sm p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-indigo-700 dark:text-white mb-6">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClasses}>Dashboard</NavLink>
          <NavLink to="/admin/education" className={linkClasses}>Education</NavLink>
          <NavLink to="/admin/about" className={linkClasses}>About</NavLink>
          <NavLink to="/admin/skills" className={linkClasses}>Skills</NavLink>
          <NavLink to="/admin/certificates" className={linkClasses}>Certificates</NavLink>
          <NavLink to="/admin/experience" className={linkClasses}>Experience</NavLink>
          <NavLink to="/admin/projects" className={linkClasses}>Projects</NavLink>
        </nav>
      </div>

      <div className="mt-6 pt-4 border-t text-sm text-gray-500 dark:text-gray-300">
        <p className="mb-2">
          Logged in as:
          <br />
          <span className="font-semibold text-indigo-700 dark:text-white">
            {decoded?.email || "Admin"}
          </span>
        </p>
        <button onClick={handleLogout} className="w-full text-left text-red-600 hover:text-white hover:bg-red-500 px-4 py-2 rounded transition">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
