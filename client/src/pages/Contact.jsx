import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, Loader2,
  Github, Linkedin, Twitter, CheckCircle2,
  Sparkles, ArrowRight, ExternalLink
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Helmet } from "react-helmet-async";

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
      <motion.div ref={cursorRef} style={{ position:"fixed", left:springX, top:springY, pointerEvents:"none", zIndex:9999, width:hovered?56:36, height:hovered?56:36, border:`2px solid ${hovered?"#7c5cfc":"rgba(124,92,252,0.6)"}`, borderRadius:"50%", translateX:"-50%", translateY:"-50%", transition:"width 0.25s ease, height 0.25s ease, border-color 0.25s ease", background:hovered?"rgba(124,92,252,0.08)":"transparent", backdropFilter:hovered?"blur(2px)":"none", boxShadow:hovered?"0 0 20px rgba(124,92,252,0.3)":"none" }} />
      <motion.div ref={dotRef}    style={{ position:"fixed", left:dotX,    top:dotY,    pointerEvents:"none", zIndex:9999, width:clicked?6:4, height:clicked?6:4, background:"#7c5cfc", borderRadius:"50%", translateX:"-50%", translateY:"-50%", transition:"width 0.1s, height 0.1s", boxShadow:"0 0 8px rgba(124,92,252,0.8)" }} />
    </>
  );
};

// ── Magnetic button wrapper ──────────────────────────────────────────────────
const Magnetic = ({ children, strength = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e) => {
    const el   = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width  / 2) * strength);
    y.set((e.clientY - rect.top  - rect.height / 2) * strength);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  );
};

// ── Floating particles ───────────────────────────────────────────────────────
const Particles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blob"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
        style={{
          width:  3 + (i % 3),
          height: 3 + (i % 3),
          left:  `${(i * 17 + 5) % 95}%`,
          top:   `${(i * 23 + 10) % 85}%`,
          background: i % 3 === 0 ? "#7c5cfc" : i % 3 === 1 ? "#c084fc" : "#06d6a0",
          filter: "blur(0.5px)",
          opacity: 0.4,
        }}
      />
    ))}
    {/* Big ambient orbs */}
    <div className="blob" style={{ position:"absolute", top:-80, right:-80, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,92,252,0.12),transparent 70%)", filter:"blur(70px)" }} />
    <div className="blob blob-delay" style={{ position:"absolute", bottom:-60, left:-60, width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,214,160,0.08),transparent 70%)", filter:"blur(70px)" }} />
  </div>
);

// ── Contact info row ─────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, href, delay }) => (
  <motion.a
    href={href || undefined}
    target={href?.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300"
    style={{
      background: "var(--glass-bg)",
      border: "1px solid var(--glass-border)",
      textDecoration: "none",
      cursor: href ? "pointer" : "default",
    }}
    whileHover={href ? { x: 6, scale: 1.01 } : {}}
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
      style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)" }}>
      <Icon className="w-5 h-5 text-purple-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm font-medium truncate transition-colors duration-200 group-hover:text-purple-400"
        style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
    {href && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 text-purple-400" />}
  </motion.a>
);

// ── Social button ────────────────────────────────────────────────────────────
const SocialBtn = ({ icon: Icon, href, label, color }) => (
  <Magnetic strength={0.4}>
    <a href={href} target="_blank" rel="noreferrer" title={label}
      className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group overflow-hidden"
      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{ background: `${color}18` }} />
      <Icon className="w-4 h-4 relative z-10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
        style={{ color: "var(--text-secondary)" }}
        onMouseEnter={e => e.currentTarget.style.color = color}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
      />
    </a>
  </Magnetic>
);

// ── Input field ──────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-xs mt-1.5 font-medium" style={{ color: "#f43f5e" }}>
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ── Main ─────────────────────────────────────────────────────────────────────
const Contact = () => {
  const formRef = useRef();
  const toast   = useToast?.();
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [formData, setFormData] = useState({ user_name: "", user_email: "", subject: "", message: "" });
  const [errors, setErrors]     = useState({});
  const [focusedField, setFocused] = useState(null);

  const socials = [
    { icon: Github,   href: "https://github.com/Biku4321",                             label: "GitHub",   color: "#e2e8f0" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/bikash-samanta-15a06428a",    label: "LinkedIn", color: "#3b82f6" },
    { icon: Twitter,  href: "https://x.com/BikashS22604480",                          label: "Twitter",  color: "#0ea5e9" },
    { icon: Mail,     href: "mailto:samantabikash83939@gmail.com",                     label: "Email",    color: "#ec4899" },
  ];

  const validate = () => {
    const e = {};
    if (!formData.user_name.trim())  e.user_name  = "Name is required";
    if (!formData.user_email.trim()) e.user_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.user_email)) e.user_email = "Invalid email address";
    if (!formData.message.trim())    e.message    = "Message is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const sendEmail = e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    ).then(() => {
      setLoading(false); setSuccess(true);
      setFormData({ user_name: "", user_email: "", subject: "", message: "" });
      toast?.pushToast?.({ type: "success", message: "Message sent! I'll reply soon." });
      setTimeout(() => setSuccess(false), 6000);
    }, () => {
      setLoading(false);
      toast?.pushToast?.({ type: "error", message: "Failed to send. Please try again." });
    });
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "0.875rem",
    outline: "none",
    background: "var(--glass-bg)",
    border: `1px solid ${errors[name] ? "#f43f5e" : focusedField === name ? "rgba(124,92,252,0.6)" : "var(--glass-border)"}`,
    color: "var(--text-primary)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.875rem",
    boxShadow: focusedField === name ? "0 0 0 3px rgba(124,92,252,0.12)" : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <div className="min-h-screen py-24 px-6" style={{ background: "var(--bg-primary)", cursor: "none" }}>
      <Helmet>
        <title>Contact Me | Portfolio</title>
        <meta name="description" content="Get in touch for freelance projects or job opportunities." />
      </Helmet>

      {/* Custom cursor */}
      <CustomCursor />
      <Particles />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.25)", color: "#a78bfa" }}>
            <Sparkles className="w-3 h-3" /> Get in touch
          </motion.span>

          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            Let's{" "}
            <span className="grad-text relative">
              Connect
              {/* Animated underline */}
              <motion.span
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left rounded-full"
                style={{ background: "linear-gradient(90deg,#7c5cfc,#c084fc)" }}
              />
            </span>
          </h1>
          <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid lg:grid-cols-5 gap-8 mb-12">

          {/* Left panel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 flex flex-col gap-4">

            {/* Contact info cards */}
            <div className="glass rounded-2xl p-6 space-y-3">
              <h2 className="font-display font-bold text-lg mb-4" style={{ color: "var(--text-primary)" }}>Contact Info</h2>
              <InfoRow icon={Mail}   label="Email"    value="samantabikash83939@gmail.com" href="mailto:samantabikash83939@gmail.com" delay={0.2} />
              <InfoRow icon={Phone}  label="Phone"    value="+91 7810998349"               href="tel:+917810998349"                   delay={0.25} />
              <InfoRow icon={MapPin} label="Location" value="Silchar, Assam, India"                                                   delay={0.3} />
            </div>

            {/* Socials */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display font-bold text-base mb-4" style={{ color: "var(--text-primary)" }}>Find Me On</h2>
              <div className="flex gap-3">
                {socials.map(s => <SocialBtn key={s.href} {...s} />)}
              </div>
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="rounded-2xl p-5 flex items-center gap-4 overflow-hidden relative"
              style={{ background: "rgba(6,214,160,0.06)", border: "1px solid rgba(6,214,160,0.2)" }}>
              {/* Shimmer sweep */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg,transparent,rgba(6,214,160,0.08),transparent)", transform: "skewX(-20deg)" }}
              />
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#06d6a0" }}>Available for work</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Open to freelance & full-time roles</p>
              </div>
            </motion.div>

            {/* Response time */}
            <div className="glass rounded-2xl p-5 text-center">
              <p className="text-3xl font-display font-bold grad-text">&lt; 24h</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Typical response time</p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3">
            <div className="glass rounded-2xl p-8 h-full">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div key="success"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-12 text-center gap-5">
                    {/* Confetti-like checkmark */}
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(6,214,160,0.12)", border: "2px solid rgba(6,214,160,0.3)" }}>
                      <CheckCircle2 className="w-12 h-12" style={{ color: "#06d6a0" }} />
                    </motion.div>
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Message Sent!</h3>
                      <p style={{ color: "var(--text-secondary)" }}>Thanks for reaching out — I'll reply within 24 hours.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setSuccess(false)}
                      className="btn-outline text-sm">
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form key="form" ref={formRef} onSubmit={sendEmail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-5">
                    <h2 className="font-display font-bold text-xl mb-6" style={{ color: "var(--text-primary)" }}>
                      Send a Message
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Your Name" error={errors.user_name}>
                        <input type="text" name="user_name" value={formData.user_name} onChange={handleChange}
                          placeholder="John Doe"
                          onFocus={() => setFocused("user_name")} onBlur={() => setFocused(null)}
                          style={inputStyle("user_name")} />
                      </Field>
                      <Field label="Email Address" error={errors.user_email}>
                        <input type="email" name="user_email" value={formData.user_email} onChange={handleChange}
                          placeholder="john@example.com"
                          onFocus={() => setFocused("user_email")} onBlur={() => setFocused(null)}
                          style={inputStyle("user_email")} />
                      </Field>
                    </div>

                    <Field label="Subject" error={errors.subject}>
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange}
                        placeholder="Project inquiry / Collaboration..."
                        onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
                        style={inputStyle("subject")} />
                    </Field>

                    <Field label="Message" error={errors.message}>
                      <textarea name="message" rows={5} value={formData.message} onChange={handleChange}
                        placeholder="Tell me about your project or opportunity..."
                        onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                        style={{ ...inputStyle("message"), resize: "none" }} />
                    </Field>

                    <Magnetic strength={0.15}>
                      <motion.button
                        type="submit" disabled={loading}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="btn-primary w-full justify-center py-4 text-sm relative overflow-hidden group">
                        {/* Shimmer on hover */}
                        <motion.span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }}
                          animate={{ x: loading ? 0 : ["-100%","200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        />
                        {loading
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                          : <><Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Send Message</>
                        }
                      </motion.button>
                    </Magnetic>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom info cards ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid sm:grid-cols-3 gap-5">
          {[
            { emoji: "💬", title: "Let's Talk",       body: "Always open to discussing new projects, creative ideas, or opportunities to be part of your vision.", color: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.18)" },
            { emoji: "🚀", title: "Quick Response",   body: "I typically respond within 24 hours. Looking forward to hearing from you!", color: "rgba(6,214,160,0.06)", border: "rgba(6,214,160,0.18)" },
            { emoji: "🌍", title: "Remote Friendly",  body: "Available for remote work worldwide. Comfortable with async communication across time zones.", color: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.18)" },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="rounded-2xl p-7 text-center relative overflow-hidden group"
              style={{ background: c.color, border: `1px solid ${c.border}` }}>
              <motion.div
                animate={{ y: [0, -4, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl mb-4 select-none">
                {c.emoji}
              </motion.div>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;