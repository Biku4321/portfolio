import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, FileText, Linkedin, Github,
  Twitter, Facebook, Instagram, Briefcase, Users,
  Star, Layers, Settings, GitMerge, Server, Building2, Trophy,
  Download, ArrowRight, Sparkles,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
});

/* ── Stat card ── */
const StatCard = ({ icon, value, label, color, delay }) => (
  <motion.div {...fadeUp(delay)}
    className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: color }} />
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-1"
      style={{ background: `${color}18` }}>
      {icon}
    </div>
    <div>
      <p className="font-display text-2xl font-bold text-gray-100 leading-none">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  </motion.div>
);

/* ── Expertise chip group ── */
const ExpertiseGroup = ({ title, items, icon, color }) => (
  <motion.div {...fadeUp(0.1)}
    className="rounded-2xl p-6"
    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
    <h3 className="font-display font-semibold text-sm text-gray-300 mb-4 flex items-center gap-2 capitalize">
      <span style={{ color }}>{icon}</span> {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {items?.map((item, i) => (
        <span key={i} className="text-xs px-3 py-1 rounded-full font-medium"
          style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}>
          {item}
        </span>
      ))}
    </div>
  </motion.div>
);

/* ── Social icon button ── */
const SocialBtn = ({ href, icon: Icon, color, label }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" title={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 group"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Icon className="w-4 h-4 transition-colors" style={{ color }} />
    </a>
  ) : null;

/* ── Main component ── */
const PublicAbout = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance.get("/about")
      .then(res => setData(res.data?.data ?? res.data))
      .catch(console.error);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-gray-950 py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className={`skeleton rounded-2xl ${i === 0 ? "h-48" : "h-16"}`} />
        ))}
      </div>
    </div>
  );

  const resumeUrl = data.resumeLink?.startsWith("http:")
    ? data.resumeLink.replace("http:", "https:")
    : data.resumeLink;

  const expertiseConfig = [
    { key: "primary",       icon: <Star className="w-4 h-4" />,     color: "#c084fc", title: "Primary Skills" },
    { key: "secondary",     icon: <Layers className="w-4 h-4" />,   color: "#60a5fa", title: "Secondary Skills" },
    { key: "tools",         icon: <Settings className="w-4 h-4" />, color: "#94a3b8", title: "Tools" },
    { key: "methodologies", icon: <GitMerge className="w-4 h-4" />, color: "#06d6a0", title: "Methodologies" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-white/5"
        style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.08) 0%, rgba(9,9,15,0) 60%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(124,92,252,0.12), transparent 60%)" }} />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-center md:items-start gap-10">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-3xl overflow-hidden"
                style={{ border: "2px solid rgba(124,92,252,0.35)", boxShadow: "0 0 40px rgba(124,92,252,0.2)" }}>
                {data.profileImage ? (
                  <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: "rgba(124,92,252,0.1)" }}>
                    <span className="font-display text-5xl font-bold grad-text">{data.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-gray-950"
                style={{ boxShadow: "0 0 10px #06d6a0" }} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs text-purple-400 mb-4"
                style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)" }}>
                <Sparkles className="w-3 h-3" /> Portfolio
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-100 leading-none tracking-tight">
                {data.name}
              </h1>
              {data.title && (
                <p className="text-xl text-purple-400 font-medium mt-3">{data.title}</p>
              )}
              {data.tagline && (
                <p className="text-gray-500 mt-2 italic text-lg max-w-xl">"{data.tagline}"</p>
              )}

              {/* Contact chips */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                {data.email && (
                  <a href={`mailto:${data.email}`}
                    className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-purple-400 transition-colors px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Mail className="w-3.5 h-3.5" /> {data.email}
                  </a>
                )}
                {data.location && (
                  <span className="inline-flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <MapPin className="w-3.5 h-3.5" /> {data.location}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2.5 px-5">
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                )}
                <a href="/contact" className="btn-outline text-sm py-2.5 px-5">
                  <Mail className="w-4 h-4" /> Hire Me <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-2.5 mt-5 justify-center md:justify-start">
                <SocialBtn href={data.linkedin}  icon={Linkedin}  color="#60a5fa" label="LinkedIn" />
                <SocialBtn href={data.github}    icon={Github}    color="#e5e7eb" label="GitHub" />
                <SocialBtn href={data.twitter}   icon={Twitter}   color="#38bdf8" label="Twitter" />
                <SocialBtn href={data.facebook}  icon={Facebook}  color="#818cf8" label="Facebook" />
                <SocialBtn href={data.instagram} icon={Instagram} color="#f472b6" label="Instagram" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">

        {/* Stats grid */}
        {data.experience && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Briefcase className="w-5 h-5" style={{ color: "#7c5cfc" }} />}
              value={data.experience.yearsOfExperience || "0"} label="Years Experience"
              color="#7c5cfc" delay={0} />
            <StatCard icon={<Server className="w-5 h-5" style={{ color: "#c084fc" }} />}
              value={data.experience.projectsCompleted || "0"} label="Projects Completed"
              color="#c084fc" delay={0.08} />
            <StatCard icon={<Building2 className="w-5 h-5" style={{ color: "#06d6a0" }} />}
              value={data.experience.companiesWorked || "0"} label="Companies Worked"
              color="#06d6a0" delay={0.16} />
            <StatCard icon={<Users className="w-5 h-5" style={{ color: "#f59e0b" }} />}
              value={data.experience.clientsSatisfied || "0"} label="Clients Satisfied"
              color="#f59e0b" delay={0.24} />
          </div>
        )}

        {/* Bio + contact sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {data.bio && (
              <motion.div {...fadeUp(0.05)}
                className="rounded-2xl p-7"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="font-display font-bold text-xl text-gray-100 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#7c5cfc" }} />
                  About Me
                </h2>
                <p className="text-gray-400 leading-relaxed text-base">{data.bio}</p>
              </motion.div>
            )}

            {data.objective && (
              <motion.div {...fadeUp(0.1)}
                className="rounded-2xl p-7"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="font-display font-bold text-xl text-gray-100 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#c084fc" }} />
                  Career Objective
                </h2>
                <p className="text-gray-400 leading-relaxed">{data.objective}</p>
              </motion.div>
            )}

            {data.achievements?.length > 0 && (
              <motion.div {...fadeUp(0.15)}
                className="rounded-2xl p-7"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="font-display font-bold text-xl text-gray-100 mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full inline-block" style={{ background: "#f59e0b" }} />
                  Key Achievements
                </h2>
                <ul className="space-y-4">
                  {data.achievements.map((ach, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
                        <Trophy className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200 text-sm">{ach.metric}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {ach.description} — {ach.project} ({ach.year})
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact card */}
            <motion.div {...fadeUp(0.05)}
              className="rounded-2xl p-6"
              style={{ background: "rgba(124,92,252,0.05)", border: "1px solid rgba(124,92,252,0.15)" }}>
              <h2 className="font-display font-bold text-base text-gray-100 mb-5">Contact</h2>
              <ul className="space-y-3.5">
                {data.email && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,92,252,0.1)" }}>
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <a href={`mailto:${data.email}`} className="text-gray-400 hover:text-purple-400 transition-colors break-all text-xs">
                      {data.email}
                    </a>
                  </li>
                )}
                {data.phone && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,92,252,0.1)" }}>
                      <Phone className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <a href={`tel:${data.phone}`} className="text-gray-400 hover:text-purple-400 transition-colors text-xs">
                      {data.phone}
                    </a>
                  </li>
                )}
                {data.location && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,92,252,0.1)" }}>
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-gray-400 text-xs">{data.location}</span>
                  </li>
                )}
              </ul>
            </motion.div>

            {/* Industries */}
            {data.industries?.length > 0 && (
              <motion.div {...fadeUp(0.1)}
                className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="font-display font-bold text-base text-gray-100 mb-4">Industries</h2>
                <div className="flex flex-wrap gap-2">
                  {data.industries.map((ind, i) => <span key={i} className="tag text-xs">{ind}</span>)}
                </div>
              </motion.div>
            )}

            {/* Availability */}
            <motion.div {...fadeUp(0.15)}
              className="rounded-2xl p-5 flex items-center gap-3"
              style={{ background: "rgba(6,214,160,0.05)", border: "1px solid rgba(6,214,160,0.18)" }}>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-200">Available for work</p>
                <p className="text-xs text-gray-500">Open to freelance & full-time</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expertise grid */}
        {data.expertise && (
          <div>
            <motion.div {...fadeUp()} className="mb-8 text-center">
              <p className="section-label">What I know</p>
              <h2 className="font-display text-4xl font-bold text-gray-100">
                My <span className="grad-text">Expertise</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {expertiseConfig.map(cfg => (
                data.expertise[cfg.key]?.length > 0 && (
                  <ExpertiseGroup key={cfg.key} title={cfg.title}
                    items={data.expertise[cfg.key]} icon={cfg.icon} color={cfg.color} />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAbout;
