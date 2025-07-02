import { FaUser } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logofinal from '../../Assets/logofinal.png';
import './Header.css';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Function to check login status from localStorage
    const checkLoginStatus = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (user && token) {
            setIsLoggedIn(true);
            setUsername(user.username);
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    };

    useEffect(() => {
        // Check status on initial mount and when location changes
        checkLoginStatus();

        // Listen for changes in localStorage (e.g., from login/logout page in a different tab)
        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location]);

    // Effect to log showDropdown state changes
    useEffect(() => {
        console.log('showDropdown state changed:', showDropdown);
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Manually update state after logout
        setIsLoggedIn(false);
        setUsername('');
        navigate('/');
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setShowDropdown(false);
    };
    
    const handleOrdersClick = () => {
        navigate('/orders'); // Navigate to orders page
        setShowDropdown(false);
    };

    const handleUserButtonClick = () => {
        console.log('User button clicked, toggling dropdown');
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="header">
            {/* logo */}
            <div className="logo">
                <img src={logofinal} alt="logo" className="logo-img" />
            </div>

            {/* navigation */}
            <div className="navigation">
                <ul>
                    <li><a href="/">Trang chủ</a></li>
                    <li><a href="/Buy">Mua sắm</a></li>
                    <li><a href="/Info">Thông Tin</a></li>
                    {/* <li><a href="/News">Tin Tức</a></li> */}
                    {/* <li><a href="/Contact">Liên Hệ</a></li> */}
                </ul>
            </div>

            {/* User account section */}
            <div className="user-account">
                {isLoggedIn ? (
                    <div className="user-dropdown" key="user-dropdown">
                        <button 
                            className="user-button"
                            onClick={handleUserButtonClick}
                        >
                            <FaUser style={{ color: 'white', fontSize: '20px', marginRight: '8px' }} />
                            <span style={{ color: 'white' }}>{username}</span>
                        </button>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={handleProfileClick}>Xem hồ sơ</button>
                                <button onClick={handleOrdersClick}>Đơn hàng</button>
                                <button onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <a href="/login-page" className="phone">
                        <FaUser style={{ color: 'white', fontSize: '20px', marginRight: '8px' }} />
                        <span style={{ color: 'white' }}>Tài khoản</span>
                    </a>
                )}
            </div>
        </div>
    );
}

export default Header;