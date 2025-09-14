#!/usr/bin/env node

/**
 * Simple test script to verify the Yardstick Notes API endpoints
 * Run this after starting the server to test basic functionality
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

async function testEndpoint(method, url, data = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(BASE_URL + url, options);
    const result = await response.json();
    
    console.log(`${method} ${url}: ${response.status} ${response.statusText}`);
    if (!response.ok) {
      console.log('Error:', result);
    }
    return { success: response.ok, data: result, status: response.status };
  } catch (error) {
    console.log(`${method} ${url}: FAILED - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Yardstick Notes API Endpoints');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('=' .repeat(50));
  
  // Test health endpoint
  console.log('\n1. Testing Health Endpoint');
  const health = await testEndpoint('GET', '/health');
  
  // Test auth endpoints with predefined accounts
  console.log('\n2. Testing Authentication');
  const testAccounts = [
    { email: 'admin@acme.test', password: 'password', tenant: 'Acme' },
    { email: 'user@acme.test', password: 'password', tenant: 'Acme' },
    { email: 'admin@globex.test', password: 'password', tenant: 'Globex' },
    { email: 'user@globex.test', password: 'password', tenant: 'Globex' }
  ];
  
  const tokens = {};
  for (const account of testAccounts) {
    const login = await testEndpoint('POST', '/api/auth/login', {
      email: account.email,
      password: account.password
    });
    
    if (login.success) {
      tokens[account.email] = login.data.token;
      console.log(`✅ ${account.email} (${account.tenant}) logged in successfully`);
    } else {
      console.log(`❌ ${account.email} login failed`);
    }
  }
  
  // Test notes endpoints
  if (tokens['user@acme.test']) {
    console.log('\n3. Testing Notes Endpoints (Acme User)');
    const token = tokens['user@acme.test'];
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    
    // Get notes
    await testEndpoint('GET', '/api/notes', null, authHeaders);
    
    // Create a note
    const createNote = await testEndpoint('POST', '/api/notes', {
      title: 'Test Note',
      content: 'This is a test note created by automated test'
    }, authHeaders);
    
    if (createNote.success) {
      const noteId = createNote.data.id;
      console.log(`✅ Note created with ID: ${noteId}`);
      
      // Get specific note
      await testEndpoint('GET', `/api/notes/${noteId}`, null, authHeaders);
      
      // Update note
      await testEndpoint('PUT', `/api/notes/${noteId}`, {
        title: 'Updated Test Note',
        content: 'This note has been updated'
      }, authHeaders);
      
      // Delete note
      await testEndpoint('DELETE', `/api/notes/${noteId}`, null, authHeaders);
    }
  }
  
  // Test tenant upgrade (admin only)
  if (tokens['admin@acme.test']) {
    console.log('\n4. Testing Tenant Upgrade (Acme Admin)');
    const token = tokens['admin@acme.test'];
    const authHeaders = { 'Authorization': `Bearer ${token}` };
    
    await testEndpoint('POST', '/api/tenants/acme/upgrade', {}, authHeaders);
  }
  
  // Test tenant isolation
  if (tokens['user@acme.test'] && tokens['user@globex.test']) {
    console.log('\n5. Testing Tenant Isolation');
    console.log('Both users should only see their own tenant\'s notes');
    
    const acmeHeaders = { 'Authorization': `Bearer ${tokens['user@acme.test']}` };
    const globexHeaders = { 'Authorization': `Bearer ${tokens['user@globex.test']}` };
    
    const acmeNotes = await testEndpoint('GET', '/api/notes', null, acmeHeaders);
    const globexNotes = await testEndpoint('GET', '/api/notes', null, globexHeaders);
    
    if (acmeNotes.success && globexNotes.success) {
      console.log(`✅ Acme user sees ${acmeNotes.data.length} notes`);
      console.log(`✅ Globex user sees ${globexNotes.data.length} notes`);
    }
  }
  
  console.log('\n🎉 Test completed!');
}

// Only run if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };
