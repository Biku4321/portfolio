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
      <footer className="relative z-10 border-t border-white/5 mt-auto">
        {/* Top glow line */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.4), rgba(192,132,252,0.4), transparent)" }} />

        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold font-display"
                  style={{ background: "linear-gradient(135deg, #7c5cfc, #c084fc)" }}>
                  BS
                </div>
                <span className="font-display font-bold text-gray-100">
                  Bikash<span style={{ color: "#c084fc" }}>Dev</span>
                </span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Full Stack Developer crafting high-performance web applications with React, Node.js, and modern cloud architectures.
              </p>
              <div className="flex gap-3 mt-5">
                {[
                  { icon: Github,   href: "https://github.com/Biku4321", title: "GitHub" },
                  { icon: Linkedin, href: "#",                           title: "LinkedIn" },
                  { icon: Twitter,  href: "#",                           title: "Twitter" },
                  { icon: Mail,     href: "mailto:samantabikash83939@gmail.com", title: "Email" },
                ].map(({ icon: Icon, href, title }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer" title={title}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-purple-400 transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Navigate</p>
              <ul className="space-y-2.5">
                <FooterLink to="/about">About</FooterLink>
                <FooterLink to="/skills">Skills</FooterLink>
                <FooterLink to="/projects">Projects</FooterLink>
                <FooterLink to="/hackathons">Hackathons</FooterLink>
                <FooterLink to="/experience">Experience</FooterLink>
                <FooterLink to="/blogs">Blogs</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Contact</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-xs text-gray-500">
                  <Mail className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <a href="mailto:samantabikash83939@gmail.com" className="hover:text-gray-300 transition-colors break-all">
                    samantabikash83939@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  Silchar, Assam, India
                </li>
                <li className="flex items-center gap-2 mt-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Available for work</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="text-xs text-gray-600 space-y-1">
                <p>© 2026 Bikash Samanta. Built with Antigravity</p>
                <p className="flex items-center justify-center sm:justify-start gap-1.5">
                  Crafted with <Heart className="w-3 h-3 text-purple-400 fill-purple-400" /> and lots of tokens
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Zap className="w-3 h-3 text-purple-400" />
                <span>React + Node.js + MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;