
const login = () => {
    return(
        <>
            <div className="login-container">
                <h2>Đăng Nhập</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit">Đăng Nhập</button>
                </form>
            </div>
        </>
    )
}

export default login;