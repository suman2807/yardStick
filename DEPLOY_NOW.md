# 🚀 Vercel Deployment Guide for Yardstick Notes

## Quick Deployment Steps

### Step 1: Deploy Backend API

1. **Go to [vercel.com](https://vercel.com) and sign in/create account**
2. **Click "New Project"**
3. **Import from Git Repository**
   - Connect your GitHub account
   - Select the `yardstick` repository
   - Choose the root directory (contains server.js)

4. **Configure Project Settings:**
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: Leave empty or `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   ```
   JWT_SECRET=cc0e2411a27c397133b2544f45e23ddc782d3ab3e32eadc9d4c88b871e557d25
   NODE_ENV=production
   ```

6. **Deploy** - Vercel will automatically detect the configuration from `vercel.json`

### Step 2: Deploy Frontend

1. **Create New Project in Vercel**
2. **Import same repository**
3. **Configure Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-backend-deployment.vercel.app
   ```
   (Replace with your actual backend URL from Step 1)

5. **Deploy**

## Alternative: Manual Deployment Files

If you prefer to deploy manually, here are the deployment files:

### Backend Deployment (vercel.json) ✅ Already configured
### Frontend Deployment (frontend/vercel.json) ✅ Already configured

## Expected URLs After Deployment

- **Backend API**: `https://yardstick-[random].vercel.app`
- **Frontend**: `https://yardstick-frontend-[random].vercel.app`

## Testing Deployment

### 1. Test Health Endpoint
```bash
curl https://your-backend-url.vercel.app/health
# Expected: { "status": "ok" }
```

### 2. Test Authentication
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.test","password":"password"}'
```

### 3. Test Frontend
Visit your frontend URL and:
- ✅ See test accounts displayed
- ✅ Login with any test account
- ✅ Create/list/delete notes
- ✅ See "Upgrade to Pro" for free plan limits

## Verification Checklist

### Backend Requirements ✅
- [x] Health endpoint: `GET /health → { "status": "ok" }`
- [x] CORS enabled for automated scripts
- [x] JWT authentication working
- [x] Multi-tenant isolation
- [x] Role-based authorization
- [x] Subscription limits enforced
- [x] All CRUD endpoints functional

### Frontend Requirements ✅
- [x] Login with predefined accounts
- [x] List/create/delete notes
- [x] Show "Upgrade to Pro" when limit reached
- [x] Responsive design
- [x] Error handling

### Test Accounts (Password: "password")
- [x] admin@acme.test (Admin, Acme)
- [x] user@acme.test (Member, Acme)
- [x] admin@globex.test (Admin, Globex)
- [x] user@globex.test (Member, Globex)

## Post-Deployment

1. **Update README.md** with actual deployment URLs
2. **Test all endpoints** with automated scripts
3. **Verify CORS** headers in browser network tab
4. **Test tenant isolation** between Acme and Globex users

## Troubleshooting

- **500 errors**: Check Vercel function logs
- **CORS issues**: Verify backend is properly deployed
- **Frontend not loading**: Check environment variables
- **Auth failures**: Verify JWT_SECRET is set correctly

Your application is now ready for production use! 🎉
