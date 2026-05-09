# Hacker News Aggregator

A full-stack MERN application that scrapes and displays top stories from Hacker News.

## Features
- Web scraping of Hacker News top stories
- User authentication (JWT)
- Bookmark stories
- Pagination support
- Responsive design

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js
- Cheerio (scraping)
- TailwindCSS (styling)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB installed locally or MongoDB Atlas account

### Environment Variables

#### Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

#### Frontend
Update API_URL in frontend/src/services/api.js

### Installation

1. Clone the repository
2. Install backend dependencies:
   cd backend && npm install
3. Install frontend dependencies:
   cd frontend && npm install

### Running the Application

1. Start MongoDB
2. Run backend: cd backend && npm run dev
3. Run frontend: cd frontend && npm start

### API Endpoints

- POST /api/auth/register - Register user
- POST /api/auth/login - Login user
- GET /api/stories - Get stories (with pagination)
- GET /api/stories/:id - Get single story
- POST /api/stories/:id/bookmark - Toggle bookmark
- POST /api/stories/scrape - Trigger scraping
