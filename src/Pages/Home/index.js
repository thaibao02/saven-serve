import React, { useEffect, useState } from 'react';
import banner from '../../Assets/banner.jpg';
import logochinh from '../../Assets/logochinh.png';
import banner2 from '../../Assets/banner2.png';
import thit from '../../Assets/thit.png';
import raucu from '../../Assets/raucu.png';
import nuocngot from '../../Assets/nuocngot.png';
import cocacola from '../../Assets/cocacola.png';
import './Home.css';
import { GiPumpkin, GiGrapes, GiOrangeSlice } from 'react-icons/gi';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';

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
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(7 * 60 * 60); // 7 tiếng tính bằng giây

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 7 * 60 * 60; // reset về 7 tiếng
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format time
  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className='home'>
      <div className="home-container">
        <div className="sidebar">
          {categories.map((cat, idx) => (
            <div className="sidebar-item" key={idx}>{cat}</div>
          ))}
        </div>
        <div className="banner-section" style={{ backgroundImage: `url(${banner})` }}>
          <div className="banner-content">
            <div className="banner-row">
                <img src={logochinh} alt="logo" className="banner-logo" />
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

      <div className="promotion-section">
        <div className="promotion-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="promotion-title">Khuyến mãi trong ngày</div>
            <div className="promotion-timer">
              <span className="promotion-timer-label">Kết thúc</span>
              <span className="promotion-timer-count">{hours} : {minutes} : {seconds}</span>
            </div>
          </div>
          <a href="/promotions" className="promotion-viewall">VIEW ALL</a>
        </div>
        <div className="promotion-slider">
          <button className="promotion-arrow left"><FaChevronLeft color="#7bc043" size={28} /></button>
          <div className="promotion-products">
            {[1,2,3,4,5,6,7,8,9].map((item, idx) => (
              <div className="promotion-product-card" key={idx}>
                <img src={cocacola} alt="Coca cola" className="promotion-product-img" />
                <div className="promotion-product-pack">6 <span>320ML</span> Lon</div>
                <div className="promotion-progress">
                  <div className="promotion-progress-bar"></div>
                  <span className="promotion-progress-label">Sắp cháy hàng <FaFire color="#ff5722" size={16} style={{marginLeft: 4}} /></span>
                </div>
                <div className="promotion-product-name">Coca cola</div>
                <div className="promotion-product-rating">★ ★ ★ ★ ★</div>
                <div className="promotion-product-price"><span>7.000 VND</span> /500g</div>
                <div className="promotion-product-bottom">
                  <span className="promotion-product-old">10.000 VND</span>
                  <span className="promotion-product-exp">HSD: Còn 2 ngày</span>
                </div>
              </div>
            ))}
          </div>
          <button className="promotion-arrow right"><FaChevronRight color="#7bc043" size={28} /></button>
        </div>
      </div>

        <div>
            
        </div>
    </div>
  );
}

export default Home;
