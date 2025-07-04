const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { 
  authenticateAdmin, 
  refreshAccessToken,
  authenticateToken,
  requireAdmin 
} = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const logger = require('../config/logger');

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/login', [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], catchAsync(async (req, res) => {
  // Validation is handled by the authenticateAdmin middleware
  authenticateAdmin(req, res);
}));

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
], catchAsync(async (req, res) => {
  refreshAccessToken(req, res);
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, catchAsync(async (req, res) => {
  logger.info(`User ${req.user.userId} logged out`);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', authenticateToken, catchAsync(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.userId,
      role: req.user.role
    }
  });
}));

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get('/verify', authenticateToken, catchAsync(async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.userId,
      role: req.user.role
    }
  });
}));

/**
 * @route   GET /api/auth/admin/check
 * @desc    Check if user has admin privileges
 * @access  Private (Admin only)
 */
router.get('/admin/check', authenticateToken, requireAdmin, catchAsync(async (req, res) => {
  res.json({
    success: true,
    message: 'Admin access confirmed',
    user: {
      id: req.user.userId,
      role: req.user.role
    }
  });
}));

module.exports = router;