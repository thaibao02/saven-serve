import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

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

// Get all products (for the buy page)
export const getProducts = async (req, res) => {
    try {
        // Fetch all products
        const products = await Product.find({}); // Find all products

        res.json(products); // Return the list of all products
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const owner = req.user.userId;
        const productId = req.params.id;
        const { name, description, price, stockQuantity, type } = req.body;
        const newImages = req.files;

        // Validate required fields
        if (!name || !description || !price || !stockQuantity || !type) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm' });
        }

        // Find the product
        const product = await Product.findOne({ _id: productId, owner });
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bạn không có quyền chỉnh sửa' });
        }

        // Update basic information
        product.name = name;
        product.description = description;
        product.price = parseFloat(price);
        product.stockQuantity = parseInt(stockQuantity);
        product.type = type;
        product.updatedAt = new Date();

        // Handle image updates if new images are provided
        if (newImages && newImages.length > 0) {
            // Delete old images
            if (product.images && product.images.length > 0) {
                for (const oldImage of product.images) {
                    const oldImagePath = path.join(process.cwd(), oldImage);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }
            
            // Save new image paths
            product.images = newImages.map(file => file.path);
        }

        // Save the updated product
        await product.save();

        res.json({ 
            message: 'Sản phẩm đã được cập nhật thành công', 
            product: product 
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật sản phẩm', 
            error: error.message 
        });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const owner = req.user.userId; // Get owner ID from authenticated user
        const productId = req.params.id; // Get product ID from URL parameters

        // Find the product by ID and owner, and delete it
        const product = await Product.findOneAndDelete({ _id: productId, owner }); // Find and delete by product ID and owner ID

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bạn không có quyền xóa' });
        }

        // Optionally, delete associated image files from the uploads directory here
       // product.images.forEach(imagePath => { /* delete file */ });

        res.json({ message: 'Sản phẩm đã được xóa thành công' });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
}; 