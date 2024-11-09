import React from 'react';
import './AddButton.css';

function CreateJobButton({ onClick }) {
  return (
    <div className="btnContainer">
        <button className="createJobButton" onClick={onClick}>
          <span>+</span>
        </button>            
    </div>
  );
}

export default CreateJobButton;