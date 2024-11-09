import  { useState } from 'react';
import './ResetPasswordRequest.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import ResetPasswordConfirmation from '../reset-password-confirmation/ResetPasswordConfirmation';
import { requestPasswordReset } from '../../services/user-service/UserService';


function ResetPasswordRequest() {
  const [showFirstDiv, setShowFirstDiv] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const userType = 'deslogado'; 

  const toggleDiv = () => {
    setShowFirstDiv(!showFirstDiv); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await requestPasswordReset(email);
      toggleDiv();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     {showFirstDiv ? (
    <>
      <Navbar userType={userType} />
      <div className="reset-container">
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
              <br></br>
              <p className="info-text">Um token para redefinir sua senha será enviado para o seu e-mail.</p>
              {errorMessage && <p className="error-message">{errorMessage}</p>} 
              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar token de redefinição'}
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
     ) : (
      <div>
        <ResetPasswordConfirmation />
      </div>
     )}
    </>
  );
}

export default ResetPasswordRequest;
