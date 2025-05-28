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