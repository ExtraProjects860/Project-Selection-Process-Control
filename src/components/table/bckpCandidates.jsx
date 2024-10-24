import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { PencilSquare } from "react-bootstrap-icons";
import EditModal from "../modalEditorTable/EditModalCandidatos";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Table.module.css";

function CandidatesTable({ searchTerm }) {
  const [candidates, setCandidates] = useState([
    {
      nome_usuario: "Ana Silva",
      telefone: "21999999999",
      email: "ana.silva@gmail.com",
      nome_cargo: "Desenvolvedor Frontend",
      nome_setor: "Desenvolvimento",
      nome_etapa: "Entrevista Técnica",
      status_processo: "FINALIZADO",
      id_status_processo_seletivo: 2,
      data_entrevista: "2024-07-15",
      data_conclusao: "2024-08-01",
      forms_respondido: 1,
      avaliacao_forms: 8,
      perfil: "Pleno",
      observacao: "Ótima desenvolvedora, perfil para liderança.",
    },
    {
      nome_usuario: "Bruno Oliveira",
      telefone: "21988888888",
      email: "bruno.oliveira@gmail.com",
      nome_cargo: "Estagiário de Suporte",
      nome_setor: "Suporte Técnico",
      nome_etapa: "Forms Inicial",
      status_processo: "EM ANDAMENTO",
      id_status_processo_seletivo: 3,
      data_entrevista: "2024-10-01",
      data_conclusao: "None",
      forms_respondido: 0,
      avaliacao_forms: null,
      perfil: null,
      observacao: "Aguardando entrevista.",
    },
    {
      nome_usuario: "Clara Mendes",
      telefone: "21977777777",
      email: "clara.mendes@gmail.com",
      nome_cargo: "Analista de Marketing",
      nome_setor: "Marketing",
      nome_etapa: "Dinâmica de Grupo",
      status_processo: "EM ANDAMENTO",
      id_status_processo_seletivo: 1,
      data_entrevista: "2024-09-25",
      data_conclusao: "None",
      forms_respondido: 1,
      avaliacao_forms: 7,
      perfil: "Júnior",
      observacao: "Participou bem na dinâmica, perfil colaborativo.",
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

  // Filtra candidatos com base no texto de busca
  const filteredCandidates = candidates.filter((candidate) =>
    candidate.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para ordenar os dados
  const currentData = () => {
    // Clona os candidatos filtrados
    let sortedCandidates = [...filteredCandidates];

    // Aplica a ordenação se sortConfig.key estiver definido
    if (sortConfig.key) {
      sortedCandidates.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Retorna os dados da página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedCandidates.slice(startIndex, endIndex);
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
    console.log("Candidato selecionado para edição:", candidate); // Adicione isto
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleSave = (updatedCandidate) => {
    setCandidates((prevCandidates) =>
      prevCandidates.map(
        (candidate) =>
          candidate.id_status_processo_seletivo ===
          updatedCandidate.id_status_processo_seletivo
            ? updatedCandidate // Atualiza apenas o candidato editado
            : candidate // Mantém os outros inalterados
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
            <th colSpan={15} className={styles.tableTitle}>
              CANDIDATOS
            </th>
          </tr>
          <tr className={styles.tableHeader}>
            <th onClick={() => handleSort("nome_usuario")}>
              NOME USUÁRIO {getSortIcon("nome_usuario")}
            </th>
            <th onClick={() => handleSort("telefone")}>
              TELEFONE {getSortIcon("telefone")}
            </th>
            <th onClick={() => handleSort("cargo")}>
              EMAIL {getSortIcon("email")}
            </th>
            <th onClick={() => handleSort("nome_cargo")}>
              CARGO {getSortIcon("nome_cargo")}
            </th>
            <th onClick={() => handleSort("nome_setor")}>
              SETOR {getSortIcon("nome_setor")}
            </th>
            <th onClick={() => handleSort("nome_etapa")}>
              ETAPA ATUAL {getSortIcon("nome_etapa")}
            </th>
            <th onClick={() => handleSort("status_processo")}>
              STATUS {getSortIcon("status_processo")}
            </th>
            <th onClick={() => handleSort("id_status_processo_seletivo")}>
              ID {getSortIcon("id_status_processo_seletivo")}
            </th>
            <th onClick={() => handleSort("data_entrevista")}>
              DATA ENTREVISTA {getSortIcon("data_entrevista")}
            </th>
            <th onClick={() => handleSort("data_conclusao")}>
              DATA CONCLUSÃO {getSortIcon("data_conclusao")}
            </th>
            <th onClick={() => handleSort("forms_respondido")}>
              FORMS RESPONDIDO {getSortIcon("forms_respondido")}
            </th>
            <th onClick={() => handleSort("avaliacao_forms")}>
              AVALIAÇÃO FORMS {getSortIcon("C")}
            </th>
            <th onClick={() => handleSort("perfil")}>
              PERFIL {getSortIcon("perfil")}
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
                onClick={() =>
                  handleCellClick(candidate.nome_usuario, "NOME USUÁRIO")
                }
              >
                {candidate.nome_usuario}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.telefone, "TELEFONE")}
              >
                {candidate.telefone}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.email, "email")}
              >
                {candidate.email}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.nome_cargo, "CARGO")}
              >
                {candidate.nome_cargo}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.nome_setor, "SETOR")}
              >
                {candidate.nome_setor}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.nome_etapa, "ETAPA ATUAL")
                }
              >
                {candidate.nome_etapa}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.status_processo, "STATUS")
                }
              >
                {candidate.status_processo}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.id_status_processo_seletivo, "ID")
                }
              >
                {candidate.id_status_processo_seletivo}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.data_entrevista, "DATA ENTREVISTA")
                }
              >
                {candidate.data_entrevista}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.data_conclusao, "DATA CONCLUSÃO")
                }
              >
                {candidate.data_conclusao}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(
                    candidate.forms_respondido,
                    "FORMS RESPONDIDO"
                  )
                }
              >
                {candidate.forms_respondido}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.avaliacao_forms, "AVALIAÇÃO FORMS")
                }
              >
                {candidate.avaliacao_forms}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(candidate.perfil, "PERFIL")}
              >
                {candidate.perfil}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(candidate.observacao, "OBSERVAÇÃO")
                }
              >
                {candidate.observacao}
              </td>
              <td className={styles.tableCell}>
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