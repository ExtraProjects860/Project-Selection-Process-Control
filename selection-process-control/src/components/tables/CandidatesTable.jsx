import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // Ícones de ordenação
import { PencilSquare } from "react-bootstrap-icons"; // Ícone de edição
import EditModal from "../modal-editor-table/EditModalCandidates";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Tables.css";

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

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />; // Ícone padrão para colunas não ordenadas
    if (sortConfig.direction === "ascending") return <FaSortUp />; // Ícone para ordem ascendente
    return <FaSortDown />; // Ícone para ordem descendente
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
            <th>AÇÃO</th> {/* Coluna para o botão de editar */}
          </tr>
        </thead>
        <tbody>
          {sortedCandidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.dataEtapa1}</td>
              <td>{candidate.candidato}</td>
              <td>{candidate.cargo}</td>
              <td>{candidate.contato}</td>
              <td>{candidate.setor}</td>
              <td>{candidate.etapaAtual}</td>
              <td>{candidate.perfil}</td>
              <td>{candidate.status}</td>
              <td>{candidate.observacao}</td>
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
      {selectedCandidate && (
        <EditModal
          show={showModal}
          candidate={selectedCandidate}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default CandidatesTable;