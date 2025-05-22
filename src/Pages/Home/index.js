import React from 'react';
import banner from '../../Assets/banner.jpg';
import logo2 from '../../Assets/logo2.jpg';
import './Home.css';
import { GiPumpkin, GiGrapes, GiOrangeSlice } from 'react-icons/gi';

const categories = [
  'Khuyến Mãi',
  'Hàng Mới',
  'Khuyến Mãi Trong Ngày',
  'Trái Cây',
  'Rau xanh',
  'Đồ uống',
  'Gia vị',
  'Sữa',
  'Thịt',
  'Cá',
];

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <div className="sidebar">
          {categories.map((cat, idx) => (
            <div className="sidebar-item" key={idx}>{cat}</div>
          ))}
        </div>
        <div className="banner-section">
          <img src={banner} alt="banner" className="banner-img" />
          <div className="banner-content">
            <div className="banner-row">
              <img src={logo2} alt="logo2" className="banner-logo" />
              <h1 className="banner-title">SavenNServe</h1>
            </div>
            <p className="banner-desc">
              Chúng tôi với sứ mệnh mang lại bữa ăn giá rẻ, chất lượng và giúp bảo vệ môi trường bằng cách không để lãng phí thực phẩm dư thừa!
            </p>
            <button className="banner-btn">MUA NGAY</button>
          </div>
        </div>
      </div>

      {/* Section 3 cột */}
      <div className="feature-section">
        <div className="feature-item">
          <div className="feature-icon-bg"><GiPumpkin size={48} color="#222" /></div>
          <div>
            <div className="feature-title">Thực phẩm chất lượng</div>
            <div className="feature-desc">Lorem ipsum dolor sit amet consectetur In tincidunt</div>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon-bg"><GiGrapes size={48} color="#222" /></div>
          <div>
            <div className="feature-title">Tươi sạch</div>
            <div className="feature-desc">Lorem ipsum dolor sit amet consectetur In tincidunt</div>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon-bg"><GiOrangeSlice size={48} color="#222" /></div>
          <div>
            <div className="feature-title">Tiết kiệm</div>
            <div className="feature-desc">Lorem ipsum dolor sit amet consectetur In tincidunt</div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Home;
