import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Code2,
  Sparkles,
  ArrowRight,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(0);
  const navigate = useNavigate();

  const roles = [
    "Full Stack Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Tech Innovator",
  ];

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    fetchAboutData();
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/about`
      );
      const data = await response.json();
      setAboutData(data);
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactClick = () => navigate("/contact");
  const handleViewWorkClick = () => navigate("/projects");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
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
              <motion.h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {aboutData?.name || "Bikash"}
                </span>
              </motion.h1>

              <div className="h-16 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 20, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: -90 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {roles[currentRole]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
              {aboutData?.bio ||
                "I create stunning digital experiences that blend creativity with technology. With a focus on user experience and robust functionality, I turn ideas into impactful solutions."}
            </p>
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {aboutData?.experience?.yearsOfExperience || '5'}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {aboutData?.experience?.projectsCompleted || '50'}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {aboutData?.experience?.clientsSatisfied || '30'}+
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">98%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4">
              
              <motion.button
                onClick={handleContactClick}
                whileHover={{ scale: 1.05 }}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Let&apos;s Work Together
              </motion.button>

              <motion.button
                onClick={handleViewWorkClick}
                whileHover={{ scale: 1.05 }}
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Code2 className="w-5 h-5 mr-2" />
                View My Work
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              {aboutData?.profileImage ? (
                <img
                  src={aboutData.profileImage}
                  alt={`${aboutData.name} Profile`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {aboutData?.name?.charAt(0) || "B"}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 dark:text-gray-400"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-900" data-aos="fade-up">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            About Me
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {aboutData?.about ||
              "I’m a passionate developer who enjoys crafting clean, user-friendly applications. With experience across multiple technologies, I thrive in solving problems and delivering solutions that matter."}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            My Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {["JavaScript", "React", "Node.js", "MongoDB", "TailwindCSS", "AWS"].map(
              (skill, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center font-semibold text-gray-800 dark:text-gray-200"
                >
                  {skill}
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-20 bg-white dark:bg-gray-900" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((p) => (
              <motion.div
                key={p}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/seed/project${p}/600/400`}
                  alt={`Project ${p}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Project {p}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    A short description about this amazing project goes here.
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 mt-4 font-medium"
                  >
                    View Details <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Me CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4">Interested in working together?</h2>
          <p className="text-lg mb-8">
            Let’s schedule a call and discuss how I can help bring your ideas to life.
          </p>
          <a
            href="https://calendly.com/yourusername/meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all"
          >
            Hire Me <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Get In Touch
          </h2>
          <div className="flex flex-wrap justify-center gap-6 text-gray-600 dark:text-gray-400">
            {aboutData?.email && (
              <a href={`mailto:${aboutData.email}`} className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                {aboutData.email}
              </a>
            )}
            {aboutData?.phone && (
              <a href={`tel:${aboutData.phone}`} className="flex items-center">
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
              <a href={aboutData.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-6 h-6" />
              </a>
            )}
            {aboutData?.linkedin && (
              <a href={aboutData.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            {aboutData?.twitter && (
              <a href={aboutData.twitter} target="_blank" rel="noopener noreferrer">
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
