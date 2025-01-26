# TaskFlow
## Tech Stack

- **Frontend**: React, Tailwind CSS, React Query
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose

## Deployment Guide (Free Tier on Render.com)

### Prerequisites
1. Create a free account on [Render.com](https://render.com)
2. Fork or have ownership of this repository

### Database Setup
1. In Render dashboard, go to "New +" > "PostgreSQL"
2. Choose a name for your database
3. Select the free tier
4. Note down the following details:
   - Internal Database URL
   - External Database URL

### Backend Setup
1. In Render dashboard, go to "New +" > "Web Service"
2. Connect your repository
3. Configure the service:
   - Name: taskflow-backend (or your preferred name)
   - Root Directory: server
   - Environment: Node
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
4. Add environment variables:
   ```
   DATABASE_URL=<Your Internal Database URL>
   JWT_SECRET=<Your Secret Key>
   CSRF_SECRET=<Your CSRF Secret>
   NODE_ENV=production
   CLIENT_URL=<Your Frontend URL>
   ```
5. Deploy the service

### Frontend Setup
1. In Render dashboard, go to "New +" > "Static Site"
2. Connect your repository
3. Configure the site:
   - Name: taskflow-frontend (or your preferred name)
   - Root Directory: client
   - Build Command: `npm install && npm run build`
   - Publish Directory: dist
4. Add environment variable:
   ```
   VITE_API_URL=<Your Backend URL>
   ```
5. Deploy the site

### Post-Deployment
1. Update CORS settings in the backend to allow requests from your frontend URL
2. Test the application by creating a new account and adding tasks

### Notes
- Free tier may have some limitations on usage and performance
- The application will sleep after 15 minutes of inactivity
- Database has storage limitations on free tier

### Troubleshooting
- If the application fails to connect to the database, verify the DATABASE_URL
- For CORS issues, ensure CLIENT_URL matches your frontend URL exactly
- Check Render logs for detailed error messages