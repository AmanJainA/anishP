import React from 'react';
import TextRevealSection from '../components/TextRevealSection';
import Footer from '../components/Footer';

import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page-container">
      
      <div className="about-page-content">
        
        <TextRevealSection text={`I'm a filmmaker, writer, editor, and visual storyteller from Alwar, currently based in Delhi.

I didn’t go to film school. I went straight to the films. Since then, I’ve worked across short films, branded content, documentaries, and social media visuals — often wearing multiple hats from direction to post.

I approach every project from the ground up — whether it's a cinematic reel or a 30-second ad. I care deeply about rhythm, emotion, and what lingers after the final frame.

When I’m not working, I’m usually watching films, overanalysing them, writing my next idea down, or listening to old-school hip-hop on loop.`} />
        <Footer />
      </div>
    </div>
  );
}

export default AboutPage;