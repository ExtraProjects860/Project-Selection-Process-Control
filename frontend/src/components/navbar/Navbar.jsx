/* eslint-disable react/prop-types */
import  { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/icon/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth-context/AuthContext';
import UserService from "../../services/user-service/UserService";


function Navbar({ userType }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    setIsLoggedIn(false);
    localStorage.clear();
    setUserRole(null);
    navigate('/');
  }
  
  const handleLogout = async () => {
    const token = localStorage.getItem('token');  
    try {
      setLoading(true);
      await UserService.userLogout(token); 
      setLoading(false);
      setShowModal(true);
      
    } catch (error) {
      setLoading(false);
      console.error("Erro ao fazer logout:", error);
    }
  };


  const renderMenu = () => {
    switch(userType) {
      case 'candidato':
        return (
          <>
            <a href="/home-candidate">Home</a>
            <a href="/reset-password-candidate">Alterar dados</a>
            <button className='logout-btn' onClick={handleLogout}>Sair</button>
          </>
        );
      case 'admin':
        return (
          <>
            <a href="/home-admin">Home</a>
            <a href="/job-posting-admin-page">Gerenciar vagas</a>
            <a href="/reset-password-admin">Alterar dados</a>
            <button className='logout-btn' onClick={handleLogout}>Sair</button>
          </>
        );
      case 'deslogado':
      default:
        return (
          <>
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/register">Cadastro</a>
            <a href="/reset-password-request">Redefinição de senha</a>
          </>
        );
    }
  };

  return (
    
    <nav className="navbar">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      {showModal && (
        <div className="success-modal-overlay">
        <div className="success-modal-content">
          <h3>Logout realizado com sucesso!</h3>
          <button onClick={handleModalClose} className="modal-close-button">Fechar</button>
        </div>
      </div>
      )}
      <a href="/"><img src={logo} alt="Web Certificados" className="logo"/></a>
      <button className="menu-button" onClick={toggleMenu}>
        {isOpen ? '✖' : '☰'} 
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {renderMenu()}
      </div>
    </nav>
  );
  
}

export default Navbar;
