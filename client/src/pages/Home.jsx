import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Mail, Code2, ArrowRight, ExternalLink,
  Github, Linkedin, Twitter, ChevronLeft, ChevronRight, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitHubCalendar } from "react-github-calendar";

class CalendarErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError)
      return <p className="text-gray-500 text-sm text-center py-4">Contribution graph unavailable.</p>;
    return this.props.children;
  }
}

const SkeletonBox = ({ h = "h-6", w = "w-full" }) => (
  <div className={`skeleton ${h} ${w} rounded-lg`} />
);

const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="text-center"
  >
    <div className="font-display text-3xl font-bold grad-text">{value}</div>
    <div className="text-xs text-gray-500 mt-1 tracking-wide">{label}</div>
  </motion.div>
);

const Home = () => {
  const [aboutData, setAboutData]     = useState(null);
  const [skills, setSkills]           = useState([]);
  const [projects, setProjects]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [currentRole, setCurrentRole] = useState(0);
  const [githubDate, setGithubDate]   = useState(new Date());
  const navigate = useNavigate();

  const roles = ["Full Stack Developer", "UI/UX Designer", "Problem Solver", "Tech Innovator"];

  useEffect(() => {
    fetchAllData();
    const iv = setInterval(() => setCurrentRole(p => (p + 1) % roles.length), 3000);
    return () => clearInterval(iv);
  }, []);

  const fetchAllData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const [aR, sR, pR] = await Promise.all([
        fetch(`${apiUrl}/api/about`),
        fetch(`${apiUrl}/api/skills`),
        fetch(`${apiUrl}/api/projects`),
      ]);
      if (aR.ok) setAboutData(await aR.json());
      if (sR.ok) { const s = await sR.json(); setSkills(Array.isArray(s) ? s : s.data || []); }
      if (pR.ok) { const p = await pR.json(); setProjects((Array.isArray(p) ? p : p.data || []).slice(0, 3)); }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const topSkills = skills.flatMap(i => i.skills || i).map(s => s.name || s).slice(0, 8);

  const prevMonth = () => setGithubDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; });
  const nextMonth = () => setGithubDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; });

  // Month display string
  const monthLabel = githubDate.toLocaleString("default", { month: "long", year: "numeric" });

  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <Helmet>
        <title>{aboutData ? `${aboutData.name} | Portfolio` : "Portfolio"}</title>
        <meta name="description" content={aboutData?.tagline || "Full Stack Developer Portfolio"} />
      </Helmet>

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="blob absolute w-[700px] h-[700px] rounded-full -top-40 -left-40 opacity-20"
          style={{ background: "radial-gradient(circle, #7c5cfc, transparent 70%)", filter: "blur(80px)" }} />
        <div className="blob blob-delay absolute w-[500px] h-[500px] rounded-full bottom-0 right-0 opacity-15"
          style={{ background: "radial-gradient(circle, #c084fc, transparent 70%)", filter: "blur(80px)" }} />
        <div className="blob absolute w-[350px] h-[350px] rounded-full top-1/2 left-1/2 opacity-10"
          style={{ background: "radial-gradient(circle, #06d6a0, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-emerald-400"
                style={{ background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-none tracking-tight">
                Hi, I&apos;m{" "}
                <span className="grad-text block mt-1">
                  {isLoading ? <SkeletonBox h="h-16" w="w-48" /> : (aboutData?.name || "Bikash")}
                </span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="h-10">
              <AnimatePresence mode="wait">
                <motion.p key={currentRole} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }} className="font-display text-2xl font-semibold text-gray-300">
                  {roles[currentRole]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }} className="text-gray-400 text-lg leading-relaxed max-w-lg">
              {isLoading
                ? <><SkeletonBox /><SkeletonBox w="w-3/4" /></>
                : (aboutData?.bio || "Building digital experiences with clean code and great design.")}
            </motion.p>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="grid grid-cols-4 gap-6 py-6 border-y border-white/5">
              <StatCard value={aboutData?.experience?.yearsOfExperience || "2+"} label="Years Exp." delay={0.5} />
              <StatCard value={aboutData?.experience?.projectsCompleted || "10+"} label="Projects" delay={0.55} />
              <StatCard value={aboutData?.experience?.clientsSatisfied || "100%"} label="Satisfaction" delay={0.6} />
              <StatCard value={projects.length || "5+"} label="Live Apps" delay={0.65} />
            </motion.div>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }} className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/contact")} className="btn-primary">
                <Mail className="w-4 h-4" /> Let&apos;s Work Together
              </button>
              <button onClick={() => navigate("/projects")} className="btn-outline">
                <Code2 className="w-4 h-4" /> View My Work
              </button>
            </motion.div>

            {/* Social */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="flex gap-3">
              {[
                { icon: Github, href: aboutData?.github || "https://github.com/Biku4321" },
                { icon: Linkedin, href: aboutData?.linkedin || "#" },
                { icon: Twitter, href: aboutData?.twitter || "#" },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-100 transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full opacity-50"
                style={{ background: "conic-gradient(from 0deg, #7c5cfc, #c084fc, #06d6a0, #7c5cfc)", filter: "blur(20px)", animation: "spin 8s linear infinite" }} />
              <div className="absolute inset-2 rounded-full overflow-hidden"
                style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                {!isLoading && aboutData?.profileImage ? (
                  <img src={aboutData.profileImage} alt={aboutData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-7xl font-bold grad-text">{aboutData?.name?.charAt(0) || "B"}</span>
                  </div>
                )}
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl text-sm font-medium"
                style={{ background: "#0f0f1a", border: "1px solid rgba(124,92,252,0.3)" }}>
                <span className="text-purple-400">Full Stack</span> <span className="text-gray-400">Dev</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── GitHub Contributions ── */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <p className="section-label">Open source activity</p>
            <h2 className="font-display text-3xl font-bold text-gray-100">
              GitHub <span className="grad-text">Contributions</span>
            </h2>
          </motion.div>

          <div className="flex items-center justify-center gap-6">
            <button onClick={prevMonth}
              className="p-3 rounded-xl text-gray-400 hover:text-gray-100 transition-all hover:-translate-x-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center w-full max-w-2xl">
              {/* Month + year label */}
              <p className="font-display font-semibold text-gray-200 mb-2 text-lg">{monthLabel}</p>

              <div className="w-full p-5 rounded-2xl overflow-x-auto"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <CalendarErrorBoundary key={githubDate.toString()}>
                  <GitHubCalendar
                    username={import.meta.env.VITE_GITHUB_USERNAME || "Biku4321"}
                    year={githubDate.getFullYear()}
                    colorScheme="dark"
                    blockSize={14}
                    blockRadius={4}
                    fontSize={13}
                    hideTotalCount={false}
                    theme={{ dark: ["#1a1a2e", "#4c1d95", "#7c3aed", "#a855f7", "#c084fc"] }}
                    transformData={(data) => data.filter(d => {
                      const dt = new Date(d.date);
                      return dt.getMonth() === githubDate.getMonth() &&
                             dt.getFullYear() === githubDate.getFullYear();
                    })}
                    renderColorLegend={() => (
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8, textAlign: "center" }}>
                        contributions in {monthLabel}
                      </div>
                    )}
                  />
                </CalendarErrorBoundary>
              </div>
            </div>

            <button onClick={nextMonth}
              className="p-3 rounded-xl text-gray-400 hover:text-gray-100 transition-all hover:translate-x-0.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Top Skills ── */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="section-label">What I use</p>
            <h2 className="font-display text-4xl font-bold text-gray-100">Top <span className="grad-text">Skills</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading
              ? Array(8).fill(0).map((_, i) => <SkeletonBox key={i} h="h-16" />)
              : topSkills.length > 0
                ? topSkills.map((skill, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="glass card-hover rounded-xl p-4 text-center text-sm font-medium text-gray-200 cursor-default">
                    {skill}
                  </motion.div>
                ))
                : <p className="col-span-full text-center text-gray-500">No skills found.</p>
            }
          </div>
          <div className="text-center mt-8">
            <button onClick={() => navigate("/skills")}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 transition-colors">
              View All Skills <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="section-label">My work</p>
            <h2 className="font-display text-4xl font-bold text-gray-100">Featured <span className="grad-text">Projects</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(3).fill(0).map((_, i) => <SkeletonBox key={i} h="h-72" />)
              : projects.length > 0
                ? projects.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="glass card-hover rounded-2xl overflow-hidden flex flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg,#7c5cfc,#c084fc)" }} />
                      <img src={p.image || `https://picsum.photos/seed/${p._id}/600/400`} alt={p.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      {p.featured && (
                        <span className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full text-emerald-400"
                          style={{ background: "rgba(6,214,160,0.15)", border: "1px solid rgba(6,214,160,0.3)" }}>
                          ✦ Featured
                        </span>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display font-semibold text-lg text-gray-100 mb-2">{p.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 flex-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                        {(p.tech || []).slice(0, 4).map(t => <span key={t} className="tag text-xs">{t}</span>)}
                      </div>
                      <div className="flex gap-3">
                        {p.liveDemo && <a href={p.liveDemo} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>}
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200">
                          <Github className="w-3.5 h-3.5" /> Source
                        </a>}
                      </div>
                    </div>
                  </motion.div>
                ))
                : <p className="col-span-full text-center text-gray-500">No projects found.</p>
            }
          </div>
          <div className="text-center mt-10">
            <button onClick={() => navigate("/projects")} className="btn-primary">
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA Banner with HIRE ME ── */}
      <section className="relative z-10 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative p-12 rounded-3xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(124,92,252,0.15), rgba(192,132,252,0.1))", border: "1px solid rgba(124,92,252,0.2)" }}>
              <div className="absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(124,92,252,0.2), transparent 70%)" }} />
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h2 className="font-display text-4xl font-bold text-gray-100 mb-4">
                Ready to Build Something?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Have a project in mind? Let's collaborate and create something exceptional together.
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                {/* ✅ Hire Me — Calendly link */}
                <a
                  href={calendlyUrl || "https://calendly.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  📅 Hire Me — Schedule a Call
                </a>
                {/* ✅ Send a Message — navigates to /contact */}
                <button onClick={() => navigate("/contact")} className="btn-outline">
                  ✉️ Send a Message
                </button>
              </div>
              {!calendlyUrl && (
                <p className="text-xs text-gray-600 mt-4">
                  Set <code className="text-purple-400">VITE_CALENDLY_URL</code> in your .env to enable scheduling
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
