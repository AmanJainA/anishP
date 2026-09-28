import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TextRevealSection from '../components/TextRevealSection';
import Footer from '../components/Footer';
import { getProjectBySlug } from '../lib/supabase';
import './ProjectDetailPage.css';
import { getVideoPoster, getVideoUrl, getVideoEmbedUrl, isDirectVideoUrl } from '../lib/supabase';

function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [useVideoEmbed, setUseVideoEmbed] = useState(false);

  useEffect(() => {
    let active = true;
    getProjectBySlug(slug).then(found => {
      if (!active) return;
      setProject(found);
      setUseVideoEmbed(false);
      setCurrentImageIndex(0);
      if (found && !found.isVertical) {
        const folder = found.slug || found.title.toLowerCase().replace(/\s+/g, '-');
        setImageUrls(Array.from({ length:5 }, (_, i) => `/${folder}/${i+1}.webp`));
      } else setImageUrls([]);
    }).catch(console.error);
    return () => { active = false; };
  }, [slug]);

  const nextImage = () => imageUrls.length && setCurrentImageIndex(i => (i + 1) % imageUrls.length);
  const prevImage = () => imageUrls.length && setCurrentImageIndex(i => (i - 1 + imageUrls.length) % imageUrls.length);

  if (!project) return <div className="project-detail-page"><div className="project-detail-content"><div className="project-header-section black-background-section"><h1 className="project-detail-title">Loading project…</h1></div></div><Footer /></div>;

  const videoSource = getVideoUrl(project.videoSrc);
  const videoEmbed = getVideoEmbedUrl(project.videoSrc);
  const handleVideoError = () => setUseVideoEmbed(true);

  return (<div className="project-detail-page">
    <div className="project-detail-content">
      <div className="project-header-section black-background-section"><h1 className="project-detail-title">{project.title}</h1><p className="project-detail-category">{project.category}</p></div>
      {!project.isVertical && <div className="project-background-video-container">
        {isDirectVideoUrl(project.videoSrc) && !useVideoEmbed ? (
          <video autoPlay controls={false} loop muted playsInline className="project-background-video" preload="auto" onError={handleVideoError} {...(getVideoPoster(project.videoSrc) ? { poster: getVideoPoster(project.videoSrc) } : {})}>
            <source src={videoSource} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe src={videoEmbed} title={project.title || 'Project video'} className="project-background-video project-background-video-embed" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        )}
      </div>}
      <TextRevealSection text={project.description} />
      {!project.isVertical ? (project.showCarousel !== false && <div className="image-slideshow-container">
        {imageUrls.length > 0 && <img src={imageUrls[currentImageIndex]} alt={`${project.title} image ${currentImageIndex+1}`} className="project-image" onError={e => { e.currentTarget.style.display='none'; }} />}
        {imageUrls.length > 1 && <div className="slideshow-nav"><button onClick={prevImage} className="nav-button">&#10094;</button><button onClick={nextImage} className="nav-button">&#10095;</button></div>}
      </div>) : <div className="project-inline-video-container">
        {isDirectVideoUrl(project.videoSrc) && !useVideoEmbed ? (
          <video controls={false} autoPlay loop muted playsInline className="project-inline-video" preload="auto" onError={handleVideoError}>
            <source src={videoSource} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe src={videoEmbed} title={project.title || 'Project video'} className="project-inline-video project-inline-video-embed" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        )}
      </div>}
    </div>
    <Footer />
  </div>);
}
export default ProjectDetailPage;
