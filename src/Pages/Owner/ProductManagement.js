import React, { useState, useEffect } from 'react';
import './ProductManagement.css';

const ProductManagement = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        type: '', // Default type value
        images: null, // Will store selected files (FileList or Array)
    });
    const [products, setProducts] = useState([]); // State to store the list of products
    const [submitMessage, setSubmitMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const productTypes = ["Trái Cây", "Rau xanh", "Đố uống", "Gia vị ", "Sữa", "Thịt", "Cá"];

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setFormData({ ...formData, [name]: files }); // Store FileList for images
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddProductClick = () => {
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting product data:', formData);

        // TODO: Implement backend API call to add product

        setSubmitMessage(''); // Clear previous messages
        setIsError(false);

        const token = localStorage.getItem('token');
        if (!token) {
            setSubmitMessage('Vui lòng đăng nhập để thêm sản phẩm.');
            setIsError(true);
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('stockQuantity', formData.stockQuantity);
        data.append('type', formData.type);

        // Append image files
        if (formData.images) {
            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i]);
            }
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Do NOT set Content-Type header for FormData
                },
                body: data,
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitMessage(result.message || 'Thêm sản phẩm thành công!');
                setIsError(false);
                // Clear form
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stockQuantity: '',
                    type: '',
                    images: null,
                });
                setShowForm(false); // Optionally hide form on success
            } else {
                setSubmitMessage(result.message || 'Lỗi khi thêm sản phẩm.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            setSubmitMessage('Đã xảy ra lỗi mạng hoặc máy chủ.');
            setIsError(true);
        }
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
            setProducts(data); // Assuming the backend returns an array of products
        } catch (error) {
            console.error('Error fetching products:', error);
            // Optionally display an error message to the user
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []); // Empty dependency array means this runs once on mount

    // Placeholder for Edit and Delete handlers
    const handleEditClick = (productId) => {
        console.log('Edit product with ID:', productId);
        // TODO: Implement edit logic (e.g., show form pre-filled with product data)
    };

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
                    <h3>Thêm sản phẩm mới</h3>
                    <div>
                        <label htmlFor="name">Tên sản phẩm:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <label htmlFor="description">Mô tả:</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price">Giá:</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                    </div>
                    <div>
                        <label htmlFor="stockQuantity">Số lượng trong kho:</label>
                        <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} required min="0" />
                    </div>
                    <div>
                        <label htmlFor="type">Loại sản phẩm:</label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                            <option value="">Chọn loại</option>
                            {productTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="images">Hình ảnh:</label>
                        <input type="file" id="images" name="images" onChange={handleInputChange} multiple accept="image/*" />
                    </div>

                    <button type="submit">Thêm sản phẩm</button>
                    <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                </form>
            )}
            {submitMessage && (
                <p className={isError ? 'error-message' : 'success-message'}>{submitMessage}</p>
            )}

            <h3>List Products</h3>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table className="product-list-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Image</th>
                            <th>Actions</th>
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
                                        <img src={`/${product.images[0]}`} alt={product.name} style={{ width: '50px', height: 'auto' }} />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleEditClick(product._id)}>Edit</button>
                                    <button onClick={() => handleDeleteClick(product._id)}>Delete</button>
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