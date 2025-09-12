const jwt = require('jsonwebtoken');

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

// Mock data for notes
let notes = [
  { id: '1', title: 'Welcome to Acme Notes', content: 'This is a sample note for Acme tenant', tenantId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Team Meeting', content: 'Remember the team meeting at 2 PM', tenantId: 1, userId: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Project Update', content: 'Project is 75% complete', tenantId: 2, userId: 3, createdAt: new Date(), updatedAt: new Date() }
];

// Mock function to find user by email
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Mock function to find tenant by ID
const findTenantById = (id) => {
  return tenants.find(tenant => tenant.id === id);
};

// Mock function to find tenant by slug
const findTenantBySlug = (slug) => {
  return tenants.find(tenant => tenant.slug === slug);
};

// Mock function to count notes for a tenant
const countNotesByTenantId = (tenantId) => {
  return notes.filter(note => note.tenantId === tenantId).length;
};

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

// Function to update the notes array
const updateNotes = (newNotes) => {
  notes = newNotes;
};

module.exports = {
  authenticate,
  authorizeAdmin,
  checkNoteLimit,
  findUserByEmail,
  findTenantById,
  findTenantBySlug,
  countNotesByTenantId,
  notes,
  updateNotes // Export function to update notes
};