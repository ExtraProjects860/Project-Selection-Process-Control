import './JobsPosting.css';
import { useState, useEffect } from 'react';
import Pagination from '../pagination/Pagination';
import JobEditionModal from '../job-edition-modal/JobEditionModal';
import JobExclusionModal from '../job-exclusion-modal/JobExclusionModal';
import CreateJobModal from '../job-creation-modal/JobCreationModal';
import CreateJobButton from '../add-button/AddButton';
import { getAllJobs } from '../../services/jobs-service/JobsService';

function JobsPosting() {
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [jobDetails, setJobDetails] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [listClass, setListClass] = useState('');

  useEffect(() => {
    const fetchVagas = async (page) => {
      try {
        setLoading(true);
        const data = await getAllJobs(page); 
        setJobDetails(data.vagas);
        setTotalPages(data.total_de_paginas);
      } catch (error) {
        setError('Erro ao carregar vagas.');
      } finally {
        setLoading(false);
      }
    };

    fetchVagas(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (jobDetails.length < 4) {
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
        <div className="inner-content">
          <h2>VAGAS</h2>
          <CreateJobButton onClick={openCreateModal} />
          <div className={`jobs-list ${listClass}`}>
            {jobDetails.map((job) => (
              <div key={job.id_vaga} className="job-card">
                <span className={job.status === "FECHADA" ? "closed-status" : "open-status"}>{job.status}</span>
                <div className="job-title-container">                  
                  <h3>{job.nome_vaga}</h3>
                </div>
                <div>
                  <hr></hr>
                  <div className='btns'>
                    <button className='edition-btn' onClick={() => openEditModal(job)}>Mais detalhes</button>
                    <button className='cancel-job-btn' onClick={() => openCancelModal(job)}>Encerrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <Pagination 
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}/>
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
