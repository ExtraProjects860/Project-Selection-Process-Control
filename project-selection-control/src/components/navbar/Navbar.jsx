import  { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/icon/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../auth-context/AuthContext';

function Navbar({ userType }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext); // Atualiza o contexto global
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpa o localStorage
    localStorage.clear();

    // Atualiza o estado global de login
    setIsLoggedIn(false);
    setUserRole(null);

    // Redireciona para a página de login
    navigate('/');
  };

  const renderMenu = () => {
    switch(userType) {
      case 'candidato':
        return (
          <>
            <a href="/home-candidate">Home</a>
            <a href="/reset-password-candidate">Alterar dados</a>
            <button onClick={handleLogout}>Sair</button>
          </>
        );
      case 'admin':
        return (
          <>
            <a href="/home-admin">Home</a>
            <a href="/">Gerenciar Usuários</a>
            <a href="/job-posting-admin-page">Gerenciar vagas</a>
            <a href="/reset-password-admin">Alterar dados</a>
            <button onClick={handleLogout}>Sair</button>
          </>
        );
      case 'deslogado':
      default:
        return (
          <>
            <a href="/">Login</a>
            <a href="/register">Cadastro</a>
            <a href="/reset-password-request">Redefinição de senha</a>
          </>
        );
    }
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="Web Certificados" className="logo"/>
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
