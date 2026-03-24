import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    { name: "Blogs",        path: "/blogs" },
    { name: "Contact",      path: "/contact" },
  ];

  const isActive = path => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  /* ── Dynamic nav background based on dark/light mode ── */
  const navBg = scrolled
    ? darkMode
      ? "rgba(9,9,15,0.9)"
      : "rgba(255,255,255,0.92)"
    : "transparent";

  const navBorder = scrolled
    ? darkMode
      ? "rgba(255,255,255,0.06)"
      : "rgba(124,92,252,0.12)"
    : "transparent";

  const linkColor        = darkMode ? "#9090b0" : "#4b4b6b";
  const linkActiveColor  = darkMode ? "#c084fc"  : "#7c5cfc";
  const linkActiveBg     = darkMode ? "rgba(124,92,252,0.12)" : "rgba(124,92,252,0.08)";
  const logoTextColor    = darkMode ? "#f0effa"  : "#1a1a2e";
  const controlBg        = darkMode ? "rgba(255,255,255,0.05)"  : "rgba(124,92,252,0.06)";
  const controlBorder    = darkMode ? "rgba(255,255,255,0.08)"  : "rgba(124,92,252,0.15)";
  const drawerBg         = darkMode ? "#0f0f1a"  : "#ffffff";
  const drawerBorder     = darkMode ? "rgba(255,255,255,0.08)"  : "rgba(124,92,252,0.12)";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg, borderBottom: `1px solid ${navBorder}`,
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold font-display"
                style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}>
                BS
              </div>
              <span className="font-display font-bold text-base hidden sm:block"
                style={{ color: logoTextColor }}>
                Bikash<span style={{ color: "#c084fc" }}>Dev</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.8rem",
                    fontWeight: isActive(link.path) ? 500 : 400,
                    color: isActive(link.path) ? linkActiveColor : linkColor,
                    background: isActive(link.path) ? linkActiveBg : "transparent",
                    transition: "color 0.2s, background 0.2s",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!isActive(link.path)) { e.target.style.color = logoTextColor; } }}
                  onMouseLeave={e => { if (!isActive(link.path)) { e.target.style.color = linkColor; } }}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/admin/login" style={{ marginLeft: "0.25rem", padding: "0.4rem 0.6rem", borderRadius: "0.5rem", color: linkColor, transition: "color 0.2s", textDecoration: "none" }}
                title="Admin" onMouseEnter={e => e.currentTarget.style.color = logoTextColor}
                onMouseLeave={e => e.currentTarget.style.color = linkColor}>
                <Settings className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* ✅ Dark/Light toggle — fully working */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{
                  width: "36px", height: "36px", borderRadius: "0.75rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: controlBg, border: `1px solid ${controlBorder}`,
                  cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div key="sun"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4" style={{ color: "#f59e0b" }} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4" style={{ color: "#7c5cfc" }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                className="xl:hidden"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  width: "36px", height: "36px", borderRadius: "0.75rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: controlBg, border: `1px solid ${controlBorder}`,
                  cursor: "pointer",
                }}
              >
                {isOpen
                  ? <X className="w-5 h-5" style={{ color: linkColor }} />
                  : <Menu className="w-5 h-5" style={{ color: linkColor }} />
                }
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
                width: "280px", display: "flex", flexDirection: "column",
                background: drawerBg, borderLeft: `1px solid ${drawerBorder}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem", borderBottom: `1px solid ${drawerBorder}` }}>
                <span className="font-display font-bold" style={{ color: logoTextColor }}>Menu</span>
                <button onClick={() => setIsOpen(false)} style={{ color: linkColor, background: "none", border: "none", cursor: "pointer" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto", flex: 1 }}>
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={link.path} onClick={() => setIsOpen(false)} style={{
                      display: "block", padding: "0.65rem 0.875rem", borderRadius: "0.75rem",
                      fontSize: "0.875rem", fontWeight: isActive(link.path) ? 500 : 400,
                      color: isActive(link.path) ? linkActiveColor : linkColor,
                      background: isActive(link.path) ? linkActiveBg : "transparent",
                      textDecoration: "none", transition: "all 0.15s",
                    }}>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: `1px solid ${drawerBorder}` }}>
                  <Link to="/admin/login" onClick={() => setIsOpen(false)} style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.65rem 0.875rem", borderRadius: "0.75rem",
                    fontSize: "0.875rem", color: linkColor, textDecoration: "none",
                  }}>
                    <Settings className="w-4 h-4" /> Admin Panel
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
