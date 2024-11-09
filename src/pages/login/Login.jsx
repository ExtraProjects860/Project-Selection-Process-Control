import  { useState, useContext } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/icon/logo.svg";
import Navbar from "../../components/navbar/Navbar";
import SocialFooter from "../../components/social-footer/SocialFooter";
import RightsFooter from "../../components/rights-footer/RightsFooter";
import { login } from "../../services/login-service/LoginService";
import UserService from "../../services/user-service/UserService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/auth-context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // Estado para erro de email
  const [passwordError, setPasswordError] = useState(""); // Estado para erro de senha
  const [userData, setUserData] = useState(null);
  const userType = "deslogado";
  

  // Função para alternar entre mostrar e esconder a senha
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError(""); // Limpar mensagens de erro anteriores
    setPasswordError("");

    // Validação do email
    if (!email.includes("@") || email.split("@")[1].length === 0) {
      setEmailError("Por favor, insira um email válido com @ e um domínio.");
      return;
    }

    // Validação da senha
    if (password.length < 8 || password.length > 16) {
      setPasswordError(
        "A senha deve ter no mínimo 8 e no máximo 16 caracteres."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await login(email, password);
      setErrorMessage("");
      const token = response.token;
      localStorage.setItem("token", token);
      const fetchedUserData = await UserService.pegarDadosUsuario(token);
      localStorage.setItem("userData", JSON.stringify(fetchedUserData));
      
      setUserData(fetchedUserData);
      
      setLoading(false);
      setShowModal(true);
    } catch (error) {
      if (error.status === 400) {
        setLoading(false);
        setErrorMessage("Campos obrigatórios ausentes.");
      } else if (error.status === 500) {
        setLoading(false);
        setErrorMessage(
          "Erro interno do servidor. Tente novamente mais tarde."
        );
      } else {
        setErrorMessage("Erro de login. Verifique suas credenciais.");
      }
    }
  };

  const handleModalClose = () => {
    if (userData) { // Verifique se userData está disponível
      setShowModal(false);
      setIsLoggedIn(true);
      setUserRole(userData.dados.admin === 1 ? "admin" : "candidate");
      const route = userData.dados.admin === 1 ? "/home-admin" : "/home-candidate";
      navigate(route);
    } else {
      console.error("userData não está disponível ao fechar a modal.");
    }
  };

  return (
    <>
      <Navbar userType={userType} />
      {loading && !errorMessage && !emailError && !passwordError && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {showModal && (
       <div className="success-modal-overlay">
       <div className="success-modal-content">
         <h3>Login realizado com sucesso!</h3>
         <button onClick={handleModalClose} className="modal-close-button">Fechar</button>
       </div>
     </div>
      )}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="Web Certificados" className="logo" />
          </div>
          <div className="login-body">
            <form onSubmit={handleLogin}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}{" "}
              {/* Exibir mensagem de erro de email */}
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={passwordType}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                <span
                  onClick={togglePasswordVisibility}
                  className="password-toggle-icon"
                >
                  {passwordType === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}{" "}
              {/* Exibir mensagem de erro de senha */}
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}{" "}
              {/* Exibir mensagem de erro geral */}
              <div className="forgot-password">
                <a href="/reset-password-request">Esqueci minha senha</a>
              </div>
              <button type="submit" className="login-button">
                Entrar
              </button>
            </form>
          </div>
          <div className="login-footer">
            <p>
              <a href="/register">Clique aqui caso não tenha uma conta!</a>
            </p>
          </div>
        </div>
      </div>
      <footer className="footer">
      <SocialFooter />
      <RightsFooter />
      </footer>
    </>
  );
}

export default Login;
