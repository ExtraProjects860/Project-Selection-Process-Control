import React from 'react';
import './DashboardAdmin.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import Navbar from '../../components/navbar/Navbar';


function DashboardAdmin() {
    const userType = 'admin'; 

  return (
    <>
    <Navbar userType={userType}/>
    <HeaderCandidate />
      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default DashboardAdmin;
