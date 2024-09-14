import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/icon/logo.svg';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <img src={logo} alt="Web Certificados" className="logo"/>
      <button className="menu-button" onClick={toggleMenu}>
      {isOpen ? '✖' : '☰'} {}
      </button>
      {isOpen && (
        <div className="navbar-menu">
          <a href="/">Login</a>
          <a href="/register">Cadastro</a>
          <a href="/reset-password-request">Redefinição de senha</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
