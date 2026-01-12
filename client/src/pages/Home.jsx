import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Code2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GitHubCalendar } from "react-github-calendar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// --- Error Boundary Component to prevent Crash ---
class CalendarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GitHub Calendar Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          <p>Contribution graph unavailable for this period.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  const [aboutData, setAboutData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(0);

  // State for GitHub Calendar (Current View Month)
  const [githubDate, setGithubDate] = useState(new Date());

  const navigate = useNavigate();

  const roles = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Innovator",
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchAllData();
    const interval = setInterval(
      () => setCurrentRole((prev) => (prev + 1) % roles.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const [aboutRes, skillsRes, projectsRes] = await Promise.all([
        fetch(`${apiUrl}/api/about`),
        fetch(`${apiUrl}/api/skills`),
        fetch(`${apiUrl}/api/projects`),
      ]);

      if (aboutRes.ok) setAboutData(await aboutRes.json());

      if (skillsRes.ok) {
        const skillsJson = await skillsRes.json();
        setSkills(
          Array.isArray(skillsJson) ? skillsJson : skillsJson.data || []
        );
      }

      if (projectsRes.ok) {
        const projectsJson = await projectsRes.json();
        const allProjects = Array.isArray(projectsJson)
          ? projectsJson
          : projectsJson.data || [];
        setProjects(allProjects.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const topSkills = skills
    .flatMap((item) => item.skills || item)
    .map((s) => s.name || s)
    .slice(0, 8);

  const handleContactClick = () => navigate("/contact");
  const handleViewWorkClick = () => navigate("/projects");

  // --- GitHub Navigation Logic ---
  const handlePrevMonth = () => {
    setGithubDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setGithubDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 overflow-hidden">
      <Helmet>
        <title>
          {aboutData ? `${aboutData.name} | Portfolio` : "Portfolio"}
        </title>
        <meta
          name="description"
          content={aboutData?.tagline || "Full Stack Developer Portfolio"}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
                Welcome to my portfolio
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {isLoading ? (
                    <Skeleton width={200} />
                  ) : (
                    aboutData?.name || "Bikash"
                  )}
                </span>
              </h1>

              <div className="h-16 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {roles[currentRole]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              {isLoading ? (
                <Skeleton count={3} />
              ) : (
                aboutData?.bio || "Building digital experiences..."
              )}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Years Exp.",
                  val: aboutData?.experience?.yearsOfExperience || "2+",
                },
                {
                  label: "Projects",
                  val: aboutData?.experience?.projectsCompleted || "10+",
                },
                {
                  label: "Clients",
                  val: aboutData?.experience?.clientsSatisfied || "100%",
                },
                { label: "Total Proj.", val: projects.length || "5+" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {isLoading ? <Skeleton width={40} /> : stat.val}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleContactClick}
                whileHover={{ scale: 1.05 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Mail className="w-5 h-5 mr-2" /> Let&apos;s Work Together
              </motion.button>
              <motion.button
                onClick={handleViewWorkClick}
                whileHover={{ scale: 1.05 }}
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Code2 className="w-5 h-5 mr-2" /> View My Work
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              {isLoading ? (
                <Skeleton height={400} />
              ) : aboutData?.profileImage ? (
                <img
                  src={aboutData.profileImage}
                  alt="Profile"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                  {aboutData?.name?.charAt(0) || "B"}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 dark:text-gray-400"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* GitHub Activity Section */}
      <section className="py-10 bg-white dark:bg-gray-900 flex justify-center">
        <div className="max-w-5xl w-full px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Github Contributions
          </h2>

          <div className="flex items-center justify-center gap-4 md:gap-8">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex flex-col items-center">
              <h3 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-200">
                {githubDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              <div className="border p-4 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 overflow-x-auto min-h-[150px] flex items-center justify-center">
                {/* --- FIX: Wrapped in Error Boundary --- */}
                <CalendarErrorBoundary key={githubDate.toString()}>
                  <GitHubCalendar
                    username={import.meta.env.VITE_GITHUB_USERNAME || "bikash"}
                    year={githubDate.getFullYear()}
                    colorScheme="light"
                    blockSize={12}
                    fontSize={14}
                    hideTotalCount
                    transformData={(data) => {
                      // Filter for the selected month
                      return data.filter((day) => {
                        const d = new Date(day.date);
                        return (
                          d.getMonth() === githubDate.getMonth() &&
                          d.getFullYear() === githubDate.getFullYear()
                        );
                      });
                    }}
                  />
                </CalendarErrorBoundary>
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Top Skills
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-6">
          {isLoading ? (
            Array(8)
              .fill(0)
              .map((_, i) => <Skeleton key={i} height={60} borderRadius={12} />)
          ) : topSkills.length > 0 ? (
            topSkills.map((skill, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-700 dark:text-white p-6 rounded-xl shadow text-center font-semibold"
              >
                {skill}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No skills found.
            </div>
          )}
        </div>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/skills")}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            View All Skills →
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} height={300} borderRadius={12} />
                ))
            ) : projects.length > 0 ? (
              projects.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  <img
                    src={
                      p.image || `https://picsum.photos/seed/${p._id}/600/400`
                    }
                    alt={p.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                      {p.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <a
                        href={p.liveDemo || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 font-medium hover:underline"
                      >
                        View Details <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center col-span-full">No projects found.</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
        <a
          href={import.meta.env.VITE_CALENDLY_URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all"
        >
          Hire Me <ArrowRight className="w-5 h-5 ml-2" />
        </a>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Get In Touch
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400">
            {aboutData?.email && (
              <a
                href={`mailto:${aboutData.email}`}
                className="flex items-center hover:text-blue-500"
              >
                <Mail className="w-5 h-5 mr-2" />
                {aboutData.email}
              </a>
            )}
            {aboutData?.phone && (
              <a
                href={`tel:${aboutData.phone}`}
                className="flex items-center hover:text-blue-500"
              >
                <Phone className="w-5 h-5 mr-2" />
                {aboutData.phone}
              </a>
            )}
            {aboutData?.location && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {aboutData.location}
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-6">
            {aboutData?.github && (
              <a
                href={aboutData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {aboutData?.linkedin && (
              <a
                href={aboutData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {aboutData?.twitter && (
              <a
                href={aboutData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;