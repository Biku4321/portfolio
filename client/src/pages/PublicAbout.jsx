import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
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
  Award,
  Star,
  Layers,
  Settings,
  GitMerge,
  Server,
  Building2,
  Trophy,
} from "lucide-react";

const StatCard = ({ icon, value, label }) => (
  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
    {icon}
    <div>
      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        {value}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  </div>
);

const ExpertiseCard = ({ title, items }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-3 capitalize flex items-center gap-2">
      {
        {
          primary: <Star className="text-yellow-500" />,
          secondary: <Layers className="text-blue-500" />,
          tools: <Settings className="text-gray-500" />,
          methodologies: <GitMerge className="text-green-500" />,
        }[title]
      }
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {items?.map((item, index) => (
        <span
          key={index}
          className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

const PublicAbout = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/about")

      .then((res) => setData(res.data?.data ?? res.data))
      .catch((err) => console.error("Failed to load about data", err));
  }, []);

  if (!data)
    return (
      <div className="text-center p-8 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto text-gray-900 dark:text-white">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        {data.profileImage && (
          <img
            src={data.profileImage}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white dark:border-gray-700"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold">{data.name}</h1>
          <p className="text-xl text-indigo-600 dark:text-indigo-400 mt-1">
            {data.title}
          </p>
          {data.tagline && (
            <p className="text-lg italic mt-2 text-gray-600 dark:text-gray-300">
              "{data.tagline}"
            </p>
          )}
        </div>
      </div>

      {/* --- EXPERIENCE SUMMARY --- */}
      {data.experience && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-center mb-6">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
              value={data.experience.yearsOfExperience || "0"}
              label="Years Experience"
            />
            <StatCard
              icon={<Server className="w-8 h-8 text-indigo-500" />}
              value={data.experience.projectsCompleted || "0"}
              label="Projects Completed"
            />
            <StatCard
              icon={<Building2 className="w-8 h-8 text-indigo-500" />}
              value={data.experience.companiesWorked || "0"}
              label="Companies Worked"
            />
            <StatCard
              icon={<Users className="w-8 h-8 text-indigo-500" />}
              value={data.experience.clientsSatisfied || "0"}
              label="Clients Satisfied"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* --- BIO & OBJECTIVE --- */}
          {data.bio && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-2xl font-semibold mb-3">About Me</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.bio}
              </p>
            </div>
          )}

          {data.objective && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-2xl font-semibold mb-3">Career Objective</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {data.objective}
              </p>
            </div>
          )}

          {/* --- ACHIEVEMENTS --- */}
          {data.achievements && data.achievements.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-2xl font-semibold mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                {data.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 mt-1 text-amber-500" />
                    <div>
                      <span className="font-semibold">{ach.metric}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {ach.description} ({ach.project} - {ach.year})
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* --- CONTACT & SOCIALS --- */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-semibold mb-4">Contact & Social</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5" /> {data.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> {data.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> {data.location}
              </li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Linkedin />
                </a>
              )}
              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 dark:text-white hover:underline"
                >
                  <Github />
                </a>
              )}
              {data.twitter && (
                <a
                  href={data.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 hover:underline"
                >
                  <Twitter />
                </a>
              )}
              {data.facebook && (
                <a
                  href={data.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  <Facebook />
                </a>
              )}
              {data.instagram && (
                <a
                  href={data.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline"
                >
                  <Instagram />
                </a>
              )}
            </div>
          </div>

          {/* --- INDUSTRIES --- */}
          {data.industries && data.industries.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-2xl font-semibold mb-3">Industries</h2>
              <div className="flex flex-wrap gap-2">
                {data.industries.map((industry, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- EXPERTISE SECTION --- */}
      {data.expertise && (
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-center mb-6">My Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpertiseCard title="primary" items={data.expertise.primary} />
            <ExpertiseCard title="secondary" items={data.expertise.secondary} />
            <ExpertiseCard title="tools" items={data.expertise.tools} />
            <ExpertiseCard
              title="methodologies"
              items={data.expertise.methodologies}
            />
          </div>
        </div>
      )}

      {/* --- RESUME BUTTON --- */}
      {data.resumeLink && (
        <div className="text-center mt-12">
          <a
            href={data.resumeLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <FileText className="w-5 h-5" />
            View My Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default PublicAbout;
