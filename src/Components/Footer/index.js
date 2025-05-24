import logochinh from '../../Assets/logochinh.png';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaInstagram, FaFacebookF, FaYoutube, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-top">
        <div className="footer-logo-row">
          <img src={logochinh} alt="logo" className="footer-logo" />
          
        </div>
        <div className="footer-hours">
          <span className="footer-hours-title">Thời gian giao hàng</span>
          <span className="footer-hours-day">Thứ 2 - CN</span>
          <span className="footer-hours-time">08.00 am - 11.00 pm</span>
        </div>
      </div>
      <div className="footer-contact-row">
        <span><FaPhoneAlt style={{marginRight: 8}} /> <b>+84 986 452 731</b></span>
        <span><FaEnvelope style={{marginRight: 8}} /> <b>Saven&Server@gmail.com</b></span>
        <span><FaMapMarkerAlt style={{marginRight: 8}} /> <b>FPT University</b></span>
        <span><FaGlobe style={{marginRight: 8}} /> <b>S&S.com</b></span>
      </div>
      <hr className="footer-hr" />
      <div className="footer-bottom-row">
        <span className="footer-copyright">Copyright 2025 @pulps all right reserved</span>
        <span className="footer-socials">
          <FaInstagram />
          <FaFacebookF />
          <FaYoutube />
          <FaTwitter />
        </span>
      </div>
    </footer>
  );
}

export default Footer;
