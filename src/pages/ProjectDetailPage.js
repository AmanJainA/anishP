import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import TextRevealSection from '../components/TextRevealSection';
import Footer from '../components/Footer';
import { allWorkProjects } from '../data/projects';
import './ProjectDetailPage.css';

function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let foundProject;

if (!slug || slug === '') {
  // Find the first project with empty slug
  foundProject = allWorkProjects.find(p => p.slug === '');
} else {
  // Find project by slug
  foundProject = allWorkProjects.find(p => p.slug === slug);
}

// Fallback to first project if nothing found
if (!foundProject) {
  foundProject = allWorkProjects[0];
}
    setProject(foundProject);

    // Attempt to load multiple images for slideshow
    if (foundProject && !foundProject.isVertical) {
      const urls = [];
      const folderName = foundProject.slug || foundProject.title.toLowerCase().replace(/\s+/g, '-');
for (let i = 1; i <= 5; i++) {
  urls.push(`/${folderName}/${i}.webp`);
}
      setImageUrls(urls);
    }
  }, [slug]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + imageUrls.length) % imageUrls.length
    );
  };

  if (!project) {
    return <div>Project not found</div>; // Or a loading spinner
  }

  return (
    <div className="project-detail-page">
      
      <div className="project-detail-content">
        <div className="project-header-section black-background-section">
          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-category">{project.category}</p>
        </div>

        {!project.isVertical && (
          <div className="project-background-video-container">
            <video autoPlay controls loop muted playsInline className="project-background-video" loading="lazy" poster={`${project.videoSrc}.webp`}>
              <source src={`${project.videoSrc}.mp4`}  type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <TextRevealSection text={project.description} />

        {!project.isVertical ? ( project.showCarousel !== false && (
          // Only show carousel if slug is not empty
         
            <div className="image-slideshow-container">
              {imageUrls.length > 0 && (
                <img src={imageUrls[currentImageIndex]} alt={`${project.title} image ${currentImageIndex + 1}`} className="project-image" />
              )}
              {imageUrls.length > 1 && (
                <div className="slideshow-nav">
                  <button onClick={prevImage} className="nav-button">&#10094;</button>
                  <button onClick={nextImage} className="nav-button">&#10095;</button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="project-inline-video-container">
            <video controls autoPlay loop muted playsInline className="project-inline-video">
              <source src={`${project.videoSrc}.mp4`}  type="video/mp4" loading="lazy" poster={`${project.videoSrc}.webp`} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProjectDetailPage;