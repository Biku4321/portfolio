// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";
// import {
//   LayoutDashboard, GraduationCap, User, Zap, Award,
//   Briefcase, FolderOpen, BookOpen, LogOut, ExternalLink,
// } from "lucide-react";

// const navItems = [
//   { to: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
//   { to: "/admin/about",       label: "About",       icon: User },
//   { to: "/admin/education",   label: "Education",   icon: GraduationCap },
//   { to: "/admin/skills",      label: "Skills",      icon: Zap },
//   { to: "/admin/certificates",label: "Certificates",icon: Award },
//   { to: "/admin/experience",  label: "Experience",  icon: Briefcase },
//   { to: "/admin/projects",    label: "Projects",    icon: FolderOpen },
//   { to: "/admin/blogs",       label: "Blogs",       icon: BookOpen },
// ];

// const Sidebar = () => {
//   const { token, logout } = useAuth();
//   const navigate = useNavigate();
//   const decoded  = token ? jwtDecode(token) : null;

//   const handleLogout = () => { logout(); navigate("/admin/login"); };

//   return (
//     <aside
//       className="w-60 h-screen flex flex-col flex-shrink-0"
//       style={{ background: "#0a0a14", borderRight: "1px solid rgba(255,255,255,0.06)" }}
//     >
//       {/* Logo */}
//       <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
//         <div className="flex items-center gap-2.5">
//           <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold font-display"
//             style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}>
//             BS
//           </div>
//           <div>
//             <p className="font-display font-bold text-sm text-gray-100">Admin Panel</p>
//             <p className="text-xs text-gray-600">Portfolio Manager</p>
//           </div>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
//         {navItems.map(({ to, label, icon: Icon }) => (
//           <NavLink
//             key={to} to={to}
//             className={({ isActive }) =>
//               `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 isActive
//                   ? "text-purple-300 bg-purple-500/10 border border-purple-500/20"
//                   : "text-gray-500 hover:text-gray-200 hover:bg-white/4"
//               }`
//             }
//           >
//             <Icon className="w-4 h-4 flex-shrink-0" />
//             {label}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
//         {/* View site */}
//         <a href="/" target="_blank" rel="noreferrer"
//           className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-200 hover:bg-white/4 transition-all">
//           <ExternalLink className="w-3.5 h-3.5" /> View Site
//         </a>

//         {/* User */}
//         <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
//           <p className="text-xs text-gray-600 mb-0.5">Logged in as</p>
//           <p className="text-xs font-medium text-gray-300 truncate">{decoded?.email || "Admin"}</p>
//         </div>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
//         >
//           <LogOut className="w-4 h-4" /> Logout
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard, GraduationCap, User, Zap, Award,
  Briefcase, FolderOpen, BookOpen, LogOut, ExternalLink, Trophy,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { to: "/admin/about",        label: "About",        icon: User },
  { to: "/admin/education",    label: "Education",    icon: GraduationCap },
  { to: "/admin/skills",       label: "Skills",       icon: Zap },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/experience",   label: "Experience",   icon: Briefcase },
  { to: "/admin/projects",     label: "Projects",     icon: FolderOpen },
  { to: "/admin/hackathons",   label: "Hackathons",   icon: Trophy },
  { to: "/admin/blogs",        label: "Blogs",        icon: BookOpen },
];

const Sidebar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const decoded  = token ? jwtDecode(token) : null;
  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <aside className="w-60 h-screen flex flex-col flex-shrink-0"
      style={{ background: "#0a0a14", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold font-display"
            style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}>BS</div>
          <div>
            <p className="font-display font-bold text-sm text-gray-100">Admin Panel</p>
            <p className="text-xs text-gray-600">Portfolio Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "text-purple-300 bg-purple-500/10 border border-purple-500/20"
                  : "text-gray-500 hover:text-gray-200 hover:bg-white/4"
              }`}>
            <Icon className="w-4 h-4 flex-shrink-0" />{label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <a href="/" target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-gray-200 hover:bg-white/4 transition-all">
          <ExternalLink className="w-3.5 h-3.5" /> View Site
        </a>
        <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-gray-600 mb-0.5">Logged in as</p>
          <p className="text-xs font-medium text-gray-300 truncate">{decoded?.email || "Admin"}</p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-500/20 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
