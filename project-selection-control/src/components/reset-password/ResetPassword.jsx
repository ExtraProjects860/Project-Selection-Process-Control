import { useState, useEffect } from 'react';
import './ResetPassword.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import { useNavigate } from 'react-router-dom';
import { validateForm, handleErrorResponse } from '../../utils/formUtils';
import { FaPaperclip } from 'react-icons/fa'; 

function ResetPassword({ user }) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [file, setFile] = useState(null); // Adicionei o estado para o arquivo
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const navigate = useNavigate();
  const userType = user;

  useEffect(() => {
   
    const userData = JSON.parse(localStorage.getItem('userData'))?.dados;
    if (userData) {
      setFormData({
        email: userData.email || '',
        phone: userData.telefone || '',
        address: userData.endereco || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
  
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não correspondem!');
      return;
    }

    const validationError = validateForm(formData);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userData = {
      email: formData.email,
      telefone: formData.phone,
      endereco: formData.address,
      senha: formData.password ? formData.password : undefined, 
    };

    try {
      setLoading(true);

     
      if (userData.email || userData.telefone || userData.endereco || userData.senha) {
        const response = await fetch('URL_DO_ENDPOINT_DE_DADOS', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (response.ok) {
          setSuccessMessage('Dados alterados com sucesso!');
        } else {
          handleErrorResponse(data); 
        }
      }

      if (file) {
        const formDataFile = new FormData();
        formDataFile.append('file', file);

        const fileResponse = await fetch('URL_DO_ENDPOINT_DE_CURRICULO', {
          method: 'POST',
          body: formDataFile,
        });

        const fileData = await fileResponse.json();
        if (fileResponse.ok) {
          setUploadStatus('Currículo enviado com sucesso!');
        } else {
          setUploadStatus('Erro ao enviar o currículo.');
        }
      }

    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      setErrorMessage('Erro ao enviar os dados.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };
  

  return (
    <>
      <Navbar userType={userType} />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img src={logo} alt="Web Certificados" className="logo" />
            <h2>Alteração de dados</h2>
          </div>
          <div className="register-body">
            <form onSubmit={handleSubmit}>
            <td>
                <div className="input-group">
                  <tr>
                  <input
                  type="email"
                  id="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                  </tr>
                  <tr>
                  <input
                  type="tel"
                  id="phone"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                  </tr>
                </div>
              </td>
              <td>
                <div className="input-group">
                <tr>
                <input
                      type="text"
                      id="address"
                      placeholder="Endereço"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
                  <tr>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </tr>
                </div>
              </td>
              <td>
                <div className="input-group">
                  <tr>
                    <input
                      type="password"
                      id="password"
                      placeholder="Nova Senha"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </tr>
                
                </div>
              </td>
              <td>
              {userType != 'admin' && (
                <div>
                   <div className="file-input-container">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="file" className="file-label">
                    {file ? file.name : 'Currículo'}
                  </label>
                  <span className="file-icon">
                    <FaPaperclip />
                  </span>
                  </div>
                  <small className="modal-note">*Só serão aceitos arquivos no formato PDF</small>
                </div>
              )}
              </td>

              <br />
              <br />
              <div className='btns'>
                <button type="submit" className="register-button" disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar'}
                </button>
                <button onClick={goBack} className="cancel-button">
                  Cancelar
                </button>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
                
             
            </form>
          </div>
        </div>
      </div>
      <SocialFooter />
      <RightsFooter />
    </>
  );
}

export default ResetPassword;
