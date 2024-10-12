import { useState, useEffect } from 'react';
import './AvaliableJobs.css';
import Pagination from '../pagination/Pagination';
import JobApplicationModal from '../job-application-modal/JobApplicationModal';
import { getAllJobs, saveResumeApplication } from '../../services/jobs-service/JobsService';

function AvaliableJobs() {
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  
  const openApplicationModal = (job) => {
    setSelectedJob(job); 
    setIsModalOpen(true); 
  };

 
  useEffect(() => {
    const fetchVagas = async () => {
      try {
        const data = await getAllJobs(); 
        setAvailableJobs(data.vagas); 
      } catch (error) {
        setError('Erro ao carregar vagas.');
      } finally {
        setLoading(false); 
      }
    };

    fetchVagas();
  }, []); 

 
  if (loading) {
    return <p className='txt'>Carregando vagas...</p>;
  }

  
  if (error) {
    return <p className='txt'>{error}</p>;
  }

  return (
    <>
      <div className="jobs-container">
        <h2>VAGAS DISPONÍVEIS</h2>
        <div className="jobs-list">
          {availableJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.nome_vaga}</h3> {}
              <p>{job.descricao_vaga}</p>
              <hr />
              <button className='inscription-btn' onClick={() => openApplicationModal(job)}>
                Inscrever
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <Pagination />
        </div>
      </div>

      {selectedJob && (
        <JobApplicationModal
          jobDetails={selectedJob} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default AvaliableJobs;
