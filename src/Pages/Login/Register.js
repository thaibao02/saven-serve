import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation
import './Register.css'; // Import the CSS file

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', { // Assuming backend runs on the same domain/port or you use a proxy
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
                // Optionally redirect to login page after successful registration
                navigate('/login-page');
            } else {
                setMessage(data.message || 'Đăng ký thất bại.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="register-container">
            <h1> Đăng ký</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đăng ký</button>
            </form>
            {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}
            <p>Đã có tài khoản? <Link to="/login-page">Đăng nhập</Link></p>
        </div>
    );
}

export default RegisterPage;