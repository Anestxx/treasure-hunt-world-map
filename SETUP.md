# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Frontend (Next.js, React, Leaflet, etc.)
- Backend (Express, MongoDB, JWT, etc.)

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Make sure it's running on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Use that connection string in your `.env` file

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/treasure-hunt
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Seed the Database (Optional but Recommended)

```bash
cd backend
node scripts/seed.js
```

This will create:
- 8 sample challenges (quizzes, riddles, logic puzzles)
- 8 sample locations (Paris, Tokyo, New York, London, Sydney, Cairo, Dubai, Rome)

### 5. Start the Development Servers

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### 6. Create Your First Account

1. Open http://localhost:3000
2. Click on any location marker
3. You'll be prompted to login/register
4. Create an account and start exploring!

## Creating an Admin Account

To access the admin panel:

1. Register a new account with username "admin"
2. Log in with that account
3. Navigate to `/admin` or click "Admin Panel" in the sidebar

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `backend/.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `backend/.env` to a different port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

### Map Not Loading
- Check browser console for errors
- Ensure Leaflet CSS is loading (check Network tab)
- Try clearing browser cache

### API Errors
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` matches your backend URL
- Verify CORS is enabled in backend (it should be)

## Project Structure

```
treasure-hunt-map/
├── frontend/              # Next.js application
│   ├── app/              # Pages and layouts
│   ├── components/       # React components
│   ├── contexts/        # React contexts
│   └── lib/             # Utilities and API client
├── backend/             # Express API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── scripts/         # Seed scripts
└── package.json         # Root package.json
```

## Next Steps

1. **Explore the Map**: Click on city markers to solve challenges
2. **Complete Challenges**: Earn points and badges
3. **Check Leaderboard**: See how you rank globally
4. **View Profile**: Track your progress and achievements
5. **Add More Content**: Use the admin panel to add new locations and challenges

## Production Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd frontend && npm run build`
2. Deploy to Vercel or Netlify
3. Set `NEXT_PUBLIC_API_URL` to your production API URL

### Backend (Heroku/Railway/Render)
1. Set environment variables in your hosting platform
2. Deploy the `backend/` directory
3. Ensure MongoDB connection string is set

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` with your Atlas connection string

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check that both frontend and backend servers are running

