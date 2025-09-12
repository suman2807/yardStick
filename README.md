# Yardstick Notes Application

A multi-tenant SaaS Notes Application built with Node.js, Express, and React.

## Features

- Multi-tenancy support with strict data isolation
- JWT-based authentication
- Role-based access control (Admin and Member roles)
- Subscription feature gating (Free and Pro plans)
- Full CRUD operations for notes
- Responsive web interface

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach for multi-tenancy. All data is stored in the same tables, but each record has a `tenantId` column that identifies which tenant it belongs to. This approach provides:

- Data isolation between tenants
- Efficient resource utilization
- Simplified maintenance
- Easy scaling

## Authentication and Authorization

The application implements JWT-based authentication with two user roles:

1. **Admin**: Can invite users and upgrade subscriptions
2. **Member**: Can only create, view, edit, and delete notes

### Test Accounts

All test accounts use the password: `password`

- `admin@acme.test` (Admin, tenant: Acme)
- `user@acme.test` (Member, tenant: Acme)
- `admin@globex.test` (Admin, tenant: Globex)
- `user@globex.test` (Member, tenant: Globex)

## Subscription Plans

1. **Free Plan**: Limited to a maximum of 3 notes per tenant
2. **Pro Plan**: Unlimited notes per tenant

Admin users can upgrade their tenant's subscription using the upgrade endpoint.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Notes (Protected)
- `GET /api/notes` - List all notes for the current tenant
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Retrieve a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Tenants (Admin Only)
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant subscription

### Health
- `GET /health` - Health check endpoint

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Development

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret_key_here
   ```
5. Create a `.env` file in the `frontend` directory with the following variables:
   ```
   VITE_API_URL=http://localhost:3001
   ```
6. Start the backend server:
   ```bash
   npm start
   ```
7. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Deployment on Vercel

### Backend Deployment

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the build command to:
   ```
   npm install
   ```
4. Set the output directory to:
   ```
   .
   ```
5. Add the following environment variables in Vercel:
   - `JWT_SECRET` - Your JWT secret key (generate a new one for security)
   - [PORT](file://c:\Users\suman\OneDrive\Desktop\Yardstick\server.js#L9-L9) - 3001 (or let Vercel auto-assign)

### Frontend Deployment

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the root directory to:
   ```
   frontend
   ```
4. Vercel will automatically detect the Vite project and set the correct build settings
5. Add the following environment variables:
   - `VITE_API_URL` - Your backend deployment URL (e.g., `https://your-backend-deployment.vercel.app`)

### Environment Variables

For local development, create a `.env` file in the root directory:
```
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
```

For frontend, create a `.env` file in the `frontend` directory:
```
VITE_API_URL=http://localhost:3001
```

## Security Considerations

- The JWT secret in the repository has been exposed and should be regenerated
- Generate a new JWT secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Never commit secrets to version control
- Use environment variables for all sensitive information

## Project Structure

```
yardstick-notes-app/
├── .env                 # Environment variables (not committed)
├── server.js            # Entry point for backend
├── package.json         # Backend dependencies
├── vercel.json          # Vercel configuration for backend
├── README.md            # This file
├── middleware/          # Authentication and authorization middleware
├── routes/              # API route handlers
├── models/              # Data models (currently using in-memory storage)
├── utils/               # Utility functions
├── frontend/            # React frontend application
│   ├── .env            # Frontend environment variables (not committed)
│   ├── package.json     # Frontend dependencies
│   ├── vercel.json      # Vercel configuration for frontend
│   ├── vite.config.js   # Vite configuration
│   ├── index.html       # HTML entry point
│   ├── src/             # Source code
│   │   ├── App.jsx      # Main application component
│   │   ├── App.css      # Application styles
│   │   └── main.jsx     # React entry point
│   └── public/          # Static assets
```

## Testing

The application has been tested with the following scenarios:

- Health endpoint availability
- Successful login for all predefined accounts
- Enforcement of tenant isolation
- Role-based restrictions
- Enforcement of the Free plan note limit
- Removal of the limit after upgrade
- Correct functioning of all CRUD endpoints
- Presence and accessibility of the frontend

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Authentication**: JWT
- **Database**: In-memory mock database (would be replaced with a real database in production)
- **Deployment**: Vercel

## Future Improvements

1. Replace in-memory storage with a real database (MongoDB, PostgreSQL, etc.)
2. Add user invitation functionality for Admins
3. Implement note editing functionality
4. Add search and filtering capabilities
5. Implement data persistence for production use

## License

This project is licensed under the MIT License.

## Deployment URLs

After deployment, update this section with your actual URLs:

- **Backend Base URL**: [https://your-backend-url.vercel.app](https://your-backend-url.vercel.app)
- **Frontend URL**: [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)