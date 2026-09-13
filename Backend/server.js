const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Serve static frontend files if present
const frontendDir = path.join(__dirname, '../Frontend');
const hasFrontend = fs.existsSync(path.join(frontendDir, 'index.html'));
if (hasFrontend) {
  app.use(express.static(frontendDir));
}

// ─── Portfolio Data API ────────────────────────────────────────────────────────
const portfolioData = {
  name: 'Tushar Kaushik',
  role: 'Full Stack Developer',
  tagline: 'I build scalable systems, ship clean APIs, and architect backends that last.',
  about: `I'm Tushar — a Full Stack Developer with a strong focus on backend architecture, cloud infrastructure, and developer tooling. I enjoy turning complex problems into elegant, maintainable systems using Node.js, Python, Docker, and modern cloud platforms.`,
  email: 'tusharkaushik275@gmail.com',
  socials: {
    github: 'https://github.com/TusharKau275',
    linkedin: 'https://www.linkedin.com/in/tusharkaushik890/',
    twitter: 'https://twitter.com/tushar'
  },
  skills: [
    { name: 'Node.js', category: 'backend', level: 90 },
    { name: 'Express.js', category: 'backend', level: 90 },
    { name: 'JavaScript', category: 'language', level: 92 },
    { name: 'TypeScript', category: 'language', level: 80 },
    { name: 'Python', category: 'language', level: 78 },
    { name: 'MongoDB', category: 'database', level: 85 },
    { name: 'MySQL', category: 'database', level: 75 },
    { name: 'REST APIs', category: 'backend', level: 92 },
    { name: 'Docker', category: 'devops', level: 80 },
    { name: 'AWS / GCP', category: 'devops', level: 75 },
    { name: 'HTML / CSS', category: 'frontend', level: 85 },
  ],
  projects: [
    {
      id: 1,
      title: 'Aarogya — Urban Heatwave Early Warning & Monitoring System',
      subtitle: 'Ward-level heat vulnerability indexing, ML-powered risk prediction, targeted multi-channel alerts, and real-time monitoring for Jaipur, India.',
      description: 'Ward-level heat vulnerability indexing, ML-powered risk prediction, targeted multi-channel alerts, and real-time monitoring for Jaipur, India. Integrates Google Earth Engine satellite LST, 72h Open-Meteo forecasts, XGBoost ML pipeline, and automated Twilio SMS alert dispatch.',
      tech: ['Python', 'FastAPI', 'XGBoost', 'Google Earth Engine', 'React 18', 'Express.js', 'MongoDB', 'Twilio SMS', 'Leaflet', 'Docker'],
      github: 'https://github.com/TusharKau275/HEATWAVE-PROJECT',
      live: 'https://heatwave-project-2.onrender.com/',
      image: 'assets/aarogya-preview.png',
      badge: 'FLAGSHIP · LIVE SYSTEM',
      featured: true,
      details: {
        problem: "Heatwaves are India's deadliest natural disaster — killing more people annually than floods, cyclones, and earthquakes combined. Yet every warning today is generic and city-wide: a slum resident with no fan and an office worker with AC receive the same alert. There is no ward-level targeting, no vulnerability weighting, and no feedback loop to measure response effectiveness.",
        solution: "Aarogya is a full-stack heatwave early warning system that asks three questions per ward: (1) Who lives here? — Demographics, elderly %, outdoor workers, green cover (Heat Vulnerability Index); (2) How hot will it get? — MODIS satellite LST + Open-Meteo 72-hour weather + XGBoost ML predictions; (3) What should we do about it? — Automated, targeted SMS/voice alerts only to at-risk wards, with cooling center routing. Same forecast → different vulnerability → different risk tier → different response.",
        architecture: [
          { layer: "DATA INGESTION LAYER", desc: "Google Earth Engine (MODIS LST) · Open-Meteo (72hr hourly weather) · Census/Ward Demographics · GeoJSON Ward Boundaries" },
          { layer: "AI / ML SERVICE (FastAPI)", desc: "XGBoost Pipeline (trained on Jaipur historical data 2009–2023) · TemporalFeatureEngineer (72hr rolling stats, lag features, diurnal range) · 3-class prediction (Low, Mild, Extreme) · GEE satellite temp injection" },
          { layer: "BACKEND API (Express.js)", desc: "Ward CRUD · DailyRisk · Alert Logs · Resources · Feedback · node-cron Watcher (30s) → Twilio SMS dispatch · Deduplicated alerts · Live demo simulation trigger" },
          { layer: "FRONTEND DASHBOARD (React + Vite)", desc: "Authority Dashboard · Interactive Risk Map (Leaflet) · Alert Management · Recharts Analytics · Shelters & Cooling Centers · Emergency Response · Live/Demo Data Stream Toggle" }
        ],
        features: [
          "🤖 XGBoost Classification Pipeline trained on Jaipur historical weather data (2009–2023)",
          "🛰️ Google Earth Engine integration — live MODIS satellite Land Surface Temperature injected into predictions with Open-Meteo fallback",
          "🗺️ Leaflet-based ward map with color-coded risk tiers (Low → Moderate → Severe → Extreme) and interactive ward polygon popups",
          "🚨 Automated Twilio SMS dispatch via node-cron (30-second intervals) with deduplicated ward/date routing",
          "📊 Authority Dashboard & Analytics — cooling centers, water stations, medical camps, and response readiness tracking",
          "🔄 Live ↔ Demo simulation switcher for peak summer heatwave scenarios (45°C benchmark) and per-ward stress testing"
        ],
        techStack: [
          { layer: "Satellite Data", tech: "Google Earth Engine (MODIS/061/MOD11A1)", purpose: "Live Land Surface Temperature" },
          { layer: "Weather Forecast", tech: "Open-Meteo API", purpose: "72-hour hourly weather (free, no API key)" },
          { layer: "ML Pipeline", tech: "XGBoost + scikit-learn + Pandas + NumPy", purpose: "Heatwave classification (3-class)" },
          { layer: "AI Service", tech: "FastAPI + Uvicorn", purpose: "ML prediction API (port 8000)" },
          { layer: "Backend API", tech: "Express.js + Mongoose", purpose: "REST API + alert dispatch (port 5000)" },
          { layer: "Database", tech: "MongoDB Atlas", purpose: "Wards, risks, alerts, resources, feedback" },
          { layer: "SMS Alerts", tech: "Twilio", purpose: "Automated SMS to at-risk ward recipients" },
          { layer: "Push Notifications", tech: "Firebase Cloud Messaging", purpose: "Mobile push alerts" },
          { layer: "Frontend", tech: "React 18 + Vite + Tailwind CSS v4 + Framer Motion", purpose: "SPA dashboard & citizen UI" },
          { layer: "Maps & Visuals", tech: "Leaflet + react-leaflet + Recharts", purpose: "Interactive ward risk map & analytics" },
          { layer: "Containerization", tech: "Docker", purpose: "Production containers for AI + Backend" }
        ]
      }
    },
    {
      id: 2,
      title: 'Project Beta',
      description: ' NOT UPDATED YET',
      tech: [],
      github: '',
      live: null,
      featured: true
    },
    {
      id: 3,
      title: 'Project Gamma',
      description: ' NOT UPDATED YET',
      tech: [],
      github: '',
      live: null,
      featured: true
    }
  ],
  certifications: [
    {
      id: 1,
      title: 'IICT AI AND ML Certification',
      issuer: 'IICT',
      year: '2026',
      icon: 'gcp'
    },
    {
      id: 2,
      title: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: 'aws'
    },
    {
      id: 3,
      title: 'Node.js Application Developer',
      issuer: 'OpenJS Foundation',
      year: '2023',
      icon: 'nodejs'
    }
  ]
};

// ─── Health Check & API Routes ───────────────────────────────────────────────
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'tushar-portfolio-backend'
  });
});

app.get(['/api/portfolio', '/portfolio'], (req, res) => {
  res.json({ success: true, data: portfolioData });
});

app.get(['/api/skills', '/skills'], (req, res) => {
  res.json({ success: true, data: portfolioData.skills });
});

app.get(['/api/projects', '/projects'], (req, res) => {
  res.json({ success: true, data: portfolioData.projects });
});

app.get(['/api/certifications', '/certifications'], (req, res) => {
  res.json({ success: true, data: portfolioData.certifications });
});

// Fallback: serve index.html if frontend directory exists, otherwise show API info
app.use((req, res) => {
  if (hasFrontend) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    res.status(200).json({
      message: "Tushar Kaushik's Portfolio API is live",
      endpoints: {
        health: '/api/health',
        portfolio: '/api/portfolio',
        skills: '/api/skills',
        projects: '/api/projects',
        certifications: '/api/certifications'
      }
    });
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Tushar's Portfolio Server running on port ${PORT}\n`);
});
