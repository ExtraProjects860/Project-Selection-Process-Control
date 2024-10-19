/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './ResetPassword.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import { useNavigate } from 'react-router-dom';
import { updateUserData, saveResume } from '../../services/user-service/UserService';
import { FaPaperclip } from 'react-icons/fa'; 
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';
import UserService from "../../services/user-service/UserService";

function ResetPassword({ user }) {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [uploadStatus, setUploadStatus] = useState(null);

  const navigate = useNavigate();
  const userType = user;
 

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem('userData'))?.dados;
    if (userData) {
      setFormData({
        email: userData.email,
        phone: userData.telefone,
        address: userData.endereco,
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

    const userData = {
      novo_email: formData.email,
      nova_senha: formData.password || "", 
      novo_telefone: formData.phone,
      novo_endereco: formData.address,
    };

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('userData'))?.dados;
      const userId = user.id;
      const dataResponse = await updateUserData(userId, userData);
      if (dataResponse.tokenExpired) {
        setIsTokenExpired(true);
      }  
      setSuccessMessage('Dados alterados com sucesso!');
      const token = localStorage.getItem('token');
      const userInfo = await UserService.pegarDadosUsuario(token);
      localStorage.setItem("userData", JSON.stringify(userInfo));
      if (file) {
        const resumeResponse = await saveResume(userId, file);
        if (resumeResponse.tokenExpired) {
          setIsTokenExpired(true);
        }  
        setUploadStatus('Currículo enviado com sucesso!');
      }

      setShowSuccessModal(true); 

    } catch (error) {
      setErrorMessage(error.message || 'Erro ao enviar os dados.');
    } finally {
      setLoading(false); 
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); 
    goBack();
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="register-container">
      {isTokenExpired && (
        <ModalTokenExpired
          title="Sessão Expirada"
          message="Seu token de autenticação expirou. Faça login novamente."
          onConfirm={() => {
            localStorage.clear();
            setIsTokenExpired(false); 
            window.location.href = '/'; 
          }}
        />
      )}
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
                />
                  </tr>
                  <tr>
                  <input
                  type="tel"
                  id="phone"
                  placeholder="Telefone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                  </tr>
                </div>
              </td>
              <td>
                <div className="input-group">
    
                <input
                      type="text"
                      id="address"
                      placeholder="Endereço"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
          
                  
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
              <div className="btns">
                <button type="submit" className="register-button" disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar'}
                </button>
                <button onClick={goBack} className="cancel-btn">
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

      {/* Modal de sucesso */}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Alterações realizadas com sucesso!</h2>
            <button onClick={handleCloseModal} className="modal-button">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
