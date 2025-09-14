const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  findTenantById,
  findTenantBySlug,
  countNotesByTenantId,
  getNotes,
  updateNotes
} = require('../data');

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const user = findUserByEmail(decoded.email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
    
    req.tenant = findTenantById(user.tenantId);
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorization middleware for admin-only routes
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Check note limit middleware
const checkNoteLimit = (req, res, next) => {
  const noteCount = countNotesByTenantId(req.user.tenantId);
  
  if (req.tenant.plan === 'free' && noteCount >= 3) {
    return res.status(403).json({ 
      message: 'Free plan limit reached. Upgrade to Pro for unlimited notes.',
      upgradeUrl: `/tenants/${req.tenant.slug}/upgrade`
    });
  }
  
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  checkNoteLimit
};