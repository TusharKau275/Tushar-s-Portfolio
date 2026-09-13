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
    }
  ],
  certifications: [
    {
      id: 1,
      title: 'AI-ML Training',
      issuer: 'Indian institute of computing and technology',
      year: 'Issued Jul 2026',
      credentialId: '',
      credentialName: 'IICT AIML Training certificate',
      skills: 'Python (Programming Language), Machine Learning',
      icon: 'python'
    },
    {
      id: 2,
      title: 'CS107: C++ Programming',
      issuer: 'Saylor University',
      year: 'Issued Jan 2026',
      credentialId: '4289665260TK',
      credentialName: 'C++ skill certificate.pdf',
      skills: 'C++',
      icon: 'cplusplus'
    }
  ]
};

// ─── Real-Time GitHub Integration & In-Memory Cache ─────────────────────────
const GITHUB_USERNAME = 'TusharKau275';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let githubCache = {
  timestamp: 0,
  user: null,
  repos: null,
};

async function fetchGitHubData() {
  const now = Date.now();
  if (githubCache.user && (now - githubCache.timestamp < CACHE_TTL_MS)) {
    return githubCache;
  }

  try {
    const headers = {
      'User-Agent': 'Tushar-Portfolio-Server',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers })
    ]);

    if (userRes.ok) {
      githubCache.user = await userRes.json();
    }
    if (reposRes.ok) {
      githubCache.repos = await reposRes.json();
    }
    githubCache.timestamp = now;
  } catch (err) {
    console.warn('GitHub API fetch error, using cached/bundled data:', err.message);
  }

  return githubCache;
}

async function getLivePortfolio() {
  const gh = await fetchGitHubData();
  const u = gh.user || {};
  const repos = gh.repos || [];

  const heatwaveRepo = repos.find(r => r.name === 'HEATWAVE-PROJECT');
  const fakeNewsRepo = repos.find(r => r.name === 'FAKE-NEWS-DETECTION-ML-PROJECT');
  const sietRepo = repos.find(r => r.name === 'SIET_COLLEGE_WEBSITE');
  const portfolioRepo = repos.find(r => r.name === 'Tushar-s-Portfolio');

  const liveProjects = [
    {
      id: 1,
      name: 'HEATWAVE-PROJECT',
      title: 'Aarogya — Urban Heatwave Early Warning & Monitoring System',
      subtitle: 'Ward-level heat vulnerability indexing, ML-powered risk prediction, targeted multi-channel alerts, and real-time monitoring for Jaipur, India.',
      description: 'Ward-level heat vulnerability indexing, ML-powered risk prediction, targeted multi-channel alerts, and real-time monitoring for Jaipur, India. Integrates Google Earth Engine satellite LST, 72h Open-Meteo forecasts, XGBoost ML pipeline, and automated Twilio SMS alert dispatch.',
      tech: ['Python', 'FastAPI', 'XGBoost', 'Google Earth Engine', 'React 18', 'Express.js', 'MongoDB', 'Twilio SMS', 'Leaflet', 'Docker'],
      github: heatwaveRepo?.html_url || 'https://github.com/TusharKau275/HEATWAVE-PROJECT',
      live: 'https://heatwave-project-2.onrender.com/',
      image: 'assets/aarogya-preview.png',
      badge: 'FLAGSHIP · LIVE SYSTEM',
      stars: heatwaveRepo?.stargazers_count ?? 0,
      forks: heatwaveRepo?.forks_count ?? 2,
      featured: true,
      details: portfolioData.projects[0].details
    },
    {
      id: 2,
      name: 'FAKE-NEWS-DETECTION-ML-PROJECT',
      title: 'Fake News Detection — Machine Learning NLP Classifier',
      subtitle: 'Natural Language Processing and supervised classification pipeline for real-time disinformation filtering.',
      description: 'Supervised NLP pipeline in Python utilizing TF-IDF vectorization and machine learning classifiers to detect, evaluate, and categorize fraudulent news articles and web propaganda.',
      tech: ['Python', 'Scikit-Learn', 'NLP', 'Pandas', 'NumPy', 'TF-IDF'],
      github: fakeNewsRepo?.html_url || 'https://github.com/TusharKau275/FAKE-NEWS-DETECTION-ML-PROJECT',
      live: null,
      badge: 'AI / ML PROJECT',
      stars: fakeNewsRepo?.stargazers_count ?? 0,
      forks: fakeNewsRepo?.forks_count ?? 0,
      featured: true
    },
    {
      id: 3,
      name: 'SIET_COLLEGE_WEBSITE',
      title: 'SIET College Web Platform & Institutional Portal',
      subtitle: 'Modern responsive web portal engineered for institutional communication and student academic resources.',
      description: 'Institutional responsive web portal developed for SIET college featuring modern layouts, semantic structure, department portals, and interactive course navigation.',
      tech: ['JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
      github: sietRepo?.html_url || 'https://github.com/TusharKau275/SIET_COLLEGE_WEBSITE',
      live: null,
      badge: 'WEB PLATFORM',
      stars: sietRepo?.stargazers_count ?? 0,
      forks: sietRepo?.forks_count ?? 0,
      featured: true
    },
    {
      id: 4,
      name: 'Tushar-s-Portfolio',
      title: 'Cloud-Native Developer Portfolio & API Architecture',
      subtitle: 'Decoupled full-stack portfolio with Three.js graphics, Express REST API on Render, and Edge deployment.',
      description: 'Production portfolio engineered with Three.js 3D interactive graphics, Node.js/Express backend on Render with rate-limit cached GitHub integration, and Vercel edge CDN routing.',
      tech: ['Node.js', 'Express.js', 'Three.js', 'Render', 'Vercel', 'REST APIs'],
      github: portfolioRepo?.html_url || 'https://github.com/TusharKau275/Tushar-s-Portfolio',
      live: 'https://tushar-s-portfolio.onrender.com/',
      badge: 'PRODUCTION APP',
      stars: portfolioRepo?.stargazers_count ?? 0,
      forks: portfolioRepo?.forks_count ?? 0,
      featured: true
    }
  ];

  return {
    ...portfolioData,
    avatar_url: u.avatar_url || 'https://avatars.githubusercontent.com/u/108011452?v=4',
    githubStats: {
      username: GITHUB_USERNAME,
      public_repos: u.public_repos ?? 7,
      followers: u.followers ?? 1,
      following: u.following ?? 5,
      company: u.company || '@gssoc',
      location: u.location || 'India',
      avatar_url: u.avatar_url || 'https://avatars.githubusercontent.com/u/108011452?v=4',
      profile_url: u.html_url || `https://github.com/${GITHUB_USERNAME}`
    },
    linkedinProfile: {
      name: 'Tushar Kaushik',
      url: 'https://www.linkedin.com/in/tusharkaushik890/',
      verifiedCertifications: portfolioData.certifications
    },
    projects: liveProjects
  };
}

// ─── Health Check & API Routes ───────────────────────────────────────────────
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'tushar-portfolio-backend'
  });
});

app.get(['/api/portfolio', '/portfolio'], async (req, res) => {
  try {
    const live = await getLivePortfolio();
    res.json({ success: true, data: live });
  } catch (err) {
    res.json({ success: true, data: portfolioData });
  }
});

app.get(['/api/github', '/github'], async (req, res) => {
  const gh = await fetchGitHubData();
  res.json({
    success: true,
    user: gh.user,
    repos: gh.repos,
    cachedAt: new Date(githubCache.timestamp).toISOString()
  });
});

app.get(['/api/skills', '/skills'], (req, res) => {
  res.json({ success: true, data: portfolioData.skills });
});

app.get(['/api/projects', '/projects'], async (req, res) => {
  try {
    const live = await getLivePortfolio();
    res.json({ success: true, data: live.projects });
  } catch (err) {
    res.json({ success: true, data: portfolioData.projects });
  }
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
        github: '/api/github',
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
