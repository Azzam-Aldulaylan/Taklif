# Taklif Podcast App

A full-stack podcast application built with NestJS backend and Next.js frontend.

> **Note**: Services are hosted on Render's free tier and may take 30-60 seconds to wake up from sleep.

##  Architecture

- **Backend**: NestJS with TypeScript, PostgreSQL database
- **Frontend**: Next.js 15 with React 19, Tailwind CSS
- **Deployment**: Docker containers on Render

## Features

- Browse podcasts from iTunes Search API
- Search functionality
- Responsive design
- Episode management
- RESTful API

## Local Development

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (or use Docker)


# Start all services with Docker Compose
npm run dev
# or
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Database: PostgreSQL on port 5433 --- check the availability of the port before hand

### Development Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build
```

##  Deployment

This app is configured for easy deployment to Render using the included `render.yaml` blueprint.


## Project Structure

```
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── services/        # Business logic
│   │   ├── entities/        # Database entities
│   │   └── dto/            # Data transfer objects
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and API client
│   └── Dockerfile
├── docker-compose.yml      # Local development
└── render.yaml            # Render deployment config
```

##  Technologies Used

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **Axios** - HTTP client for iTunes API

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **Render** - Hosting platform
- **GitHub Actions** - CI/CD (optional)

## API Endpoints

### Podcasts
- `GET /api/podcasts` - Get all podcasts
- `GET /api/podcasts/:id` - Get podcast by ID
- `GET /api/podcasts/search` - Search podcasts

### Episodes
- `GET /api/episodes` - Get all episodes
- `GET /api/episodes/:podcastId` - Get episodes for a podcast

## Environment Variables

### Backend
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
DB_HOST=hostname
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=thmanyah
```

### Frontend
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://taklif-backend.onrender.com/api
```
