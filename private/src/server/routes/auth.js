import express from 'express';
import axios from 'axios';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = await axios.post(`${process.env.API_BASE_URL}/auth/login`, {
      email,
      password
    });

    res.json(response.data);
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).json({ 
      message: error.response?.data?.message || 'Authentication failed'
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = await authService.register({ email, password });
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

export default router; 