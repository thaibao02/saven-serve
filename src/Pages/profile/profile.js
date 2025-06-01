import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css'; // Import the CSS file

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        phone: '',
        address: '',
        password: '' // Add password for update form
    });
    const navigate = useNavigate();

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login-page');
                return;
            }

            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login-page');
                    // Log out if fetching profile fails
                    // You might want more specific error handling here
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUserData(data);
                // Initialize form data with fetched user data including new fields
                setFormData({
                    username: data.username,
                    email: data.email,
                    name: data.name || '', // Use || '' to handle null/undefined
                    phone: data.phone || '', // Use || '' to handle null/undefined
                    address: data.address || '',
                    password: '' // Password field is initially empty
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]); // Dependency array includes navigate

    // Handle input changes in the form
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle click on Update button
    const handleUpdateClick = () => {
        setIsEditing(true);
        // Re-initialize form data in case user cancelled previous edit
        if (userData) {
             setFormData({
                username: userData.username,
                email: userData.email,
                name: userData.name || '', // Use || '' to handle null/undefined
                phone: userData.phone || '',
                address: userData.address || '',
                password: ''
            });
        }
    };

    // Handle click on Cancel button
    const handleCancelClick = () => {
        setIsEditing(false);
        // Optionally reset form data to original user data
         if (userData) {
             setFormData({
                username: userData.username,
                email: userData.email,
                name: userData.name || '', // Use || '' to handle null/undefined
                phone: userData.phone || '',
                address: userData.address || '',
                password: ''
            });
         }
    };

    // Handle click on Save button
    const handleSaveClick = async () => {
        setLoading(true); // Show loading state while saving
        setError(null); // Clear previous errors

        const token = localStorage.getItem('token');
        if (!token) {
             navigate('/login-page');
             setLoading(false);
             return;
        }

        try {
            // Implement backend API call to update profile
            // Assuming a PUT or PATCH request to /api/profile
            const response = await fetch('/api/profile', {
                method: 'PUT', // Or PATCH
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                // Send all formData fields including phone and address
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                 // Handle update errors (e.g., validation errors from backend)
                 const errorData = await response.json();
                 throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedUserData = await response.json();
            setUserData(updatedUserData); // Update local user data state
            setIsEditing(false); // Exit editing mode
            // Optionally update user data in localStorage if needed elsewhere
             localStorage.setItem('user', JSON.stringify(updatedUserData));

        } catch (err) {
            setError(err.message);
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) { // Show loading only on initial fetch
        return <div>Đang tải thông tin hồ sơ...</div>;
    }

    if (error && !isEditing) { // Show error only in view mode, not while editing
        return <div>Lỗi: {error}</div>;
    }

    if (!userData && !loading) {
        return <div>Không có dữ liệu hồ sơ. Vui lòng đăng nhập lại.</div>;
    }

    return (
        <div className="profile-container"> {/* Container class for styling */}
            {/* Conditionally render title */}
            {!isEditing && <h1>Thông tin hồ sơ</h1>}

            {isEditing ? (
                // Edit Form
                <div className="profile-edit-form"> {/* Class for styling */}
                    <h2>Chỉnh sửa hồ sơ</h2>
                    {error && <p className="error-message">Lỗi: {error}</p>}
                    <div>
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username"
                            value={formData.username || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="name">Họ và tên:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Add Phone and Address input fields */}
                    <div>
                        <label htmlFor="phone">Số điện thoại:</label>
                        <input 
                            type="text" 
                            id="phone" 
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="address">Địa chỉ:</label>
                        <input 
                            type="text" 
                            id="address" 
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Mật khẩu (Để trống nếu không đổi):</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleInputChange}
                            placeholder="Để trống nếu không đổi mật khẩu"
                        />
                    </div>
                    <button onClick={handleSaveClick} disabled={loading}>Lưu</button>
                    <button onClick={handleCancelClick} disabled={loading}>Hủy</button>
                </div>
            ) : (
                // Profile View
                <div className="profile-view"> {/* Class for styling */}
                    <p><strong>Tên đăng nhập:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Họ và tên:</strong> {userData.name || 'Chưa cập nhật'}</p>
                    {/* Display Phone and Address */}
                    <p><strong>Số điện thoại:</strong> {userData.phone || 'Chưa cập nhật'}</p>
                    <p><strong>Địa chỉ:</strong> {userData.address || 'Chưa cập nhật'}</p>
                    <button onClick={handleUpdateClick}>Cập nhật hồ sơ</button>
                </div>
            )}
             {loading && <p>Đang xử lý...</p>}
        </div>
    );
};

export default ProfilePage;