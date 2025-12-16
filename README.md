---
## Tech Stack

### Frontend
- Angular (standalone components)
- Routing + Guards
- Services for API calls + state helpers
- Pipes, directives, animations

### Backend
- Node.js + Express
- TypeScript
- Cron job for periodic weather updates
- Layered structure: routers → controllers → services → data-layers
- Centralized error handling middleware
---

## Main Features

-   ✅ User authentication (register/login)
-   ✅ Weather forecast UI (carousel + weekly view)
-   ✅ Weather updates via scheduled job (cron)
-   ✅ News module
-   ✅ Favorites support (client-side service)
-   ✅ Error handling middleware + utilities

---

## Getting Started

### Prerequisites

-   Node.js (LTS recommended)
-   npm (or pnpm/yarn if you prefer)
-   (Optional) MongoDB if your backend is using it

---

## Environment Variables

Create `di-1-backend/.env` (adjust names to your actual config):

```env
PORT=3000
NODE_ENV=development

# If using a database
MONGO_URI=mongodb://localhost:27017/weatherapp

# Auth
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d

# External APIs (examples)
WEATHER_API_KEY=your_weather_api_key
NEWS_API_KEY=your
```
