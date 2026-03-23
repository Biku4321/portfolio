<div align="center">

# ✦ Bikash Samanta — Developer Portfolio

**A full-stack portfolio platform built with React + Node.js + MongoDB**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](LICENSE)

[🌐 Live Demo](https://portfolio-biku4321s-projects.vercel.app) · [📧 Contact](mailto:samantabikash83939@gmail.com) · [🐙 GitHub](https://github.com/Biku4321)

</div>

---

## 📸 Preview

> Dark-themed, glassmorphism UI with smooth Framer Motion animations, a GitHub contribution calendar, dynamic project modals, and a full admin CMS dashboard.

---

## ✨ Features

### Public Portfolio
| Feature | Description |
|---------|-------------|
| 🏠 **Hero** | Animated role typewriter, profile avatar with conic gradient ring, stats |
| 📊 **GitHub Calendar** | Month-by-month contribution graph with navigation |
| 🛠️ **Skills** | Category-filtered skill chips with proficiency levels & icons |
| 💼 **Projects** | Searchable, filterable grid with click-to-expand **detail modal** |
| 🏆 **Hackathons** | Competition cards with rank badges, achievements & tech stack |
| 📚 **Education** | Timeline cards with CGPA, coursework, and achievement bullets |
| 🧑‍💼 **Experience** | Animated vertical timeline |
| 📜 **Certificates** | Verified credential cards with issuer filter |
| 📝 **Blogs** | Tag-filtered article cards with read time |
| 📬 **Contact** | EmailJS form + info cards + social links |

### Admin Dashboard
| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | JWT-protected admin login with token refresh |
| 📋 **CMS** | Full CRUD for all sections via modal forms |
| 🖼️ **Image Upload** | Cloudinary integration via `/api/upload` |
| 📊 **Stats** | Live counts for all content sections |

---

## 🗂️ Project Structure

```
portfolio/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── pages/             # Public pages
│       │   ├── Home.jsx
│       │   ├── PublicAbout.jsx
│       │   ├── PublicProjects.jsx  # + Project Detail Modal
│       │   ├── PublicHackathons.jsx
│       │   ├── PublicEducation.jsx
│       │   ├── PublicExperience.jsx
│       │   ├── Skills.jsx
│       │   ├── Certificate.jsx
│       │   ├── PublicBlogs.jsx
│       │   └── Contact.jsx
│       ├── admin/             # Protected admin panel
│       │   ├── AdminDashboard.jsx
│       │   ├── ProjectsAdmin.jsx
│       │   ├── HackathonsAdmin.jsx
│       │   ├── SkillsAdmin.jsx
│       │   ├── ExperienceAdmin.jsx
│       │   ├── EducationAdmin.jsx
│       │   ├── CertificatesAdmin.jsx
│       │   ├── BlogsAdmin.jsx
│       │   └── aboutAdmin.jsx
│       ├── components/        # Shared components
│       └── context/           # Auth + Toast context
│
└── server/                    # Node.js + Express backend
    ├── models/                # Mongoose schemas
    │   ├── Project.js
    │   ├── Hackathon.js       # ← New
    │   ├── educationModel.js  # ← Updated (grade, location, courses, highlights)
    │   ├── Skills.js
    │   ├── Experience.js
    │   ├── Certificate.js
    │   ├── Blog.js
    │   ├── About.js
    │   └── admin.js
    ├── controllers/           # Business logic
    ├── routes/                # Express routers
    │   └── hackathonRoutes.js # ← New
    ├── middleware/
    │   └── authMiddleware.js  # JWT verify
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- EmailJS account (for contact form)

### 1. Clone the repo

```bash
git clone https://github.com/Biku4321/portfolio.git
cd portfolio
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` in `server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_key_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev        # Development
npm start          # Production
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000
VITE_GITHUB_USERNAME=Biku4321

# EmailJS (contact form)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Calendly (hire me button)
VITE_CALENDLY_URL=https://calendly.com/your-username
```

```bash
npm run dev        # http://localhost:5173
npm run build      # Production build
```

### 4. Create Admin Account

```bash
cd server
node insertAdmin.js
```

> Default credentials set in `insertAdmin.js`. **Change them before deploying!**

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set root directory to `client/`
4. Add all `VITE_*` environment variables
5. Deploy ✓

### Backend → Railway / Render / VPS

```bash
# Railway
railway login
railway init
railway up
```

Add all environment variables in the dashboard, then add your deployed backend URL to:
- `VITE_API_URL` in Vercel frontend env
- CORS `origin` array in `server.js`

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/about` | ❌ | Get about info |
| GET | `/api/projects` | ❌ | List projects (search, filter, paginate) |
| GET | `/api/projects/:id` | ❌ | Get single project |
| GET | `/api/hackathons` | ❌ | List hackathons |
| GET | `/api/skills` | ❌ | List skills by category |
| GET | `/api/experience` | ❌ | List experience |
| GET | `/api/education` | ❌ | List education |
| GET | `/api/certificates` | ❌ | List certificates |
| GET | `/api/blogs` | ❌ | List blogs |
| POST | `/api/admin/login` | ❌ | Admin login → JWT |
| POST | `/api/upload` | ✅ | Upload image → Cloudinary URL |
| POST/PUT/DELETE | `/api/*` | ✅ | All write operations |

> ✅ = Requires `Authorization: Bearer <token>` header

---

## 🎨 Tech Stack

**Frontend**
- [React 18](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS 3](https://tailwindcss.com) — utility-first styling
- [Framer Motion](https://framer.com/motion) — animations
- [React Router v6](https://reactrouter.com) — routing
- [Lucide React](https://lucide.dev) — icons
- [react-github-calendar](https://github.com/grubersjoe/react-github-calendar)
- [EmailJS](https://emailjs.com) — contact form (no backend needed)
- [React Helmet Async](https://github.com/staylor/react-helmet-async) — SEO

**Backend**
- [Node.js](https://nodejs.org) + [Express 5](https://expressjs.com)
- [MongoDB](https://mongodb.com) + [Mongoose 8](https://mongoosejs.com)
- [JWT](https://jwt.io) — authentication
- [Cloudinary](https://cloudinary.com) — image hosting
- [Multer](https://github.com/expressjs/multer) — file handling
- [Helmet](https://helmetjs.github.io) + [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) — security

---

## ⚙️ Environment Variables

### Server `.env`
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ❌ | Server port (default: 5000) |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |

### Client `.env`
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend URL (no trailing slash) |
| `VITE_GITHUB_USERNAME` | ✅ | GitHub username for calendar |
| `VITE_EMAILJS_SERVICE_ID` | ✅ | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | ✅ | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | ✅ | EmailJS public key |
| `VITE_CALENDLY_URL` | ❌ | Calendly scheduling link |

---

## 🐛 Troubleshooting

**Image upload fails ("Upload failed")**
- Ensure `CLOUDINARY_*` vars are set in server `.env`
- Verify the upload endpoint uses `upload.single("file")` in `routes/uploadRoutes.js`
- The frontend sends `fd.append("file", ...)` — field name must match

**GitHub calendar not showing**
- Set `VITE_GITHUB_USERNAME` in client `.env`
- The calendar filters by month — use arrows to navigate

**Admin login fails**
- Run `node insertAdmin.js` to create admin account
- Verify `JWT_SECRET` is set and consistent

**CORS errors**
- Add your frontend URL to the `origin` array in `server.js`

---

## 📝 License

MIT © 2026 [Bikash Samanta](https://github.com/Biku4321)

---

<div align="center">
  <sub>Built with React + Node.js + ❤️ · Crafted with 💜 and lots of tokens</sub>
</div>
