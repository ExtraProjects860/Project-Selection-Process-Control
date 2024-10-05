import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Ícones de ordenação
import { PencilSquare } from "react-bootstrap-icons"; // Ícone de edição
import EditModal from "../modalEditorTable/EditModalCandidatos";
import Modal from "react-bootstrap/Modal"; // Importe o Modal do React-Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Table.module.css";

function CandidatesTable() {
  const [candidates, setCandidates] = useState([
    {
      dataEtapa1: "2023-09-01",
      candidato: "Mark Otto",
      cargo: "Desenvolvedor",
      contato: "mark@example.com",
      setor: "Tecnologia",
      etapaAtual: "Entrevista Técnica",
      perfil: "Senior",
      status: "Em andamento",
      observacao: "Entrevista agendada para semana que vem",
    },
    {
      dataEtapa1: "2023-09-02",
      candidato: "Jacob Thornton",
      cargo: "Analista",
      contato: "jacob@example.com",
      setor: "Marketing",
      etapaAtual: "Testes de Habilidades",
      perfil: "Pleno",
      status: "Aguardando feedback",
      observacao: "Testes entregues, aguardando resposta",
    },
    {
      dataEtapa1: "2023-09-03",
      candidato: "Larry Bird",
      cargo: "Gerente de Projetos",
      contato: "larry@example.com",
      setor: "Gestão",
      etapaAtual: "Entrevista Final",
      perfil: "Sênior",
      status: "Aprovado",
      observacao: "Aprovação pendente de documentação",
    },
  ]);

  const [selectedColumn, setSelectedColumn] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState(null); // Novo estado para o texto completo

  const itemsPerPage = 8; // Defina quantos itens por página você deseja
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(candidates.length / itemsPerPage);

  // Retorna os dados da página atual
  const currentData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return candidates.slice(startIndex, endIndex);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    if (sortConfig.direction === "ascending") return <FaSortUp />;
    return <FaSortDown />;
  };

  const handleEditClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleSave = (updatedCandidate) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map((candidate) =>
        candidate.candidato === updatedCandidate.candidato
          ? updatedCandidate
          : candidate
      )
    );
    setShowModal(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleCellClick = (text, columnName) => {
    setFullText(text);
    setSelectedColumn(columnName);
  };

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th colSpan={10} className={styles.tableTitle}>
              CANDIDATOS
            </th>
          </tr>
          <tr className={styles.tableHeader}>
            <th onClick={() => handleSort("dataEtapa1")}>
              DATA ETAPA 1 {getSortIcon("dataEtapa1")}
            </th>
            <th onClick={() => handleSort("candidato")}>
              CANDIDATO {getSortIcon("candidato")}
            </th>
            <th onClick={() => handleSort("cargo")}>
              CARGO {getSortIcon("cargo")}
            </th>
            <th onClick={() => handleSort("contato")}>
              CONTATO {getSortIcon("contato")}
            </th>
            <th onClick={() => handleSort("setor")}>
              SETOR {getSortIcon("setor")}
            </th>
            <th onClick={() => handleSort("etapaAtual")}>
              ETAPA ATUAL {getSortIcon("etapaAtual")}
            </th>
            <th onClick={() => handleSort("perfil")}>
              PERFIL {getSortIcon("perfil")}
            </th>
            <th onClick={() => handleSort("status")}>
              STATUS {getSortIcon("status")}
            </th>
            <th onClick={() => handleSort("observacao")}>
              OBSERVAÇÃO {getSortIcon("observacao")}
            </th>
            <th>AÇÃO</th>
          </tr>
        </thead>
        <tbody>
          {currentData().map((candidate, index) => (
            <tr key={index}>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.dataEtapa1, "DATA ETAPA 1")}
              >
                {candidate.dataEtapa1}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.candidato, "CANDIDATO")}
              >
                {candidate.candidato}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.cargo, "CARGO")}
              >
                {candidate.cargo}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.contato, "CONTATO")}
              >
                {candidate.contato}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.setor, "SETOR")}
              >
                {candidate.setor}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.etapaAtual, "ETAPA ATUAL")}
              >
                {candidate.etapaAtual}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.perfil, "PERFIL")}
              >
                {candidate.perfil}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.status, "STATUS")}
              >
                {candidate.status}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.observacao, "OBSERVAÇÃO")}
              >
                {candidate.observacao}
              </td>
              <td>
                <PencilSquare
                  className="action-icon"
                  style={{
                    cursor: "pointer",
                    marginRight: "10px",
                    color: "#006C98",
                  }}
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
          candidate={selectedCandidate}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Modal para exibir o texto completo */}
      <Modal show={fullText !== null} onHide={() => setFullText(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedColumn} - Texto Completo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{fullText}</Modal.Body>
        <Modal.Footer>
          <button
            className="btn"
            style={{
              backgroundColor: "#006C98",
              color: "white",
              border: "none",
            }} // Estilo inline
            onClick={() => setFullText(null)}
          >
            Fechar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CandidatesTable;
