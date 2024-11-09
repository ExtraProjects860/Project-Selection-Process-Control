import HeaderCandidate from '../../components/header-candidate/HeaderCandidate';
import SocialFooter from '../../components/social-footer/SocialFooter';
import RightsFooter from '../../components/rights-footer/RightsFooter';
import Navbar from '../../components/navbar/Navbar';
import TablesContainer from '../../components/table/TablesContainer';



function HomeAdmin() {
  const userType = 'admin'; 

  return (
    <>
    <div>
      <Navbar userType={userType}/>
      <HeaderCandidate />
    </div>
    <TablesContainer />
    <footer className='footer'>
      <SocialFooter/>
      <RightsFooter/>
      </footer>
      </>
  );
}

export default HomeAdmin