import React, { useState } from 'react';
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
  const [cart, setCart] = useState([]); // [{product, quantity}]
  const [likeCount, setLikeCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  // Thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.product.name === product.name);
      if (found) {
        return prev.map(item =>
          item.product.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Tăng/giảm số lượng
  const handleChangeQty = (product, delta) => {
    setCart(prev => prev.map(item =>
      item.product.name === product.name
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  // Tính tổng
  const total = cart.reduce((sum, item) => sum + parseInt(item.product.price.replace(/\D/g, '')) * item.quantity, 0);
  const shipping = cart.length > 0 ? 15000 : 0;
  const grandTotal = total + shipping;

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
            <div style={{position: 'relative', display: 'inline-block', marginRight: 18}}>
              <FaHeart />
              {likeCount > 0 && (
                <span className="cart-badge">{likeCount}</span>
              )}
            </div>
            <div style={{position: 'relative', display: 'inline-block'}} onClick={() => setShowCart(!showCart)}>
              <FaShoppingCart style={{cursor: 'pointer'}} />
              {cart.length > 0 && (
                <span className="cart-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              )}
            </div>
            <span className="buy-user">Datnx11</span>
          </div>
        </div>
        <div className="buy-products">
          {products.map((p, idx) => (
            <div className="buy-product-card" key={idx}>
              <div className="buy-product-badge">{p.badge}</div>
              <div className="buy-product-like" onClick={() => setLikeCount(likeCount + 1)}><FaHeart color={p.liked ? '#7bc043' : '#bbb'} /></div>
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
                <button className="buy-product-cart" onClick={() => handleAddToCart(p)}><FaShoppingCart style={{marginRight: 6}} /> Thêm vào giỏ hàng</button>
              </div>
              <div className="buy-product-exp">{p.exp}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Cart Modal */}
      {showCart && (
        <>
          <div className="cart-modal-overlay" onClick={() => setShowCart(false)}></div>
          <div className="cart-modal">
            <button className="cart-modal-close" onClick={() => setShowCart(false)}>×</button>
            <div className="cart-title">Hóa đơn</div>
            <div className="cart-list">
              {cart.map((item, idx) => (
                <div className="cart-item" key={idx}>
                  <img src={item.product.img} alt={item.product.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-more">Thêm »</div>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleChangeQty(item.product, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleChangeQty(item.product, 1)}>+</button>
                  </div>
                  <div className="cart-item-price">{item.product.price}</div>
                </div>
              ))}
            </div>
            <div className="cart-bill">
              <div className="cart-bill-row"><span>Đơn giá</span><span>{total.toLocaleString()} VND</span></div>
              <div className="cart-bill-row"><span>Phí giao Hàng</span><span>{shipping.toLocaleString()} VND</span></div>
              <div className="cart-bill-row cart-bill-total"><span>Thành tiền</span><span style={{color:'#ff9800', fontWeight:'bold', fontSize:22}}>{grandTotal.toLocaleString()} VND</span></div>
              <button className="cart-checkout">Thanh toán</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Buy; 