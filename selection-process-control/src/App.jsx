import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import Register from './components/register/Register';
import ResetPasswordRequest from './components/reset-password-request/ResetPasswordRequest';
import ResetPasswordConfirmation from './components/reset-password-confirmation/ResetPasswordConfirmation';


// Instalar o npm install react-router-dom mdb-react-ui-kit para roteamento e para o bootstrap !!

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/reset-password-request" element={<ResetPasswordRequest/>} />
        <Route path="/password-reset-confirmation" element={<ResetPasswordConfirmation/>} />
        </Routes>  
      </div>   
    </Router>
  );
}

export default App;