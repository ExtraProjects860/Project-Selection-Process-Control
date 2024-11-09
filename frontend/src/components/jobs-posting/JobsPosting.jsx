import './JobsPosting.css';
import { useState, useEffect } from 'react';
import { usePagination } from "../table/logic/TablesLogic";
import styles from "../table/Table.module.css";
import JobEditionModal from '../job-edition-modal/JobEditionModal';
import JobExclusionModal from '../job-exclusion-modal/JobExclusionModal';
import CreateJobModal from '../job-creation-modal/JobCreationModal';
import CreateJobButton from '../add-button/AddButton';
import { getAllJobs } from '../../services/jobs-service/JobsService';
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';
import TooManyRequestsError from '../too-many-requests-error-page/TooManyRequestsErrorPage';

function JobsPosting() {
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [jobDetails, setJobDetails] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [tooManyRequests, setTooManyRequests] = useState(false);

  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handleNextPage, handlePrevPage } = usePagination(totalPages);

  const [listClass, setListClass] = useState('');

  const fetchVagas = async (page) => {
    try {
      setLoading(true);
      setTooManyRequests(false);
      const data = await getAllJobs(page); 
      if (data && data.tokenExpired) {
        setIsTokenExpired(true);
      } else if (data && data.tooManyRequests) {
        setTooManyRequests(true);
      } else {
        setJobDetails(data.vagas);
        setTotalPages(data.total_de_paginas);
      }
    } catch (error) {
      setError('Vagas não encontradas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVagas(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (jobDetails && jobDetails.length < 4) {
      setListClass('has-less-than-four');
    } else {
      setListClass('');
    }
  }, [jobDetails]);

  const openEditModal = (job) => {
    setIsModalOpen(false);
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const openCancelModal = (job) => {
    setIsModalOpen(false);
    setSelectedJob(job);
    setIsModalCancelOpen(true);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Função para tentar novamente
  const handleRetry = () => {
    setTooManyRequests(false);
    fetchVagas(currentPage);
  };

  return (
    <>
      <div className="jobsContainer">
        <div className="innerContent">
          <h2 className='titleAdminPage'>VAGAS</h2>
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
          <CreateJobButton onClick={openCreateModal} />

          {tooManyRequests && (
            <TooManyRequestsError onRetry={handleRetry} />
          )}

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}


          {error && !tooManyRequests && <p className='txt'>{error}</p>}

          {!loading && !error && !tooManyRequests && (
            <div className={`jobsList ${listClass}`}>
              {jobDetails && jobDetails.map((job) => (
                <div key={job.id_vaga} className="jobCard">
                  <span className={job.status === "FECHADA" ? "closed-status" : "open-status"}>{job.status}</span>
                  <div className="jobTitleContainer">                  
                    <h3 className="titleCardAdmin">{job.nome_vaga}</h3>
                  </div>
                  <div>
                    <hr></hr>
                    <div className='btnsCard'>
                      <button className='editionBtn' onClick={() => openEditModal(job)}>Mais detalhes</button>
                      <button className='cancelJobBtn' onClick={() => openCancelModal(job)}>Encerrar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className='div-pagination'>
            <div className={styles.pagination}>
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                Anterior
              </button>
              <span className={styles.pageInfo}>
                {`Página ${currentPage} de ${totalPages}`}
              </span>
              <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Próxima
              </button>
            </div>
          </div>

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

      {isCreateModalOpen && (
        <CreateJobModal
          jobDetails={selectedJob}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </>
  );
}

export default JobsPosting;
