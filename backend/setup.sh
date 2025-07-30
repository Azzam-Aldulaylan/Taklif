#!/bin/bash

# Thmanyah Backend Setup Script
echo "🚀 Setting up Thmanyah Backend..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "🔗 Visit: https://www.postgresql.org/download/"
    exit 1
fi

# Create database if it doesn't exist
echo "📅 Creating database..."
psql -U postgres -c "CREATE DATABASE thmanyah_podcasts;" 2>/dev/null || echo "📅 Database already exists"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your PostgreSQL credentials"
echo "2. Run 'npm run start:dev' to start the development server"
echo "3. The API will be available at http://localhost:3000/api"
echo ""
echo "📚 Available endpoints:"
echo "   POST /api/podcasts/search - Search and store podcasts"
echo "   GET  /api/podcasts       - Get all stored podcasts"
echo "   GET  /api/podcasts/:id   - Get specific podcast"
