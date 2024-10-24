import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { PencilSquare } from "react-bootstrap-icons";
import EditModal from "../modalEditorTable/EditModalUsers";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Table.module.css";

function UsersTable({ searchTerm }) {
  // Recebe o searchTerm como prop
  const [users, setUsers] = useState([
    // Dados de exemplo
    {
      id_usuario: 5,
      nome_usuario: "João da Silva",
      email: "joao.silva@example.com",
      telefone: "12342318385",
      data_nascimento: "02/02/1992",
      sexo: "M",
      cpf: "12345678914",
      endereco: "Rua Exemplo, 123",
      admin: "Sim",
      data_criacao: "2024-10-11 03:21:50",
      tem_inscricao: "Não",
    },
    {
      id_usuario: 6,
      nome_usuario: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      telefone: "98765432100",
      data_nascimento: "15/05/1990",
      sexo: "F",
      cpf: "98765432100",
      endereco: "Av. Principal, 456",
      admin: "Não",
      data_criacao: "2024-10-12 14:30:00",
      tem_inscricao: "Sim",
    },
    {
      id_usuario: 7,
      nome_usuario: "Carlos Pereira",
      email: "carlos.pereira@example.com",
      telefone: "55555555555",
      data_nascimento: "30/08/1985",
      sexo: "M",
      cpf: "11223344556",
      endereco: "Rua Secundária, 789",
      admin: "Sim",
      data_criacao: "2024-10-13 10:15:45",
      tem_inscricao: "Não",
    },
    {
      id_usuario: 8,
      nome_usuario: "Ana Costa",
      email: "ana.costa@example.com",
      telefone: "44444444444",
      data_nascimento: "22/11/1995",
      sexo: "F",
      cpf: "99887766554",
      endereco: "Rua das Flores, 321",
      admin: "Não",
      data_criacao: "2024-10-14 09:00:30",
      tem_inscricao: "Sim",
    },
    {
      id_usuario: 9,
      nome_usuario: "Pedro Santos",
      email: "pedro.santos@example.com",
      telefone: "33333333333",
      data_nascimento: "10/01/1988",
      sexo: "M",
      cpf: "22334455667",
      endereco: "Rua das Árvores, 654",
      admin: "Sim",
      data_criacao: "2024-10-15 16:45:12",
      tem_inscricao: "Não",
    },
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fullText, setFullText] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Definido como 3 itens por página, você pode ajustar

  // Aplicar filtro baseado no termo de busca
  const filteredUsers = users.filter((user) =>
    user.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const sortedUsers = [...currentItems].sort((a, b) => {
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
    if (sortConfig.key !== key) return <FaSort />;
    if (sortConfig.direction === "ascending") return <FaSortUp />;
    return <FaSortDown />;
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id_usuario === updatedUser.id_usuario ? updatedUser : user
      )
    );
    setShowModal(false);
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
            <th colSpan={12} className={styles.tableTitle}>
              USUÁRIOS
            </th>
          </tr>
          <tr>
            <th onClick={() => handleSort("id_usuario")}>
              ID {getSortIcon("id_usuario")}
            </th>
            <th onClick={() => handleSort("nome_usuario")}>
              NOME DO USUÁRIO {getSortIcon("nome_usuario")}
            </th>
            <th onClick={() => handleSort("email")}>
              EMAIL {getSortIcon("email")}
            </th>
            <th onClick={() => handleSort("telefone")}>
              TELEFONE {getSortIcon("telefone")}
            </th>
            <th onClick={() => handleSort("data_nascimento")}>
              DATA DE NASCIMENTO {getSortIcon("data_nascimento")}
            </th>
            <th onClick={() => handleSort("sexo")}>
              SEXO {getSortIcon("sexo")}
            </th>
            <th onClick={() => handleSort("cpf")}>CPF {getSortIcon("cpf")}</th>
            <th onClick={() => handleSort("endereco")}>
              ENDEREÇO {getSortIcon("endereco")}
            </th>
            <th onClick={() => handleSort("admin")}>
              ADMIN {getSortIcon("admin")}
            </th>
            <th onClick={() => handleSort("data_criacao")}>
              DATA DE CRIAÇÃO {getSortIcon("data_criacao")}
            </th>
            <th onClick={() => handleSort("tem_inscricao")}>
              TEM INSCRIÇÃO {getSortIcon("tem_inscricao")}
            </th>
            <th>AÇÃO</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user.id_usuario}>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.id_usuario, "ID")}
              >
                {user.id_usuario}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(user.nome_usuario, "NOME DO USUÁRIO")
                }
              >
                {user.nome_usuario}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.email, "EMAIL")}
              >
                {user.email}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.telefone, "TELEFONE")}
              >
                {user.telefone}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(user.data_nascimento, "DATA DE NASCIMENTO")
                }
              >
                {user.data_nascimento}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.sexo, "SEXO")}
              >
                {user.sexo}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.cpf, "CPF")}
              >
                {user.cpf}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.endereco, "ENDEREÇO")}
              >
                {user.endereco}
              </td>
              <td
                className={styles.tableCell}
                onClick={() => handleCellClick(user.admin, "ADMIN")}
              >
                {user.admin}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(user.data_criacao, "DATA DE CRIAÇÃO")
                }
              >
                {user.data_criacao}
              </td>
              <td
                className={styles.tableCell}
                onClick={() =>
                  handleCellClick(user.tem_inscricao, "TEM INSCRIÇÃO")
                }
              >
                {user.tem_inscricao}
              </td>
              <td
                className={styles.tableCell}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <PencilSquare
                  style={{ cursor: "pointer", color: "#006C98" }}
                  onClick={() => handleEditClick(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginação */}
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

      {selectedUser && (
        <EditModal
          show={showModal}
          user={selectedUser}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal para exibir o texto completo */}
      <Modal show={fullText !== null} onHide={() => setFullText(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedColumn}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{fullText}</Modal.Body>
        <Modal.Footer>
          <button
            className="btn"
            style={{
              backgroundColor: "#006C98",
              color: "white",
              border: "none",
            }}
            onClick={() => setFullText(null)}
          >
            Fechar
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UsersTable;
