import React from 'react';

import TextRevealSection from '../components/TextRevealSection';
import Footer from '../components/Footer';
import { blogs } from '../data/blogs';
import './WritingPage.css';

function WritingPage() {
  return (
    <div className="project-detail-page">
      
      <div className="project-detail-content w-80 mt-5">
        {blogs.map((blog, index) => (
          
          <div key={index} className="blog-entry">
            <div className="project-header-section black-background-section">
              <h3 className="project-detail-title">{blog.title}</h3>
            </div>

             <hr style={{ margin: '60px 0', borderColor: '#333' }} />
            <TextRevealSection text={blog.content} />

           
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default WritingPage;
