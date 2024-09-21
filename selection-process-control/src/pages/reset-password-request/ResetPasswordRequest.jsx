import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './ResetPasswordRequest.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';

function ResetPasswordRequest() {
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/password-reset-confirmation'); 
  };

  return (
    <>
      <Navbar />
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
                required
              />
              <p className="info-text">Um token para redefinir sua senha será enviado para o seu e-mail.</p>
              <button type="submit" className="reset-button">Enviar token de redefinição</button>
            </form>
          </div>
        </div>
      </div>
      <SocialFooter />
      <RightsFooter />
    </>
  );
}

export default ResetPasswordRequest;
