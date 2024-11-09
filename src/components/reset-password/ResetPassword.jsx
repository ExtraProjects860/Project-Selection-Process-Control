/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import styles from './ResetPassword.module.css';
import logo from "../../assets/icon/logo.svg";
import Navbar from "../../components/navbar/Navbar";
import SocialFooter from "../../components/social-footer/SocialFooter";
import RightsFooter from "../../components/rights-footer/RightsFooter";
import { useNavigate } from "react-router-dom";
import {
  updateUserData,
  saveResume,
} from "../../services/user-service/UserService";
import { FaPaperclip } from "react-icons/fa";
import ModalTokenExpired from "../modal-token-expired/ModalTokenExpired";
import UserService from "../../services/user-service/UserService";
import { validateForm } from "../../utils/formUtils";

function ResetPassword({ user }) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const navigate = useNavigate();
  const userType = user;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"))?.dados;
    if (userData) {
      setFormData({
        email: userData.email,
        phone: userData.telefone,
        address: userData.endereco,
        password: "",
        confirmPassword: "",
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
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm({
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não correspondem!");
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
      const user = JSON.parse(localStorage.getItem("userData"))?.dados;
      const userId = user.id;
      const dataResponse = await updateUserData(userId, userData);
      if (dataResponse && dataResponse.tokenExpired) {
        return setIsTokenExpired(true);
      }
      
      setSuccessMessage("Dados alterados com sucesso!");

      if (file) {
        const resumeResponse = await saveResume(userId, file);
        if (resumeResponse.tokenExpired) {
          setIsTokenExpired(true);
        }
        setUploadStatus("Currículo enviado com sucesso!");
      }

      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error.message || "Erro ao enviar os dados.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1); 
  };
  
  const handleCloseModal = async () => {
    const token = localStorage.getItem('token');  
    try {
      console.log("Tentando fazer logout...");
      if (token) {
        const data = await UserService.userLogout(token);
        if (data && data.tokenExpired) {
          setIsTokenExpired(true);
        }
        if (isTokenExpired) {
          localStorage.clear();
          setIsTokenExpired(false); 
          return window.location.href = '/';
        }
      }
      localStorage.clear(); 
      console.log("LocalStorage limpo, redirecionando para a tela de login...");
      window.location.href = '/'; 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };
  
  

  return (
    <>
      <Navbar userType={userType} />
      <div className={styles.registerContainer}>
        {isTokenExpired && (
          <ModalTokenExpired
            title="Sessão Expirada"
            message="Seu token de autenticação expirou. Faça login novamente."
            onConfirm={() => {
              localStorage.clear();
              setIsTokenExpired(false);
              window.location.href = "/";
            }}
          />
        )}
        <div className={styles.registerCard}>
          <div className={styles.registerHeader}>
            <img src={logo} alt="Web Certificados" className="logo" />
            <h2>Alteração de dados</h2>
          </div>
          <div className={styles.registerBody}>
            <form onSubmit={handleSubmit}>
              <td>
                <div className={styles.inputGroup}>
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
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="address"
                    placeholder="Endereço"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </td>
              <td>
                <div className={styles.inputGroup}>
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
                {userType != "admin" && (
                  <div>
                    <div className={styles.FileInputContainer}>
                      <input
                        type="file"
                        id="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                      />
                      <label htmlFor="file" className={styles.fileLabel}>
                        {file ? file.name : "Currículo"}
                      </label>
                      <span className={styles.fileIcon}>
                        <FaPaperclip />
                      </span>
                    </div>
                    <small className={styles.modalNote}>
                      *Só serão aceitos arquivos no formato PDF
                    </small>
                  </div>
                )}
              </td>
              <div className={styles.btns}>
                <button
                  type={styles.submit}
                  className={styles.registerButton}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Confirmar"}
                </button>
                <button onClick={goBack} className={styles.cancelBtn}>
                  Cancelar
                </button>
              </div>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
              {successMessage && (
                <p className={styles.successMessage}>{successMessage}</p>
              )}
              {uploadStatus && <p className={styles.uploadStatus}>{uploadStatus}</p>}
            </form>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
      <SocialFooter />
      <RightsFooter />
      </footer>
     
      {showSuccessModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Alterações realizadas com sucesso!</h2>
            <p>Você será direcionado para realizar um novo login.</p>
            <button onClick={handleCloseModal} className={styles.okButton}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
