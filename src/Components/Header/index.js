
const Header = () => {
    return(
        
        <div className="header">
            {/* logo */}
            <div className="logo">
                <img src="https://saven-serve.s3.amazonaws.com/logo.png" alt="logo" />
            </div>

            {/* navigation */}
            <div className="navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/services">Services</a></li>
                </ul>
            </div>
            {/* icon profile */}
            <div className="profile">
                <img src="https://saven-serve.s3.amazonaws.com/profile.png" alt="profile" />
            </div>
        </div>
    );
}

export default Header;