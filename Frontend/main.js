/* ============================================================
   TUSHAR KAUSHIK — PORTFOLIO · main.js
   Three.js 3D hero · API data fetch · Scroll reveal · Nav
   ============================================================ */

'use strict';

/* ─── CONFIG ──────────────────────────────────────────────── */
let metaBackendUrl = document.querySelector('meta[name="backend-api-url"]')?.getAttribute('content')?.trim() || '';
if (metaBackendUrl) {
  metaBackendUrl = metaBackendUrl.replace(/\/+$/, '');
  if (!metaBackendUrl.endsWith('/api')) {
    metaBackendUrl += '/api';
  }
  try {
    const parsed = new URL(metaBackendUrl, window.location.href);
    if (parsed.origin === window.location.origin) {
      metaBackendUrl = '/api';
    }
  } catch (e) {
    // Ignore invalid URL
  }
}

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// When running on localhost, always talk to local API
// In production, use metaBackendUrl if specified, or default to '/api'
const API_BASE = window.__API_BASE__
  || (isLocalhost
    ? (window.location.port === '3000' ? '/api' : 'http://localhost:3000/api')
    : (metaBackendUrl || '/api'));

let cachedProjects = [];


/* ─── THREE.JS 3D HERO ────────────────────────────────────── */
(function initThreeHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* Respect reduced motion */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 4);

  /* ── Wireframe sphere (the main 3D element) ── */
  const geoSphere = new THREE.IcosahedronGeometry(1.4, 3);
  const matWire   = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });
  const sphere = new THREE.Mesh(geoSphere, matWire);
  scene.add(sphere);

  /* ── Inner solid sphere for depth ── */
  const geoInner = new THREE.SphereGeometry(1.38, 32, 32);
  const matInner = new THREE.MeshBasicMaterial({
    color: 0x09090b,
    transparent: true,
    opacity: 0.6,
  });
  const innerSphere = new THREE.Mesh(geoInner, matInner);
  scene.add(innerSphere);

  /* ── Particle field ── */
  const PARTICLE_COUNT = 180;
  const particleGeo   = new THREE.BufferGeometry();
  const positions      = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 0.022,
    transparent: true,
    opacity: 0.55,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Ring accent ── */
  const geoRing = new THREE.TorusGeometry(1.9, 0.008, 8, 80);
  const matRing = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.18 });
  const ring    = new THREE.Mesh(geoRing, matRing);
  ring.rotation.x = Math.PI * 0.35;
  scene.add(ring);

  /* ── Mouse tracking ── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ── */
  function onResize() {
    const heroEl = document.getElementById('hero');
    const w = heroEl ? heroEl.clientWidth : window.innerWidth;
    const h = heroEl ? Math.min(heroEl.clientHeight || window.innerHeight, window.innerHeight) : window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / (h || 1);
    camera.updateProjectionMatrix();

    // Position sphere on right side on desktop so it nicely balances hero text
    if (w > 900) {
      sphere.position.x = 0.85;
      innerSphere.position.x = 0.85;
      ring.position.x = 0.85;
      particles.position.x = 0.35;
    } else {
      sphere.position.x = 0;
      innerSphere.position.x = 0;
      ring.position.x = 0;
      particles.position.x = 0;
    }
  }
  window.addEventListener('resize', onResize);
  onResize();

  /* ── Animate ── */
  let frame = 0;
  function tick() {
    requestAnimationFrame(tick);
    frame += 0.005;

    if (!reducedMotion) {
      /* Lerp toward mouse */
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      sphere.rotation.y = frame + targetX * 0.4;
      sphere.rotation.x = frame * 0.3 + targetY * 0.3;
      innerSphere.rotation.copy(sphere.rotation);

      ring.rotation.z    = frame * 0.2;
      particles.rotation.y = frame * 0.05;
      particles.rotation.x = frame * 0.02;
    }

    renderer.render(scene, camera);
  }
  tick();
})();


/* ─── NAV SCROLL STATE ────────────────────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });

  /* Close mobile menu on link click */
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
})();


/* ─── INTERSECTION OBSERVER (scroll reveal) ───────────────── */
let revealObserver = null;

function refreshRevealObserver() {
  if (typeof IntersectionObserver === 'undefined') {
    document.querySelectorAll('.reveal-el, .skill-pill, .project-card, .cert-card')
      .forEach(el => {
        el.classList.add('visible');
        const bar = el.querySelector('.skill-pill__bar-fill');
        if (bar && bar.dataset.level) bar.style.width = bar.dataset.level + '%';
      });
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const siblings = el.parentElement ? el.parentElement.querySelectorAll(`.${el.classList[0]}`) : [el];
          let idx = 0;
          siblings.forEach((s, i) => { if (s === el) idx = i; });
          el.style.transitionDelay = `${idx * 60}ms`;
          el.classList.add('visible');
          const bar = el.querySelector('.skill-pill__bar-fill');
          if (bar && bar.dataset.level) bar.style.width = bar.dataset.level + '%';
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.05, rootMargin: '40px' });
  }

  document.querySelectorAll('.reveal-el:not(.visible), .skill-pill:not(.visible), .project-card:not(.visible), .cert-card:not(.visible)')
    .forEach(el => revealObserver.observe(el));
}

// Initial observer attachment for static elements
refreshRevealObserver();


/* ─── DATA RENDERING HELPERS ──────────────────────────────── */
function githubIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>`;
}
function externalIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>`;
}
function specIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>`;
}

const SOCIAL_ICONS = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.84L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
};

const CERT_ICONS = {
  python:     'https://cdn.simpleicons.org/python/3776AB',
  cplusplus:  'https://cdn.simpleicons.org/cplusplus/00599C',
  gcp:        'https://cdn.simpleicons.org/googlecloud/4285F4',
  aws:        'https://cdn.simpleicons.org/amazonaws/FF9900',
  nodejs:     'https://cdn.simpleicons.org/nodedotjs/339933',
};


/* ─── DATA LOADER ─────────────────────────────────────────── */
async function loadPortfolio() {
  // 1. Immediately render default content so page sections are NEVER blank
  renderFallback();
  refreshRevealObserver();

  // 2. Fetch fresh live data from API
  try {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error('API error or invalid format');
    const data = json.data;

    /* ── About ── */
    const aboutBody = document.getElementById('about-body');
    if (aboutBody && data.about) aboutBody.textContent = data.about;

    /* ── Skills ── */
    if (Array.isArray(data.skills) && data.skills.length) {
      renderSkills(data.skills);
    }

    /* ── Projects ── */
    if (Array.isArray(data.projects) && data.projects.length) {
      renderProjects(data.projects);
    }

    /* ── Certifications ── */
    if (Array.isArray(data.certifications) && data.certifications.length) {
      renderCerts(data.certifications);
    }

    /* ── Live GitHub & LinkedIn Stats ── */
    if (data.avatar_url) {
      const avatarEl = document.getElementById('about-avatar');
      if (avatarEl) avatarEl.src = data.avatar_url;
    }
    if (data.githubStats) {
      const reposEl = document.getElementById('fact-repos');
      if (reposEl && data.githubStats.public_repos !== undefined) {
        reposEl.textContent = data.githubStats.public_repos;
      }
      const communityEl = document.getElementById('fact-community');
      if (communityEl && data.githubStats.company) {
        communityEl.textContent = data.githubStats.company.replace('@', '');
      }
    }
    if (Array.isArray(data.certifications)) {
      const certsEl = document.getElementById('fact-certs');
      if (certsEl) certsEl.textContent = data.certifications.length;
    }

    /* ── Footer socials ── */
    if (data.socials) {
      renderSocials(data.socials, data.email);
    }

    /* ── Update email links ── */
    if (data.email) {
      document.querySelectorAll('[href="mailto:tushar@example.com"]').forEach(el => {
        el.href = `mailto:${data.email}`;
      });
      const footerEmail = document.getElementById('footer-email');
      if (footerEmail) { footerEmail.href = `mailto:${data.email}`; footerEmail.textContent = data.email; }
    }

    refreshRevealObserver();
  } catch (err) {
    console.info('Using bundled portfolio data (API unavailable or sleeping):', err.message || err);
  } finally {
    // Safety reveal: guarantees every card becomes visible even if observer is delayed or missed
    setTimeout(() => {
      document.querySelectorAll('.skill-pill:not(.visible), .project-card:not(.visible), .cert-card:not(.visible)')
        .forEach(el => {
          el.classList.add('visible');
          const bar = el.querySelector('.skill-pill__bar-fill');
          if (bar && bar.dataset.level) bar.style.width = bar.dataset.level + '%';
        });
    }, 600);
  }
}

/* ─── RENDER: SKILLS ──────────────────────────────────────── */
function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = skills.map(s => `
    <div class="skill-pill" role="listitem">
      <span class="skill-pill__name">${escHtml(s.name)}</span>
      <div class="skill-pill__bar-track" aria-hidden="true">
        <div class="skill-pill__bar-fill" data-level="${s.level}"></div>
      </div>
      <span class="skill-pill__cat">${escHtml(s.category)}</span>
    </div>
  `).join('');
}

/* ─── RENDER: PROJECTS ────────────────────────────────────── */
function renderProjects(projects) {
  cachedProjects = projects;
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => {
    const isFeatured = p.featured || i === 0;
    return `
    <article class="project-card ${isFeatured ? 'project-card--featured' : ''}">
      ${p.image ? `
        <div class="project-card__media">
          <img src="${escHtml(p.image)}" alt="${escHtml(p.title)} preview" class="project-card__img" loading="lazy" />
          <div class="project-card__media-badge">
            <span class="pulse-dot"></span> LIVE DASHBOARD
          </div>
          <div class="project-card__media-overlay">
            ${p.live ? `<a href="${escHtml(p.live)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">${externalIcon()} Open App</a>` : ''}
            ${p.details ? `<button type="button" class="btn btn--ghost btn--sm open-spec-btn" data-project-idx="${i}">${specIcon()} Architecture</button>` : ''}
          </div>
        </div>
      ` : ''}
      <div class="project-card__top">
        <span class="project-card__num">0${i + 1}</span>
        ${p.badge ? `<span class="project-badge"><span class="pulse-dot"></span>${escHtml(p.badge)}</span>` : ''}
      </div>
      <h3 class="project-card__title">${escHtml(p.title)}</h3>
      <p class="project-card__desc">${escHtml(p.description)}</p>
      <div class="project-card__tech">
        ${p.tech.map(t => `<span class="tech-tag">${escHtml(t)}</span>`).join('')}
      </div>
      <div class="project-card__links">
        ${p.github ? `<a href="${escHtml(p.github)}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View ${escHtml(p.title)} on GitHub">${githubIcon()} GitHub</a>` : ''}
        ${p.live   ? `<a href="${escHtml(p.live)}"   class="project-link project-link--live" target="_blank" rel="noopener noreferrer" aria-label="View live demo of ${escHtml(p.title)}">${externalIcon()} Live Demo</a>` : ''}
        ${p.details ? `<button type="button" class="project-link project-link--btn open-spec-btn" data-project-idx="${i}">${specIcon()} Architecture & Specs</button>` : ''}
        ${!p.github && !p.live && !p.details ? `<span class="project-link" style="opacity:0.4;cursor:default">Private repository</span>` : ''}
      </div>
    </article>
  `}).join('');

  // Attach click listeners for "Specs & Architecture" modal buttons
  grid.querySelectorAll('.open-spec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.projectIdx, 10);
      if (cachedProjects[idx]) {
        openProjectModal(cachedProjects[idx]);
      }
    });
  });
}

/* ─── MODAL: PROJECT SPECS & ARCHITECTURE ─────────────────── */
function openProjectModal(p) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  const d = p.details || {};
  const arch = d.architecture || [];
  const features = d.features || [];
  const stack = d.techStack || [];

  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-header__meta">
        ${p.badge ? `<span class="project-badge"><span class="pulse-dot"></span>${escHtml(p.badge)}</span>` : ''}
        <span class="modal-eyebrow">SYSTEM ARCHITECTURE & CASE STUDY</span>
      </div>
      <h2 class="modal-title" id="modal-title">${escHtml(p.title)}</h2>
      <p class="modal-subtitle">${escHtml(p.subtitle || p.description)}</p>
      
      <div class="modal-actions">
        ${p.live ? `<a href="${escHtml(p.live)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">${externalIcon()} Launch Live System</a>` : ''}
        ${p.github ? `<a href="${escHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm">${githubIcon()} View GitHub Repository</a>` : ''}
      </div>
    </div>

    ${p.image ? `
      <div class="modal-hero-img">
        <img src="${escHtml(p.image)}" alt="${escHtml(p.title)} full dashboard preview" />
      </div>
    ` : ''}

    <div class="modal-body">
      ${d.problem ? `
        <div class="modal-card modal-card--problem">
          <h3 class="modal-card__title">💡 The Problem</h3>
          <p class="modal-card__text">${escHtml(d.problem)}</p>
        </div>
      ` : ''}

      ${d.solution ? `
        <div class="modal-card modal-card--solution">
          <h3 class="modal-card__title">🎯 Our Solution</h3>
          <p class="modal-card__text">${escHtml(d.solution)}</p>
        </div>
      ` : ''}

      ${arch.length ? `
        <div class="modal-section">
          <h3 class="modal-section__title">🏗️ System Architecture Flow</h3>
          <div class="arch-flow">
            ${arch.map((layer, idx) => `
              <div class="arch-node">
                <div class="arch-node__badge">STAGE 0${idx + 1}</div>
                <div class="arch-node__content">
                  <h4 class="arch-node__title">${escHtml(layer.layer)}</h4>
                  <p class="arch-node__desc">${escHtml(layer.desc)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${features.length ? `
        <div class="modal-section">
          <h3 class="modal-section__title">✨ Key Engineering Features</h3>
          <ul class="modal-feature-grid">
            ${features.map(f => `
              <li class="modal-feature-item">
                <span class="feature-bullet">▸</span>
                <span>${escHtml(f)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${stack.length ? `
        <div class="modal-section">
          <h3 class="modal-section__title">🛠️ Full Production Tech Stack</h3>
          <div class="modal-table-wrap">
            <table class="modal-table">
              <thead>
                <tr>
                  <th>Layer</th>
                  <th>Technology</th>
                  <th>Core Purpose</th>
                </tr>
              </thead>
              <tbody>
                ${stack.map(row => `
                  <tr>
                    <td class="modal-table__layer">${escHtml(row.layer)}</td>
                    <td class="modal-table__tech"><code>${escHtml(row.tech)}</code></td>
                    <td class="modal-table__purpose">${escHtml(row.purpose)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </div>

    <div class="modal-footer">
      <div class="modal-footer__links">
        ${p.github ? `<a href="${escHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="project-link">${githubIcon()} GitHub</a>` : ''}
        ${p.live ? `<a href="${escHtml(p.live)}" target="_blank" rel="noopener noreferrer" class="project-link project-link--live">${externalIcon()} Live Deployed Link</a>` : ''}
      </div>
      <button type="button" class="btn btn--outline btn--sm" id="modal-close-btn">Close Modal</button>
    </div>
  `;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Modal listeners
(function initModalListeners() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  if (backdrop) backdrop.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });
})();

/* ─── RENDER: CERTIFICATIONS ──────────────────────────────── */
function renderCerts(certs) {
  const grid = document.getElementById('certs-grid');
  if (!grid) return;
  grid.innerHTML = certs.map(c => `
    <div class="cert-card">
      <div class="cert-card__icon">
        <img src="${CERT_ICONS[c.icon] || CERT_ICONS.python}" alt="${escHtml(c.issuer)} logo" width="26" height="26" />
      </div>
      <div class="cert-card__body">
        <h3 class="cert-card__title">${escHtml(c.title)}</h3>
        <p class="cert-card__issuer">${escHtml(c.issuer)}</p>
        <div class="cert-card__meta">
          <span class="cert-card__year">${escHtml(c.year)}</span>
          ${c.credentialId ? `<span class="cert-card__id">ID: <code>${escHtml(c.credentialId)}</code></span>` : ''}
        </div>
        ${c.skills ? `<p class="cert-card__skills"><span class="cert-card__skills-label">Skills:</span> ${escHtml(c.skills)}</p>` : ''}
      </div>
    </div>
  `).join('');
}

/* ─── RENDER: SOCIALS ─────────────────────────────────────── */
function renderSocials(socials, email) {
  const container = document.getElementById('footer-socials');
  if (!container) return;
  const links = [];
  if (socials.github)   links.push({ href: socials.github,   label: 'GitHub',   icon: SOCIAL_ICONS.github });
  if (socials.linkedin) links.push({ href: socials.linkedin, label: 'LinkedIn', icon: SOCIAL_ICONS.linkedin });
  if (socials.twitter)  links.push({ href: socials.twitter,  label: 'Twitter/X',icon: SOCIAL_ICONS.twitter });
  container.innerHTML = links.map(l => `
    <a href="${escHtml(l.href)}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${escHtml(l.label)}">
      ${l.icon}
    </a>
  `).join('');
}

/* ─── FALLBACK (if API is down) ───────────────────────────── */
function renderFallback() {
  const aboutBody = document.getElementById('about-body');
  if (aboutBody) aboutBody.textContent = "I'm Tushar — a Full Stack Developer with a strong focus on backend architecture, cloud infrastructure, and developer tooling.";

  renderSkills([
    { name: 'Node.js', category: 'backend', level: 90 },
    { name: 'Express.js', category: 'backend', level: 90 },
    { name: 'JavaScript', category: 'language', level: 92 },
    { name: 'TypeScript', category: 'language', level: 80 },
    { name: 'Python', category: 'language', level: 78 },
    { name: 'MongoDB', category: 'database', level: 85 },
    { name: 'MySQL', category: 'database', level: 80 },
    { name: 'Docker', category: 'devops', level: 80 },
    { name: 'AWS / GCP', category: 'devops', level: 75 },
    { name: 'REST APIs', category: 'backend', level: 92 },
    { name: 'HTML / CSS', category: 'frontend', level: 85 },
  ]);

  renderProjects([
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
      name: 'FAKE-NEWS-DETECTION-ML-PROJECT',
      title: 'Fake News Detection — Machine Learning NLP Classifier',
      subtitle: 'Natural Language Processing and supervised classification pipeline for real-time disinformation filtering.',
      description: 'Supervised NLP pipeline in Python utilizing TF-IDF vectorization and machine learning classifiers to detect, evaluate, and categorize fraudulent news articles and web propaganda.',
      tech: ['Python', 'Scikit-Learn', 'NLP', 'Pandas', 'NumPy', 'TF-IDF'],
      github: 'https://github.com/TusharKau275/FAKE-NEWS-DETECTION-ML-PROJECT',
      live: null,
      badge: 'AI / ML PROJECT',
      featured: true
    },
    {
      id: 3,
      name: 'SIET_COLLEGE_WEBSITE',
      title: 'SIET College Web Platform & Institutional Portal',
      subtitle: 'Modern responsive web portal engineered for institutional communication and student academic resources.',
      description: 'Institutional responsive web portal developed for SIET college featuring modern layouts, semantic structure, department portals, and interactive course navigation.',
      tech: ['JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
      github: 'https://github.com/TusharKau275/SIET_COLLEGE_WEBSITE',
      live: null,
      badge: 'WEB PLATFORM',
      featured: true
    },
    {
      id: 4,
      name: 'Tushar-s-Portfolio',
      title: 'Cloud-Native Developer Portfolio & API Architecture',
      subtitle: 'Decoupled full-stack portfolio with Three.js graphics, Express REST API on Render, and Edge deployment.',
      description: 'Production portfolio engineered with Three.js 3D interactive graphics, Node.js/Express backend on Render with rate-limit cached GitHub integration, and Vercel edge CDN routing.',
      tech: ['Node.js', 'Express.js', 'Three.js', 'Render', 'Vercel', 'REST APIs'],
      github: 'https://github.com/TusharKau275/Tushar-s-Portfolio',
      live: 'https://tushar-s-portfolio.onrender.com/',
      badge: 'PRODUCTION APP',
      featured: true
    }
  ]);

  renderCerts([
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
  ]);

  renderSocials(
    { github:'https://github.com/TusharKau275', linkedin:'https://www.linkedin.com/in/tusharkaushik890/', twitter:'https://twitter.com/tushar' },
    'tusharkaushik275@gmail.com'
  );

  refreshRevealObserver();
}

/* ─── UTIL ────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ─── BOOT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadPortfolio);
