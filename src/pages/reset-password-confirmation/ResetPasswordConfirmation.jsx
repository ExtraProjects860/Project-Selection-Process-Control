import { useState, useEffect } from 'react';
import './ResetPasswordConfirmation.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import { resetPassword, requestPasswordReset } from '../../services/user-service/UserService';
import { useNavigate } from 'react-router-dom'; 

function ResetPasswordConfirmation() {
  const userType = 'deslogado'; 
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(300); // Inicia o contador com 5 minutos (300 segundos)
  const [resendLoading, setResendLoading] = useState(false); 
  const navigate = useNavigate();

  // Inicia o contador regressivo automaticamente ao carregar o componente
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);

      // Limpa o intervalo quando o contador atingir 0
      return () => clearInterval(timerId);
    }
  }, [resendTimer]);

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === "password" ? "text" : "password");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem');
      return;
    }

    setLoading(true); 

    try {
      await resetPassword(email, password, token);
      setShowSuccessModal(true); // Exibe a modal de sucesso
    } catch (error) {
      setErrorMessage(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/'); // Redireciona para a página de login
  };

  const handleResendToken = async () => {
    if (!email) {
      setErrorMessage('Por favor, preencha o campo de e-mail antes de reenviar o token.');
      return;
    }

    setResendLoading(true); 
    setErrorMessage('');

    try {
      await requestPasswordReset(email);
      setResendTimer(300); // Reinicia o contador de 5 minutos (300 segundos)
    } catch (error) {
      setErrorMessage('Erro ao reenviar token. Por favor, tente novamente. ' + error.message);
    } finally {
      setResendLoading(false); 
    }
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="reset-container">
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Senha alterada com sucesso!</h2>
            <button onClick={handleSuccessModalClose} className="modal-button">
              OK
            </button>
          </div>
        </div>
      )}
        <div className="reset-card">
          <div className="reset-header">
            <img src={logo} alt="Web Certificados" className="logo" />
          </div>
          <div className="reset-body">
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={passwordType}
                  id="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  {passwordType === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <label htmlFor="confirm-password">Confirme sua senha</label>
              <div className="password-input-container">
                <input
                  type={confirmPasswordType}
                  id="confirm-password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                  {confirmPasswordType === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <label htmlFor="token">Token</label>
              <div className="password-input-container">
                <input
                  type="text"
                  id="token"
                  placeholder="Digite o token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
              
              {errorMessage && <p className="error-message">{errorMessage}</p>} 
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? 'Processando...' : 'Alterar senha'}
              </button>

              <button
                className={`reset-again-button ${resendTimer > 0 ? 'disabled' : ''}`} // Aplica classe de desabilitado se o timer > 0
                type="button"
                onClick={handleResendToken}
                disabled={resendTimer > 0 || resendLoading}
              >
                {resendLoading ? 'Reenviando...' : resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar token'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <footer className='footer'>
      <SocialFooter />
      <RightsFooter />
      </footer>
      
    </>
  );
}

export default ResetPasswordConfirmation;
