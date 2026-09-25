import React from 'react';
import { motion } from 'framer-motion';
import './TitlePage.css';


function TitlePage() {
  return (
    <div className="title-page-container">
      <video autoPlay loop muted playsInline className="background-video" loading="lazy" poster="/content/showcase.webp">
        <source src="/content/showcase.mp4" type="video/mp4"  />
        Your browser does not support the video tag.
      </video>
      <div className="color-overlay"></div>
      <div className="grid-overlay"></div>

      

      <div className="bottom-section">
        <p className="descriptive-text">
          I BELIEVE IN POWERFUL VISUALS AND HONEST CRAFT. BASED IN DELHI, I WORK ACROSS FILM, PHOTOGRAPHY, AND BRANDING — ALWAYS FROM THE GROUND UP.
        </p>
        <div className="call-to-action-area">
          <button className="cta-button" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>LET'S TALK</button>
        </div>
      </div>
    </div>
  );
}

export default TitlePage;