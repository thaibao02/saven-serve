import React, { useState } from 'react';

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

    return (
        <div>
            <h2>Product Management</h2>
            {!showForm && (
                <button onClick={handleAddProductClick}>Add Product</button>
            )}

            {showForm && (
                <form onSubmit={handleSubmit}>
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
        </div>
    );
};

export default ProductManagement; 