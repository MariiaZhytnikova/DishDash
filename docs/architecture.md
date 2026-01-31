# Architecture

This document describes the high-level architecture of the Dish Dash application, including its main components, data flow, and deployment setup.

## System Overview

Dish Dash follows a classic client–server architecture.

- The **frontend** runs in the browser and handles user interaction.
- The **backend** exposes a REST API that provides recipe data and manages application logic.
- The frontend communicates with the backend via HTTP requests.

## Components

### Frontend

- Runs as a single-page application in the browser.
- Responsible for:
  - Managing available ingredients
  - Displaying recipe search results
  - Showing recipe details and cooking instructions
  - Managing shopping lists
- Communicates with the backend using JSON over HTTP.
- The backend URL is configured via environment variables.

### Backend

- Runs as a standalone server application.
- Responsible for:
  - Processing ingredient-based recipe searches
  - Returning recipe data
  - Managing shopping list logic
  - Updating available ingredients after cooking
- Exposes a REST API consumed by the frontend.

## API Communication

The frontend communicates with the backend through REST endpoints.

Typical interactions include:
- Sending a list of available ingredients
- Requesting matching recipes
- Retrieving recipe details
- Updating ingredient quantities after cooking
- Generating shopping lists for missing ingredients

All responses are returned in JSON format.

## Data Flow

1. The user manages their available ingredients in the frontend.
2. The frontend sends the ingredient data to the backend API.
3. The backend processes the request and determines matching recipes.
4. The backend returns a list of recipes to the frontend.
5. The frontend displays the results to the user.
6. When the user selects **Cook**, the frontend notifies the backend to update ingredient quantities.
7. When generating a shopping list, the backend returns missing ingredients.

## Environment Configuration

The frontend requires a backend API URL to be defined.

Example configuration (.env):

```
VITE_API_URL=http://localhost:8080
```

For production:
```
VITE_API_URL=https://backend-ancient-waterfall-8399.fly.dev
```

Deployment
Backend Deployment

Deployed on Fly.io

Publicly accessible at:

https://backend-ancient-waterfall-8399.fly.dev

Frontend Deployment

Deployed as a static web application

Communicates with the deployed backend API

## Scalability Considerations

The current architecture allows future extensions, including:

- User accounts and authentication
- Use Database to store data
- Family and shared access
- Nutrition tracking and analytics
- AI-powered recommendation logic

Dish Dash uses a simple and scalable client–server architecture.