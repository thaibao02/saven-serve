import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    try {
        // Assuming the authenticate middleware adds the user to the request
        const owner = req.user.userId; // Get owner ID from authenticated user

        // Get product data from the request body
        const { name, description, price, stockQuantity, type } = req.body;
        const images = req.files; // Get uploaded files from multer

        // Basic validation (can be expanded)
        if (!name || !description || !price || !stockQuantity || !type || !images || images.length === 0) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm và ít nhất một hình ảnh' });
        }

        // Create a new product instance
        const newProduct = new Product({
            owner,
            name,
            description,
            price,
            stockQuantity,
            type,
            images: images.map(file => file.path), // Save paths of uploaded files
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ message: 'Sản phẩm đã được thêm thành công', product: newProduct });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
}; 