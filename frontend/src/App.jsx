import MainPage from './pages/landing-page/LandingPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../src/components/auth-context/AuthContext';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ResetPasswordRequest from './pages/reset-password-request/ResetPasswordRequest';
import ResetPasswordConfirmation from './pages/reset-password-confirmation/ResetPasswordConfirmation';
import HomeCandidate from './pages/home-candidate/HomeCandidate';
import JobPostingAdminPage from './pages/job-posting-admin-page/JobPostingAdminPage';
import HomeAdmin from './pages/home-admin/HomeAdmin';
import ResetPasswordAdmin from './pages/reset-password-admin/ResetPasswordAdmin';
import ResetPasswordCandidate from './pages/reset-password-candidate/ResetPasswordCandidate';
import NotFoundPage from './pages/error-pages/NotFoundPage';
//import { useEffect } from 'react';

function App() {
  const { isLoggedIn, userRole } = useContext(AuthContext); 

  // useEffect(() => {
  //   const handleLogoutOnClose = () => {
  //     localStorage.clear();
  //   };
  //   window.addEventListener('beforeunload', handleLogoutOnClose);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleLogoutOnClose);
  //   };
  // }, []);

  const route = userRole === "admin" ? "/home-admin" : "/home-candidate";

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to={route} /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password-request" element={<ResetPasswordRequest />} />
          <Route path="/password-reset-confirmation" element={<ResetPasswordConfirmation />} />
          <Route
            path="/home-candidate"
            element={isLoggedIn && userRole === "candidate" ? <HomeCandidate /> : <Navigate to="/" />}
          />
          <Route
            path="/job-posting-admin-page"
            element={isLoggedIn && userRole === "admin" ? <JobPostingAdminPage /> : <Navigate to="/" />}
          />
          <Route
            path="/home-admin"
            element={isLoggedIn && userRole === "admin" ? <HomeAdmin /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password-admin"
            element={isLoggedIn && userRole === "admin" ? <ResetPasswordAdmin /> : <Navigate to="/" />}
          />
          <Route
            path="/reset-password-candidate"
            element={isLoggedIn && userRole === "candidate" ? <ResetPasswordCandidate /> : <Navigate to="/" />}
          />
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
