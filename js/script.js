/*
   PORTFOLIO SCRIPT
   Fetches data.json and dynamically renders every section of the page.
   Organized into: data loading, render functions, navigation behavior,
   scroll effects, and form handling.
    */

document.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * Entry point. Fetches the JSON data source and kicks off rendering.
 * Any fetch/parsing failure is caught and shown to the user instead of
 * silently leaving the page blank.
 */
async function init() {
  try {
    const response = await fetch('data.json');

    if (!response.ok) {
      throw new Error(`Failed to load data.json (status ${response.status})`);
    }

    const data = await response.json();

    renderNavigation(data.navigation);
    renderHero(data.personal);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderEducation(data.education);
    renderContact(data.contact);
    renderFooterYear();

    setupMobileMenu();
    setupActiveNavHighlighting();
    setupFadeInOnScroll();
    setupContactForm();

  } catch (error) {
    console.error('Error loading portfolio data:', error);
    showLoadError();
  }
}

/**
 * Displays a simple, user-facing fallback message if data.json fails to load.
 */
function showLoadError() {
  const main = document.querySelector('main');
  if (!main) return;

  const notice = document.createElement('p');
  notice.textContent = 'Something went wrong while loading this page. Please refresh and try again.';
  notice.style.textAlign = 'center';
  notice.style.padding = '4rem 1rem';
  main.prepend(notice);
}

/*
   RENDER: NAVIGATION
    */
function renderNavigation(navItems = []) {
  const navList = document.getElementById('nav-list');
  if (!navList) return;

  navList.innerHTML = navItems.map(item => `
    <li>
      <a href="#${item.target}" data-target="${item.target}">${item.label}</a>
    </li>
  `).join('');
}

/*
   RENDER: HERO
    */
function renderHero(personal = {}) {
  const heroContent = document.getElementById('hero-content');
  const codeWindow = document.getElementById('code-window-body');
  if (!heroContent) return;

  // Build the profile photo block if a photo path is provided in the JSON.
  // Falls back to a plain initials badge if the photo is missing or fails to load.
  const photoBlock = personal.photo
    ? `<img src="${personal.photo}" alt="Profile photo of ${personal.fullName || 'the author'}" class="hero-avatar" />`
    : `<div class="hero-avatar hero-avatar-fallback">${getInitials(personal.fullName)}</div>`;

  heroContent.innerHTML = `
    ${photoBlock}
    <span class="hero-kicker">Available for opportunities</span>
    <h1 class="hero-name">${personal.fullName || ''}</h1>
    <p class="hero-role">${personal.role || ''}</p>
    <p class="hero-intro">${personal.introduction || ''}</p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary">View Projects</a>
      <a href="#contact" class="btn btn-outline">Contact Me</a>
    </div>
  `;

  // Signature visual: a mock JSON snippet echoing the same data,
  // reinforcing the "JSON-driven" concept of the site itself.
  if (codeWindow) {
    codeWindow.innerHTML =
`<span class="punct">{</span>
  <span class="key">"name"</span><span class="punct">:</span> <span class="string">"${personal.fullName || ''}"</span><span class="punct">,</span>
  <span class="key">"role"</span><span class="punct">:</span> <span class="string">"${personal.role || ''}"</span><span class="punct">,</span>
  <span class="key">"status"</span><span class="punct">:</span> <span class="string">"learning"</span>
<span class="punct">}</span>`;
  }
}

/**
 * Small helper: returns the uppercase initials from a full name,
 * e.g. "Prian Andrei Gallardo" -> "PG".
 */
function getInitials(fullName = '') {
  return fullName
    .split(' ')
    .filter(part => part && !part.includes('.'))
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

/*
   RENDER: ABOUT
    */
function renderAbout(about = {}) {
  const aboutGrid = document.getElementById('about-grid');
  if (!aboutGrid) return;

  const interests = (about.interests || [])
    .map(interest => `<li>${interest}</li>`)
    .join('');

  aboutGrid.innerHTML = `
    <div class="about-card fade-in">
      <h3>Background</h3>
      <p>${about.biography || ''}</p>
      <p>${about.background || ''}</p>
    </div>
    <div class="about-card fade-in">
      <h3>Interests</h3>
      <ul class="interest-list">${interests}</ul>
    </div>
    <div class="about-card fade-in">
      <h3>Why BSIT</h3>
      <p>${about.whyBSIT || ''}</p>
    </div>
    <div class="about-card fade-in">
      <h3>Career Goals</h3>
      <p>${about.careerGoals || ''}</p>
    </div>
  `;
}

/*
   RENDER: SKILLS
    */
function renderSkills(skills = {}) {
  const technicalContainer = document.getElementById('technical-skills');
  const softContainer = document.getElementById('soft-skills');

  if (technicalContainer) {
    technicalContainer.innerHTML = (skills.technical || []).map(skill => `
      <div class="skill-card fade-in">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${skill.level || ''}</span>
        <span class="skill-meter" aria-hidden="true">
          <span class="skill-meter-fill" data-level="${(skill.level || '').toLowerCase()}"></span>
        </span>
      </div>
    `).join('');
  }

  if (softContainer) {
    softContainer.innerHTML = (skills.soft || []).map(skill => `
      <span class="tag">${skill}</span>
    `).join('');
  }
}

/*
   RENDER: PROJECTS
    */
function renderProjects(projects = []) {
  const projectsGrid = document.getElementById('projects-grid');
  if (!projectsGrid) return;

  projectsGrid.innerHTML = projects.map(project => {
    const techTags = (project.technologies || [])
      .map(tech => `<span>${tech}</span>`)
      .join('');

    // Project image with graceful fallback if the image path is missing
    const imageBlock = project.image
      ? `<img src="${project.image}" alt="Thumbnail for ${project.title}" class="project-image" loading="lazy" />`
      : '';

    return `
      <article class="project-card fade-in">
        ${imageBlock}
        <div class="project-body">
          <span class="project-category">${project.category || ''}</span>
          <h3>${project.title || ''}</h3>
          <p>${project.description || ''}</p>
          <div class="project-tech">${techTags}</div>
          <a href="${project.link || '#'}" class="project-link">View Project</a>
        </div>
      </article>
    `;
  }).join('');
}

/*
   RENDER: EDUCATION
    */
function renderEducation(education = []) {
  const timeline = document.getElementById('education-timeline');
  if (!timeline) return;

  timeline.innerHTML = education.map(item => `
    <div class="timeline-item fade-in">
      <span class="timeline-period">${item.period || item.yearLevel || ''}</span>
      <h3>${item.school || ''}</h3>
      <p class="timeline-program">${item.program || ''}${item.yearLevel ? ' &middot; ' + item.yearLevel : ''}</p>
      <p>${item.experience || ''}</p>
    </div>
  `).join('');
}

/*
   RENDER: CONTACT
    */
function renderContact(contact = {}) {
  const contactDetails = document.getElementById('contact-details');
  if (!contactDetails) return;

  const socialLinks = (contact.social || []).map(item => `
    <a href="${item.url}" class="contact-link" target="_blank" rel="noopener noreferrer">${item.platform}</a>
  `).join('');

  contactDetails.innerHTML = `
    <a href="mailto:${contact.email || ''}" class="contact-link">${contact.email || ''}</a>
    ${socialLinks}
  `;
}

/*
   RENDER: FOOTER YEAR (auto-updates to the current year)
    */
function renderFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/*
   BEHAVIOR: MOBILE MENU
    */
function setupMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is clicked
  nav.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/*
   BEHAVIOR: ACTIVE SECTION HIGHLIGHTING
    */
function setupActiveNavHighlighting() {
  const sections = document.querySelectorAll('main .section[id]');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.target === id);
        });
      }
    });
  }, {
    rootMargin: '-45% 0px -50% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/*
   BEHAVIOR: FADE-IN ON FIRST APPEARANCE
    */
function setupFadeInOnScroll() {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

/*
   BEHAVIOR: CONTACT FORM (front-end only, no backend)
    */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    if (!name) {
      status.textContent = 'Please fill in all fields before sending.';
      return;
    }

    status.textContent = `Thanks, ${name}! Your message has been noted (no server is connected yet).`;
    form.reset();
  });
}
