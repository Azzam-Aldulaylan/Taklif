#!/bin/bash

# Build script for Render deployment

echo "Starting build process..."

# Check if we're in backend or frontend directory
if [ -f "nest-cli.json" ]; then
    echo "Building backend..."
    npm install
    npm run build
    echo "Backend build complete!"
elif [ -f "next.config.ts" ]; then
    echo "Building frontend..."
    npm install
    npm run build
    echo "Frontend build complete!"
else
    echo "Error: Unable to determine project type"
    exit 1
fi

echo "Build process finished successfully!"
