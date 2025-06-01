import React, { useState, useEffect } from 'react';
import cocacola from '../../Assets/cocacola.png';

import { FaHeart, FaFire, FaShoppingCart, FaSearch } from 'react-icons/fa';

const categories = [
   'Hàng Mới', 'Trái Cây', 'Rau xanh', 'Đồ uống', 'Gia vị', 'Sữa', 'Thịt', 'Cá'
];

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hàng Mới');

  useEffect(() => {
    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User not authenticated. Cannot fetch products.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products
    .filter(product => 
      selectedCategory === 'Hàng Mới' || product.type === selectedCategory
    )
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddToCart = (product) => {
    setCart(prev => {
      const found = prev.find(item => item.product._id === product._id);
      if (found) {
        return prev.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleChangeQty = (product, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product._id === product._id) {
        const currentQty = item.quantity;
        const stockQty = product.stockQuantity;

        if (delta === 1) {
          const newQty = currentQty + 1;
          return { ...item, quantity: newQty <= stockQty ? newQty : currentQty };
        } else if (delta === -1) {
          return { ...item, quantity: Math.max(1, currentQty + delta) };
        }
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const shipping = cart.length > 0 ? 15000 : 0;
  const grandTotal = total + shipping;

  const handleLikeClick = (productId) => {
      console.log('Like/Unlike product with ID:', productId);
      setLikeCount(prevCount => prevCount + 1);
  };

  return (
    <div className="buy-container">
      <div className="buy-sidebar">
        {categories.map((cat, idx) => (
          <div 
            className={`buy-sidebar-item${
              selectedCategory === cat ? ' active' : ''
            }`}
            key={idx}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat} <span>&gt;</span>
          </div>
        ))}
      </div>
      <div className="buy-main">
        <div className="buy-header">
          
          <div className="buy-search">
            <input 
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={handleSearchInputChange}
            />
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
            <span className="buy-user"></span>
          </div>
        </div>

        {loading ? (
            <div>Đang tải sản phẩm...</div>
        ) : error ? (
            <div>Lỗi khi tải sản phẩm: {error}</div>
        ) : (
            <div className="buy-products">
              {filteredProducts.map((p) => (
                <div className="buy-product-card" key={p._id}>
                  {p.badge && <div className="buy-product-badge">{p.badge}</div>}
                  <div className="buy-product-like" onClick={() => handleLikeClick(p._id)}><FaHeart color={p.liked ? '#7bc043' : '#bbb'} /></div>
                  <img src={`/${p.images && p.images.length > 0 ? p.images[0] : cocacola}`} alt={p.name} className="buy-product-img" />
                  <div className="buy-product-pack">{p.name}</div>
                  <div className="buy-product-progress">
                    <div className="buy-product-progress-bar"></div>
                    
                  </div>
                  <div className="buy-product-name">{p.description}</div>
                  <div className="buy-product-rating">★ ★ ★ ★ ★</div>
                  <div className="buy-product-price"><span>{parseFloat(p.price).toLocaleString()} VND</span>{p.weight || ''}</div>
                  
                  <div className="buy-product-bottom">
                    {p.oldPrice && <span className="buy-product-old">{parseFloat(p.oldPrice).toLocaleString()} VND</span>}
                    <button className="buy-product-cart" onClick={() => handleAddToCart(p)}><FaShoppingCart style={{marginRight: 6}} /> Thêm vào giỏ hàng</button>
                  </div>
                  {p.exp && <div className="buy-product-exp">{p.exp}</div>}
                  <div className="buy-product-stock">Còn hàng: {p.stockQuantity}</div>
                </div>
              ))}
            </div>
        )}

      </div>
      {showCart && (
        <>
          <div className="cart-modal-overlay" onClick={() => setShowCart(false)}></div>
          <div className="cart-modal">
            <button className="cart-modal-close" onClick={() => setShowCart(false)}>×</button>
            <div className="cart-title">Hóa đơn</div>
            <div className="cart-list">
              {cart.map((item) => (
                <div className="cart-item" key={item.product._id}> 
                  <img src={`/${item.product.images && item.product.images.length > 0 ? item.product.images[0] : cocacola}`} alt={item.product.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-more">Thêm »</div>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleChangeQty(item.product, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleChangeQty(item.product, 1)}>+</button>
                  </div>
                  <div className="cart-item-price">{parseFloat(item.product.price).toLocaleString()} VND</div>
                </div>
              ))}
            </div>
            <div className="cart-bill">
              <div className="cart-bill-row"><span>Đơn giá</span><span>{total.toLocaleString()} VND</span></div>
              <div className="cart-bill-row"><span>Phí giao Hàng</span><span>{shipping.toLocaleString()} VND</span></div>
              <div className="cart-bill-row cart-bill-total"><span>Thành tiền</span><span style={{color:'#ff9800', fontWeight:'bold', fontSize:22}}>{grandTotal.toLocaleString()} VND</span></div>
              <button className="cart-checkout">Đặt hàng</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Buy; 