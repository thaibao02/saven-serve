import { FiPhone } from 'react-icons/fi';
import logo from '../../Assets/logo1.jpg';
import SaveNServer from '../../Assets/SaveNServer.png';

const Header = () => {
    return(
        
        <div className="header">
            {/* logo */}
            <div className="logo">
                <img src={logo} alt="logo" />
                <img src={SaveNServer} alt="SaveNServer" style={{ height: '20px', marginLeft: '15px' }} />
            </div>

            {/* navigation */}
            <div className="navigation">
                <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/shop">Mua sắm</a></li>
                    <li><a href="/info">Thông Tin</a></li>
                    <li><a href="/news">Tin Tức</a></li>
                    <li><a href="/contact">Liên Hệ</a></li>
                </ul>
            </div>
            {/* phone icon and number */}
            <div className="phone">
                <FiPhone style={{ color: 'white', fontSize: '20px', marginRight: '8px' }} />
                <span style={{ color: 'white' }}>+84 915 824 712</span>
            </div>
            {/* icon profile */}
            <div className="profile">
                <img src="https://saven-serve.s3.amazonaws.com/profile.png" alt="profile" />
            </div>
        </div>
    );
}

export default Header;