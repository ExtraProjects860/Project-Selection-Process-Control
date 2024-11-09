import React from 'react';
import styles from './TooManyRequestsErrorPage.module.css';

function TooManyRequestsError({ onRetry }) {
  return (
    <div className={styles.tooManyRequestsContainer}>
      <div className={styles.tooManyRequestsContent}>
        <h2 className={styles.errorTitle}>Erro 429 - Muitas requisições</h2>
        <p className={styles.errorMessage}>
          Você fez muitas requisições em um curto período de tempo. Por favor, aguarde alguns instantes e tente novamente.
        </p>
        <button className={styles.retryButton} onClick={onRetry}>
          Tentar Novamente
        </button>
      </div>
    </div>      
  );
}

export default TooManyRequestsError;
