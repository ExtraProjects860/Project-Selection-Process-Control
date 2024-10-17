/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './AvaliableJobs.css';
import JobApplicationModal from '../job-application-modal/JobApplicationModal';
import { getAllJobs } from '../../services/jobs-service/JobsService';
import  Pagination  from '../pagination/Pagination';
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';


function AvaliableJobs({ onSuccess, onLoaded }) { 
  const [selectedJob, setSelectedJob] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); 

  const openApplicationModal = (job) => {
    setSelectedJob(job); 
    setIsModalOpen(true); 
  };

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs(currentPage); 
        if (data.tokenExpired) {
          setIsTokenExpired(true);
        }    

        if (data && data.vagas) {
          setAvailableJobs(data.vagas);
        } else {
          setAvailableJobs([]); 
        }

        if (data && data.total_de_paginas) {
          setTotalPages(data.total_de_paginas); 
        } else {
          setTotalPages(1); 
        }
      } catch (error) {
        setError('Erro ao carregar vagas.', error);
      } finally {
        setLoading(false); 
        onLoaded();
      }
    };

    fetchVagas();
  }, [currentPage, onLoaded]); 

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p className='txt'>{error}</p>;
  }

  return (
    <>
      <div className="jobs-container">
        <h2>VAGAS DISPONÍVEIS</h2>
        <div className="jobs-list">
        {isTokenExpired && (
        <ModalTokenExpired
          title="Sessão Expirada"
          message="Seu token de autenticação expirou. Faça login novamente."
          onConfirm={() => {
            localStorage.clear();
            setIsTokenExpired(false); 
            window.location.href = '/'; 
          }}
        />
      )}
          {availableJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.nome_vaga}</h3>
              <p>{job.descricao_vaga}</p>
              <hr />
              <button className='inscription-btn' onClick={() => openApplicationModal(job)}>
                Inscrever
              </button>
            </div>
          ))}
        </div>
        
        <Pagination  totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}/>
      </div>

      {selectedJob && (
        <JobApplicationModal
          jobDetails={selectedJob} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={onSuccess} 
        />
      )}
    </>
  );
}

export default AvaliableJobs;
