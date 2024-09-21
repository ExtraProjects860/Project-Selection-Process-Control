import React, { useState } from 'react';
import './AvaliableJobs.css';
import Pagination from '../pagination/Pagination';
import JobApplicationModal from '../job-application-modal/JobApplicationModal';

function AvaliableJobs() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const availableJobs = [
        { id: 1, title: 'Vaga de Desenvolvedor Frontend', description: 'Desenvolva incríveis interfaces.' },
        { id: 2, title: 'Vaga de Designer UX/UI', description: 'Melhore a experiência do usuário.' },
        { id: 3, title: 'Vaga de Analista de Dados', description: 'Analise e transforme dados em insights.' },
      ];

      const jobDetails = {
        title: 'vaga tal',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.'
      };    
      
  return (
    <><div className="jobs-container">
          <h2>VAGAS DISPONÍVEIS</h2>
          <div className="jobs-list">
              
              {availableJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <hr></hr>
            <button className='inscription-btn' onClick={() => setIsModalOpen(true)}>Inscrever</button>
      <JobApplicationModal
        jobDetails={jobDetails}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
