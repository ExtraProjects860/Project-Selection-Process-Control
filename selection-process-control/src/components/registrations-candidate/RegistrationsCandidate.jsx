import React from 'react';
import './RegistrationsCandidate.css';

function RegistrationsCandidate() {
  return (
    <div className="registrations-container">
      <h2>MINHAS INSCRIÇÕES</h2>
      <div className="registration-card">
        <h3>Vaga Tal</h3>
        <p>Status da Inscrição: Inscrito</p>
        <p>Status da vaga: Aberta</p>
        <p>Data da entrevista: 10/10/2024</p>
        <p>Etapa atual: Entrevista</p>
        <button>Mais detalhes</button>
      </div>
    </div>
  );
}

export default RegistrationsCandidate;
