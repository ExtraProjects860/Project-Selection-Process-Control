import { useState } from 'react';
import './JobsPosting.css';
import Pagination from '../pagination/Pagination';
import JobEditionModal from '../job-edition-modal/JobEditionModal';
import JobExclusionModal from '../job-exclusion-modal/JobExclusionModal';

function JobsPosting() {
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);

  const jobDetails = [
    {
      id: 1,
      title: "Vaga de Desenvolvedor Frontend",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    {
      id: 2,
      title: "Vaga de Designer UX/UI",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
    {
      id: 3,
      title: "Vaga de Analista de Dados",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet.",
    },
  ];

  const openEditModal = (job) => {
    setIsModalOpen(false); // Fecha o modal de edição atual, se aberto
    setSelectedJob(job); // Define a vaga selecionada
    setIsModalOpen(true); // Abre o modal de edição
  };

  const openCancelModal = (job) => {
    setIsModalOpen(false); // Fecha o modal de edição atual, se aberto
    setSelectedJob(job); // Define a vaga selecionada
    setIsModalCancelOpen(true); // Abre o modal de exclusão
  };

  return (
    <>
      <div className="jobs-container">
        <h2>VAGAS</h2>
        <div className="jobs-list">
          {jobDetails.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <hr></hr>
              <div className='btns'>
                <button className='edition-btn' onClick={() => openEditModal(job)}>Editar</button>
                <button className='cancel-job-btn' onClick={() => openCancelModal(job)}>Encerrar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <Pagination />
        </div>
      </div>
      
      {selectedJob && isModalOpen && (
        <JobEditionModal
          jobDetails={selectedJob}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}

      {selectedJob && isModalCancelOpen && (
        <JobExclusionModal
          jobDetails={selectedJob}
          isOpen={isModalCancelOpen}
          onClose={() => {
            setIsModalCancelOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </>
  );
}

export default JobsPosting;
