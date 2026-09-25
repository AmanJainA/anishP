import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer id="contact" className="main-footer">
      <div className="footer-border-frame">
        
        <div className="footer-center-cta">
          <p className="cta-line-1">
            LET'S TALK
          </p>
          <p className="cta-line-2">
            <a href="mailto:anishwork1234@gmail.com" className="cta-link">MAIL</a>
            <span className="cta-separator"> // </span>
            <a href="https://www.instagram.com/qaafkaontheroad/" target="_blank" rel="noopener noreferrer" className="cta-link">INSTA</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
