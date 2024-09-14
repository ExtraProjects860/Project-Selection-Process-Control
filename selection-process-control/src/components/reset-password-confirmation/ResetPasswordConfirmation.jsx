import React, { useState } from 'react';
import './ResetPasswordConfirmation.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../navbar/Navbar';
import SocialFooter from '../social-footer/SocialFooter';
import RightsFooter from '../rights-footer/RightsFooter';

function ResetPasswordConfirmation() {
  // Crie estados separados para cada campo de senha
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  // Função para alternar entre mostrar e esconder a senha
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  // Função para alternar entre mostrar e esconder a confirmação de senha
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType(confirmPasswordType === "password" ? "text" : "password");
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
            <form>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="Digite seu e-mail"
                required
              />

              <label htmlFor="password">Senha</label>
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

              <label htmlFor="confirm-password">Confirme sua senha</label>
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

              <label htmlFor="token">Token</label>
              <div className="password-input-container">
                <input
                  type="number"
                  id="token"
                  placeholder="Digite o token"
                  required
                />
              </div>
              <button type="submit" className="reset-button">Alterar senha</button>
              <button type="button" className="reset-again-button">Requisitar novamente</button>
            </form>
          </div>
        </div>
      </div>
      <SocialFooter />
      <RightsFooter />
    </>
  );
}

export default ResetPasswordConfirmation;
