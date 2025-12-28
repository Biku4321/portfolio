import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";

// Public pages
import Home from "./pages/Home";
import About from "./pages/PublicAbout.jsx"; // Changed
import Certificates from "./pages/Certificate";
import Skills from "./pages/Skills";
// import Education from "./pages/Education";
import Education from "./pages/PublicEducation.jsx";
import Projects from "./pages/PublicProjects.jsx"; // Changed
import Experience from "./pages/PublicExperience.jsx";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminDebug from "./pages/AdminDebug";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./admin/ProtectedRoute";
import ProjectsAdmin from "./admin/ProjectsAdmin";
import ExperienceAdmin from "./admin/ExperienceAdmin";
import EducationAdmin from "./admin/EducationAdmin";
import SkillsAdmin from "./admin/SkillsAdmin";
import CertificatesAdmin from "./admin/CertificatesAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import AboutAdmin from "./admin/AboutAdmin";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/education" element={<Education />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="experience" element={<ExperienceAdmin />} />
            <Route path="education" element={<EducationAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="certificates" element={<CertificatesAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
          </Route>

          <Route path="/admin/debug" element={<AdminDebug />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
