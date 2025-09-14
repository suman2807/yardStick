const express = require('express');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { findTenantBySlug, updateTenantPlan } = require('../data');

const router = express.Router();

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
    const updatedTenant = updateTenantPlan(tenant.id, 'pro');
    
    if (!updatedTenant) {
      return res.status(500).json({ message: 'Failed to upgrade tenant' });
    }
    
    res.json({
      message: 'Tenant upgraded to Pro plan successfully',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        slug: updatedTenant.slug,
        plan: updatedTenant.plan
      }
    });
  } catch (error) {
    console.error('Error upgrading tenant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;