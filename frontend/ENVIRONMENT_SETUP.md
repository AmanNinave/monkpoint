# Frontend Environment Setup

## Environment Variables

Create a `.env.local` file in the frontend directory with the following content:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api
```

## For Production

When you deploy your frontend, update the environment variable to point to your deployed backend:

```bash
# Production backend URL
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

## How It Works

The frontend uses `import.meta.env.VITE_API_BASE_URL` to get the backend URL from environment variables, with a fallback to `http://localhost:3001/api` for local development.

## Vite Environment Variables

- All environment variables in Vite must be prefixed with `VITE_`
- Variables are available in the browser via `import.meta.env`
- `.env.local` is ignored by git (add to .gitignore)
- `.env.example` can be committed to show the required variables
