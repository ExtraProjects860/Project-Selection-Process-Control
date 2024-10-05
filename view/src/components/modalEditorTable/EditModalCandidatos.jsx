import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function EditModal({ show, candidate, onSave, onClose }) {
  const [formData, setFormData] = useState({
    etapaAtual: candidate.etapaAtual,
    status: candidate.status,
    observacao: candidate.observacao,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave({ ...candidate, ...formData });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Candidato: {candidate.candidato}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEtapaAtual">
            <Form.Label>Etapa Atual</Form.Label>
            <Form.Control
              type="text"
              name="etapaAtual"
              value={formData.etapaAtual}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formObservacao">
            <Form.Label>Observação</Form.Label>
            <Form.Control
              type="text"
              name="observacao"
              value={formData.observacao}
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
