
import './SocialFooter.css';
import facebook from '../../assets/icon/facebook.svg';
import instagram from '../../assets/icon/instagram.svg'

function SocialFooter() {
  return (
    <div className="social-footer">
      <a href="https://facebook.com" className="social-icon" > <img src={facebook} /> </a>
      <a href="https://instagram.com" className="social-icon"><img src={instagram} /></a>
    </div>
  );
}

export default SocialFooter;
