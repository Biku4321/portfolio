import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const navLinks = [
    { name: "Home",         path: "/" },
    { name: "About",        path: "/about" },
    { name: "Skills",       path: "/skills" },
    { name: "Education",    path: "/education" },
    { name: "Projects",     path: "/projects" },
    { name: "Hackathons",   path: "/hackathons" },
    { name: "Experience",   path: "/experience" },
    { name: "Certificates", path: "/certificates" },
    //{ name: "Blogs",        path: "/blogs" },
    { name: "Contact",      path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  /* Close drawer on route change */
  useEffect(() => { setIsOpen(false); }, [location]);

  /* Scroll + progress bar */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Magnetic link effect (from Navbar 1) */
  const handleMouseMove = (e) => {
    const el  = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.18;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const resetTransform = (e) => { e.currentTarget.style.transform = "translate(0,0)"; };

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div className="fixed top-0 left-0 w-full h-[2.5px] z-[60] pointer-events-none">
        <motion.div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3))",
            boxShadow: "0 0 10px rgba(124,92,252,0.8)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "dark:bg-[#09090f]/80 bg-white/80 backdrop-blur-2xl border-b dark:border-white/[0.06] border-purple-200/40 shadow-sm shadow-purple-500/5" : "bg-transparent"
        }`}
      >
        {/* Top ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[120px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(124,92,252,0.12) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group flex-shrink-0"
              style={{ textDecoration: "none" }}
            >
              {/* Animated logo mark */}
              <div className="relative w-9 h-9">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "conic-gradient(from 0deg, #7c5cfc, #c084fc, #06d6a0, #7c5cfc)",
                    filter: "blur(4px)",
                    borderRadius: "0.625rem",
                  }}
                />
                <div
                  className="relative w-full h-full rounded-xl flex items-center justify-center text-white text-sm font-bold font-display"
                  style={{ background: "linear-gradient(135deg,#7c5cfc,#c084fc)" }}
                >
                  BS
                </div>
              </div>
              <span
                className="font-display font-bold text-base hidden sm:block transition-colors duration-200"
                style={{ color: "var(--text-primary)" }}
              >
                Bikash<span style={{ color: "var(--accent2)" }}>Dev</span>
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translate(0,0)";
                      if (!active) e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                    className="relative px-3.5 py-2 text-[0.8rem] font-medium rounded-lg group transition-all duration-200"
                    style={{
                      textDecoration: "none",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                      background: active ? (darkMode ? "rgba(124,92,252,0.12)" : "rgba(124,92,252,0.08)") : "transparent",
                    }}
                  >
                    {/* Hover bg */}
                    {!active && (
                      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(124,92,252,0.05)" }} />
                    )}

                    {/* Active animated underline */}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{ background: darkMode ? "rgba(124,92,252,0.12)" : "rgba(124,92,252,0.08)" }}
                        transition={{ type: "spring", damping: 26, stiffness: 280 }}
                      />
                    )}

                    <span className="relative">{link.name}</span>

                    {/* Bottom accent dot for active */}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Admin icon - commented out */}
              {/* <Link
                to="/admin/login"
                title="Admin Panel"
                className="ml-1 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ color: "var(--text-muted)", textDecoration: "none" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
              >
                <Settings className="w-3.5 h-3.5" />
              </Link> */}
            </div>

            {/* ── Right controls ── */}
            <div className="flex items-center gap-2">

              {/* Dark / Light toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light" : "Switch to Dark"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(124,92,252,0.07)",
                  border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(124,92,252,0.18)",
                  cursor: "pointer",
                }}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0,   opacity: 1, scale: 1 }}
                      exit={{   rotate: 90,  opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.22 }}
                    >
                      <Sun className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90,  opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0,   opacity: 1, scale: 1 }}
                      exit={{   rotate: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.22 }}
                    >
                      <Moon className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile hamburger */}
              <motion.button
                className="xl:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(124,92,252,0.07)",
                  border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(124,92,252,0.18)",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                }}
              >
                <AnimatePresence mode="wait">
                  {isOpen
                    ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X    className="w-4 h-4" /></motion.div>
                    : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu className="w-4 h-4" /></motion.div>
                  }
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 40,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
              }}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0,      opacity: 1 }}
              exit={{   x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
                width: 280, display: "flex", flexDirection: "column",
                background: darkMode ? "#0f0f1a" : "#ffffff",
                borderLeft: darkMode ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(124,92,252,0.12)",
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(124,92,252,0.1)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#7c5cfc,#c084fc)" }}>
                    BS
                  </div>
                  <span className="font-display font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                    Bikash<span style={{ color: "var(--accent2)" }}>Dev</span>
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)}
                  style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Links */}
              <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
                {navLinks.map((link, i) => {
                  const active = isActive(link.path);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.035, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "0.6rem 0.875rem", borderRadius: "0.75rem", marginBottom: "2px",
                          fontSize: "0.875rem", fontWeight: active ? 600 : 400,
                          color: active ? "var(--accent)" : "var(--text-secondary)",
                          background: active
                            ? (darkMode ? "rgba(124,92,252,0.12)" : "rgba(124,92,252,0.07)")
                            : "transparent",
                          textDecoration: "none", transition: "all 0.15s",
                        }}
                      >
                        <span>{link.name}</span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "var(--accent)" }} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Drawer footer - commented out */}
              {/* <div style={{ padding: "0.75rem", borderTop: darkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(124,92,252,0.1)" }}>
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.6rem 0.875rem", borderRadius: "0.75rem",
                    fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  <Settings className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              </div> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;