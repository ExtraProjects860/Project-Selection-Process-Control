import './HomeCandidate.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import RegistrationsCandidate from '../../components/registrations-candidate/RegistrationsCandidate';
import AvaliableJobs from '../../components/avaliable-jobs/AvaliableJobs';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import Navbar from '../../components/navbar/Navbar';
import { useState } from 'react';

function HomeCandidate() {
  const userType = 'candidato'; 
  const [updateRegistrations, setUpdateRegistrations] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);

  const handleUpdateRegistrations = () => {
    setUpdateRegistrations(!updateRegistrations); 
  };

  const handleJobsLoaded = () => {
    setLoadingJobs(false); 
  };

  const handleRegistrationsLoaded = () => {
    setLoadingRegistrations(false); 
  };

  const isLoading = loadingJobs || loadingRegistrations; 

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
      <div>
        <Navbar userType={userType} />
        <HeaderCandidate />
      </div>
      
      <div>
        <AvaliableJobs onSuccess={handleUpdateRegistrations} onLoaded={handleJobsLoaded} />
        <hr className='line'></hr>
        <RegistrationsCandidate updateTrigger={updateRegistrations} onLoaded={handleRegistrationsLoaded} />
      </div>
      <footer className='footer'>
        <SocialFooter />
        <RightsFooter />
      </footer>
    </>
  );
}

export default HomeCandidate;
