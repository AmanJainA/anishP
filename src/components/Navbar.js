import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useScrollDirection from '../hooks/useScrollDirection';
import './Navbar.css';

function Navbar({ isDark }) {
  const scrollDirection = useScrollDirection();

  const handleMenuClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.header
      className={`main-header ${isDark ? 'dark-navbar' : ''}`}
      initial={{ opacity: 1, y: 0 }}
      animate={{ 
        opacity: scrollDirection === 'down' ? 0 : 1,
        y: scrollDirection === 'down' ? -7.5 : 0
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeInOut"
      }}
    >
      <div className="main-logo">
        <Link to="/" onClick={handleMenuClick}>ANISH JAIN</Link>
      </div>
      <nav className="main-nav">
        <Link to="/about" onClick={handleMenuClick}>ABOUT</Link>
        <Link to="/portfolio" onClick={handleMenuClick}>PORTFOLIO</Link>
        <Link to="/writing" onClick={handleMenuClick}>WRITING</Link>
        <a href="#contact">CONTACT</a>
      </nav>
    </motion.header>
  );
}

export default Navbar;