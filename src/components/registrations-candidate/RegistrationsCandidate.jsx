/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './RegistrationsCandidate.css';
import { showUserRegistrations, markFormAsResponded } from '../../services/jobs-service/JobsService';
import { usePagination } from "../table/logic/TablesLogic";
import styles from "../table/Table.module.css";
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import TooManyRequestsError from '../too-many-requests-error-page/TooManyRequestsErrorPage';

function RegistrationsCandidate({ updateTrigger, onLoaded }) { 
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [error, setError] = useState(null);
  const [isFormResponded, setIsFormResponded] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handleNextPage, handlePrevPage } = usePagination(totalPages);
  const [loading, setLoading] = useState(true); 
  const data = localStorage.getItem("userData");
  const userData = JSON.parse(data);
  const userId = userData.dados.id;
  const [tooManyRequests, setTooManyRequests] = useState(false);

  const fetchRegistrations = async (page) => {
    try {
      setLoading(true);
      setTooManyRequests(false);
      const response = await showUserRegistrations(userId, page);

      if (data && data.total_de_paginas) {
        setTotalPages(data.total_de_paginas); 
      }

      if (response && response.tooManyRequests) {
        setTooManyRequests(true);
      }

      if (response.inscricoes) { 
        setRegistrations(response.inscricoes);
      } else {
        setRegistrations([]); 
      }

      if (response && response.total_de_paginas) {
        setTotalPages(response.total_de_paginas); 
      }

    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      setError('Nenhuma inscrição encontrada.');
    } finally {
      onLoaded();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(currentPage);
  }, [updateTrigger, currentPage, onLoaded, userId]);

  const handleShowDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRegistration(null);
    setShowModal(false);
  };

  const handleFormResponded = async (idStatusProcessoSeletivo) => {
    try {
      const data = await markFormAsResponded(idStatusProcessoSeletivo);
      if (data.tokenExpired) {
        setIsTokenExpired(true);
      } 
      setIsFormResponded(true);
      setSelectedRegistration((prev) => ({
        ...prev,
        forms_respondido: 1, 
      }));
    } catch (error) {
      console.error('Erro ao marcar o formulário como respondido:', error);
    }
  };

  const handleRetry = () => {
    setTooManyRequests(false);
    fetchRegistrations(currentPage);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }  

  return (
    <><div className="registrations-container">
      <h2>MINHAS INSCRIÇÕES</h2>
      <div className="jobsList-candidate">
        {tooManyRequests && (
            <TooManyRequestsError onRetry={handleRetry} />
        )}

        {!loading && !error && !tooManyRequests && (
          <>
          {registrations.length > 0 ? (
            registrations.map((registration) => (
              <div key={registration.id_inscricao} className="registration-card">
                <h3>{registration.nome_vaga}</h3>
                <div className="infosCard-candidate">
                  <p>
                    Status da Inscrição:{" "}
                    {registration.status_processo || "Status não disponível"}
                  </p>
                  <p style={{
                    color: registration.status === 'ABERTA' ? 'green' : 'red'
                  }}>
                    Status da Vaga: {registration.status || "Status não disponível"}
                  </p>
                  <p>
                    Data da Entrevista:{" "}
                    {formatDateTime(registration.data_entrevista)}
                  </p>
                  <p>
                    Etapa Atual: {registration.nome_etapa || "Etapa não disponível"}
                  </p>
                </div>
                <div>
                  <hr />
                  <button onClick={() => handleShowDetails(registration)}>
                    Mais detalhes
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Você não tem inscrições ativas.</p>
          )}
          </>
        )}
        </div>

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

      {showModal && selectedRegistration && (
        <div className="modal-overlay">
          <div className="modal-content modalRegistrationContent">
            <h2>Inscrição para a vaga {selectedRegistration.nome_vaga}</h2>
            <div className="registrationData">
              <p> <b>Descrição da Vaga:</b> {selectedRegistration.descricao_vaga}</p>
              <p> <b>Status:</b> {selectedRegistration.status}</p>
              <p> <b>Salário:</b> {selectedRegistration.salario}</p>
              <p> <b>Setor:</b> {selectedRegistration.nome_setor}</p>
              <p> <b>Quantidade de Vagas:</b> {selectedRegistration.quantidade_vagas}</p>
              <p> <b>Etapa Atual:</b> {selectedRegistration.nome_etapa}</p>
              <p>
                <b>Data de Encerramento:</b>{" "}
                {formatDate(selectedRegistration.data_encerramento)}
              </p>
              <p>
                <b>Data da Entrevista:</b>{" "}
                {formatDateTime(selectedRegistration.data_entrevista)}
              </p>

              <p>
                {selectedRegistration.link ? (
                  <a
                    href={selectedRegistration.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acessar Forms
                  </a>
                ) : (
                  "Nenhum Forms Disponível"
                )}
              </p>
              
              <p
                style={{
                  color: selectedRegistration.forms_respondido === 0 ? "red" : "green",
                }}
              >
                {selectedRegistration.link && (
                  <>
                    <b>Formulário Respondido:</b>{" "}
                    {selectedRegistration.forms_respondido === 0 ? "Não" : "Sim"}
                  </>
                )}
              </p>


            </div>

            <div className="modal-buttons modalButtonsRegistration">
              {selectedRegistration.link && selectedRegistration.forms_respondido === 0 && !isFormResponded && (
                  <button className='btn-form'
                    onClick={() =>
                      setShowConfirmation(true)
                    }
                  >
                    Marcar como Respondido
                  </button>
              )}

              <button
                type="button"
                className="cancel-button"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
            </div>

            {showConfirmation && (
              <div className="confirmation-overlay">
                <div className="confirmation-box registrationModal-confirmationBox">
                  {!isConfirmed ? (
                    <>
                      <p>Só marque como respondido se você <b>realmente respondeu</b> o formulário.</p>
                      <div className="confirmation-buttons">
                        <button type="button" className="modal-save-button" onClick={() => {
                          handleFormResponded(selectedRegistration.id_status_processo_seletivo)
                          }}>Confirmar</button>
                        <button type="button" className="modal-cancel-button" onClick={() => {
                          setShowConfirmation(false);                        
                        }}>Cancelar</button>
                      </div>                    
                    </>
                  ) : (
                    <>
                      <p>Informação salva com sucesso!</p>
                      <div className="confirmation-buttons">
                        <button type="button" className="modal-save-button" onClick={() => {setIsConfirmed(false)}}>Ok</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              )}
          </div>
        </div>
      )}
    </div>
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
    </>
  ); 
  
}

export default RegistrationsCandidate;