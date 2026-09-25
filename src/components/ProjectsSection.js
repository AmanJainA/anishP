import React from 'react';
import { motion } from 'framer-motion';
import './ProjectsSection.css';
import { getVideoPoster, getVideoUrl, isGoogleDriveVideoUrl } from '../lib/supabase';

function ProjectsSection({ projects, showArrow = true, headerTitle = "PORTFOLIO", headerParagraph = "I TRIED NOT DOING FILMMAKING, AND I HATED EVERY BIT OF IT. YOU'RE IN GOOD HANDS." }) {

  const verticalProjects = projects.filter(p => p.isVertical);
  const nonVerticalProjects = projects.filter(p => !p.isVertical);

  const orderedProjects = [];
  let vIndex = 0;
  let nvIndex = 0;

  while (vIndex < verticalProjects.length || nvIndex < nonVerticalProjects.length) {
    if (nvIndex < nonVerticalProjects.length) {
      orderedProjects.push(...nonVerticalProjects.slice(nvIndex, nvIndex + 2));
      nvIndex += 2;
    }
    if (vIndex < verticalProjects.length) {
      orderedProjects.push(...verticalProjects.slice(vIndex, vIndex + 2));
      vIndex += 2;
    }
  }

  return (
    <div className="projects-section-container">
      <div className="projects-grid-overlay"></div>

      <header className="projects-header">
        <div className="projects-header-left">
          <h2 className="featured-heading">{headerTitle}</h2>
          <p className="header-paragraph">
            {headerParagraph}
          </p>
        </div>
      </header>

      <div className="project-cards-list">
        {orderedProjects.map((project, index) => (
          <motion.a
            key={index}
            href={`/portofolio/${project.slug}`}
            className={`project-card ${project.isVertical ? 'vertical' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="project-card-inner-border">
              <video autoPlay loop muted playsInline className="project-video" loading="lazy" {...(getVideoPoster(project.videoSrc) ? { poster: getVideoPoster(project.videoSrc) } : {})}>
                <source src={getVideoUrl(project.videoSrc)} />
                Your browser does not support the video tag.
              </video>
              <div className="project-text-overlay">
                {project.hasBlob && <div className="yellow-blob"></div>}
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default ProjectsSection;