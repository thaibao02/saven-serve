import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate if needed for authentication checks
import './OrderManagement.css'; // Import the CSS file

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Define valid statuses

    // Define fetchOrders outside useEffect
    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token is found (assuming authentication is required)
            navigate('/login-page'); // Adjust path as needed
            return;
        }

        try {
            const response = await fetch('/api/orders/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle errors, e.g., token expired or permission denied
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login-page'); // Redirect to login on auth failure
                }
                throw new Error(`Error fetching orders: ${response.statusText}`);
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Add fetchOrders to useEffect dependency array

    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem('token');
        if (!token) {
             navigate('/login-page');
             return;
        }

        // Optimistically update the UI
        setOrders(orders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        ));

        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                // If update fails, revert the UI state (optional but good practice)
                // You might need to refetch the specific order or all orders
                 fetchOrders(); // Refetch all orders on failure
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status');
            }

            // If successful, the optimistic update is sufficient
            console.log(`Order ${orderId} status updated to ${newStatus}`);

        } catch (err) {
            console.error('Error updating order status:', err);
            setError(err.message); // Set error state to display message
            // Revert state if there's an error or handle it visually
             fetchOrders(); // Refetch orders to show correct state after error
        }
    };

    if (loading) {
        return <div>Đang tải danh sách đơn hàng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="order-management-container">
            <h2>Quản lý đơn hàng</h2>

            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Đơn hàng ID</th> {/* Added Order ID for clarity */}
                            <th>Tên người đặt</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá tiền</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            // Map through items for each order
                            order.items.map((item, itemIndex) => (
                                <tr key={order._id + '-' + itemIndex}>
                                    {/* Display order details only for the first item of the order */}
                                    {itemIndex === 0 && (
                                        <>
                                            <td rowSpan={order.items.length}>{order._id}</td> {/* Use rowSpan */}
                                            <td rowSpan={order.items.length}>{order.user?.name || 'N/A'}</td>
                                            <td rowSpan={order.items.length}>{order.user?.phoneNumber || 'N/A'}</td>
                                            <td rowSpan={order.items.length}>{order.user?.address || 'N/A'}</td>
                                        </>
                                    )}
                                    <td>{item.product?.name || 'Sản phẩm không tồn tại'}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price?.toLocaleString('vi-VN') || 'N/A'} VNĐ</td>
                                    {/* Display total amount only for the first item of the order */}
                                     {itemIndex === 0 && (
                                        <td rowSpan={order.items.length}>{order.totalAmount?.toLocaleString('vi-VN') || 'N/A'} VNĐ</td>
                                     )}
                                    {/* Display status only for the first item of the order */}
                                     {itemIndex === 0 && (
                                        <td rowSpan={order.items.length}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            >
                                                {validStatuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                     )}
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderManagement;
