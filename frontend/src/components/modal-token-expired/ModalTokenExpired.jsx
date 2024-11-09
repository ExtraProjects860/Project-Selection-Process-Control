/* eslint-disable react/prop-types */
import './ModalTokenExpired.css'; 

function ModalTokenExpired({ title, message, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm}>OK</button>
      </div>
    </div>
  );
}

export default ModalTokenExpired;
