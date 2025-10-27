const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const USER_SECRET = process.env.USER_SECRET_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;


const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPass });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, USER_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'User created successfully',
      user: { id: newUser._id, email: newUser.email, name: newUser.name },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password does not match' });

    const isAdmin = user.isAdmin === true;

    const token = jwt.sign(
      { userId: user._id, email: user.email, isAdmin },
      isAdmin ? ADMIN_SECRET : USER_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie(isAdmin ? 'adminToken' : 'token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: `Login ${isAdmin ? 'Admin' : 'User'} Successful`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('adminToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };
