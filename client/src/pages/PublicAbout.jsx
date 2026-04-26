import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Briefcase,
  Users,
  Star,
  Layers,
  Settings,
  GitMerge,
  Server,
  Building2,
  Trophy,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const CustomCursor = () => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });
  const dotX = useSpring(mouseX, { damping: 40, stiffness: 600, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 600, mass: 0.1 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    const over = (e) => {
      setHovered(!!e.target.closest("a, button, [data-cursor-hover]"));
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
      {/* Big ring */}
      <motion.div
        style={{
          position: "fixed",
          left: springX,
          top: springY,
          pointerEvents: "none",
          zIndex: 9999,
          width: hovered ? 56 : 36,
          height: hovered ? 56 : 36,
          border: `2px solid ${hovered ? "#7c5cfc" : "rgba(124,92,252,0.6)"}`,
          borderRadius: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.25s ease",
          background: hovered ? "rgba(124,92,252,0.08)" : "transparent",
          backdropFilter: hovered ? "blur(2px)" : "none",
          boxShadow: hovered ? "0 0 20px rgba(124,92,252,0.3)" : "none",
        }}
      />
      {/* Dot */}
      <motion.div
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          pointerEvents: "none",
          zIndex: 9999,
          width: clicked ? 6 : 4,
          height: clicked ? 6 : 4,
          background: "#7c5cfc",
          borderRadius: "50%",
          translateX: "-50%",
          translateY: "-50%",
          transition: "width 0.1s, height 0.1s",
          boxShadow: "0 0 8px rgba(124,92,252,0.8)",
        }}
      />
    </>
  );
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] },
});

/* ── Stat card ── */
const StatCard = ({ icon, value, label, accentClass, bgClass, delay }) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
  >
    <div
      className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${accentClass}`}
    />
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-1 ${bgClass}`}
    >
      {icon}
    </div>
    <div>
      <p className="font-display text-2xl font-bold text-slate-900 dark:text-gray-100 leading-none transition-colors">
        {value}
      </p>
      <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 transition-colors">
        {label}
      </p>
    </div>
  </motion.div>
);

/* ── Expertise chip group ── */
const ExpertiseGroup = ({
  title,
  items,
  icon,
  textClass,
  bgClass,
  borderClass,
}) => (
  <motion.div
    {...fadeUp(0.1)}
    className="rounded-2xl p-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
  >
    <h3
      className={`font-display font-semibold text-sm mb-4 flex items-center gap-2 capitalize ${textClass}`}
    >
      <span>{icon}</span>{" "}
      <span className="text-slate-800 dark:text-gray-300">{title}</span>
    </h3>
    <div className="flex flex-wrap gap-2">
      {items?.map((item, i) => (
        <span
          key={i}
          className={`text-xs px-3 py-1 rounded-full font-medium border ${bgClass} ${borderClass} ${textClass}`}
        >
          {item}
        </span>
      ))}
    </div>
  </motion.div>
);

/* ── Social icon button ── */
const SocialBtn = ({ href, icon: Icon, textClass, label }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={label}
      data-cursor-hover
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-1 group bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:shadow-md ${textClass}`}
    >
      <Icon className="w-4 h-4 transition-colors" />
    </a>
  ) : null;

/* ── Main component ── */
const PublicAbout = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/about")
      .then((res) => setData(res.data?.data ?? res.data))
      .catch(console.error);
  }, []);

  if (!data)
    return (
      <div
        className="min-h-screen bg-slate-50 dark:bg-[#0a0a14] transition-colors py-24 px-6"
        style={{ cursor: "none" }}
      >
        <CustomCursor />
        <div className="max-w-4xl mx-auto space-y-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`animate-pulse bg-slate-200 dark:bg-white/5 rounded-2xl ${i === 0 ? "h-48" : "h-16"}`}
              />
            ))}
        </div>
      </div>
    );

  const resumeUrl = data.resumeLink?.startsWith("http:")
    ? data.resumeLink.replace("http:", "https:")
    : data.resumeLink;

  const expertiseConfig = [
    {
      key: "primary",
      icon: <Star className="w-4 h-4" />,
      textClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-50 dark:bg-purple-500/10",
      borderClass: "border-purple-200 dark:border-purple-500/20",
      title: "Primary Skills",
    },
    {
      key: "secondary",
      icon: <Layers className="w-4 h-4" />,
      textClass: "text-blue-600 dark:text-blue-400",
      bgClass: "bg-blue-50 dark:bg-blue-500/10",
      borderClass: "border-blue-200 dark:border-blue-500/20",
      title: "Secondary Skills",
    },
    {
      key: "tools",
      icon: <Settings className="w-4 h-4" />,
      textClass: "text-slate-600 dark:text-slate-400",
      bgClass: "bg-slate-100 dark:bg-slate-500/10",
      borderClass: "border-slate-300 dark:border-slate-500/20",
      title: "Tools",
    },
    {
      key: "methodologies",
      icon: <GitMerge className="w-4 h-4" />,
      textClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      borderClass: "border-emerald-200 dark:border-emerald-500/20",
      title: "Methodologies",
    },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#0a0a14] transition-colors duration-500"
      style={{ cursor: "none" }}
    >
      {/* ✅ Custom cursor — only visible on this page */}
      <CustomCursor />

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent dark:from-purple-500/10">
        <div
          className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(124,92,252,0.12), transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-center md:items-start gap-10"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-3xl overflow-hidden border-2 border-purple-200 dark:border-purple-500/35 shadow-[0_0_40px_rgba(124,92,252,0.1)] dark:shadow-[0_0_40px_rgba(124,92,252,0.2)] bg-white dark:bg-transparent">
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-50 dark:bg-purple-500/10">
                    <span className="font-display text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-400">
                      {data.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-950 shadow-[0_0_10px_#06d6a0]" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                style={{
                  background: "rgba(124,92,252,0.1)",
                  border: "1px solid rgba(124,92,252,0.25)",
                  color: "#a78bfa",
                }}
              >
                <Sparkles className="w-3 h-3" /> Portfolio
              </motion.span>
              <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                <span className="relative inline-block group">
                  {data.name}

                  {/* Animated underline */}
                  <span
                    className="absolute left-0 -bottom-1 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#7c5cfc,#c084fc)",
                    }}
                  />
                </span>
              </h1>
              {data.title && (
                <p className="text-xl text-purple-600 dark:text-purple-400 font-medium mt-3 transition-colors">
                  {data.title}
                </p>
              )}
              {data.tagline && (
                <p className="text-slate-600 dark:text-gray-500 mt-2 italic text-lg max-w-xl transition-colors">
                  "{data.tagline}"
                </p>
              )}

              {/* Contact chips */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                {data.email && (
                  <a
                    href={`mailto:${data.email}`}
                    data-cursor-hover
                    className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-3 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none"
                  >
                    <Mail className="w-3.5 h-3.5" /> {data.email}
                  </a>
                )}
                {data.location && (
                  <span className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-none transition-colors">
                    <MapPin className="w-3.5 h-3.5" /> {data.location}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="btn-primary text-sm py-2.5 px-5"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </a>
                )}
                <a
                  href="/contact"
                  data-cursor-hover
                  className="btn-outline text-sm py-2.5 px-5 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                >
                  <Mail className="w-4 h-4" /> Hire Me{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Socials */}
              <div className="flex gap-2.5 mt-5 justify-center md:justify-start">
                <SocialBtn
                  href={data.linkedin}
                  icon={Linkedin}
                  textClass="text-blue-600 dark:text-blue-400"
                  label="LinkedIn"
                />
                <SocialBtn
                  href={data.github}
                  icon={Github}
                  textClass="text-slate-800 dark:text-gray-200"
                  label="GitHub"
                />
                <SocialBtn
                  href={data.twitter}
                  icon={Twitter}
                  textClass="text-sky-500 dark:text-sky-400"
                  label="Twitter"
                />
                <SocialBtn
                  href={data.facebook}
                  icon={Facebook}
                  textClass="text-indigo-600 dark:text-indigo-400"
                  label="Facebook"
                />
                <SocialBtn
                  href={data.instagram}
                  icon={Instagram}
                  textClass="text-pink-600 dark:text-pink-400"
                  label="Instagram"
                />
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
            <StatCard
              icon={
                <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              }
              value={data.experience.yearsOfExperience || "0"}
              label="Years Experience"
              accentClass="bg-purple-500"
              bgClass="bg-purple-100 dark:bg-purple-500/10"
              delay={0}
            />
            <StatCard
              icon={
                <Server className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
              }
              value={data.experience.projectsCompleted || "0"}
              label="Projects Completed"
              accentClass="bg-fuchsia-500"
              bgClass="bg-fuchsia-100 dark:bg-fuchsia-500/10"
              delay={0.08}
            />
            <StatCard
              icon={
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              }
              value={data.experience.companiesWorked || "0"}
              label="Companies Worked"
              accentClass="bg-emerald-500"
              bgClass="bg-emerald-100 dark:bg-emerald-500/10"
              delay={0.16}
            />
            <StatCard
              icon={
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              }
              value={data.experience.clientsSatisfied || "0"}
              label="Clients Satisfied"
              accentClass="bg-amber-500"
              bgClass="bg-amber-100 dark:bg-amber-500/10"
              delay={0.24}
            />
          </div>
        )}

        {/* Bio + contact sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {data.bio && (
              <motion.div
                {...fadeUp(0.05)}
                className="rounded-2xl p-7 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
              >
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
                  <span className="w-1 h-5 rounded-full inline-block bg-purple-500" />
                  About Me
                </h2>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-base transition-colors">
                  {data.bio}
                </p>
              </motion.div>
            )}

            {data.objective && (
              <motion.div
                {...fadeUp(0.1)}
                className="rounded-2xl p-7 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
              >
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-gray-100 mb-4 flex items-center gap-2 transition-colors">
                  <span className="w-1 h-5 rounded-full inline-block bg-fuchsia-500" />
                  Career Objective
                </h2>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                  {data.objective}
                </p>
              </motion.div>
            )}

            {data.achievements?.length > 0 && (
              <motion.div
                {...fadeUp(0.15)}
                className="rounded-2xl p-7 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
              >
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-gray-100 mb-5 flex items-center gap-2 transition-colors">
                  <span className="w-1 h-5 rounded-full inline-block bg-amber-500" />
                  Key Achievements
                </h2>
                <ul className="space-y-4">
                  {data.achievements.map((ach, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                        <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-gray-200 text-sm transition-colors">
                          {ach.metric}
                        </p>
                        <p className="text-slate-500 dark:text-gray-500 text-xs mt-0.5 transition-colors">
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
            <motion.div
              {...fadeUp(0.05)}
              className="rounded-2xl p-6 bg-purple-50 dark:bg-purple-500/[0.05] border border-purple-100 dark:border-purple-500/[0.15] shadow-sm dark:shadow-none transition-colors"
            >
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-gray-100 mb-5 transition-colors">
                Contact
              </h2>
              <ul className="space-y-3.5">
                {data.email && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white dark:bg-purple-500/10 border border-purple-100 dark:border-transparent">
                      <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <a
                      href={`mailto:${data.email}`}
                      data-cursor-hover
                      className="text-slate-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors break-all text-xs"
                    >
                      {data.email}
                    </a>
                  </li>
                )}
                {data.phone && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white dark:bg-purple-500/10 border border-purple-100 dark:border-transparent">
                      <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <a
                      href={`tel:${data.phone}`}
                      data-cursor-hover
                      className="text-slate-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-xs"
                    >
                      {data.phone}
                    </a>
                  </li>
                )}
                {data.location && (
                  <li className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white dark:bg-purple-500/10 border border-purple-100 dark:border-transparent">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-slate-600 dark:text-gray-400 text-xs transition-colors">
                      {data.location}
                    </span>
                  </li>
                )}
              </ul>
            </motion.div>

            {data.industries?.length > 0 && (
              <motion.div
                {...fadeUp(0.1)}
                className="rounded-2xl p-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] shadow-sm dark:shadow-none transition-colors"
              >
                <h2 className="font-display font-bold text-base text-slate-900 dark:text-gray-100 mb-4 transition-colors">
                  Industries
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.industries.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-gray-300 transition-colors"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              {...fadeUp(0.15)}
              className="rounded-2xl p-5 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/[0.05] border border-emerald-200 dark:border-emerald-500/[0.18] shadow-sm dark:shadow-none transition-colors"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-gray-200 transition-colors">
                  Available for work
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-500 transition-colors">
                  Open to freelance & full-time
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expertise grid */}
        {data.expertise && (
          <div>
            <motion.div {...fadeUp()} className="mb-8 text-center">
              <p className="text-purple-600 dark:text-purple-400 font-semibold tracking-wider uppercase text-sm mb-3">
                What I know
              </p>
              <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-gray-100 transition-colors">
                My{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-400">
                  Expertise
                </span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {expertiseConfig.map(
                (cfg) =>
                  data.expertise[cfg.key]?.length > 0 && (
                    <ExpertiseGroup
                      key={cfg.key}
                      title={cfg.title}
                      items={data.expertise[cfg.key]}
                      icon={cfg.icon}
                      textClass={cfg.textClass}
                      bgClass={cfg.bgClass}
                      borderClass={cfg.borderClass}
                    />
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAbout;
