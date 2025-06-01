import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login-page');
                return;
            }

            try {
                const response = await fetch('/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#ff9800';
            case 'Processing':
                return '#2196f3';
            case 'Completed':
                return '#4caf50';
            case 'Cancelled':
                return '#f44336';
            default:
                return '#757575';
        }
    };

    if (loading) {
        return <div className="orders-loading">Đang tải đơn hàng...</div>;
    }

    if (error) {
        return <div className="orders-error">Lỗi khi tải đơn hàng: {error}</div>;
    }

    return (
        <div className="orders-container">
            <h1 className="orders-title">Lịch sử đơn hàng</h1>
            
            {orders.length === 0 ? (
                <div className="orders-empty">
                    Bạn chưa có đơn hàng nào
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Mã đơn hàng: {order._id}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <div 
                                    className="order-status"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {order.status}
                                </div>
                            </div>

                            <div className="order-items">
                                {order.items.map((item) => (
                                    <div key={item._id} className="order-item">
                                        <img 
                                            src={`/${item.product.images[0]}`} 
                                            alt={item.product.name}
                                            className="order-item-image"
                                        />
                                        <div className="order-item-details">
                                            <h3>{item.product.name}</h3>
                                            <p>Số lượng: {item.quantity}</p>
                                            <p>Giá: {parseFloat(item.price).toLocaleString()} VND</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    Tổng tiền: <span>{parseFloat(order.totalAmount).toLocaleString()} VND</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders; 