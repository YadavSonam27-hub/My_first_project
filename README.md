# Weather Forecast Agent (AWS + MCP-style Assistant)

A full-stack weather assistant with authentication, personalized dashboard, search history, real-time weather, and smart recommendations.

## Project structure

- `frontend/` React + Vite client (Login, Signup, Dashboard)
- `backend/` Node.js + Express API (Auth, Weather, History, Agent)

## Features

- JWT authentication (signup/login/logout)
- Password hashing with bcrypt
- Protected dashboard routes
- Current weather + 5-day forecast from OpenWeatherMap
- AI-style recommendations and follow-up support (`What about tomorrow?`)
- Personalized search history and last searched city context
- Dark/light mode toggle
- Responsive card-based UI with loading/error states

## Local development

### 1) Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Required backend `.env` values:

- `MONGO_URI`
- `JWT_SECRET`
- `OPENWEATHER_API_KEY`
- `FRONTEND_URL`

### 2) Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Weather
- `GET /api/weather?city=London` (protected)
- `GET /api/weather/agent?query=What%20about%20tomorrow` (protected)
- `GET /api/history` (protected)

## AWS deployment plan

### Frontend on S3 + CloudFront
1. Run `npm run build` in `frontend/`.
2. Create an S3 bucket and enable static website hosting.
3. Upload `frontend/dist` contents.
4. (Recommended) Put CloudFront in front of S3 and enforce HTTPS.
5. Set `VITE_API_BASE_URL` to your deployed backend URL.

### Backend on EC2 or Elastic Beanstalk
1. Provision Node.js runtime environment.
2. Set environment variables from `backend/.env.example`.
3. Run `npm install && npm start`.
4. Configure reverse proxy (Nginx) and TLS.

### Database
- Use MongoDB Atlas for production persistence.
- Restrict IPs and enable DB user with least privilege.

### Optional AWS Lambda
- You can move weather-fetch logic to Lambda and call it from Express.

## Security notes

- Passwords are hashed using bcrypt.
- Tokens are signed JWTs and required for protected routes.
- Input validation via `express-validator`.
- API keys/secrets are stored in environment variables.

