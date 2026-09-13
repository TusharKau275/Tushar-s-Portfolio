# Tushar Kaushik — Full Stack Developer Portfolio

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

**A high-performance, dark-mode developer portfolio powered by Three.js WebGL graphics, real-time GitHub REST API synchronization, interactive system architecture modals, and a lightweight Node.js/Express backend.**

[Live Demo](https://tushar-s-portfolio.onrender.com/) • [GitHub Profile](https://github.com/TusharKau275) • [Report Issue](https://github.com/TusharKau275/Tushar-s-Portfolio/issues)

</div>

---

## 🌟 Overview

This portfolio is built to showcase production-grade engineering without boilerplate bloat. It combines high visual fidelity (fluid typography, custom glassmorphism, responsive grid architecture, and interactive 3D WebGL physics) with a resilient backend layer featuring dynamic GitHub REST syncing and in-memory caching.

---

## ✨ Features

- 🪐 **Interactive Three.js 3D Hero**: Custom wireframe particle sphere and planetary orbital rings rendered with Three.js WebGL, interactive pointer tracking, and responsive canvas containment.
- ⚡ **Real-Time GitHub Sync**: Live data fetching from GitHub API (`https://api.github.com/users/TusharKau275`) with in-memory TTL caching (15 minutes) and synchronous static fallbacks for instantaneous first-paint performance.
- 🏛️ **Architecture & Case Study Modals**: Deep-dive system design views detailing technical pipelines, layered architecture, data workflows, and performance metrics (e.g., Aarogya Heatwave Early Warning System).
- 📜 **Verified Credentials**: Real verified certifications from Saylor Academy (*CS107: C++ Programming*, Credential ID: `4289665260TK`) and Indian Institute of Computing & Technology (*AI-ML Training*).
- 🎨 **Anti-Slop Vanilla Design System**: Bespoke dark aesthetic crafted in pure Vanilla CSS—zero generic templates, fluid responsive sizing with `clamp()`, and smooth scroll reveal transitions.
- 📱 **Fully Responsive**: Seamless layout adaptivity from mobile viewports (320px) to ultra-wide desktop monitors (1920px+).
- 🚀 **Dual Deployment Ready**: Native configurations for Vercel edge frontend routing (`vercel.json`) and Render backend containerization (`render.yaml`).

---

## 🛠️ Tech Stack

### Frontend
- **HTML5 & Vanilla CSS**: Custom CSS variables, responsive CSS Grid, Flexbox, glassmorphic filters, and `@keyframes` animations.
- **JavaScript (ES6+)**: Modular scripts, IntersectionObserver for viewport reveals, and modal dialog management.
- **Three.js**: WebGL-based 3D scene, dynamic particle meshes, orbital rings, and resize observer logic.

### Backend
- **Node.js & Express 5**: Modern HTTP server serving static frontend assets and RESTful API endpoints.
- **Dynamic CORS**: Configured to securely support local development (`localhost`) and live Vercel deployments (`*.vercel.app`).
- **Caching**: 15-minute in-memory cache to prevent GitHub API rate limiting.

### Deployment & Infrastructure
- **Vercel**: Static file serving, clean URLs, and custom header security rules (`vercel.json`).
- **Render**: Node.js web service running `server.js` with integrated `/api/health` health checking (`render.yaml`).

---

## 📂 Project Structure

```text
.
├── Backend/
│   ├── package.json         # Backend dependencies (express, cors)
│   └── server.js            # Express 5 server, GitHub sync & REST routes
├── Frontend/
│   ├── assets/              # Project screenshots & images
│   ├── index.html           # Semantic HTML structure & SEO meta tags
│   ├── main.js              # Three.js canvas, data fetching & DOM rendering
│   └── style.css            # Bespoke design system & responsive styling
├── package.json             # Root scripts and workspace metadata
├── render.yaml              # Render web service configuration
├── vercel.json              # Vercel deployment routing & headers
├── .gitignore               # Ignored directories and environment files
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TusharKau275/Tushar-s-Portfolio.git
   cd Tushar-s-Portfolio
   ```

2. **Install backend dependencies**:
   ```bash
   cd Backend
   npm install
   ```

3. **Start the local server**:
   ```bash
   npm start
   ```
   Or from the project root:
   ```bash
   node Backend/server.js
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the portfolio.

---

## 🔌 API Reference

The backend provides the following REST API endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service health status check for hosting platforms |
| `/api/github` | `GET` | Live GitHub profile metrics & verified public repositories |
| `/api/projects` | `GET` | Curated project portfolio data including system specs |
| `/api/certifications`| `GET` | Verified academic & professional credentials |

---

## 🌐 Deployment

### Deploying to Render (Backend)
The project includes a pre-configured `render.yaml` blueprint:
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **Web Service** from the repo.
3. Set **Root Directory** to `Backend`.
4. Build command: `npm install`
5. Start command: `node server.js`
6. Health check path: `/api/health`

### Deploying to Vercel (Frontend)
The included `vercel.json` provides edge rewrites for hosting the static client directly on [Vercel](https://vercel.com/):
1. Import the repository into your Vercel dashboard.
2. The framework will automatically detect configuration from `vercel.json`.
3. Deploy!

---

## 👤 Author

**Tushar Kaushik**  
*Full Stack Developer & Open Source Contributor*

- **GitHub**: [@TusharKau275](https://github.com/TusharKau275)
- **LinkedIn**: [Tushar Kaushik](https://www.linkedin.com/in/tushar-kaushik-935703273)
- **Email**: [tusharkaushik275@gmail.com](mailto:tusharkaushik275@gmail.com)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
