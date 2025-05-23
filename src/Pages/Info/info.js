import banner2 from '../../Assets/banner2.png';
import logo2 from '../../Assets/logo2.jpg';
import thumua from '../../Assets/thumua.png';
import phanloai from '../../Assets/phanloai.png';
import dangban from '../../Assets/dangban.png';
import giaonhanh from '../../Assets/giaonhanh.png';
import avatar from '../../Assets/avatar.png';
import './info.css';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';


const InfoSteps = () => {
  return (
    <div className="steps-section">
      <h2 className="steps-title">Cách chúng tôi hoạt động</h2>
      <div className="steps-wrapper">
        <div className="steps-col">
          <div className="step-item"><img src={thumua} alt="" /><div className="step-title">1. Thu mua đồ ăn từ đối tác</div><div className="step-desc">Chúng tôi hợp tác với các nhà hàng, siêu thị, cửa hàng thực phẩm để thu mua thực phẩm dư thừa, đảm bảo chất lượng và an toàn.</div></div>
          <div className="step-item"><img src={dangban} alt="" /><div className="step-title">3. Đăng bán trên Website</div><div className="step-desc">Các sản phẩm đạt chuẩn sẽ được đăng bán trên website với giá ưu đãi, minh bạch thông tin và nguồn gốc.</div></div>
        </div>
        <div className="steps-timeline">
          {/* chỉ giữ lại line, không còn step-dot */}
        </div>
        <div className="steps-col">
          <div className="step-item"><img src={phanloai} alt="" /><div className="step-title">2. Phân loại và kiểm định</div><div className="step-desc">Thực phẩm được phân loại, kiểm định kỹ càng về chất lượng, nguồn gốc và hạn sử dụng trước khi đưa đến tay khách hàng.</div></div>
          <div className="step-item"><img src={giaonhanh} alt="" /><div className="step-title">4. Giao nhanh & kêu gọi</div><div className="step-desc">Đơn hàng được giao nhanh chóng, kèm theo lời kêu gọi cùng chung tay giảm lãng phí thực phẩm và bảo vệ môi trường.</div></div>
        </div>
      </div>
    </div>
  );
};

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

            <div>
                <InfoSteps />
            </div>

            <div className="review-section">
                <button className="review-arrow left"><FaChevronLeft /></button>
                <div className="review-list">
                    {[1,2,3].map((item, idx) => (
                        <div className="review-card" key={idx}>
                            <div className="review-content">
                                <div className="review-text">“Website dễ sử dụng, đặt món nhanh chóng. Đồ ăn ngon, giao hàng đúng giờ và đóng gói cẩn thận. Mình rất hài lòng với dịch vụ và chắc chắn sẽ quay lại nhiều lần nữa!”</div>
                                <div className="review-user-row">
                                    <div className="review-avatar"></div>
                                    <div className="review-user">
                                        <div className="review-username">Baovt</div>
                                        <div className="review-time">Đã từng đặt</div>
                                    </div>
                                    <div className="review-stars">
                                        <FaStar color="#ffb400" />
                                        <FaStar color="#ffb400" />
                                        <FaStar color="#ffb400" />
                                        <FaStar color="#ffb400" />
                                        <FaStar color="#ffb400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="review-arrow right"><FaChevronRight /></button>
            </div>

            <div className="team-section">
                <h2 className="team-title">Thành viên </h2>
                <div className="team-list">
                    {[1,2,3,4,5,6].map((item, idx) => (
                        <div className="team-card" key={idx}>
                                <img src={avatar} alt="Avatar Baovt" className="team-avatar-img" />
                            <div className="team-name">Baovt</div>
                            <div className="team-role">CEO</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Info;