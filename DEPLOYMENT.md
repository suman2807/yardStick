# Deployment Checklist for Yardstick Notes

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All files have correct syntax (run `npm run test`)
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured
- [ ] CORS configured to allow all origins
- [ ] All required endpoints implemented

### ✅ Backend Requirements
- [ ] Health endpoint: `GET /health`
- [ ] Authentication: `POST /api/auth/login`
- [ ] Notes CRUD: `GET/POST/PUT/DELETE /api/notes`
- [ ] Tenant upgrade: `POST /api/tenants/:slug/upgrade`
- [ ] JWT authentication middleware
- [ ] Role-based authorization
- [ ] Tenant isolation middleware
- [ ] Subscription limit enforcement

### ✅ Frontend Requirements
- [ ] Login form with test account information
- [ ] Notes list and creation interface
- [ ] Upgrade to Pro button for admins
- [ ] Subscription limit warnings
- [ ] Responsive design
- [ ] Error handling and success messages

### ✅ Test Accounts (Password: "password")
- [ ] admin@acme.test (Admin, Acme tenant)
- [ ] user@acme.test (Member, Acme tenant)
- [ ] admin@globex.test (Admin, Globex tenant)
- [ ] user@globex.test (Member, Globex tenant)

## Vercel Deployment Steps

### Backend Deployment
1. **Create New Vercel Project**
   ```bash
   vercel
   ```

2. **Configure Environment Variables in Vercel Dashboard**
   - `JWT_SECRET`: Generate a secure random string
   - `NODE_ENV`: production

3. **Verify Deployment**
   - Test health endpoint: `https://your-backend.vercel.app/health`
   - Test login with test accounts
   - Verify CORS headers are present

### Frontend Deployment
1. **Update Environment Variables**
   ```bash
   # In frontend/.env
   VITE_API_URL=https://your-backend.vercel.app
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Vercel Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Post-Deployment Testing

### Automated Tests
1. Run the test script:
   ```bash
   node test-api.js
   ```

2. Verify all endpoints return expected responses

### Manual Testing
1. **Access Frontend**
   - Open deployed frontend URL
   - Verify test accounts are displayed
   - Test login with each account

2. **Test Multi-tenancy**
   - Login as user@acme.test
   - Create notes, verify they appear
   - Logout and login as user@globex.test
   - Verify Globex user cannot see Acme notes

3. **Test Subscription Limits**
   - Create 3 notes on free plan
   - Verify 4th note creation is blocked
   - Test admin upgrade functionality

4. **Test CRUD Operations**
   - Create notes with title and content
   - Edit existing notes
   - Delete notes
   - Verify tenant isolation

### Validation Points
- [ ] Health endpoint returns `{ "status": "ok" }`
- [ ] All 4 test accounts can login successfully
- [ ] Notes are properly isolated by tenant
- [ ] Members cannot access admin-only endpoints
- [ ] Free plan enforces 3-note limit
- [ ] Pro upgrade removes note limit
- [ ] CRUD operations work correctly
- [ ] Frontend is accessible and functional

## Production URLs
After deployment, update these URLs:

- **Backend API**: https://your-backend.vercel.app
- **Frontend App**: https://your-frontend.vercel.app
- **Health Check**: https://your-backend.vercel.app/health

## Security Notes
- JWT secret should be randomly generated for production
- All passwords in test accounts are "password" - suitable for demo only
- CORS is configured to allow all origins for API accessibility
- No sensitive data is stored in the codebase

## Support
If automated tests fail, check:
1. Environment variables are correctly set
2. CORS headers are present in responses
3. All required endpoints are accessible
4. JWT tokens are properly generated and validated
