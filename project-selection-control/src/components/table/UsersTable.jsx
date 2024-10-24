import React, { useEffect, useState } from 'react';
import Table from "react-bootstrap/Table";
import { PencilSquare } from "react-bootstrap-icons";
import EditModal from '../modalEditorTable/EditModalUsers';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Table.module.css";
import LoadingSpinner from "../spinnerLoadingTable/LoadingSpinnerTable";
import { getUsers } from "../../services/get-data-table-service/GetDataTableService";
import { usePagination } from "./logic/TablesLogic";

function UsersTable({ searchTerm }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Controle do modal
  const [showTextModal, setShowTextModal] = useState(false); // Controle da modal de texto completo
  const [selectedUser, setSelectedUser] = useState(null); // Usuário selecionado
  const [selectedText, setSelectedText] = useState(""); // Texto do item selecionado
  const [totalPages, setTotalPages] = useState(1);
  const { currentPage, handleNextPage, handlePrevPage } = usePagination(totalPages);

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData(page) {
      try {
        setLoading(true);
        const data = await getUsers(page, token); // Chama a função de serviço
        setUsers(data.usuarios); // Ajusta conforme a estrutura da resposta da API
        setTotalPages(data.total_de_paginas);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar os dados');
        setLoading(false);
      }
    }

    fetchData(currentPage);
  }, [currentPage]);

  // Função de filtragem com base no termo de busca
  const filteredUsers = users.filter(user => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      user.nome_usuario.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.cpf.toLowerCase().includes(lowerSearchTerm) ||
      user.data_nascimento.toLowerCase().includes(lowerSearchTerm) ||
      user.endereco.toLowerCase().includes(lowerSearchTerm) ||
      user.telefone.toLowerCase().includes(lowerSearchTerm) ||
      (user.admin ? 'Sim' : 'Não').toLowerCase().includes(lowerSearchTerm) ||
      user.tem_inscricao.toLowerCase().includes(lowerSearchTerm)
    );
  });

  const handleEditClick = (user) => {
    setSelectedUser(user); // Define o usuário clicado
    setShowEditModal(true); // Mostra o modal de edição
  };

  const handleModalClose = () => {
    setShowEditModal(false); // Fecha o modal de edição
  };

  const handleTextClick = (text) => {
    setSelectedText(text); // Define o texto selecionado
    setShowTextModal(true); // Mostra a modal de texto completo
  };

  const handleTextModalClose = () => {
    setShowTextModal(false); // Fecha a modal de texto completo
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Table striped bordered hover className={styles.table}>
        <thead>
          <tr>
            <th colSpan={10} className={styles.tableTitle}>
              USUÁRIOS
            </th>
          </tr>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Admin</th>
            <th>Tem Inscrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id_usuario}>
              <td>{user.id_usuario}</td>
              <td onClick={() => handleTextClick(user.nome_usuario)} style={{ cursor: 'pointer' }}>{user.nome_usuario}</td>
              <td onClick={() => handleTextClick(user.email)} style={{ cursor: 'pointer' }}>{user.email}</td>
              <td onClick={() => handleTextClick(user.cpf)} style={{ cursor: 'pointer' }}>{user.cpf}</td>
              <td onClick={() => handleTextClick(user.data_nascimento)} style={{ cursor: 'pointer' }}>{user.data_nascimento}</td>
              <td onClick={() => handleTextClick(user.endereco)} style={{ cursor: 'pointer' }}>{user.endereco}</td>
              <td onClick={() => handleTextClick(user.telefone)} style={{ cursor: 'pointer' }}>{user.telefone}</td>
              <td>{user.admin ? 'Sim' : 'Não'}</td>
              <td>{user.tem_inscricao}</td>
              <td>
                <PencilSquare
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEditClick(user)} // Chama o modal de edição
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

      {/* Modal de Edição */}
      {showEditModal && selectedUser && (
        <EditModal
          show={showEditModal}
          user={selectedUser} // Passa o usuário selecionado
          onClose={handleModalClose}
          onSave={() => setShowEditModal(false)}
        />
      )}

      {/* Modal de Exibição de Texto Completo */}
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

export default UsersTable;
