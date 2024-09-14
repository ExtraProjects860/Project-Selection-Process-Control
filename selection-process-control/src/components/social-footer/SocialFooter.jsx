import React from 'react';
import './SocialFooter.css';
import facebook from '../../assets/icon/facebook.svg';
import instagram from '../../assets/icon/instagram.svg'

function SocialFooter() {
  return (
    <footer className="social-footer">
      <a href="https://facebook.com" className="social-icon" > <img src={facebook} /> </a>
      <a href="https://instagram.com" className="social-icon"><img src={instagram} /></a>
    </footer>
  );
}

export default SocialFooter;
