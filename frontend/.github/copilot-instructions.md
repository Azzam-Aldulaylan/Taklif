# Copilot Instructions for Thmanyah Frontend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js 14 frontend application for the Thmanyah Podcast Search platform. It integrates with a NestJS backend API to search, display, and manage podcast data from iTunes.

## Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **API Integration**: Fetch API with proper error handling
- **UI Components**: Custom responsive components

## Backend API Integration
- Base URL: `http://localhost:3000/api`
- Endpoints:
  - POST `/podcasts/search` - Search and store podcasts
  - GET `/podcasts` - List all stored podcasts
  - GET `/podcasts/:id` - Get specific podcast
  - GET `/health` - Health check

## Code Style Guidelines
- Use TypeScript with strict type checking
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with responsive design
- Implement proper error handling and loading states
- Use React Server Components where appropriate
- Follow component composition patterns
- Implement accessibility best practices

## Component Structure
- Keep components small and focused
- Use proper TypeScript interfaces for props
- Implement loading and error states
- Use semantic HTML elements
- Follow responsive design principles

## API Integration Guidelines
- Use proper error handling for API calls
- Implement loading states for better UX
- Use TypeScript interfaces for API responses
- Handle network errors gracefully
- Implement proper data validation
