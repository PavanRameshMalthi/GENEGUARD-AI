# 🧬 GeneGuard AI

**Predict Tomorrow's Health, Today.**

A modern AI-powered preventive healthcare web application that helps users understand possible health risks through AI-generated wellness insights.

> ⚠️ **Disclaimer**: GeneGuard AI provides educational wellness insights only. It is not a medical diagnosis. Always consult a qualified healthcare professional.

---

## ✨ Features

- 🏥 **AI Health Assessment** — Multi-step health questionnaire with AI-powered analysis
- 💬 **AI Health Chatbot** — Real-time health conversations powered by Google Gemini
- 📊 **Interactive Dashboard** — Health score, BMI, risk meter, charts, and statistics
- 📋 **Medical Report Analysis** — Upload PDF/image reports for AI summary
- 💡 **Personalized Recommendations** — Daily tips and weekly goals
- 🌙 **Dark/Light/System Theme** — Full theme support with no flickering
- 🔐 **JWT Authentication** — Secure registration, login, and protected routes
- 👑 **Admin Panel** — User management, analytics, and activity logs
- 📱 **Fully Responsive** — Mobile-first design with glassmorphism UI
- ♿ **Accessible** — Semantic HTML, ARIA attributes, keyboard navigation

---

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router DOM v7
- React Hook Form
- Framer Motion
- Recharts
- Lucide React
- Axios

### Backend
- Node.js + Express.js
- TypeScript (tsx)
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken + bcryptjs)
- Google Gemini API (`@google/generative-ai`)
- Multer (file uploads)
- Helmet, CORS, Rate Limiting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
# Install server dependencies
cd server
cp .env.example .env   # Edit with your MongoDB URI, JWT secret, and Gemini API key
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/geneguard
JWT_SECRET=your-super-secret-jwt-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 📁 Project Structure

```
geneguard-ai/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Button, Input, Card, Modal, etc.
│   │   │   ├── layout/         # Navbar, Sidebar, Footer, Layouts
│   │   │   ├── charts/         # Recharts visualizations
│   │   │   └── features/       # Domain-specific components
│   │   ├── pages/              # Route pages
│   │   ├── context/            # Theme, Auth, Toast providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer (Axios)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helpers and constants
│   │   └── styles/             # Tailwind CSS
│   └── ...config files
├── server/                     # Express Backend
│   ├── src/
│   │   ├── models/             # Mongoose schemas
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Auth, validation, rate-limit
│   │   ├── services/           # Gemini AI integration
│   │   ├── config/             # DB, env, Gemini config
│   │   └── utils/              # Helpers
│   └── ...config files
└── README.md
```

---

## 🔗 Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Forgot Password | Public |
| `/dashboard` | Dashboard | Protected |
| `/assessment` | Health Assessment | Protected |
| `/assessment/:id` | Assessment Results | Protected |
| `/chat` | AI Chatbot | Protected |
| `/reports` | Medical Reports | Protected |
| `/recommendations` | Health Tips | Protected |
| `/profile` | User Profile | Protected |
| `/settings` | Settings | Protected |
| `/admin` | Admin Panel | Admin Only |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/assessments` | Create assessment + AI analysis |
| GET | `/api/assessments` | List assessments |
| GET | `/api/assessments/:id` | Get assessment |
| POST | `/api/chat/message` | Send chat message |
| GET | `/api/chat/history` | Get chat history |
| POST | `/api/reports/upload` | Upload report |
| POST | `/api/reports/:id/analyze` | Analyze report with AI |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/recommendations/daily` | Get daily tips |
| GET | `/api/admin/stats` | Admin statistics |

---

## 🎨 Design System

- **Apple-inspired** premium healthcare branding
- **Glassmorphism** with backdrop blur and semi-transparent surfaces
- **Color Palette**: Blue (primary), Green (accent), White/Gray backgrounds
- **Dark Mode**: Class-based with system preference detection
- **Typography**: Clean, professional spacing
- **Animations**: Framer Motion page transitions and micro-interactions

---

## 📄 License

MIT
