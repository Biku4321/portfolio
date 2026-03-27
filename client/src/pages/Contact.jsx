import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, Twitter, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Helmet } from "react-helmet-async";

const ContactInfoItem = ({ icon: Icon, label, value, href }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(124,92,252,0.12)", border: "1px solid rgba(124,92,252,0.2)" }}>
      <Icon className="w-5 h-5 text-purple-400" />
    </div>
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      {href ? <a href={href} className="text-sm text-gray-200 hover:text-purple-400 transition-colors">{value}</a>
             : <p className="text-sm text-gray-200">{value}</p>}
    </div>
  </motion.div>
);

const SocialBtn = ({ icon: Icon, href, color }) => (
  <a href={href} target="_blank" rel="noreferrer"
    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1"
    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color }}>
    <Icon className="w-4 h-4" />
  </a>
);

const Contact = () => {
  const formRef = useRef();
  const toast   = useToast?.();
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [formData, setFormData] = useState({ user_name: "", user_email: "", message: "" });
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!formData.user_name)  e.user_name  = "Name is required";
    if (!formData.user_email) e.user_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.user_email)) e.user_email = "Invalid email";
    if (!formData.message)    e.message    = "Message is required";
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
      setFormData({ user_name: "", user_email: "", message: "" });
      toast?.pushToast?.({ type: "success", message: "Message sent!" });
      setTimeout(() => setSuccess(false), 5000);
    }, () => { setLoading(false); toast?.pushToast?.({ type: "error", message: "Failed. Try again." }); });
  };

  const socials = [
    { icon: Github,   href: "https://github.com/Biku4321", color: "#e5e7eb" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/bikash-samanta-15a06428a",                           color: "#60a5fa" },
    { icon: Twitter,  href: "https://x.com/BikashS22604480",                           color: "#38bdf8" },
    { icon: Mail,     href: "mailto:samantabikash83939@gmail.com", color: "#f472b6" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <Helmet>
        <title>Contact Me | Portfolio</title>
        <meta name="description" content="Get in touch for freelance projects or job opportunities." />
      </Helmet>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="section-label">Get in touch</p>
          <h1 className="font-display text-5xl font-bold text-gray-100">Let's <span className="grad-text">Connect</span></h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">Have a project in mind or just want to say hello? I'd love to hear from you.</p>
        </motion.div>

        {/* Form + Info */}
        <div className="grid lg:grid-cols-5 gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5">
            <div className="glass rounded-2xl p-7 space-y-5">
              <h2 className="font-display font-bold text-lg text-gray-100">Contact Info</h2>
              <ContactInfoItem icon={Mail}   label="Email"    value="samantabikash83939@gmail.com" href="mailto:samantabikash83939@gmail.com" />
              <ContactInfoItem icon={Phone}  label="Phone"    value="+91 7810998349" href="tel:+917810998349" />
              <ContactInfoItem icon={MapPin} label="Location" value="Silchar, Assam, India" />
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display font-bold text-base text-gray-100 mb-4">Find me on</h2>
              <div className="flex gap-3">{socials.map(s => <SocialBtn key={s.href} {...s} />)}</div>
            </div>
            <div className="glass rounded-2xl p-5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-200">Available for work</p>
                <p className="text-xs text-gray-500">Open to freelance & full-time</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3">
            <div className="glass rounded-2xl p-8">
              {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-gray-100 mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Thanks for reaching out. I'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
                  <h2 className="font-display font-bold text-lg text-gray-100 mb-2">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2 font-medium tracking-wide">Your Name</label>
                      <input type="text" name="user_name" value={formData.user_name} onChange={handleChange}
                        placeholder="John Doe" className={`input-field ${errors.user_name ? "border-red-500/50" : ""}`} />
                      {errors.user_name && <p className="text-red-400 text-xs mt-1">{errors.user_name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2 font-medium tracking-wide">Email Address</label>
                      <input type="email" name="user_email" value={formData.user_email} onChange={handleChange}
                        placeholder="john@example.com" className={`input-field ${errors.user_email ? "border-red-500/50" : ""}`} />
                      {errors.user_email && <p className="text-red-400 text-xs mt-1">{errors.user_email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-medium tracking-wide">Message</label>
                    <textarea name="message" rows={5} value={formData.message} onChange={handleChange}
                      placeholder="Tell me about your project or opportunity..."
                      className={`input-field resize-none ${errors.message ? "border-red-500/50" : ""}`} />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Image 1 style info boxes ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }} className="grid sm:grid-cols-3 gap-4 mt-10">

          <div className="rounded-2xl p-7 text-center"
            style={{ background: "rgba(124,92,252,0.07)", border: "1px solid rgba(124,92,252,0.18)" }}>
            <div className="text-3xl mb-4">💬</div>
            <h3 className="font-display font-bold text-base text-gray-100 mb-2">Let's Talk</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </div>

          <div className="rounded-2xl p-7 text-center"
            style={{ background: "rgba(6,214,160,0.06)", border: "1px solid rgba(6,214,160,0.18)" }}>
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="font-display font-bold text-base text-gray-100 mb-2">Quick Response</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              I typically respond within 24 hours. Looking forward to hearing from you!
            </p>
          </div>

          <div className="rounded-2xl p-7 text-center"
            style={{ background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.18)" }}>
            <h3 className="font-display font-bold text-base text-gray-100 mb-5">Connect With Me</h3>
            <div className="flex justify-center gap-3">
              {socials.map(({ icon: Icon, href, color }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;