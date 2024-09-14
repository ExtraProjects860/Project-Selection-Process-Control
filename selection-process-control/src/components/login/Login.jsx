import React, { useState } from 'react';
import './Login.css'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../navbar/Navbar';
import SocialFooter from '../social-footer/SocialFooter';
import RightsFooter from '../rights-footer/RightsFooter';

function Login() {
  const [passwordType, setPasswordType] = useState("password"); 

  // Função para alternar entre mostrar e esconder a senha
  const togglePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <><><><Navbar /><div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="Web Certificados" className="logo" />
        </div>
        <div className="login-body">
          <form>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              required />

            <label htmlFor="password">Senha</label>
            <div className="password-input-container">
              <input
                type={passwordType}
                id="password"
                placeholder="Digite sua senha"
                required />
              <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                {passwordType === "password" ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="forgot-password">
              <a href="#!">Esqueci minha senha</a>
            </div>
            <button type="submit" className="login-button">Entrar</button>
          </form>
        </div>
        <div className="login-footer">
          <p>
            <a href="#!">Clique aqui caso não tenha uma conta!</a>
          </p>
        </div>
      </div>
    </div></><SocialFooter /></><RightsFooter /></>
  );
}

export default Login;
