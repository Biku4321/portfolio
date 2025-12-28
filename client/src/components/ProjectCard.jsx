import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, TrendingUp, Users, Clock, Award, ChevronRight, Star } from 'lucide-react';

const ProjectCard = ({ project, index }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
          <Star className="w-4 h-4 mr-1" />
          Featured
        </div>
      )}

      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-2xl font-bold">{project.title.charAt(0)}</div>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {project.category || 'Web Development'}
        </div>

        {/* Overlay with Quick Actions */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Impact Metrics */}
        {project.impact && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Key Impact
            </h4>
            <div className="grid grid-cols-1 gap-1 text-xs text-green-700 dark:text-green-400">
              {project.impact.performanceImprovement && (
                <div>🚀 {project.impact.performanceImprovement}</div>
              )}
              {project.impact.userEngagement && (
                <div>👥 {project.impact.userEngagement}</div>
              )}
              {project.impact.businessValue && (
                <div>💰 {project.impact.businessValue}</div>
              )}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{project.tech.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          {project.timeline && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {project.timeline}
            </div>
          )}
          {project.teamSize && (
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Team of {project.teamSize}
            </div>
          )}
        </div>

        {/* Quality Scores */}
        {project.metrics && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {project.metrics.performanceScore && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-bold text-green-600">{project.metrics.performanceScore}</div>
                <div className="text-xs text-gray-500">Performance</div>
              </div>
            )}
            {project.metrics.accessibilityScore && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-bold text-blue-600">{project.metrics.accessibilityScore}</div>
                <div className="text-xs text-gray-500">Accessibility</div>
              </div>
            )}
            {project.metrics.testCoverage && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-lg font-bold text-purple-600">{project.metrics.testCoverage}</div>
                <div className="text-xs text-gray-500">Coverage</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium flex items-center transition-colors"
              >
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            )}
          </div>
          
          {project.caseStudyUrl && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 text-sm font-medium flex items-center transition-colors"
            >
              Case Study
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Client Testimonial */}
        {project.testimonials && project.testimonials.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
              "{project.testimonials[0].feedback}"
            </p>
            <div className="text-xs text-gray-500">
              - {project.testimonials[0].client}, {project.testimonials[0].role}
            </div>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {showDetails && project.caseStudyUrl && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700"
        >
          <div className="space-y-4">
            {/* Problem & Solution */}
            {project.problemStatement && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Challenge</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{project.problemStatement}</p>
              </div>
            )}
            
            {project.solution && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Solution</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{project.solution}</p>
              </div>
            )}

            {/* Architecture */}
            {project.architecture && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Architecture</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Frontend:</span>
                    <div className="text-gray-600 dark:text-gray-300">
                      {project.architecture.frontend?.join(', ')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Backend:</span>
                    <div className="text-gray-600 dark:text-gray-300">
                      {project.architecture.backend?.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <a
              href={project.caseStudyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Read Full Case Study
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
