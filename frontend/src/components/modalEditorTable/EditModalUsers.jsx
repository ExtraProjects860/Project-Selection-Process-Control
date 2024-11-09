import './EditModalTables.css';
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { updateAdminStatus } from "../../services/get-data-table-service/GetDataTableService";

function EditModal({ show, user, onSave, onClose }) { 
  const [formData, setFormData] = useState({
    nome_usuario: "",
    adminAction: false, 
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      setFormData({
        nome_usuario: user.nome_usuario || "",
        adminAction: false, 
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.adminAction) {
       
        const newAdminStatus = user.admin === 1 ? 0 : 1; 
        await updateAdminStatus(user.id_usuario, newAdminStatus, token); 
      }

      onSave({
        ...user,
        admin: formData.adminAction ? (user.admin === 1 ? 0 : 1) : user.admin, 
      });

      onClose(); 


      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar o status de admin:", error);

    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuário: {user?.nome_usuario}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNomeUsuario">
            <Form.Label>Nome do Usuário</Form.Label>
            <Form.Control
              type="text"
              name="nome_usuario"
              value={formData.nome_usuario}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
          <Form.Group controlId="formAdmin">
            <Form.Check
              className='layoutModalUser'
              type="checkbox"
              name="adminAction"
              label={user.admin === 1 ? "Remover Admin" : "Tornar Admin"} // Condicional para o label
              checked={formData.adminAction} // O checkbox sempre começa desmarcado
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditModal;
