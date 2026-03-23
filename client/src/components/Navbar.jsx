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
    { name: "Experience", path: "/experience" },
    { name: "Hackthons",   path: "/hackathons" },
    { name: "Certificates", path: "/certificates" },
    { name: "Blogs",        path: "/blogs" },
    { name: "Contact",      path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-gray-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm font-display"
                style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}>
                BS
              </div>
              <span className="font-display font-bold text-gray-100 hidden sm:block">
                Bikash<span style={{ color: "#c084fc" }}>Dev</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-purple-400"
                      : "text-gray-400 hover:text-gray-100"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg -z-10"
                      style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.2)" }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="ml-2 p-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
                title="Admin"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4 text-amber-400" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4 text-purple-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                className="lg:hidden p-2 rounded-xl text-gray-300"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 lg:hidden flex flex-col"
              style={{ background: "#0f0f1a", borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <span className="font-display font-bold text-gray-100">Menu</span>
                <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col p-4 gap-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                          : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t mt-4 pt-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <Link to="/admin/login" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
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
