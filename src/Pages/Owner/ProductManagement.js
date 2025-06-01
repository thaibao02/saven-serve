import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        type: '',
        images: null,
    });
    const [products, setProducts] = useState([]);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const productTypes = ["Trái Cây", "Rau xanh", "Đố uống", "Gia vị ", "Sữa", "Thịt", "Cá"];

    // Function to format number with commas
    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Function to remove commas and convert to number
    const removeCommas = (str) => {
        return str.replace(/,/g, '');
    };

    // Effect to hide submit message after a few seconds
    useEffect(() => {
        if (submitMessage) {
            const timer = setTimeout(() => {
                setSubmitMessage('');
                setIsError(false); // Also reset error state
            }, 2000); // Hide after 2 seconds

            // Cleanup function to clear the timer if the component unmounts
            // or if submitMessage changes before the timer finishes
            return () => clearTimeout(timer);
        }
    }, [submitMessage]); // Dependency array: run this effect when submitMessage changes

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'images') {
            setFormData({ ...formData, [name]: files });
        } else if (name === 'price' || name === 'stockQuantity') {
            // Remove commas and non-numeric characters
            const numericValue = value.replace(/[^0-9]/g, '');
            // Format with commas
            const formattedValue = formatNumber(numericValue);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddProductClick = () => {
        setIsEditing(false);
        setEditingProductId(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            type: '',
            images: null,
        });
        setShowForm(true);
    };

    const handleEditClick = (productId) => {
        const productToEdit = products.find(p => p._id === productId);
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                description: productToEdit.description,
                price: formatNumber(productToEdit.price.toString()),
                stockQuantity: formatNumber(productToEdit.stockQuantity.toString()),
                type: productToEdit.type,
                images: null,
            });
            setEditingProductId(productId);
            setIsEditing(true);
            setShowForm(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage('');
        setIsError(false);

        const token = localStorage.getItem('token');
        if (!token) {
            setSubmitMessage('Vui lòng đăng nhập để thêm/sửa sản phẩm.');
            setIsError(true);
            return;
        }

        // Validate form data
        if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity || !formData.type) {
            setSubmitMessage('Vui lòng điền đầy đủ thông tin sản phẩm.');
            setIsError(true);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('description', formData.description.trim());
        // Remove commas before sending to server
        data.append('price', removeCommas(formData.price));
        data.append('stockQuantity', removeCommas(formData.stockQuantity));
        data.append('type', formData.type);

        if (formData.images) {
            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i]);
            }
        }

        try {
            const url = isEditing 
                ? `/api/products/${editingProductId}`
                : '/api/products';
            
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage(result.message || (isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!'));
                setIsError(false);
                
                // Clear form and reset states
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stockQuantity: '',
                    type: '',
                    images: null,
                });
                setShowForm(false);
                setIsEditing(false);
                setEditingProductId(null);
                
                // Refresh the product list
                await fetchProducts();
            } else {
                setSubmitMessage(result.message || (isEditing ? 'Lỗi khi cập nhật sản phẩm.' : 'Lỗi khi thêm sản phẩm.'));
                setIsError(true);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            setSubmitMessage('Đã xảy ra lỗi mạng hoặc máy chủ.');
            setIsError(true);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditingProductId(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            type: '',
            images: null,
        });
    };

    // Function to fetch products
    const fetchProducts = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteClick = async (productId) => {
        console.log('Delete product with ID:', productId);
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để xóa sản phẩm.'); // Or use a more sophisticated message system
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) { // Confirmation dialog
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || 'Xóa sản phẩm thành công!'); // Success message
                    fetchProducts(); // Refresh the product list
                } else {
                    alert(result.message || 'Lỗi khi xóa sản phẩm.'); // Error message
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Đã xảy ra lỗi mạng hoặc máy chủ khi xóa sản phẩm.'); // Network/server error
            }
        }
    };

    return (
        <div className="product-management-container">
            <h2>Product Management</h2>
            {!showForm && (
                <button className="add-product-button" onClick={handleAddProductClick}>Add Product</button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="product-form">
                    <h3>{isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                    <div>
                        <label htmlFor="name">Tên sản phẩm:</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Mô tả:</label>
                        <textarea 
                            id="description" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="price">Giá:</label>
                        <input 
                            type="text" 
                            id="price" 
                            name="price" 
                            value={formData.price} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="Ví dụ: 1,000,000"
                        />
                    </div>
                    <div>
                        <label htmlFor="stockQuantity">Số lượng trong kho:</label>
                        <input 
                            type="text" 
                            id="stockQuantity" 
                            name="stockQuantity" 
                            value={formData.stockQuantity} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="Ví dụ: 1,000"
                        />
                    </div>
                    <div>
                        <label htmlFor="type">Loại sản phẩm:</label>
                        <select 
                            id="type" 
                            name="type" 
                            value={formData.type} 
                            onChange={handleInputChange} 
                            required
                        >
                            <option value="">Chọn loại</option>
                            {productTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="images">Hình ảnh:</label>
                        <input 
                            type="file" 
                            id="images" 
                            name="images" 
                            onChange={handleInputChange} 
                            multiple 
                            accept="image/*" 
                        />
                    </div>

                    <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}</button>
                    <button type="button" onClick={handleCancel}>Hủy</button>
                </form>
            )}

            {submitMessage && (
                <p className={isError ? 'error-message' : 'success-message'}>{submitMessage}</p>
            )}

            <h3>Danh sách sản phẩm</h3>
            {products.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <table className="product-list-table">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Mô tả</th>
                            <th>Loại</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Hình ảnh</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.type}</td>
                                <td>{product.price}</td>
                                <td>{product.stockQuantity}</td>
                                <td>
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={`${product.images[0]}`} 
                                            alt={product.name} 
                                            style={{ width: '50px', height: 'auto' }} 
                                        />
                                    ) : (
                                        'Không có ảnh'
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(product._id)}>Sửa</button>
                                    <button onClick={() => handleDeleteClick(product._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductManagement; 