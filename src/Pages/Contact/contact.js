import './contact.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const Contact = () => {
    return (
        <>
            <div className="contact-section">
                <div className="contact-info">
                    <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <span>+84 986 452 731</span>
                    </div>
                    <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span>Saven&Server@gmail.com</span>
                    </div>
                    <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <span>FPT University</span>
                    </div>
                    <div className="contact-item">
                        <FaGlobe className="contact-icon" />
                        <span>S&S.com</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact;