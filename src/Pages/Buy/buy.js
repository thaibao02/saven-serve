import React from 'react';
import cocacola from '../../Assets/cocacola.png';

import { FaHeart, FaFire, FaShoppingCart, FaSearch, FaChevronDown } from 'react-icons/fa';

const categories = [
  'Khuyến Mãi', 'Hàng Mới', 'Khuyến Mãi Trong Ngày', 'Trái Cây', 'Rau xanh', 'Đồ uống', 'Gia vị', 'Sữa', 'Thịt', 'Cá'
];

const products = [
  {
    img: cocacola,
    name: 'Coca cola',
    price: '7.000 VND',
    oldPrice: '10.000 VND',
    weight: '/Lon',
    badge: '-30%',
    exp: 'HSD: Còn 3 tháng',
    hot: true,
    liked: true,
  },
  
  // Thêm các sản phẩm cocacola cho đủ grid
  ...Array(16).fill({
    img: cocacola,
    name: 'Coca cola',
    price: '7.000 VND',
    oldPrice: '10.000 VND',
    weight: '/Lon',
    badge: '-30%',
    exp: 'HSD: Còn 3 tháng',
    hot: true,
    liked: false,
  })
];

const Buy = () => {
  return (
    <div className="buy-container">
      <div className="buy-sidebar">
        {categories.map((cat, idx) => (
          <div className={`buy-sidebar-item${idx === 0 ? ' active' : ''}`} key={idx}>
            {cat} <span>&gt;</span>
          </div>
        ))}
      </div>
      <div className="buy-main">
        <div className="buy-header">
          <button className="buy-filter-btn">
            Danh mục <FaChevronDown style={{marginLeft: 8}} />
          </button>
          <div className="buy-search">
            <input placeholder="Tìm kiếm sản phẩm..." />
            <button><FaSearch /></button>
          </div>
          <div className="buy-icons">
            <FaHeart style={{marginRight: 18}} />
            <FaShoppingCart />
            <span className="buy-user">Datnx11</span>
          </div>
        </div>
        <div className="buy-products">
          {products.map((p, idx) => (
            <div className="buy-product-card" key={idx}>
              <div className="buy-product-badge">{p.badge}</div>
              <div className="buy-product-like"><FaHeart color={p.liked ? '#7bc043' : '#bbb'} /></div>
              <img src={p.img} alt={p.name} className="buy-product-img" />
              <div className="buy-product-pack">6 Lon  <span>320ML</span> </div>
              <div className="buy-product-progress">
                <div className="buy-product-progress-bar"></div>
                <span className="buy-product-progress-label">Sắp cháy hàng <FaFire color="#ff5722" size={16} style={{marginLeft: 4}} /></span>
              </div>
              <div className="buy-product-name">{p.name}</div>
              <div className="buy-product-rating">★ ★ ★ ★ ★</div>
              <div className="buy-product-price"><span>{p.price}</span>{p.weight}</div>
              <div className="buy-product-bottom">
                <span className="buy-product-old">{p.oldPrice}</span>
                <button className="buy-product-cart"><FaShoppingCart style={{marginRight: 6}} /> Thêm vào giỏ hàng</button>
              </div>
              <div className="buy-product-exp">{p.exp}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Buy; 