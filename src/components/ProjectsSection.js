import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './ProjectsSection.css';
import { getVideoPoster, getVideoUrl, isExternalVideoUrl, isDirectVideoUrl, getVideoEmbedUrl } from '../lib/supabase';

function ProjectMedia({ project }) {
  const raw = String(project.videoSrc || '').trim();
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [useEmbed, setUseEmbed] = useState(isExternalVideoUrl(raw) && !isDirectVideoUrl(raw));

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => setIsVisible(entries.some(entry => entry.isIntersecting)),
      { rootMargin: '500px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  if (!raw) {
    return <div ref={frameRef} className="project-video project-video-empty" aria-hidden="true" />;
  }

  const directUrl = getVideoUrl(raw);
  const embedUrl = getVideoEmbedUrl(raw);

  if (useEmbed) {
    return (
      <div ref={frameRef} className="project-video-frame">
        {isVisible && (
          <iframe
            src={embedUrl}
            title={project.title || 'Project video'}
            className="project-video project-video-embed"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading="lazy"
          />
        )}
        <a
          href={raw}
          target="_blank"
          rel="noopener noreferrer"
          className="project-video-open-link"
          onClick={event => event.stopPropagation()}
        >
          Open video
        </a>
      </div>
    );
  }

  return (
    <div ref={frameRef} className="project-video-frame">
      <video
        ref={videoRef}
        autoPlay={isVisible}
        loop
        muted
        playsInline
        className="project-video"
        preload={isVisible ? 'metadata' : 'none'}
        poster={getVideoPoster(raw)}
        onError={() => {
          if (isExternalVideoUrl(raw)) setUseEmbed(true);
        }}
      >
        {isVisible && <source src={directUrl} />}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

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
            key={project.id || project.slug || index}
            href={`/portfolio/${project.slug}`}
            className={`project-card ${project.isVertical ? 'vertical' : ''}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="project-card-inner-border">
              <ProjectMedia project={project} />
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
