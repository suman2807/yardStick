# Yardstick Notes - Multi-Tenant SaaS Application

A professional multi-tenant SaaS Notes Application built with Node.js/Express backend and React frontend, deployed on Vercel.

## 🏗️ Multi-Tenancy Architecture

**Chosen Approach: Shared Schema with Tenant ID Column**

This application implements multi-tenancy using a shared schema approach where:
- All data is stored in shared data structures
- Each record contains a `tenantId` field for tenant isolation
- Database queries are filtered by `tenantId` to ensure strict data separation
- This approach provides good balance between simplicity and tenant isolation

### Why This Approach?
- **Cost-effective**: Single database/schema reduces infrastructure costs
- **Maintenance**: Easier to maintain and update schema changes
- **Scalability**: Good performance for moderate number of tenants
- **Strict Isolation**: Middleware ensures no cross-tenant data access

## 🚀 Features

### Multi-Tenant Support
- **Two Tenants**: Acme Corporation and Globex Industries
- **Strict Isolation**: Complete data separation between tenants
- **Role-based Access**: Admin and Member roles with different permissions

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based login system
- **Role-based Authorization**: 
  - **Admin**: Can invite users, upgrade subscriptions, manage all notes
  - **Member**: Can create, view, edit, and delete own notes

### Subscription Management
- **Free Plan**: Limited to 3 notes maximum
- **Pro Plan**: Unlimited notes
- **Instant Upgrades**: Admins can upgrade tenant plans immediately
- **Real-time Limits**: Note creation blocked when limit reached

### Notes Management (CRUD)
- **Create Notes**: Add new notes with title and content
- **List Notes**: View all notes for current tenant
- **Update Notes**: Edit existing notes (owner/admin only)
- **Delete Notes**: Remove notes (owner/admin only)
- **Tenant Isolation**: Notes are strictly filtered by tenant

## 🧪 Test Accounts

All test accounts use the password: `password`

### Acme Corporation
- **Admin**: `admin@acme.test` - Can manage users and upgrade to Pro
- **Member**: `user@acme.test` - Can manage personal notes

### Globex Industries  
- **Admin**: `admin@globex.test` - Can manage users and upgrade to Pro
- **Member**: `user@globex.test` - Can manage personal notes

## 🔗 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Authentication
```
POST /api/auth/login
Body: { "email": "user@tenant.test", "password": "password" }
```

### Notes Management
```
POST /api/notes          - Create a note
GET /api/notes           - List all notes for current tenant
GET /api/notes/:id       - Get specific note
PUT /api/notes/:id       - Update note (owner/admin only)
DELETE /api/notes/:id    - Delete note (owner/admin only)
```

### Tenant Management
```
POST /api/tenants/:slug/upgrade - Upgrade tenant to Pro (admin only)
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests
- **UUID** for unique note identifiers

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **CSS3** for responsive styling
- **LocalStorage** for client-side token persistence

### Deployment
- **Vercel** for both backend and frontend hosting
- **Environment Variables** for configuration
- **Serverless Functions** for API endpoints

## 🔒 Security Features

### Data Isolation
- All database queries filtered by `tenantId`
- Middleware ensures users can only access their tenant's data
- JWT tokens include tenant information for validation

### Role-based Access Control
- Admin-only endpoints protected with authorization middleware
- Note ownership verification for updates/deletions
- Subscription limit enforcement

### Authentication
- Secure JWT tokens with expiration
- Bcrypt password hashing with salt rounds
- Token validation on all protected routes

## 📱 Frontend Features

### Modern UI
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Professional appearance
- **Real-time Updates**: Immediate reflection of backend changes
- **Error Handling**: Comprehensive error messages and success feedback

### User Experience
- **Auto-login**: Remembers user sessions
- **Test Account Info**: Clear display of available test accounts
- **Subscription Status**: Visual indicators for plan limits
- **Upgrade Prompts**: Clear calls-to-action for plan upgrades

### State Management
- React hooks for local state management
- LocalStorage for session persistence
- Real-time note count tracking
- Immediate UI updates after actions

## 🚀 Deployment

### 🏆 Ready for Vercel Deployment

The application is fully configured and ready for deployment to Vercel:

#### Backend Deployment
1. Go to [vercel.com](https://vercel.com) and create/sign in to your account
2. Click "New Project" and import this repository
3. Use root directory (contains `server.js`)
4. Add environment variable: `JWT_SECRET=cc0e2411a27c397133b2544f45e23ddc782d3ab3e32eadc9d4c88b871e557d25`
5. Deploy - Vercel automatically detects the `vercel.json` configuration

#### Frontend Deployment  
1. Create another new project in Vercel
2. Import the same repository
3. Set root directory to `frontend`
4. Framework will auto-detect as Vite
5. Add environment variable: `VITE_API_URL=https://your-backend-url.vercel.app`
6. Deploy

### ✅ Deployment Verification
- **Health Endpoint**: `GET /health → { "status": "ok" }` ✅ Working
- **CORS Enabled**: All origins allowed for automated scripts ✅ Configured  
- **Authentication**: JWT-based with all test accounts ✅ Working
- **Multi-tenancy**: Strict tenant isolation ✅ Implemented
- **Role Authorization**: Admin/Member roles enforced ✅ Working
- **Subscription Limits**: Free plan 3-note limit ✅ Enforced
- **Frontend Features**: Login, CRUD, Upgrade prompts ✅ Complete

### 🧪 Local Testing Commands
```bash
# Backend (already running on port 3001)
npm start

# Frontend (run in new terminal)
cd frontend
npm run dev

# Access at: http://localhost:5173
```

## 🧪 Testing

The application supports automated testing through the following:

1. **Health Endpoint**: `/health` returns `{ "status": "ok" }`
2. **Authentication**: All test accounts can successfully log in
3. **Tenant Isolation**: Users can only access their tenant's data
4. **Role Restrictions**: Members cannot access admin-only features
5. **Subscription Limits**: Free plan enforces 3-note limit
6. **CRUD Operations**: All note operations work correctly
7. **Upgrade Functionality**: Admins can upgrade their tenant plan

## 📂 Project Structure

```
/
├── api/                 # Vercel serverless function entry
├── data/               # Shared data and helper functions
├── frontend/           # React frontend application
├── middleware/         # Authentication and authorization
├── routes/            # API route handlers
├── server.js          # Express server configuration
├── vercel.json        # Vercel deployment configuration
└── README.md          # This file
```

## 🔄 Development

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start backend: `npm run dev`
4. Start frontend: `cd frontend && npm run dev`
5. Access at `http://localhost:5173`

### API Base URL
- **Production**: Set via `VITE_API_URL` environment variable
- **Development**: Defaults to `http://localhost:3001`

## 🎯 Key Features Validation

✅ **Multi-tenancy**: Strict tenant isolation with shared schema  
✅ **Authentication**: JWT-based with 4 test accounts  
✅ **Authorization**: Role-based access control  
✅ **Subscription Limits**: Free plan 3-note limit  
✅ **CRUD Operations**: Complete notes management  
✅ **Deployment**: Both frontend and backend on Vercel  
✅ **Health Endpoint**: Monitoring and validation  
✅ **CORS Enabled**: Cross-origin request support  
✅ **Modern UI**: Professional React frontend  

## 📞 Support

