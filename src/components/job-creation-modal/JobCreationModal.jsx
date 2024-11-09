import { useState, useEffect } from 'react';
import { createJob, getSetoresECargos } from '../../services/jobs-service/JobsService';

function CreateJobModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cargo, setCargo] = useState('');
  const [setor, setSetor] = useState('');
  const [salario, setSalario] = useState('');
  const [quantVagas, setQuantVagas] = useState('');
  const [dataEncerramento, setDataEncerramento] = useState('');
  const [status, setStatus] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [cargosOptions, setCargosOptions] = useState([]);
  const [setoresOptions, setSetoresOptions] = useState([]);
  const [error, setError] = useState(null);
  const maxTitleLength = 50;

  useEffect(() => {
    const fetchSetoresECargos = async () => {
      try {
        const data = await getSetoresECargos();
        setCargosOptions(data.cargos);
        setSetoresOptions(data.setores);
      } catch (error) {
        setError('Erro ao carregar setores e cargos');
      }
    };

    if (isOpen) {
      fetchSetoresECargos();
    }
  }, [isOpen]);

  const handleCreateJob = async () => {
    if (!title || !description || !cargo || !setor || !salario || !quantVagas || !dataEncerramento || !status) {
      setError('Todos os campos devem estar preenchidos.');
      return; // Impede o envio se algum campo estiver vazio
    }

    if (error) {
      return; // Se houver algum erro de validação, não submeter
    }

    const newJob = {
      nome_vaga: title,
      descricao_vaga: description,
      status: status,
      salario: salario,
      quantidade_vagas: quantVagas,
      data_encerramento: dataEncerramento,
      setor: setor,
      cargo: cargo,
    };

    try {
      const result = await createJob(newJob);
      console.log('Vaga criada com sucesso: ', result);
      setShowSuccessModal(true);
      console.log(dataEncerramento);
      
    } catch (error) {
      console.log(dataEncerramento);
      console.log(salario);
      console.error('Erro ao criar a vaga:', error.message);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
    window.location.reload();
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content modalContent">
        <h2 className="title-modal">Criar nova vaga</h2>
        <div className="inner-content-container">
          <div className="column">
            <div className="title-container">              
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da vaga"
                maxLength={maxTitleLength}
              />
              <p>{title.length}/{maxTitleLength}</p>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da vaga"
            />
          </div>       
          <div className="column">
            <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
              <option value="">Selecione um cargo</option>
              {cargosOptions.map((cargoOption, index) => (
                <option key={index} value={cargoOption}>
                  {cargoOption}
                </option>
              ))}
            </select>
            <select value={setor} onChange={(e) => setSetor(e.target.value)}>
              <option value="">Selecione um setor</option>
              {setoresOptions.map((setorOption, index) => (
                <option key={index} value={setorOption}>
                  {setorOption}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              placeholder="Salário"
            />
            <input
              type="number"
              value={quantVagas}
              onChange={(e) => setQuantVagas(e.target.value)}
              placeholder="Quantidade de vagas"
            />
            <input
              type="date"
              value={dataEncerramento}
              onChange={(e) => setDataEncerramento(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Selecione um status</option>
              <option value="ABERTA">Aberta</option>
              <option value="FECHADA">Fechada</option>
            </select>
          </div>
        </div>
        
        <div className="modal-buttons">
          <button onClick={handleCreateJob} type="submit" className="modal-save-button" >Criar</button>
          <button type="button" className="modal-cancel-button" onClick={onClose}>Cancelar</button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>

      {showSuccessModal && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <p>Vaga criada com sucesso!</p>
            <div className="confirmation-buttons">
              <button onClick={handleCloseSuccessModal} className="modal-save-button">Ok</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default CreateJobModal;
