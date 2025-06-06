import React, { useState, useEffect } from 'react';
import cocacola from '../../Assets/cocacola.png';

import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = [
   'Hàng Mới', 'Trái Cây', 'Rau xanh', 'Đố uống', 'Gia vị ', 'Sữa', 'Thịt', 'Cá'
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
  const [orderMessage, setOrderMessage] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      // Remove token check here so products are fetched even if not authenticated
      // if (!token) {
      //     console.log('User not authenticated. Cannot fetch products.');
      //     setLoading(false);
      //     return;
      // }

      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear previous errors

      try {
          const response = await fetch(' https://saven.tramsac.xyz/api/products', {
              headers: {
                  // Conditionally include Authorization header if token exists
                  // 'Authorization': token ? `Bearer ${token}` : '',
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` }), // Add header only if token exists
              },
          });

          if (!response.ok) {
              // Handle cases where backend might still require auth or return error
              // console.error('Failed to fetch products non-authenticated', response.status);
               // Depending on backend setup, non-auth might result in 401/403,
               // but our current /api/products is public GET.
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

  useEffect(() => {
    fetchProducts();
    // Check for saved cart in localStorage on mount
    const savedCart = localStorage.getItem('savedCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Basic validation: ensure it's an array and has product objects
        if (Array.isArray(parsedCart) && parsedCart.every(item => item.product && item.product._id)) {
          setCart(parsedCart);
          setShowCart(true); // Open the cart modal if a saved cart is loaded
          localStorage.removeItem('savedCart'); // Clear saved cart from localStorage
        } else {
          console.error('Invalid saved cart data found in localStorage.');
          localStorage.removeItem('savedCart'); // Clear invalid data
        }
      } catch (e) {
        console.error('Error parsing saved cart from localStorage:', e);
        localStorage.removeItem('savedCart'); // Clear problematic data
      }
    }
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
      console.log('Cart state changed:', cart);
  }, [cart]);

  useEffect(() => {
      if (orderMessage) {
          // Set a timer to clear the message
          const timer = setTimeout(() => {
              setOrderMessage('');
              // If the message was the "please login" message, navigate after clearing
              if (orderMessage === 'Vui lòng đăng nhập để đặt hàng.') {
                  navigate('/login-page');
              }
          }, 3000); // Message visible for 3 seconds

          return () => clearTimeout(timer);
      }
  }, [orderMessage, navigate]); // Depend on orderMessage and navigate

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products
    .filter(product => 
      // Filter by stock quantity > 0
      product.stockQuantity > 0
    )
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
          return { ...item, quantity: (stockQty === undefined || newQty <= stockQty) ? newQty : currentQty };
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

  const handlePlaceOrder = async () => {
      console.log('Current cart state when placing order:', cart);
      const token = localStorage.getItem('token');
      if (!token) {
          // User is not authenticated, show message
          setOrderMessage('Vui lòng đăng nhập để đặt hàng.');
          // Save current cart state to localStorage
          localStorage.setItem('savedCart', JSON.stringify(cart));
          return;
      }

      if (cart.length === 0) {
          setOrderMessage('Giỏ hàng trống. Vui lòng thêm sản phẩm để đặt hàng.');
          return;
      }

      try {
          // First check user profile information
          const profileResponse = await fetch(' https://saven.tramsac.xyz/api/profile', {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });

          if (!profileResponse.ok) {
              throw new Error('Failed to fetch profile information');
          }

          const userData = await profileResponse.json();
          
          // Check if required fields are filled
          if (!userData.name || !userData.phone || !userData.address) {
              setOrderMessage('Vui lòng cập nhật đầy đủ thông tin cá nhân (Họ tên, Số điện thoại, Địa chỉ) trước khi đặt hàng.');
              // Save cart state before redirecting
              localStorage.setItem('savedCart', JSON.stringify(cart));
              // Navigate to profile page after a short delay
              setTimeout(() => {
                  navigate('/profile');
              }, 2000);
              return;
          }

          const orderItems = cart.map(item => ({
              product: item.product ? item.product._id : null, 
              quantity: item.quantity,
              price: parseFloat(item.product.price) 
          }));

          const hasInvalidItem = orderItems.some(item => item.product === null);
          if (hasInvalidItem) {
              setOrderMessage('Thông tin sản phẩm trong giỏ hàng không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.');
              console.error('Invalid product ID found in cart:', cart);
              return;
          }

          console.log('Sending order items to backend:', orderItems);
          orderItems.forEach((item, index) => {
              console.log(`Item ${index}:`, item);
          });

          const response = await fetch(' https://saven.tramsac.xyz/api/orders', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ items: orderItems, totalAmount: grandTotal }),
          });

          const result = await response.json();

          if (response.ok) {
              setOrderMessage(result.message || 'Đặt hàng thành công!');
              setCart([]);
              setShowCart(false);
              
              fetchProducts();

              setTimeout(() => {
                  navigate('/orders');
              }, 2000);
          } else {
              setOrderMessage(result.message || 'Lỗi khi đặt hàng.');
          }
      } catch (error) {
          console.error('Error placing order:', error);
          setOrderMessage('Đã xảy ra lỗi mạng hoặc máy chủ khi đặt hàng.');
      }
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
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
                  <img src={` https://saven.tramsac.xyz/${p.images && p.images.length > 0 ? p.images[0] : cocacola}`} alt={p.name} className="buy-product-img" />
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
                  <div className="buy-product-stock">Số lượng: {p.stockQuantity}</div>
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
                  <button style={{backgroundColor: 'red', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 20}} className="cart-item-remove" onClick={() => handleRemoveItem(item.product._id)}>×</button>
                </div>
              ))}
            </div>
            <div className="cart-bill">
              <div className="cart-bill-row"><span>Đơn giá</span><span>{total.toLocaleString()} VND</span></div>
              <div className="cart-bill-row"><span>Phí giao Hàng</span><span>{shipping.toLocaleString()} VND</span></div>
              <div className="cart-bill-row cart-bill-total"><span>Thành tiền</span><span style={{color:'#ff9800', fontWeight:'bold', fontSize:22}}>{grandTotal.toLocaleString()} VND</span></div>
              <button className="cart-checkout" onClick={handlePlaceOrder}>Đặt hàng</button>
            </div>
          </div>
        </>
      )}
       {orderMessage && (
           <div className="order-message-overlay">
               <div className="order-message-modal">
                   <p>{orderMessage}</p>
               </div>
           </div>
       )}
    </div>
  );
}

export default Buy; 