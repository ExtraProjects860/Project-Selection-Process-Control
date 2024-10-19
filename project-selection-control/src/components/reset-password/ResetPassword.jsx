import React, { useState } from 'react';
import './ResetPassword.css'; 
import logo from '../../assets/icon/logo.svg';
import Navbar from '../../components/navbar/Navbar';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import { useNavigate } from 'react-router-dom';
import { validateForm, handleErrorResponse} from '../../utils/formUtils'

function ResetPassword({user}) {
  const userType = user;
  const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); 
    };

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',

  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
      email: formData.email,
      senha: formData.password,
      telefone: formData.phone,
      endereco: formData.address,
    };

   
  };
  

  return (
    <>
      <Navbar userType={userType} />
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img src={logo} alt="Web Certificados" className="logo" />
            <h2>Alteração de dados</h2>
          </div>
          <div className="register-body">
            <form onSubmit={handleSubmit}>
            <td>
                <div className="input-group">
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
                    <input
                      type="password"
                      id="password"
                      placeholder="Senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </tr>
                
                </div>
              </td>
              <td>
                
              </td>

              <br />
              <br />
              <div className='btns'>
              <button type="submit" className="register-button">
                Confirmar
              </button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
               <button onClick={goBack}  className="cancel-button">
                Cancelar
              </button>
              </div>
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
