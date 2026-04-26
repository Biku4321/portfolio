import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Github, Linkedin, Twitter, Mail, MapPin, Heart, Zap } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef    = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600, mass: 0.1 });

  useEffect(() => {
    const move = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    const down = () => setClicked(true);
    const up   = () => setClicked(false);
    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor-hover]")) setHovered(true);
      else setHovered(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        ref={cursorRef}
        style={{
          position: "fixed", left: springX, top: springY,
          pointerEvents: "none", zIndex: 9999,
          width: hovered ? 56 : 36, height: hovered ? 56 : 36,
          border: `2px solid ${hovered ? "#7c5cfc" : "rgba(124,92,252,0.6)"}`,
          borderRadius: "50%", translateX: "-50%", translateY: "-50%",
          transition: "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          background: hovered ? "rgba(124,92,252,0.08)" : "transparent",
          backdropFilter: hovered ? "blur(2px)" : "none",
          boxShadow: hovered ? "0 0 20px rgba(124,92,252,0.3)" : "none",
        }}
      />
      <motion.div
        ref={dotRef}
        style={{
          position: "fixed", left: dotX, top: dotY,
          pointerEvents: "none", zIndex: 9999,
          width: clicked ? 6 : 4, height: clicked ? 6 : 4,
          background: "#7c5cfc", borderRadius: "50%",
          translateX: "-50%", translateY: "-50%",
          transition: "width 0.1s, height 0.1s",
          boxShadow: "0 0 8px rgba(124,92,252,0.8)",
        }}
      />
    </>
  );
};

const Layout = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a14] transition-colors duration-500" style={{ cursor: "none" }}>

      {/* Custom cursor — placed here so it works across the entire app */}
      <CustomCursor />

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-auto bg-white/60 dark:bg-[#0a0a14]/80 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-500">
        
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] pointer-events-none" />

        {/* Top glow line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)" }} />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand Section */}
            <div className="lg:col-span-2 flex flex-col items-start">
              <Link to="/" className="group inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #d946ef)" }}>
                  BS
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-slate-100 transition-colors">
                  Bikash<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500 dark:from-purple-400 dark:to-fuchsia-400">Dev</span>
                </span>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mb-8 transition-colors">
                Crafting high-performance web applications with modern architectures. Transforming ideas into elegant, scalable digital experiences.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-4">
                {[
                  { icon: Github,   href: "https://github.com/Biku4321",                             title: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/bikash-samanta-15a06428a",    title: "LinkedIn" },
                  { icon: Twitter,  href: "https://x.com/BikashS22604480",                          title: "Twitter" },
                  { icon: Mail,     href: "mailto:samantabikash83939@gmail.com",                     title: "Email" },
                ].map(({ icon: Icon, href, title }) => (
                  <a key={title} href={href} target="_blank" rel="noreferrer" title={title}
                    className="group relative w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 overflow-hidden transition-all duration-300 hover:text-purple-600 dark:hover:text-white hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 dark:from-purple-500/20 dark:to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Icon className="w-4 h-4 relative z-10" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider mb-6 uppercase transition-colors">Explore</p>
              <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
                {["About", "Skills", "Education", "Projects", "Hackathons", "Experience", "Certificate", "Contact"].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.toLowerCase()}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-purple-500/0 group-hover:bg-purple-500 transition-all duration-300" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-wider mb-6 uppercase transition-colors">Connect</p>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:samantabikash83939@gmail.com" className="group flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-slate-200 transition-colors break-all">
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:border-purple-300 dark:group-hover:border-purple-500/30 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <span className="mt-1.5">samantabikash83939<br/>@gmail.com</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  </div>
                  <span className="mt-0.5">Silchar, Assam, India</span>
                </li>
                <li className="pt-4">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Available for work</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
            <div className="text-xs text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
              <p>© 2026 Bikash Samanta. All rights reserved.</p>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <p className="flex items-center gap-1.5">
                Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> using React
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 transition-colors">
              <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>Powered by MERN & Vercel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;