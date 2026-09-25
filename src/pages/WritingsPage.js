import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './WritingsPage.css';

function WritingsPage() {
  return (
    <div className="writings-page-container">
      <Navbar />
      <div className="writings-page-content mg-t">
        <h1>My Writings</h1>
        <p>This page will list my blog posts.</p>
      </div>
      <Footer />
    </div>
  );
}

export default WritingsPage;
