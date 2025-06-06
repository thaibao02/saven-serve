import React, { useState } from 'react';
import './owner.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import RevenueManagement from './RevenueManagement'; // Import RevenueManagement
// Import necessary icons from react-icons
import { AiOutlineInbox } from 'react-icons/ai';
import { FaRegCalendarCheck } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { BiLogOut } from 'react-icons/bi'; // Import a logout icon

const OwnerDashboard = () => {
    const [activeMenuItem, setActiveMenuItem] = useState('overview');
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle menu item clicks
    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    // Function to render content based on active menu item
    const renderContent = () => {
        switch (activeMenuItem) {
            case 'overview':
                return <div>Overview Content</div>;
            case 'products':
                return <ProductManagement />;
            case 'orders':
                return <OrderManagement />
            case 'notifications':
                return <div>Notification Content</div>;
            case 'revenue':
                return <RevenueManagement />;
            default:
                return <div>Select a menu item</div>;
        }
    };

    const handleLogout = () => {
        console.log('Logging out...');
        // Remove token and user data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to the homepage or login page
        navigate('/');
    };

    return (
        <div className="owner-dashboard-container">
            <div className="sidebar">
                <h2>Owner Dashboard</h2>
                <ul>
                    {/* <li onClick={() => handleMenuItemClick('overview')} className={activeMenuItem === 'overview' ? 'active' : ''}>
                        <MdOutlineDashboard className="menu-icon" />
                        Overview
                    </li> */}
                    <li onClick={() => handleMenuItemClick('products')} className={activeMenuItem === 'products' ? 'active' : ''}>
                         <AiOutlineInbox className="menu-icon" />
                         Product management
                    </li>
                    <li onClick={() => handleMenuItemClick('orders')} className={activeMenuItem === 'orders' ? 'active' : ''}>
                         <FaRegCalendarCheck className="menu-icon" />
                         Order management
                    </li>
                    
                    <li onClick={() => handleMenuItemClick('revenue')} className={activeMenuItem === 'revenue' ? 'active' : ''}>
                         <HiOutlineCurrencyDollar className="menu-icon" />
                         Revenue
                    </li>
                    <li onClick={handleLogout} className="logout-item">
                        <BiLogOut className="menu-icon" />
                        Log out
                    </li>
                </ul>
            </div>
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default OwnerDashboard;  