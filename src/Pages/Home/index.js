import React from 'react';
import banner from '../../Assets/banner.jpg';
import logo2 from '../../Assets/logo2.jpg';
import banner2 from '../../Assets/banner2.png';
import thit from '../../Assets/thit.png';
import raucu from '../../Assets/raucu.png';
import nuocngot from '../../Assets/nuocngot.png';
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

      {/* Section 3 cột sản phẩm */}
      <div className="product-section" style={{ backgroundImage: `url(${banner2})` }}>
        <div className="product-item">
          <img src={thit} alt="Thực phẩm tươi sống" className="product-img" />
          <div className="product-title">Thực phẩm Tươi Sống</div>
          <div className="product-desc">Chọn lựa đa dạng các loại thịt, cá, trứng, hải sản tươi ngon mỗi ngày</div>
          <button className="product-btn">Xem</button>
        </div>
        <div className="product-item">
          <img src={raucu} alt="Thực phẩm xanh" className="product-img" />
          <div className="product-title">Thực phẩm xanh</div>
          <div className="product-desc">Rau củ quả và nấm tươi sạch, giàu dinh dưỡng và an toàn cho sức khỏe.</div>
          <button className="product-btn">Xem</button>
        </div>
        <div className="product-item">
          <img src={nuocngot} alt="Đồ uống" className="product-img" />
          <div className="product-title">Đồ uống</div>
          <div className="product-desc">Đồ uống tiện lợi, tươi mát và dễ sử dụng mỗi ngày.</div>
          <button className="product-btn">Xem</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
