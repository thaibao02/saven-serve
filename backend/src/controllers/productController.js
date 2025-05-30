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

// Get all products for the authenticated owner
export const getProducts = async (req, res) => {
    try {
        const owner = req.user.userId; // Get owner ID from authenticated user
        const products = await Product.find({ owner }); // Find products by owner ID
        res.json(products); // Return the list of products
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        const owner = req.user.userId; // Get owner ID from authenticated user
        const productId = req.params.id; // Get product ID from URL parameters
        const updateData = req.body; // Get update data from request body
       // Note: Handling file uploads for updates would require more complex logic here
       // For simplicity, this update assumes no file uploads are part of this specific update endpoint

        // Find the product by ID and owner, and update it
        const product = await Product.findOneAndUpdate(
            { _id: productId, owner }, // Find by product ID and owner ID
            updateData,
            { new: true, runValidators: true } // Return updated doc and run validators
        );

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc bạn không có quyền chỉnh sửa' });
        }

        res.json({ message: 'Sản phẩm đã được cập nhật thành công', product });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
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