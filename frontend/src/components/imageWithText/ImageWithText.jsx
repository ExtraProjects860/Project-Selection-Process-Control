// src/components/ImageWithText.jsx
import React from 'react';
import './ImageWithText.css'; 

function ImageWithText({ text }) {
  return (
    <div className="image-with-text">
      <img src="/image.png" alt="Decorative" className="image" />
      <div className="text">{text}</div>
    </div>
  );
}

export default ImageWithText;
