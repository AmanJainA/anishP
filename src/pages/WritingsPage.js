import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getWritings } from '../data/writings';
import './WritingsPage.css';

function WritingsPage() {
  const [writings, setWritings] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getWritings().then(setWritings).catch(e => setError(e.message || 'Unable to load writings.'));
  }, []);
  return (
    <div className="writings-page-container">
      <Navbar />
      <div className="writings-page-content mg-t">
        <h1>My Writings</h1>
        {error && <p>{error}</p>}
        {!error && writings.length === 0 && <p>Loading writings...</p>}
        {writings.map(item => (
          <article key={item.external_id || item.url || item.title}>
            <h2>{item.title}</h2>
            {item.url && <a href={item.url} target="_blank" rel="noreferrer">Read article</a>}
          </article>
        ))}
      </div>
      <Footer />
    </div>
  );
}
export default WritingsPage;
