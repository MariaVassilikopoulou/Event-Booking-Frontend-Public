## EventBooking Frontend
### Overview

This project is the frontend application for the EventBooking Platform.
It’s built with Next.js and TypeScript, following modern best practices for scalability, maintainability, and secure integration with a cloud-based backend.

The goal is to provide a fast, responsive, and user-friendly interface where users can browse and book events.
All communication with the backend API is handled through secure HTTP requests, with proper authentication and data validation.

### Tech Stack

Framework: Next.js 
Language: TypeScript
Styling: SCSS 
API Communication: REST API (secured with JWT tokens)
Deployment: Vercel (Frontend) integrated with Azure-hosted backend
Environment Variables: Managed securely using .env files (not committed to source control)

### Security & Integration

All API requests are authenticated using JWT tokens, which ensures that only logged-in users can make bookings or access protected routes. Sensitive configuration values (like API base URLs or public keys) are managed securely through environment variables.

### Deployment

The frontend is hosted on Vercel, connected directly to the main branch of the GitHub repository for automatic deployment.
It uses environment variables to connect securely to the backend API, ensuring separation between development and production environments.

### What I Focused On and Learned

Building scalable frontend architecture using Next.js and TypeScript
Writing clean, modular SCSS for maintainable styling
Implementing secure API communication with JWT authentication
Integrating with a cloud-hosted backend on Azure
Managing environment variables safely across environments
Deploying and maintaining a modern web app through Vercel CI/CD

