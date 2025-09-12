import React, { useState, useEffect } from 'react';
import './App.css';

// Use VITE_API_URL environment variable or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      fetchNotes(savedToken);
    }
  }, []);

  // Fetch notes from the API
  const fetchNotes = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (err) {
      setError('Failed to fetch notes');
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        fetchNotes(data.token);
        setSuccess('Login successful!');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setNotes([]);
    setTitle('');
    setContent('');
    setError('');
    setSuccess('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Handle note creation
  const handleCreateNote = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotes([...notes, data]);
        setTitle('');
        setContent('');
        setError('');
        setSuccess('Note created successfully!');
      } else {
        setError(data.message || 'Failed to create note');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Handle note deletion
  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
        setSuccess('Note deleted successfully!');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete note');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // Handle tenant upgrade (for admin users)
  const handleUpgrade = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/tenants/${user.tenant.slug}/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update user tenant plan
        const updatedUser = { ...user, tenant: data.tenant };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Tenant upgraded to Pro successfully!');
        // Refresh notes to reflect new plan
        fetchNotes(token);
      } else {
        setError(data.message || 'Failed to upgrade tenant');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  // If user is not logged in, show login form
  if (!user) {
    return (
      <div className="app">
        <div className="login-container">
          <div className="login-header">
            <h1>Yardstick Notes</h1>
            <p className="subtitle">Professional Note Management for Teams</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="test-accounts">
            <h3>Test Accounts</h3>
            <div className="accounts-grid">
              <div className="account-card">
                <h4>Acme Tenant</h4>
                <p><strong>Admin:</strong> admin@acme.test</p>
                <p><strong>Member:</strong> user@acme.test</p>
              </div>
              <div className="account-card">
                <h4>Globex Tenant</h4>
                <p><strong>Admin:</strong> admin@globex.test</p>
                <p><strong>Member:</strong> user@globex.test</p>
              </div>
            </div>
            <p className="password-info">Password for all accounts: <strong>password</strong></p>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, show notes interface
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Yardstick Notes</h1>
          <div className="user-info">
            <div className="user-details">
              <span className="user-email">{user.email}</span>
              <span className="user-role">{user.role} • {user.tenant.name}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="dashboard-header">
          <h2>My Notes</h2>
          <div className="subscription-info">
            <span className={`plan-badge ${user.tenant.plan}`}>
              {user.tenant.plan.toUpperCase()} PLAN
            </span>
            {user.tenant.plan === 'free' && (
              <span className="note-count">
                {notes.length}/3 notes
              </span>
            )}
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {user.tenant.plan === 'free' && notes.length >= 3 && (
          <div className="upgrade-banner">
            <div className="upgrade-content">
              <h3>Upgrade to Pro</h3>
              <p>You've reached the free plan limit of 3 notes. Upgrade to Pro for unlimited notes.</p>
              {user.role === 'admin' ? (
                <button onClick={handleUpgrade} className="upgrade-button">
                  Upgrade Now - $9.99/month
                </button>
              ) : (
                <p className="contact-admin">Contact your admin to upgrade to Pro</p>
              )}
            </div>
          </div>
        )}
        
        <div className="notes-section">
          <div className="notes-form">
            <h3>Create New Note</h3>
            <form onSubmit={handleCreateNote} className="note-form">
              <div className="form-group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Note title"
                  className="title-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Write your note here..."
                  className="content-textarea"
                />
              </div>
              <button type="submit" className="create-button">
                Create Note
              </button>
            </form>
          </div>
          
          <div className="notes-list">
            <h3>Your Notes ({notes.length})</h3>
            {notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h4>No notes yet</h4>
                <p>Create your first note using the form above</p>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map(note => (
                  <div key={note.id} className="note-card">
                    <div className="note-header">
                      <h4 className="note-title">{note.title}</h4>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteNote(note.id)}
                        aria-label="Delete note"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="note-content">
                      <p>{note.content}</p>
                    </div>
                    <div className="note-footer">
                      <small className="note-date">
                        {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;