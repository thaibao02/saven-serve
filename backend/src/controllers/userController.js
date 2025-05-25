import User from '../models/user.js';

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Please provide username, password, and email' });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}; 