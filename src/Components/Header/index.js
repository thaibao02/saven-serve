import { FiPhone } from 'react-icons/fi';
import logochinh from '../../Assets/logochinh.png';

const Header = () => {
    return(
        
        <div className="header">
            {/* logo */}
            <div className="logo">
                <img src={logochinh} alt="logo" className="logo-img" />
            </div>

            {/* navigation */}
            <div className="navigation">
                <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/Buy">Mua sắm</a></li>
                    <li><a href="/Info">Thông Tin</a></li>
                    <li><a href="/News">Tin Tức</a></li>
                    <li><a href="/Contact">Liên Hệ</a></li>
                </ul>
            </div>
            {/* phone icon and number */}
            <div className="phone">
                <FiPhone style={{ color: 'white', fontSize: '20px', marginRight: '8px' }} />
                <span style={{ color: 'white' }}>+84 915 824 712</span>
            </div>
            
        </div>
    );
}

export default Header;