import React from 'react';
import './ResetPasswordCandidate.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import ResetPassword from '../../components/reset-password/ResetPassword';


function ResetPasswordCandidate() {

  return (
    <>
    <ResetPassword user={'candidato'}/>
    <HeaderCandidate />

      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default ResetPasswordCandidate;
