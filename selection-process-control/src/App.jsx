import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ResetPasswordRequest from './pages/reset-password-request/ResetPasswordRequest';
import ResetPasswordConfirmation from './pages/reset-password-confirmation/ResetPasswordConfirmation';
import HomeCandidate from './pages/home-candidate/HomeCandidate';
import JobPostingAdminPage from './pages/job-posting-admin-page/JobPostingAdminPage';
import DashboardAdmin from './pages/dashboard-admin/DashboardAdmin';


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
        <Route path="/home-candidate" element={<HomeCandidate/>} />
        <Route path="/job-posting-admin-page" element={<JobPostingAdminPage/>} />
        <Route path="/dashboard-admin" element={<DashboardAdmin/>} />
        </Routes>  
      </div>   
    </Router>
  );
}

export default App;