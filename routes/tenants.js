const express = require('express');
const { authenticate, authorizeAdmin, findTenantBySlug } = require('../middleware/auth');

const router = express.Router();

// Mock database for demonstration
// In a real application, this would be replaced with actual database queries
const tenants = [
  { id: 1, name: 'Acme', slug: 'acme', plan: 'free' },
  { id: 2, name: 'Globex', slug: 'globex', plan: 'free' }
];

// Upgrade tenant plan endpoint (admin only)
router.post('/:slug/upgrade', authenticate, authorizeAdmin, (req, res) => {
  try {
    const tenant = findTenantBySlug(req.params.slug);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Check if the user belongs to this tenant
    if (tenant.id !== req.user.tenantId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Upgrade the plan
    tenant.plan = 'pro';
    
    res.json({
      message: 'Tenant upgraded to Pro plan successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan
      }
    });
  } catch (error) {
    console.error('Error upgrading tenant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;