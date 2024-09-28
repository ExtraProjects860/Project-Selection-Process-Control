import React, { useState } from 'react';
import './ResetPassword.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../navbar/Navbar';
import SocialFooter from '../social-footer/SocialFooter';
import RightsFooter from '../rights-footer/RightsFooter';
import { useNavigate } from 'react-router-dom';

function ResetPassword({user}) {
  const navigate = useNavigate();

  const userType = user; 
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === "password" ? "text" : "password");
  };

  const handleClick = () => {
    navigate(-1); 
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="reset-container">
        <div className="reset-card">
          <div className="reset-header">
            <img src={logo} alt="Web Certificados" className="logo" />
          </div>
          <div className="reset-body">
            <form>

              <label htmlFor="password">Senha atual</label>
              <div className="password-input-container">
                <input
                  type={passwordType}
                  id="password"
                  placeholder="Digite sua senha"
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  {passwordType === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <label htmlFor="confirm-password">Nova senha</label>
              <div className="password-input-container">
                <input
                  type={confirmPasswordType}
                  id="confirm-password"
                  placeholder="Confirme sua senha"
                  required
                />
                <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                  {confirmPasswordType === "password" ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type="submit" className="reset-button">Alterar senha</button>
              <button onClick={handleClick} type="button" className="reset-again-button">Cancelar</button>
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
