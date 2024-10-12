import './JobPostingAdminPage.css';
import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import JobsPosting from '../../components/jobs-posting/JobsPosting';
import Navbar from '../../components/navbar/Navbar';


function JobPostingAdminPage() {
    const userType = 'admin'; 

  return (
    <>
    <Navbar userType={userType}/>
    <HeaderCandidate />
    <JobsPosting/>
      <SocialFooter/>
      <RightsFooter/>
      </>
  );
}

export default JobPostingAdminPage;