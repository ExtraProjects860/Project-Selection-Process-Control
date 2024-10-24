import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { PencilSquare } from "react-bootstrap-icons";
import EditModal from "../modalEditorTable/EditModalCandidatos";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Table.module.css";
import LoadingSpinner from "../spinnerLoadingTable/LoadingSpinnerTable";
import { getProcessStatusCandidates } from "../../services/get-data-table-service/GetDataTableService";
import { usePagination, useEditCandidateOrUser } from "./logic/TablesLogic";

function CandidatesTable({ searchTerm }) {
  const [candidates, setCandidates] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTextModal, setShowTextModal] = useState(false); // Estado para controlar a modal de texto completo
  const [selectedText, setSelectedText] = useState(""); // Estado para armazenar o texto selecionado

  const { currentPage, handleNextPage, handlePrevPage } = usePagination(totalPages);
  const { selectedCandidate, showModal, handleEditClick, setShowModal } = useEditCandidateOrUser();

  const token = localStorage.getItem('token');

  const filteredCandidates = candidates.filter(candidate => {
    // Filtra os candidatos com base em qualquer campo que contenha o termo de busca
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      candidate.nome_usuario.toLowerCase().includes(lowerSearchTerm) ||
      candidate.telefone.toLowerCase().includes(lowerSearchTerm) ||
      candidate.email.toLowerCase().includes(lowerSearchTerm) ||
      candidate.nome_cargo.toLowerCase().includes(lowerSearchTerm) ||
      candidate.nome_setor.toLowerCase().includes(lowerSearchTerm) ||
      candidate.status_processo.toLowerCase().includes(lowerSearchTerm)
    );
  });

  useEffect(() => {
    async function fetchData(page) {
      try {
        setLoading(true);
        const data = await getProcessStatusCandidates(page, token);
        setCandidates(data.status_processo_seletivo);
        setTotalPages(data.total_de_paginas);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar os dados');
        setLoading(false);
      }
  }

  fetchData(currentPage);
  }, [currentPage]);

  const handleTextClick = (text) => {
    setSelectedText(text); // Define o texto selecionado
    setShowTextModal(true); // Exibe a modal de texto completo
  };

  const handleTextModalClose = () => {
    setShowTextModal(false); // Fecha a modal de texto completo
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th colSpan={15} className={styles.tableTitle}>
            CANDIDATOS
          </th>
        </tr>
        <tr className={styles.tableHeader}>
          <th>ID</th>
          <th>NOME DO USUÁRIO</th>
          <th>TELEFONE</th>
          <th>EMAIL</th>
          <th>CARGO</th>
          <th>SETOR</th>
          <th>ETAPA ATUAL</th>
          <th>STATUS</th>
          <th>DATA ENTREVISTA</th>
          <th>DATA CONCLUSÃO</th>
          <th>FORMS RESPONDIDO</th>
          <th>AVALIAÇÃO FORMS</th>
          <th>PERFIL</th>
          <th>OBSERVAÇÃO</th>
          <th>AÇÃO</th>
        </tr>
      </thead>
      <tbody>
      {filteredCandidates.map(candidate => (
          <tr key={candidate.id_status_processo_seletivo}>
            <td>{candidate.id_status_processo_seletivo}</td>
            <td onClick={() => handleTextClick(candidate.nome_usuario)} style={{ cursor: 'pointer' }}>{candidate.nome_usuario}</td>
            <td onClick={() => handleTextClick(candidate.telefone)} style={{ cursor: 'pointer' }}>{candidate.telefone}</td>
            <td onClick={() => handleTextClick(candidate.email)} style={{ cursor: 'pointer' }}>{candidate.email}</td>
            <td onClick={() => handleTextClick(candidate.nome_cargo)} style={{ cursor: 'pointer' }}>{candidate.nome_cargo}</td>
            <td onClick={() => handleTextClick(candidate.nome_setor)} style={{ cursor: 'pointer' }}>{candidate.nome_setor}</td>
            <td onClick={() => handleTextClick(candidate.nome_etapa)} style={{ cursor: 'pointer' }}>{candidate.nome_etapa}</td>
            <td onClick={() => handleTextClick(candidate.status_processo)} style={{ cursor: 'pointer' }}>{candidate.status_processo}</td>
            <td onClick={() => handleTextClick(candidate.data_entrevista)} style={{ cursor: 'pointer' }}>{candidate.data_entrevista}</td>
            <td onClick={() => handleTextClick(candidate.data_conclusao)} style={{ cursor: 'pointer' }}>{candidate.data_conclusao}</td>
            <td>{candidate.forms_respondido ? "Sim" : "Não"}</td>
            <td>{candidate.avaliacao_forms || "N/A"}</td>
            <td onClick={() => handleTextClick(candidate.perfil)} style={{ cursor: 'pointer' }}>{candidate.perfil || "N/A"}</td>
            <td onClick={() => handleTextClick(candidate.observacao)} style={{ cursor: 'pointer' }}>{candidate.observacao || "N/A"}</td>
            <td>
              <PencilSquare 
                className="text-primary" 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleEditClick(candidate)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <div className={styles.pagination}>
      <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
      </button>
        <span
          className={styles.pageInfo}
        >{`Página ${currentPage} de ${totalPages}`}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Próxima
      </button>
    </div>
    
    {selectedCandidate && (
      <EditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        candidate={selectedCandidate}
      />
    )}

    {/* Modal para exibir o texto completo */}
    <Modal show={showTextModal} onHide={handleTextModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Texto Completo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{selectedText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleTextModalClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default CandidatesTable;
