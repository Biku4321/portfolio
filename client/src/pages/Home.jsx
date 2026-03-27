import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Code2,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitHubCalendar } from "react-github-calendar";

class CalendarErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <p
          style={{
            color: "var(--text-muted)",
            textAlign: "center",
            padding: "1rem",
            fontSize: "0.875rem",
          }}
        >
          Contribution graph unavailable.
        </p>
      );
    return this.props.children;
  }
}

const SkeletonBox = ({ h = "h-6", w = "w-full" }) => (
  <div className={`skeleton ${h} ${w} rounded-lg`} />
);
const useGithubStats = (username) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        const data = await res.json();

        setStats({
          repos: data.public_repos,
          followers: data.followers,
          following: data.following,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, [username]);

  return stats;
};
const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="text-center"
  >
    <div className="font-display text-3xl font-bold grad-text">{value}</div>
    <div
      className="text-xs mt-1 tracking-wide"
      style={{ color: "var(--text-muted)" }}
    >
      {label}
    </div>
  </motion.div>
);

/* Fetches monthly count from GitHub contributions API */
const useMonthlyCount = (username, month, year) => {
  const [count, setCount] = useState(null);
  useEffect(() => {
    if (!username) return;
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const total = (data.contributions || [])
          .filter((d) => {
            const dt = new Date(d.date);
            return dt.getMonth() === month && dt.getFullYear() === year;
          })
          .reduce((s, d) => s + d.count, 0);
        setCount(total);
      })
      .catch(() => setCount(null));
  }, [username, month, year]);
  return count;
};

const Home = () => {
  const [aboutData, setAboutData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(0);
  const [githubDate, setGithubDate] = useState(new Date());
  const navigate = useNavigate();

  const roles = [
    "🚀 Full Stack Developer",
    "⚡ MERN Stack Engineer",
    "💡 Building Real-World Solutions",
    "🔥 Turning Ideas into Products",
  ];
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
  const ghUser = import.meta.env.VITE_GITHUB_USERNAME || "Biku4321";
  const githubStats = useGithubStats(ghUser);
  /* ✅ Single count — used only OUTSIDE the box */
  const monthlyCount = useMonthlyCount(
    ghUser,
    githubDate.getMonth(),
    githubDate.getFullYear(),
  );
  const monthLabel = githubDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchAllData();
    const iv = setInterval(
      () => setCurrentRole((p) => (p + 1) % roles.length),
      3000,
    );
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
      if (sR.ok) {
        const s = await sR.json();
        setSkills(Array.isArray(s) ? s : s.data || []);
      }
      if (pR.ok) {
        const p = await pR.json();
        setProjects((Array.isArray(p) ? p : p.data || []).slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const topSkills = skills
    .flatMap((i) => i.skills || i)
    .map((s) => s.name || s)
    .slice(0, 8);
  const prevMonth = () =>
    setGithubDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() - 1);
      return n;
    });
  const nextMonth = () =>
    setGithubDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + 1);
      return n;
    });

  const cardBg = "var(--glass-bg)";
  const cardBorder = "var(--glass-border)";
  const textPri = "var(--text-primary)";
  const textSec = "var(--text-secondary)";
  const textMuted = "var(--text-muted)";

  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <Helmet>
        <title>
          {aboutData ? `${aboutData.name} | Portfolio` : "Portfolio"}
        </title>
        <meta
          name="description"
          content={aboutData?.tagline || "Full Stack Developer Portfolio"}
        />
      </Helmet>

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="blob absolute w-[700px] h-[700px] rounded-full -top-40 -left-40 opacity-20"
          style={{
            background: "radial-gradient(circle, #7c5cfc, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="blob blob-delay absolute w-[500px] h-[500px] rounded-full bottom-0 right-0 opacity-15"
          style={{
            background: "radial-gradient(circle, #c084fc, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="blob absolute w-[350px] h-[350px] rounded-full top-1/2 left-1/2 opacity-10"
          style={{
            background: "radial-gradient(circle, #06d6a0, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(6,214,160,0.1)",
                  border: "1px solid rgba(6,214,160,0.25)",
                  color: "#06d6a0",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h1
                className="font-display text-5xl md:text-7xl font-bold leading-none tracking-tight"
                style={{ color: textPri }}
              >
                Hi, I&apos;m{" "}
                <span className="grad-text block mt-1">
                  {isLoading ? (
                    <SkeletonBox h="h-16" w="w-48" />
                  ) : (
                    aboutData?.name || "Bikash"
                  )}
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="h-10"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentRole}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="font-display text-2xl font-semibold"
                  style={{ color: textPri }}
                >
                  {roles[currentRole]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
            {/* <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
  className="text-sm font-medium"
  style={{ color: "#7c5cfc" }}
>
  🚀 Building scalable apps • 💡 Solving real-world problems
</motion.p> */}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg leading-relaxed max-w-lg"
              style={{ color: textSec }}
            >
              {isLoading ? (
                <>
                  <SkeletonBox />
                  <SkeletonBox w="w-3/4" />
                </>
              ) : (
                aboutData?.bio ||
                "Building digital experiences with clean code and great design."
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-4 gap-6 py-6"
              style={{
                borderTop: `1px solid ${cardBorder}`,
                borderBottom: `1px solid ${cardBorder}`,
              }}
            >
              <StatCard
                value={aboutData?.experience?.yearsOfExperience || "2+"}
                label="Years Exp."
                delay={0.5}
              />
              <StatCard
                value={aboutData?.experience?.projectsCompleted || "10+"}
                label="Projects"
                delay={0.55}
              />
              <StatCard
                value={aboutData?.experience?.clientsSatisfied || "100%"}
                label="Satisfaction"
                delay={0.6}
              />
              <StatCard
                value={projects.length || "5+"}
                label="Live Apps"
                delay={0.65}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => navigate("/contact")}
                className="btn-primary"
              >
                <Mail className="w-4 h-4" /> Let&apos;s Work Together
              </button>
              <button
                onClick={() => navigate("/projects")}
                className="btn-outline"
              >
                <Code2 className="w-4 h-4" /> View My Work
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex gap-3"
            >
              {[
                {
                  icon: Github,
                  href: aboutData?.github || "https://github.com/Biku4321",
                },
                { icon: Linkedin, href: aboutData?.linkedin || "#" },
                { icon: Twitter, href: aboutData?.twitter || "#" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    color: textSec,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="relative w-80 h-80">
              <div
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  background:
                    "conic-gradient(from 0deg, #7c5cfc, #c084fc, #06d6a0, #7c5cfc)",
                  filter: "blur(20px)",
                  animation: "spin 8s linear infinite",
                }}
              />
              <div
                className="absolute inset-2 rounded-full overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: `1px solid ${cardBorder}`,
                }}
              >
                {!isLoading && aboutData?.profileImage ? (
                  <img
                    src={aboutData.profileImage}
                    alt={aboutData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-7xl font-bold grad-text">
                      {aboutData?.name?.charAt(0) || "B"}
                    </span>
                  </div>
                )}
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl text-sm font-medium"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid rgba(124,92,252,0.3)",
                }}
              >
                <span style={{ color: "#7c5cfc" }}>Full Stack</span>{" "}
                <span style={{ color: textSec }}>Dev</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: textMuted }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>
      <section className="py-12 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-xl font-bold mb-4 text-purple-400">
            Why choose me?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="glass p-4 rounded-xl">⚡ Fast & optimized apps</div>
            <div className="glass p-4 rounded-xl">🎯 Clean & scalable code</div>
            <div className="glass p-4 rounded-xl">💬 Strong communication</div>
          </div>
        </div>
      </section>

      {/* ── GitHub Contributions ── */}
      <section
        className="relative z-10 py-16"
        style={{
          borderTop: `1px solid ${cardBorder}`,
          borderBottom: `1px solid ${cardBorder}`,
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-label">Open source activity</p>

            <h2 className="font-display text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                GitHub Contributions
              </span>
            </h2>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full mb-8 mt-6">
            {[
              { label: "Contributions", value: monthlyCount ?? "—" },
              { label: "Repositories", value: githubStats?.repos ?? "—" },
              //   { label: "Followers", value: githubStats?.followers ?? "—" },
              //{ label: "Following", value: githubStats?.following ?? "—" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                // w-40 (mobile) aur sm:w-48 (desktop) lagaya taaki size fix rahe, shrink-0 isse chota hone se rokega
                className="p-4 rounded-xl text-center backdrop-blur-md w-40 sm:w-48 shrink-0 shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${cardBorder || "rgba(255,255,255,0.1)"}`,
                }}
              >
                <p className="text-2xl font-bold text-purple-400">
                  {item.value}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: textSec || "#94a3b8" }}
                >
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
          {/* Main Section */}
          <div className="flex items-center justify-center gap-4">
            {/* Left Button */}
            <button
              onClick={prevMonth}
              className="p-3 rounded-xl transition-all hover:-translate-x-1 hover:scale-105"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                color: textSec,
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Calendar Box */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center flex-1 max-w-2xl"
            >
              <p
                className="font-display font-semibold text-lg mb-4"
                style={{ color: textPri }}
              >
                {monthLabel}
              </p>

              {/* Glass Card */}
              <div
                className="w-full p-6 rounded-2xl backdrop-blur-lg shadow-xl border transition-all duration-300 hover:shadow-purple-500/20 flex justify-center overflow-x-auto"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${cardBorder}`,
                }}
              >
                <div className="[&_.react-activity-calendar__count]:hidden">
                  <CalendarErrorBoundary key={githubDate.toString()}>
                    <GitHubCalendar
                      username={ghUser}
                      year={githubDate.getFullYear()}
                      colorScheme="dark"
                      blockSize={12}
                      blockRadius={4}
                      fontSize={12}
                      hideTotalCount={true}
                      hideColorLegend={true}
                      theme={{
                        dark: [
                          "#1a1a2e",
                          "#4c1d95",
                          "#7c3aed",
                          "#a855f7",
                          "#c084fc",
                        ],
                      }}
                      transformData={(data) =>
                        data.filter((d) => {
                          const dt = new Date(d.date);
                          return (
                            dt.getMonth() === githubDate.getMonth() &&
                            dt.getFullYear() === githubDate.getFullYear()
                          );
                        })
                      }
                    />
                  </CalendarErrorBoundary>
                </div>
              </div>

              {/* Contribution Stats */}
              {monthlyCount !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md"
                  style={{
                    background: "rgba(124, 92, 252, 0.1)",
                    border: "1px solid rgba(124,92,252,0.3)",
                    color: textSec,
                  }}
                >
                  🚀{" "}
                  <span className="font-bold text-purple-400">
                    {monthlyCount}
                  </span>{" "}
                  contributions in {monthLabel}
                </motion.div>
              )}
            </motion.div>

            {/* Right Button */}
            <button
              onClick={nextMonth}
              className="p-3 rounded-xl transition-all hover:translate-x-1 hover:scale-105"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                color: textSec,
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Top Skills ── */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="section-label">What I use</p>
            <h2
              className="font-display text-4xl font-bold"
              style={{ color: textPri }}
            >
              Top <span className="grad-text">Skills</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <SkeletonBox key={i} h="h-16" />)
            ) : topSkills.length > 0 ? (
              topSkills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass card-hover rounded-xl p-4 text-center text-sm font-medium cursor-default"
                  style={{ color: textPri }}
                >
                  {skill}
                </motion.div>
              ))
            ) : (
              <p
                className="col-span-full text-center"
                style={{ color: textMuted }}
              >
                No skills found.
              </p>
            )}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/skills")}
              className="text-sm font-medium inline-flex items-center gap-1 transition-colors hover:opacity-80"
              style={{ color: "#7c5cfc" }}
            >
              View All Skills <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section
        className="relative z-10 py-20"
        style={{ borderTop: `1px solid ${cardBorder}` }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="section-label">My work</p>
            <h2
              className="font-display text-4xl font-bold"
              style={{ color: textPri }}
            >
              Featured <span className="grad-text">Projects</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => <SkeletonBox key={i} h="h-72" />)
            ) : projects.length > 0 ? (
              projects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass card-hover rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: "linear-gradient(135deg,#7c5cfc,#c084fc)",
                      }}
                    />
                    <img
                      src={
                        p.image || `https://picsum.photos/seed/${p._id}/600/400`
                      }
                      alt={p.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    {p.featured && (
                      <span
                        className="absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(6,214,160,0.15)",
                          border: "1px solid rgba(6,214,160,0.3)",
                          color: "#06d6a0",
                        }}
                      >
                        ✦ Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="font-display font-semibold text-lg mb-2"
                      style={{ color: textPri }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="text-sm line-clamp-2 flex-1"
                      style={{ color: textSec }}
                    >
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {(p.tech || []).slice(0, 4).map((t) => (
                        <span key={t} className="tag text-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div
                      className="flex gap-3 pt-3"
                      style={{ borderTop: `1px solid ${cardBorder}` }}
                    >
                      {p.liveDemo && (
                        <a
                          href={p.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-80"
                          style={{ color: "#7c5cfc" }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium hover:opacity-80"
                          style={{ color: textSec }}
                        >
                          <Github className="w-3.5 h-3.5" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p
                className="col-span-full text-center"
                style={{ color: textMuted }}
              >
                No projects found.
              </p>
            )}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/projects")}
              className="btn-primary"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA — Hire Me ── */}
      <section
        className="relative z-10 py-20"
        style={{ borderTop: `1px solid ${cardBorder}` }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="p-12 rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,92,252,0.12), rgba(192,132,252,0.07))",
                border: "1px solid rgba(124,92,252,0.2)",
                position: "relative",
              }}
            >
              {/* ✅ pointer-events:none so overlay never blocks clicks */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.2,
                  borderRadius: "1.5rem",
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(124,92,252,0.25), transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <Sparkles
                  className="w-8 h-8 mx-auto mb-4"
                  style={{ color: "#7c5cfc" }}
                />
                <h2
                  className="font-display text-4xl font-bold mb-4"
                  style={{ color: textPri }}
                >
                  Ready to Build Something?
                </h2>
                <p className="mb-8 max-w-xl mx-auto" style={{ color: textSec }}>
                  Have a project in mind? Let's collaborate and create something
                  exceptional together.
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {/* Hire Me — opens Calendly in new tab */}
                  <a
                    href={calendlyUrl || "https://calendly.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    📅 Hire Me — Schedule a Call
                  </a>

                  {/* Send a Message — navigates to contact */}
                  <button
                    className="btn-outline"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/contact")}
                  >
                    ✉️ Send a Message
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
