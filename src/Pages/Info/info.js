import banner2 from '../../Assets/banner2.png';
import logo2 from '../../Assets/logo2.jpg';
import './info.css';
const Info = () => {
    return (
        <div className='info'>
            <div className="info-container">
                <h1 className="info-title">Thông tin bạn cần biết</h1>
                <hr className="info-hr" />
                <div className="info-box" style={{ backgroundImage: `url(${banner2})` }}>
                    <div className="info-overlay">
                        <div className="info-content">
                            <img src={logo2} alt="logo" className="info-logo" />
                            <div className="info-desc">
                                <span className="info-name">SaveNServe</span> là một nền tảng được xây dựng bởi nhóm sinh viên với mong muốn giảm thiểu tình trạng lãng phí thực phẩm. Tại đây, chúng tôi kết nối các cửa hàng, quán ăn với người tiêu dùng thông qua việc cung cấp những món ăn còn chất lượng nhưng dư thừa hoặc sắp hết hạn với mức giá ưu đãi. Không chỉ giúp tiết kiệm chi phí, SaveNServe còn lan toả thông điệp sống xanh, tiêu dùng thông minh và bảo vệ môi trường.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Info;