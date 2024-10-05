import React, { useState } from 'react';
import './HomeAdmin.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import Navbar from '../../components/navbar/Navbar';
import CandidatesTable from '../../components/tables/CandidatesTable';
import UsersTable from '../../components/tables/UsersTable';

function HomeAdmin() {
  const userType = 'admin'; 
  const [showCandidates, setShowCandidates] = useState(true);

  const toggleTables = () => setShowCandidates(!showCandidates);

  return (
    <>
    <Navbar userType={userType}/>
    <HeaderCandidate />
    <div className="tables-container">
      <button onClick={toggleTables}>
        {showCandidates ? 'Mostrar Tabela de Usuários' : 'Mostrar Tabela de Candidatos'}
      </button>
      
      {showCandidates ? <CandidatesTable /> : <UsersTable />}
    </div>
    <SocialFooter/>
     <RightsFooter/>
    </>
    
  );
}


// function HomeAdmin() {
//     const userType = 'admin'; 

//   return (
//     <>
//     <Navbar userType={userType}/>
//     <HeaderCandidate />
//       <SocialFooter/>
//       <RightsFooter/>
//       </>
//   );
// }

export default HomeAdmin;
