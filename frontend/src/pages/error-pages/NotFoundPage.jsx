import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

  const NotFoundPage = () => {
    const navigate = useNavigate();
  
    const goBack = () => {
      navigate(-1) ? window.history.length > 2 : navigate('/');
    };
  
    return (
      <div className="not-found-container">
        <h1 className="not-found-title">Ops... Erro 404</h1>
        <p className="not-found-text">Essa página ou rota infelizmente não existe, tente retornar para a página anterior.</p>
        <button onClick={goBack} className="not-found-link">Voltar</button>
      </div>
    );
  };

export default NotFoundPage;