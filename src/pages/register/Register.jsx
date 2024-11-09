import React, { useState } from 'react';
import './Register.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import UserService from '../../services/user-service/UserService';
import { useNavigate } from 'react-router-dom';
import { validateForm, handleErrorResponse} from '../../utils/formUtils'

function Register() {
  const userType = 'deslogado';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
    gender: '' 
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não correspondem!');
      return;
    }
    const validationError = validateForm(formData);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const userData = {
      nome_usuario: formData.name,
      email: formData.email,
      senha: formData.password,
      cpf: formData.cpf,
      telefone: formData.phone,
      endereco: formData.address,
      dataNascimento: formData.birthdate,
      sexo: formData.gender 
    };

    try {
      const response = await UserService.registerUser(userData);
      setSuccessMessage('Usuário registrado com sucesso!');
      navigate('/');
      setErrorMessage('');  
    } catch (error) {
      const errorMsg = handleErrorResponse(error);
      setErrorMessage(errorMsg); 
      setSuccessMessage('');  
    }
  };

  return (
    <>
      <Navbar userType={userType} />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img src={logo} alt="Web Certificados" className="logo" />
            <h2>Registro</h2>
          </div>
          <div className="register-body">
            <form onSubmit={handleSubmit}>
              <td>
                <div className="input-group">
                  <tr>
                    <input
                      type="text"
                      id="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
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
                </div>
              </td>
              <td>
                <div className="input-group">
                  <tr>
                    <input
                      type="text"
                      id="cpf"
                      placeholder="CPF"
                      value={formData.cpf}
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
                <div className="input-group">
                  <tr>
                    <input
                      type="text"
                      id="address"
                      placeholder="Endereço"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
                  <tr>
                    <input
                      type="date"
                      id="birthdate"
                      value={formData.birthdate}
                      onChange={handleInputChange}
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
                  <tr>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
                </div>
              </td>
              <td>
                <div className="input-group">
                  <tr>
                    <select
                      id="gender"
                      value={formData.gender} // formData.gender deve iniciar com uma string vazia
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="" disabled hidden>
                        Gênero
                      </option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                    </select>
                  </tr>
                </div>
              </td>

              <br />
              <br />
              <button type="submit" className="register-button">
                Registre-se agora
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
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

export default Register;
