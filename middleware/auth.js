const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_change_in_production';

/**
 * Generate JWT tokens for user authentication
 */
const generateTokens = (userId, role = 'user') => {
  const payload = { userId, role };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
  
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
  
  return { accessToken, refreshToken };
};

/**
 * Middleware to verify JWT access tokens
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn(`Token verification failed: ${err.message}`);
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.user = decoded;
    next();
  });
};

/**
 * Middleware to verify admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

/**
 * Verify and refresh JWT tokens
 */
const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      logger.warn(`Refresh token verification failed: ${err.message}`);
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const tokens = generateTokens(decoded.userId, decoded.role);
    res.json({
      success: true,
      ...tokens,
    });
  });
};

/**
 * Simple admin authentication for demo purposes
 * In production, this should be replaced with proper user management
 */
const authenticateAdmin = (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded admin check - replace with database lookup in production
  if (username === 'admin' && password === 'jbstire2024') {
    const tokens = generateTokens('admin_user', 'admin');
    
    logger.info('Admin login successful');
    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'admin_user',
        username: 'admin',
        role: 'admin',
      },
      ...tokens,
    });
  }

  logger.warn(`Failed admin login attempt for username: ${username}`);
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials',
  });
};

module.exports = {
  generateTokens,
  authenticateToken,
  requireAdmin,
  refreshAccessToken,
  authenticateAdmin,
};