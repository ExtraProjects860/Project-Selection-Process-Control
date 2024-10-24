import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./LoadingSpinner.module.css"; // Crie o CSS para o fundo escuro

function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <Spinner animation="border" role="status" className={styles.spinner}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default LoadingSpinner;