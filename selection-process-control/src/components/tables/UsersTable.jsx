import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { PencilSquare } from "react-bootstrap-icons";
import EditModal from "../modal-editor-table/EditModalCandidates";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Tables.css";

function UsersTable() {
    const [users, setUsers] = useState([
        {
          dataEtapa1: "2023-09-01",
          candidato: "Mark Otto",
          cargo: "Desenvolvedor",
          contato: "mark@example.com",
          setor: "Tecnologia",
          etapaAtual: "Entrevista Técnica",
          perfil: "Senior",
          status: "Em andamento",
          feedback: "Muito bem, aprovado!",
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
          feedback: "Seu currículo será salvo em nosso banco de talentos.",
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
          feedback: "Parabéns, aprovado!",
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
          feedback: "Parabéns, aprovado!",
        },
      ]);
    
      const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
      });
      const [selectedUser, setSelectedUser] = useState(null);
      const [showModal, setShowModal] = useState(false);
    
      const sortedUsers = [...users].sort((a, b) => {
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
    
      const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
      };
    
      const handleSave = (updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.usuario === updatedUser.usuario ? updatedUser : user
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
                  USUÁRIOS
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
                <th onClick={() => handleSort("feedback")}>
                  FEEDBACK {getSortIcon("feedback")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.dataEtapa1}</td>
                  <td>{user.candidato}</td>
                  <td>{user.cargo}</td>
                  <td>{user.contato}</td>
                  <td>{user.setor}</td>
                  <td>{user.etapaAtual}</td>
                  <td>{user.perfil}</td>
                  <td>{user.status}</td>
                  <td>{user.feedback}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {selectedUser && (
            <EditModal
              show={showModal}
              user={selectedUser}
              onSave={handleSave}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      );
    }

export default UsersTable;