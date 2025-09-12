const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../middleware/auth');

const router = express.Router();

// Mock database for demonstration
// In a real application, this would be replaced with actual database queries
const users = [
  { id: 1, email: 'admin@acme.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'admin', tenantId: 1 }, // password: password
  { id: 2, email: 'user@acme.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'member', tenantId: 1 }, // password: password
  { id: 3, email: 'admin@globex.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'admin', tenantId: 2 }, // password: password
  { id: 4, email: 'user@globex.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'member', tenantId: 2 } // password: password
];

const tenants = [
  { id: 1, name: 'Acme', slug: 'acme', plan: 'free' },
  { id: 2, name: 'Globex', slug: 'globex', plan: 'free' }
];

// Mock function to find tenant by ID
const findTenantById = (id) => {
  return tenants.find(tenant => tenant.id === id);
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Get tenant info
    const tenant = findTenantById(user.tenantId);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    
    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;