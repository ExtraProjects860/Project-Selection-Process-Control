/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import styles from './AvaliableJobs.module.css';
import JobApplicationModal from '../job-application-modal/JobApplicationModal';
import { getAllJobs } from '../../services/jobs-service/JobsService';
import { usePagination } from "../table/logic/TablesLogic";
import stylesPagination from "../table/Table.module.css";
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';
import TooManyRequestsError from '../too-many-requests-error-page/TooManyRequestsErrorPage';
import { formatDate } from '../../utils/dateUtils';

function AvaliableJobs({ onSuccess, onLoaded }) { 
  const [selectedJob, setSelectedJob] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); 
  const { currentPage, handleNextPage, handlePrevPage } = usePagination(totalPages);
  const [tooManyRequests, setTooManyRequests] = useState(false);

  const openApplicationModal = (job) => {
    setSelectedJob(job); 
    setIsModalOpen(true); 
  };

  const fetchVagas = async (page) => {
    try {
      setLoading(true);
      setTooManyRequests(false);
      const data = await getAllJobs(page);
      if (data.tokenExpired) {
        setIsTokenExpired(true);
      }

      if (data && data.tooManyRequests) {
        setTooManyRequests(true);
      }
      
      if (data && data.vagas) {
        setAvailableJobs(data.vagas);
      } else {
        setAvailableJobs([]); 
      }

      if (data && data.total_de_paginas) {
        setTotalPages(data.total_de_paginas); 
      }

    } catch (error) {
      setError('Nenhuma vaga encontrada.');
    } finally {
      setLoading(false); 
      onLoaded();
    }
  };

  useEffect(() => {
    fetchVagas(currentPage);
  }, [currentPage, onLoaded]); 

  // Função para tentar novamente
  const handleRetry = () => {
    setTooManyRequests(false);
    fetchVagas(currentPage);
  };

  if (loading) {
    return (
      <div className={styles.loading_overlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error && !tooManyRequests) {
    return (
      <div className={styles.jobs_container}>
        <h2>VAGAS DISPONÍVEIS</h2>
        <p 
          className='txt' 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '20vh',
            textAlign: 'center'
          }}
        >
          
          {error}
        </p>
      </div>
    );
  } 

  return (
    <>
      <div className={styles.jobs_container}>
        <h2>VAGAS DISPONÍVEIS</h2>
        <div className={styles.jobs_list}>
          {tooManyRequests && (
            <TooManyRequestsError onRetry={handleRetry} />
          )}
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
          {!loading && !error && !tooManyRequests && (
            <>
              {availableJobs
                .map(job => (
                  <div key={job.id} className={styles.job_card}>
                    <h3>{job.nome_vaga}</h3>
                    <p
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Descrição:
                    </p>
                    <p className={styles.description_jobCard}>{job.descricao_vaga}</p>
                    <p
                      style={{
                        fontWeight: 'bold',
                      }}
                    >
                      Data de Encerramento: {formatDate(job.data_encerramento)}
                    </p>
                    <div>
                      <hr />
                      <button className={styles.inscription_btn} onClick={() => openApplicationModal(job)}>
                        Inscrever
                      </button>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
        
        <div className='div-pagination'>
          <div className={stylesPagination.pagination}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span className={stylesPagination.pageInfo}>
              {`Página ${currentPage} de ${totalPages}`}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Próxima
            </button>
          </div>
        </div>
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
