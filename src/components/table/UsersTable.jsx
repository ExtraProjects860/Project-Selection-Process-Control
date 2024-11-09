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
import { formatDate } from '../../utils/dateUtils';
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';
import TooManyRequestsError from '../too-many-requests-error-page/TooManyRequestsErrorPage';

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
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [tooManyRequests, setTooManyRequests] = useState(false);

  const token = localStorage.getItem('token');

  const fetchData = async (page) => {
    try {
      setLoading(true);
      setTooManyRequests(false);
      const data = await getUsers(page, token); 
      if (data && data.tokenExpired) {
        setIsTokenExpired(true);
      }

      if (data && data.tooManyRequests) {
        console.log('data', data.tooManyRequests);
        setTooManyRequests(true);
      }

      if (isTokenExpired) {
        return (
          <ModalTokenExpired
            title="Sessão Expirada"
            message="Seu token de autenticação expirou. Faça login novamente."
            onConfirm={() => {
              localStorage.clear();
              setIsTokenExpired(false); 
              window.location.href = '/'; 
            }}
          />
        );
      }
      
      setUsers(data.usuarios); 
      setTotalPages(data.total_de_paginas);
      setLoading(false);
    } catch (error) {
      setError('Usuários não encontrados.');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  
  const normalizeDate = (dateString) => {
    // Substitui as barras (/) por traços (-)
    return dateString.replace(/\//g, '-');
  };

 
  const filteredUsers = (users || []).filter(user => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    
    const formattedBirthDate = normalizeDate(formatDate(user.data_nascimento));
    const normalizedSearchTerm = normalizeDate(lowerSearchTerm);

    return (
      user.nome_usuario.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.cpf.toLowerCase().includes(lowerSearchTerm) ||
      formattedBirthDate.includes(normalizedSearchTerm) || // Ajuste para data de nascimento
      user.endereco.toLowerCase().includes(lowerSearchTerm) ||
      user.telefone.toLowerCase().includes(lowerSearchTerm) ||
      (user.admin ? 'Sim' : 'Não').toLowerCase().includes(lowerSearchTerm) ||
      user.tem_inscricao.toLowerCase().includes(lowerSearchTerm)
    );
  });

  const handleEditClick = (user) => {
    setSelectedUser(user); 
    setShowEditModal(true); 
  };

  const handleModalClose = () => {
    setShowEditModal(false); 
  };

  const handleTextClick = (text) => {
    setSelectedText(text);
    setShowTextModal(true); 
  };

  const handleTextModalClose = () => {
    setShowTextModal(false); 
  };

  const handleRetry = () => {
    setTooManyRequests(false);
    fetchData(currentPage);
  };

  if (loading) return <LoadingSpinner />;

  if (tooManyRequests) {
    return <TooManyRequestsError onRetry={handleRetry} />
  }

  if (error && !tooManyRequests) {
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
              <td onClick={() => handleTextClick(formatDate(user.data_nascimento))} style={{ cursor: 'pointer' }}>{formatDate(user.data_nascimento)}</td>
              <td onClick={() => handleTextClick(user.endereco)} style={{ cursor: 'pointer' }}>{user.endereco}</td>
              <td onClick={() => handleTextClick(user.telefone)} style={{ cursor: 'pointer' }}>{user.telefone}</td>
              <td>{user.admin ? 'Sim' : 'Não'}</td>
              <td>{user.tem_inscricao}</td>
              <td>
                <PencilSquare
                  className="text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleEditClick(user)} 
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
        <span className={styles.pageInfo}>
          {`Página ${currentPage} de ${totalPages}`}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Próxima
        </button>
      </div>

      {/* Modal de Edição */}
      {showEditModal && selectedUser && (
        <EditModal
          show={showEditModal}
          user={selectedUser} 
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
