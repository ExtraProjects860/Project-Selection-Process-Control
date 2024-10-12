import './HomeCandidate.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import RegistrationsCandidate from '../../components/registrations-candidate/RegistrationsCandidate';
import AvaliableJobs from '../../components/avaliable-jobs/AvaliableJobs';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import Navbar from '../../components/navbar/Navbar';


function HomeCandidate() {
  const userType = 'candidato'; 

  return (
    <>
    <Navbar userType={userType}/>
    <HeaderCandidate />
    <AvaliableJobs/>
      <hr className='line'></hr>
      <RegistrationsCandidate/>
      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default HomeCandidate;
