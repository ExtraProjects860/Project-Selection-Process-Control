import React from 'react';
import './Register.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../navbar/Navbar';
import SocialFooter from '../social-footer/SocialFooter';
import RightsFooter from '../rights-footer/RightsFooter';

function Register() {
  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img src={logo} alt="Web Certificados" className="logo" />
            <h2>Registro</h2>
          </div>
          <div className="register-body">
            <form>
              <td>
                <div className="input-group">
                  <tr>
                    <input
                      type="text"
                      id="name"
                      placeholder="Seu nome"
                      required
                    />
                  </tr>
                  <tr>
                    {" "}
                    <input
                      type="email"
                      id="email"
                      placeholder="E-mail"
                      required
                    />
                  </tr>
                </div>
              </td>
              <td>
                <div className="input-group">
                  <tr>
                    <input type="text" id="cpf" placeholder="CPF" required />
                  </tr>
                  <tr>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Telefone"
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
                      required
                    />
                  </tr>
                  <tr>
                    <input
                      type="date"
                      id="birthdate"
                      placeholder="Data de nascimento"
                      required
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
                      placeholder="Senha"
                      required
                    />
                  </tr>
                  <tr>
                    <input
                      type="password"
                      id="confirm-password"
                      placeholder="Confirme sua senha"
                      required
                    />
                  </tr>
                </div>
              </td>
              <br/><br/>
              <button type="submit" className="register-button">
                Registre-se agora
              </button>
            </form>
          </div>
        </div>
      </div>
      <SocialFooter />
      <RightsFooter />
    </>
  );
}

export default Register;
