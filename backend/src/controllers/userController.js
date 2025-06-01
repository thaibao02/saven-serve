import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// Register new user
export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin đăng ký' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email hoặc tên đăng nhập đã tồn tại' 
      });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Đăng ký thành công',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi đăng ký', 
      error: error.message 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' 
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Tên đăng nhập hoặc mật khẩu không đúng' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi đăng nhập', 
      error: error.message 
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        // User ID is attached to the request by the auth middleware
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin hồ sơ', 
            error: error.message 
        });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email,name, password, phone, address } = req.body; // Add phone and address

        console.log('Update Profile Request Body:', req.body);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Update user data
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (name) user.name = name; // Update name if provided
        // Update phone and address if provided
        if (phone !== undefined) user.phone = phone; // Use !== undefined to allow empty string
        if (address !== undefined) user.address = address; // Use !== undefined to allow empty string

        await user.save();

        // Exclude password from the response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json(userResponse);

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật thông tin hồ sơ', 
            error: error.message 
        });
    }
}; 