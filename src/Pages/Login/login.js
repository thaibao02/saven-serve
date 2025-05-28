import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css'; // Import the CSS file

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', { // Assuming backend runs on the same domain/port or you use a proxy
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Lưu token vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setMessage('Đăng nhập thành công!');
                // Chuyển hướng về trang Home sau 1 giây
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setMessage(data.message || 'Đăng nhập thất bại.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="login-container"> {/* Add container class */}
            <h1>Đăng nhập</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group"> {/* Add form-group class */}
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group"> {/* Add form-group class */}
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}> {/* Add message class */}{message}</p>}
            <p>Chưa có tài khoản? <Link to="/register-page">Đăng ký ngay</Link></p>
        </div>
    );
}

export default LoginPage;