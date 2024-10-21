import './JobEditionModal.css';
import { useState, useEffect } from 'react';
import { updateJobs, getSetoresECargos } from '../../services/jobs-service/JobsService';


function JobEditionModal({ jobDetails, isOpen, onClose }) {
  const [title, setTitle] = useState(jobDetails.nome_vaga);
  const [description, setDescription] = useState(jobDetails.descricao_vaga);
  const [salario, setSalario] = useState(jobDetails.salario);
  const [cargo, setCargo] = useState(jobDetails.nome_cargo);
  const [setor, setSetor] = useState(jobDetails.nome_setor);
  const [quantVagas, setQuantVagas] = useState(jobDetails.quantidade_vagas);
  const [dataEncerramento, setDataEncerramento] = useState(jobDetails.data_encerramento);
  const [status, setStatus] = useState(jobDetails.status);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // controla o modo de edição
  const [updateError, setUpdateError] = useState('');
  const [cargosOptions, setCargosOptions] = useState([]); // Estado para armazenar os cargos
  const [setoresOptions, setSetoresOptions] = useState([]); 
  const maxTitleLength = 50;

  // carrega setores e cargos ao abrir modal
  useEffect(() => {
    const fetchSetoresECargos = async () => {
      try {
        const data = await getSetoresECargos();
        setCargosOptions(data.cargos);
        setSetoresOptions(data.setores);
      } catch (error) {
        setUpdateError('Erro ao carregar setores e cargos');
      }
    };

    if (isOpen) {
      fetchSetoresECargos();
    }
  }, [isOpen]);
  
  // função que habilita o editar
  const handleEditClick = () => {
    setIsEditing(true);
  }

  //função de validação de data
  const validateDate = (dateStr, originalDateStr) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
      return 'Data inválida. Use o formato AAAA-MM-DD.';
    }

    const [year, month, day] = dateStr.split('-');
    const inputDate = new Date(year, month - 1, day);

    if (inputDate.getFullYear() !== parseInt(year) || inputDate.getMonth() + 1 !== parseInt(month) || inputDate.getDate() !== parseInt(day)) {
      return 'Data inválida.';
    }

    const [origYear, origMonth, origDay] = originalDateStr.split('-');
    const originalDate = new Date(origYear, origMonth - 1, origDay);

    if (inputDate < originalDate) {
      return 'A data de encerramento não pode ser anterior à data original.';
    } 

    return '';
  };

  //formatação da data
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    value = value.replace(/\D/g, '');
    if (value.length > 4 && value.length <= 6) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6)}`;
    }

    setDataEncerramento(value);
    validateDate(value);
  };

  //aciona botão de salvar ou mostra erros
  const handleSave = () => {
    //todos os campos devem estar preenchidos
    if (!title || !description || !cargo || !setor || !salario || !quantVagas || !dataEncerramento || !status) {
      setUpdateError('Todos os campos devem estar preenchidos.');
      return;
    }

    //chamando a função de validação de data
    const dateError = validateDate(dataEncerramento, jobDetails.data_encerramento);
    if (dateError) {
      setUpdateError(dateError);
      return;
    }

    setUpdateError(''); // Limpa erros antes de abrir a confirmação
    setShowConfirmation(true);
  };

  //confirmar salvar vaga
  const confirmSave = () => {
    const jobId = jobDetails.id_vaga;

    const updateJobData = {
      nome_vaga: title,
      descricao_vaga: description,
      cargo: cargo,
      setor: setor,
      status: status,
      salario: salario,
      quantidade_vagas: quantVagas,
      data_encerramento: dataEncerramento,
    };

    if (updateError) {
      return; // Impede o envio se houver erro
    }

    updateJobs(jobId, updateJobData)
    .then(() => {
      setIsConfirmed(true);
      setIsEditing(false);  // Desabilita o modo edição após salvar
      setUpdateError('');   // Limpa os erros
    })
    .catch((error) => {
      if (error.message.includes('Já existe uma vaga com esse nome.')) {
        setUpdateError('Já existe uma vaga com esse nome.');
      } else {
        setUpdateError('Erro ao atualizar a vaga.');
      }
      console.error('Erro ao atualizar a vaga:', error);
    });
  };

  // botão de cancelar tudo na confirmação
  const closeAll = () => {
    setShowConfirmation(false);
    onClose();
    setIsConfirmed(false);
    window.location.reload();
  };

  //cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setTitle(jobDetails.nome_vaga); 
    setDescription(jobDetails.descricao_vaga);
    setCargo(jobDetails.nome_cargo);
    setSetor(jobDetails.nome_setor);
    setSalario(jobDetails.salario);
    setQuantVagas(jobDetails.quantidade_vagas);
    setDataEncerramento(jobDetails.data_encerramento);
    setStatus(jobDetails.status);
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <h2 className="title-modal">Editar vaga</h2>
      <div className="inner-content-container">
        <div className="column">
          <div className="title-container">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditing}
              placeholder={title}
              maxLength={maxTitleLength}
            />
            <p>{title.length}/{maxTitleLength}</p>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            placeholder={description}
          />
        </div>    

        <div className="column">          
          <select value={cargo} onChange={(e) => setCargo(e.target.value)} disabled={!isEditing}>
            <option value="">Selecione um setor</option>
            {cargosOptions.map((cargoOption, index) => (
              <option key={index} value={cargoOption}>
                {cargoOption}
              </option>
            ))}
          </select>
          <select value={setor} onChange={(e) => setSetor(e.target.value)} disabled={!isEditing}>
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
              disabled={!isEditing} // desabilita se não estiver editando
              placeholder={salario}
            />
            <input
              type="number"
              value={quantVagas}
              onChange={(e) => setQuantVagas(e.target.value)}
              disabled={!isEditing} // desabilita se não estiver editando
              placeholder={quantVagas}
            />
            <input
              type="text"
              value={dataEncerramento}
              onChange={handleInputChange}
              disabled={!isEditing} // desabilita se não estiver editando
              placeholder={dataEncerramento}
              maxLength={10}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!isEditing}>
              <option value="">Selecione um status</option>
              <option value="ABERTA">Aberta</option>
              <option value="FECHADA">Fechada</option>
            </select>
        </div>
      </div>
        
        <div className="modal-buttons">
          {!isEditing ? (
            <>
              <button onClick={handleEditClick} className="modal-edit-button">Editar</button>
              <button type="button" className="modal-close-button" onClick={onClose}>Fechar</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} type="submit" className="modal-save-button" >Salvar</button>
              <button type="button" className="modal-cancel-button" onClick={() => {
                handleCancelEdit();
                setUpdateError('');
              }}>Cancelar</button>
            </>
          )}
        </div>
        {updateError && <p className="error-message">{updateError}</p>}
      </div>

      {showConfirmation && (
            <div className="confirmation-overlay">
              <div className="confirmation-box">
                {!isConfirmed ? (
                  <>
                    <p>Você realmente deseja salvar?</p>
                    <div className="confirmation-buttons">
                      <button type="button" className="modal-save-button" onClick={confirmSave}>Confirmar</button>
                      <button type="button" className="modal-cancel-button" onClick={() => {
                        setShowConfirmation(false);                        
                      }}>Cancelar</button>
                    </div>                    
                  </>
                ) : (
                  <>
                    <p>Informações salvas com sucesso!</p>
                    <div className="confirmation-buttons">
                      <button type="button" className="modal-save-button" onClick={closeAll}>Ok</button>
                    </div>
                  </>
                )}
              </div>
            </div>
        )}
    </div>
  );
}


export default JobEditionModal;
