import React from 'react';
import './ResetPasswordAdmin.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import ResetPassword from '../../components/reset-password/ResetPassword';


function ResetPasswordAdmin() {

  return (
    <>
    <ResetPassword user={'admin'}/>
    <HeaderCandidate />

      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default ResetPasswordAdmin;
