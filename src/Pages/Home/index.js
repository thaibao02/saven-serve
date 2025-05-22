import React from 'react';
import banner from '../../Assets/banner.jpg';
import logo2 from '../../Assets/logo2.jpg';
import './Home.css';

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
  );
}

export default Home;