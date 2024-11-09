import './EditModalTables.css';
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { getSteps, updateStatusProcessCandidate, downloadResume, deleteResume } from "../../services/get-data-table-service/GetDataTableService";

function EditModal({ show, candidate, onClose }) {
  const [formData, setFormData] = useState({
    nome_etapa: "",
    status_processo: "",
    observacao: "",
    data_entrevista: "",
    data_conclusao: "",
    forms_respondido: "NÃO",
    avaliacao_forms: "",
    perfil: "",
  });
  const [etapas, setEtapas] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (candidate) {
      console.log(candidate)
      setFormData({
        nome_etapa: candidate.nome_etapa || "",
        status_processo: candidate.status_processo || "",
        observacao: candidate.observacao || "",
        data_entrevista: candidate.data_entrevista ? new Date(candidate.data_entrevista).toLocaleString('sv-SE').slice(0, 16) : "",
        data_conclusao: candidate.data_conclusao && !isNaN(new Date(candidate.data_conclusao)) ? new Date(candidate.data_conclusao).toISOString().slice(0, 10) : "",
        forms_respondido: candidate.forms_respondido || "NÂO",
        avaliacao_forms: candidate.avaliacao_forms || "",
        perfil: candidate.perfil || "",
      });
    }
  }, [candidate]);

  useEffect(() => {
    async function fetchSteps() {
      try {
        const response = await getSteps(token); // Faz a chamada à API
        setEtapas(response.etapas); // Armazena as etapas no estado
      } catch (error) {
        console.error("Erro ao buscar etapas:", error);
      }
    }
    fetchSteps(); // Chama a função ao montar o componente
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Armazena como string
    });
  };

  const handleDownloadResume = async () => {
    try {
      await downloadResume(candidate.id_usuario, token); // Chama a função de download
    } catch (error) {
      setAlertVariant("danger");
      setAlertMessage("O arquivo do currículo não foi encontrado no diretório");
      setShowAlert(true);
    }
  };

  // Função para excluir o currículo
  const handleDeleteResume = async () => {
    try {
      await deleteResume(candidate.id_usuario, token); // Chama a função de exclusão
      setAlertVariant("success");
      setAlertMessage("Currículo excluído com sucesso!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setAlertVariant("danger");
      setAlertMessage(error.response.data.error);
      setShowAlert(true);
    }
  };

  const handleSubmit = async () => {
    const formsRespondidoValue = formData.forms_respondido === "SIM" ? 1 : 0;
    console.log(formsRespondidoValue);
    const updatedData = {
      data_entrevista: formData.data_entrevista,
      data_conclusao: formData.data_conclusao,
      status_processo: formData.status_processo,
      perfil: formData.perfil,
      observacao: formData.observacao,
      forms_respondido: formsRespondidoValue,
      avaliacao_forms: formData.avaliacao_forms,
      etapa: formData.nome_etapa,
    };
    console.log(updatedData);
  
    try {
      // Chama a função que envia os dados para a API
      await updateStatusProcessCandidate(candidate.id_status_processo_seletivo, updatedData, token);

      setAlertVariant("success");
      setAlertMessage("Dados salvos com sucesso!");
      setShowAlert(true);


      // Recarrega a página após um breve intervalo
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setAlertVariant("danger");
      setAlertMessage("Erro ao salvar os dados!");
      setShowAlert(true);

    }
  };

  // Obtém a data atual no formato YYYY-MM-DD
  const currentDate = new Date().toISOString().split("T")[0];


  return (
    <>
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Candidato: {candidate?.nome_usuario}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNomeEtapa">
            <Form.Label>Etapa Atual</Form.Label>
            <Form.Control
              as="select"
              name="nome_etapa"
              value={formData.nome_etapa}
              onChange={handleChange}
            >
              {etapas.map((etapa, index) => (
                <option key={index} value={etapa}>
                  {etapa}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status_processo"
              value={formData.status_processo}
              onChange={handleChange}
            >
              <option value="">SELECIONE</option>
              <option value="ATIVO">ATIVO</option>
              <option value="BANCO_DE_TALENTOS">BANCO DE TALENTOS</option>
              <option value="CONCLUIDO">CONCLUÍDO</option>
              <option value="DESISTENCIA">DESISTÊNCIA</option>
              <option value="REPROVACAO">REPROVAÇÃO</option>
              <option value="ENCERRADO">ENCERRADO</option>
            </Form.Control>
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
          <Form.Group controlId="formDataEntrevista">
            <Form.Label>Data da Entrevista</Form.Label>
            <Form.Control
              type="datetime-local"
              name="data_entrevista"
              value={formData.data_entrevista}
              onChange={handleChange}
              min={currentDate + "T00:00"} 
            />
          </Form.Group>
          <Form.Group controlId="formDataConclusao">
            <Form.Label>Data de Conclusão</Form.Label>
            <Form.Control
              type="date"
              name="data_conclusao"
              value={formData.data_conclusao}
              onChange={handleChange}
              min={formData.data_entrevista}
            />
          </Form.Group>
          <Form.Group controlId="formFormsRespondido">
            <Form.Label>Forms Respondido</Form.Label>
            <Form.Control
              as="select"
              name="forms_respondido"
              value={formData.forms_respondido}
              onChange={handleChange}
            >
              <option value="NÃO">NÃO</option>
              <option value="SIM">SIM</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAvaliacaoForms">
            <Form.Label>Avaliação</Form.Label>
            <Form.Control
              as="select" // Mudou para texto
              name="avaliacao_forms"
              value={formData.avaliacao_forms}
              onChange={handleChange}
            >
              <option value="">SELECIONE</option>
              <option value="IDEAL">IDEAL</option>
              <option value="MEDIANO">MEDIANO</option>
              <option value="RUIM">RUIM</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPerfil">
            <Form.Label>Perfil</Form.Label>
            <Form.Control
              type="text"
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={handleDownloadResume}>
            Baixar Currículo
          </Button>
          <Button variant="danger" onClick={handleDeleteResume} style={{ marginLeft: '10px' }}>
            Excluir Currículo
          </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Modal de Sucesso ou Erro */}
    <Modal show={showAlert} onHide={() => setShowAlert(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{alertVariant === "success" ? "Sucesso" : "Erro"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{alertMessage}</Modal.Body>
      <Modal.Footer>
          <Button variant={alertVariant} onClick={() => setShowAlert(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditModal;
