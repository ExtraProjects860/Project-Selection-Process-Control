import React from 'react';
import './HomeCandidate.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import RegistrationsCandidate from '../../components/registrations-candidate/RegistrationsCandidate';
import AvaliableJobs from '../../components/avaliable-jobs/AvaliableJobs';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';


function HomeCandidate() {

  return (
    <><HeaderCandidate />
    <AvaliableJobs/>
      <hr className='line'></hr>
      <RegistrationsCandidate/>
      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default HomeCandidate;
