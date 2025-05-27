import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

const LoginPage = () => {
    return (
        <div className="login-page">
            <h1>Trang Đăng nhập</h1>
            <form>
                <div>
                    <label htmlFor="username">Tên đăng nhập:</label>
                    <input type="text" id="username" required />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input type="password" id="password" required />
                </div>
                <button type="submit">Đăng nhập</button>
            </form>
            <p>Chưa có tài khoản? <Link to="/register-page">Đăng ký ngay</Link></p>
            <p><Link to="/">Quay lại trang chủ</Link></p>
        </div>
    );
}

export default LoginPage;