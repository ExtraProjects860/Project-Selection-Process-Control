/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './RegistrationsCandidate.css';
import { showUserRegistrations } from '../../services/jobs-service/JobsService';
import Pagination from '../pagination/Pagination';

function RegistrationsCandidate({ updateTrigger, onLoaded }) { 
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const [totalPages, setTotalPages] = useState(1);
  const data = localStorage.getItem("userData");
  const userData = JSON.parse(data);
  const userId = userData.dados.id;

  const formatDate = (dateString) => {
    if (dateString === "None" || !dateString) return "Data não definida";
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
 

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await showUserRegistrations(userId, currentPage);
        setRegistrations(response.inscricoes); 
        setTotalPages(response.total_de_paginas);
        console.log(response);
        if (response.inscricoes) { 
          setRegistrations(response.inscricoes);
        } else {
          setRegistrations([]); 
        }
      } catch (error) {
        console.error('Erro ao carregar inscrições:', error);
      } finally {
        onLoaded();
        setLoading(false);
      }
    };
  
    fetchRegistrations();
  }, [updateTrigger, currentPage, onLoaded, userId]);

  const handleShowDetails = (registration) => {
    setSelectedRegistration(registration);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedRegistration(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  

  return (
    <><div className="registrations-container">
      <h2>MINHAS INSCRIÇÕES</h2>
      {registrations.length > 0 ? (
        registrations.map((registration) => (
          <div key={registration.id_inscricao} className="registration-card">
            <h3>{registration.nome_vaga}</h3>
            <p>
              Status da Inscrição:{" "}
              {registration.status_processo || "Status não disponível"}
            </p>
            <p>
              Status da Vaga: {registration.status || "Status não disponível"}
            </p>
            <p>
              Data da Entrevista:{" "}
              {registration.data_entrevista !== "None"
                ? registration.data_entrevista
                : "Data não marcada"}
            </p>
            <p>
              Etapa Atual: {registration.nome_etapa || "Etapa não disponível"}
            </p>
            <button onClick={() => handleShowDetails(registration)}>
              Mais detalhes
            </button>
          </div>
        ))
      ) : (
        <p>Você não tem inscrições ativas.</p>
      )}



      {showModal && selectedRegistration && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Inscrição para a vaga {selectedRegistration.nome_vaga}</h2>
            <p>Descrição da Vaga: {selectedRegistration.descricao_vaga}</p>
            <p>Status: {selectedRegistration.status}</p>
            <p>Salário: {selectedRegistration.salario}</p>
            <p>Setor: {selectedRegistration.nome_setor}</p>
            <p>Quantidade de Vagas: {selectedRegistration.quantidade_vagas}</p>
            <p>Etapa Atual: {selectedRegistration.nome_etapa}</p>
            <p>
              Data de Encerramento:{" "}
              {formatDate(selectedRegistration.data_encerramento)}
            </p>
            <p>
              Data da Entrevista:{" "}
              {selectedRegistration.data_entrevista !== "None"
                ? selectedRegistration.data_entrevista
                : "Data não marcada"}
            </p>

            
            <p
              style={{
                color: selectedRegistration.forms_respondido === 0 ? "red" : "black",
              }}
            >
              Formulário Respondido:{" "}
              {selectedRegistration.forms_respondido === 0 ? "Não" : "Sim"}
            </p>

            <p>
              <a
                href={selectedRegistration.link_forms}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar formulário
              </a>
            </p>

            <div className="modal-buttons">
              <button
                type="button"
                className="modal-cancel-button"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className='div-pagination'>
    <Pagination  totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage} />
    </div>
    </>
  ); 
  
}

export default RegistrationsCandidate;
