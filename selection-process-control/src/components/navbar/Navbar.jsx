import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/icon/logo.svg';

function Navbar({ userType }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderMenu = () => {
    switch(userType) {
      case 'candidato':
        return (
          <>
            <a href="/home-candidate">Home</a>
          </>
        );
      case 'admin':
        return (
          <>
            <a href="/dashboard-admin">Dashboard</a>
            <a href="/">Gerenciar Usuários</a>
            <a href="/job-posting-admin-page">Gerenciar vagas</a>
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
