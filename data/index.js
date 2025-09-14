// Shared data for the application
// In a real application, this would be replaced with actual database operations

// Mock database for users
const users = [
  { id: 1, email: 'admin@acme.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'admin', tenantId: 1 },
  { id: 2, email: 'user@acme.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'member', tenantId: 1 },
  { id: 3, email: 'admin@globex.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'admin', tenantId: 2 },
  { id: 4, email: 'user@globex.test', password: '$2a$10$l2QvebvRFcfHUxCUCuCqwuh040QGS.G/ikUtE6/c.761mIqlo1iFa', role: 'member', tenantId: 2 }
];

// Mock database for tenants
const tenants = [
  { id: 1, name: 'Acme', slug: 'acme', plan: 'free' },
  { id: 2, name: 'Globex', slug: 'globex', plan: 'free' }
];

// Mock database for notes
let notes = [
  { id: '1', title: 'Welcome to Acme Notes', content: 'This is a sample note for Acme tenant', tenantId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Team Meeting', content: 'Remember the team meeting at 2 PM', tenantId: 1, userId: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'Project Update', content: 'Project is 75% complete', tenantId: 2, userId: 3, createdAt: new Date(), updatedAt: new Date() }
];

// Helper functions
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findTenantById = (id) => {
  return tenants.find(tenant => tenant.id === id);
};

const findTenantBySlug = (slug) => {
  return tenants.find(tenant => tenant.slug === slug);
};

const countNotesByTenantId = (tenantId) => {
  return notes.filter(note => note.tenantId === tenantId).length;
};

const getNotes = () => {
  return notes;
};

const updateNotes = (newNotes) => {
  notes = newNotes;
};

const updateTenantPlan = (tenantId, plan) => {
  const tenant = tenants.find(t => t.id === tenantId);
  if (tenant) {
    tenant.plan = plan;
    return tenant;
  }
  return null;
};

module.exports = {
  users,
  tenants,
  findUserByEmail,
  findTenantById,
  findTenantBySlug,
  countNotesByTenantId,
  getNotes,
  updateNotes,
  updateTenantPlan
};
