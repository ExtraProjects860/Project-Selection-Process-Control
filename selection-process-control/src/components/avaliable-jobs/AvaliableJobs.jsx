import React from 'react';
import './AvaliableJobs.css';
import Pagination from '../pagination/Pagination';

function AvaliableJobs() {

    const availableJobs = [
        { id: 1, title: 'Vaga de Desenvolvedor Frontend', description: 'Desenvolva incríveis interfaces.' },
        { id: 2, title: 'Vaga de Designer UX/UI', description: 'Melhore a experiência do usuário.' },
        { id: 3, title: 'Vaga de Analista de Dados', description: 'Analise e transforme dados em insights.' },
      ];
      
  return (
    <><div className="jobs-container">
          <h2>VAGAS DISPONÍVEIS</h2>
          <div className="jobs-list">
              
              {availableJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <hr></hr>
            <button>Inscrever</button>
          </div>
        ))}

          </div>
          <div className="pagination">
            <Pagination/>
          </div>
      </div>
      </>
  );
}

export default AvaliableJobs;
