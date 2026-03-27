import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Navbar";
import { Github, Linkedin, Twitter, Mail, MapPin, Heart, Zap } from "lucide-react";

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
      {children}
    </Link>
  </li>
);

const Layout = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 mt-auto bg-slate-900/50 backdrop-blur-2xl border-t border-white/10 overflow-hidden">
  
  {/* Abstract Background Glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-500/10 blur-[100px] pointer-events-none" />

  {/* Top glow line */}
  <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)" }} />

  <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

      {/* Brand Section */}
      <div className="lg:col-span-2 flex flex-col items-start">
        <Link to="/" className="group inline-flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20 transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #d946ef)" }}>
            BS
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-100 group-hover:text-white transition-colors">
            Bikash<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Dev</span>
          </span>
        </Link>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-8">
          Crafting high-performance web applications with modern architectures. Transforming ideas into elegant, scalable digital experiences.
        </p>
        
        {/* Social Icons */}
        <div className="flex gap-4">
          {[
            { icon: Github, href: "https://github.com/Biku4321", title: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/bikash-samanta-15a06428a", title: "LinkedIn" },
            { icon: Twitter, href: "https://x.com/BikashS22604480", title: "Twitter" },
            { icon: Mail, href: "mailto:samantabikash83939@gmail.com", title: "Email" },
          ].map(({ icon: Icon, href, title }) => (
            <a key={title} href={href} target="_blank" rel="noreferrer" title={title}
              className="group relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 overflow-hidden transition-all duration-300 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-4 h-4 relative z-10" />
            </a>
          ))}
        </div>
      </div>

      {/* Navigation (2-Column Layout for modern feel) */}
      <div>
        <p className="text-sm font-semibold text-slate-100 tracking-wider mb-6">Explore</p>
        <ul className="grid grid-cols-2 gap-y-3 gap-x-4">
          {["About", "Skills", "Education", "Projects", "Hackathons", "Experience", "Certificate", "Blogs", "Contact"].map((item) => (
             <li key={item}>
               {/* Note: Yahan aapna <FooterLink> use kar sakte hain agar usme specific logic hai */}
               <Link to={`/${item.toLowerCase()}`} className="text-sm text-slate-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                 <span className="w-1.5 h-1.5 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all duration-300" />
                 {item}
               </Link>
             </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <p className="text-sm font-semibold text-slate-100 tracking-wider mb-6">Connect</p>
        <ul className="space-y-4">
          <li>
            <a href="mailto:samantabikash83939@gmail.com" className="group flex items-start gap-3 text-sm text-slate-400 hover:text-slate-200 transition-colors break-all">
              <div className="mt-0.5 p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-colors">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="mt-1.5">samantabikash83939<br/>@gmail.com</span>
            </a>
          </li>
          <li className="flex items-center gap-3 text-sm text-slate-400">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="mt-0.5">Silchar, Assam, India</span>
          </li>
          <li className="pt-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Available for work</span>
            </div>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-xs text-slate-500 flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
        <p>© 2026 Bikash Samanta. All rights reserved.</p>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-700" />
        <p className="flex items-center gap-1.5">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> using React
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Powered by MERN & Vercel</span>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Layout;