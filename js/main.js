/* ============================================================
   GSAP + ScrollTrigger
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   1. LOAD — Name letters stagger in
   ============================================================ */
window.addEventListener('load', () => {

  // Set initial states
  gsap.set('#h-photo', { y: '115vh' });
  gsap.set('.w-c', { opacity: 0, y: 60, scale: 0.6, filter: 'blur(12px)' });

  // Animate name letters
  gsap.to('.h-c', {
    opacity: 1,
    y: 0,
    stagger: 0.045,
    duration: 0.9,
    ease: 'power4.out',
    delay: 0.2,
  });

  // Fade in scroll hint
  gsap.fromTo('#scroll-hint',
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 1, delay: 1.6, ease: 'power2.out' }
  );
});

/* ============================================================
   2. HERO SCROLL — Photo reveal + WHO? appearance
   ============================================================ */
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero-scroll',
    pin: '#hero-pin',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});

// Phase 1 (0–45%): Photo rises up from below
heroTl.to('#h-photo', {
  y: 0,
  duration: 45,
  ease: 'none',
}, 0);

// Hide scroll hint immediately on scroll
heroTl.to('#scroll-hint', {
  opacity: 0,
  duration: 6,
}, 0);

// Phase 2 (40–62%): Name fades to ghost
heroTl.to('#h-name', {
  opacity: 0.1,
  duration: 20,
}, 40);

// Phase 2b (45–65%): Photo slightly settles
heroTl.to('#h-photo', {
  y: -10,
  duration: 20,
}, 45);

// Phase 3 (60–80%): WHO? letters burst in
heroTl.to('#h-who', {
  opacity: 1,
  duration: 3,
}, 60);

heroTl.to('.w-c', {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
  stagger: 0.05,
  duration: 12,
  ease: 'back.out(1.4)',
}, 62);

// Phase 4 (75–100%): Photo fades, WHO? scales slightly
heroTl.to('#h-photo', {
  opacity: 0,
  y: 30,
  duration: 20,
}, 75);

heroTl.to('#h-who', {
  scale: 1.04,
  duration: 25,
}, 75);

/* ============================================================
   3. SHAPE PARALLAX — scroll-driven movement at different rates
   ============================================================ */
// Shape 1 (bottom-left) — moves up slowly, slight rotate
gsap.to('.g-b1', {
  yPercent: -25,
  rotation: 8,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 2,
  }
});

// Shape 2 (top-right) — moves down slightly, opposite direction
gsap.to('.g-b2', {
  yPercent: 18,
  rotation: -6,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 3,
  }
});

// Shape 3 (center-right) — moves up faster, drifts left
gsap.to('.g-b3', {
  yPercent: -40,
  xPercent: -8,
  rotation: 12,
  ease: 'none',
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});

/* ============================================================
   4. HORIZONTAL SCROLL
   ============================================================ */
gsap.to('#hx-track', {
  xPercent: -100 * 2, // 3 panels → move 2 widths
  ease: 'none',
  scrollTrigger: {
    trigger: '#hx-wrap',
    pin: '#hx-pin',
    start: 'top top',
    end: () => '+=' + (window.innerWidth * 2),
    scrub: 1,
    anticipatePin: 1,
  }
});

/* ============================================================
   5. SECTION 007 ENTRANCE
   ============================================================ */
gsap.fromTo('.s007-inner > *',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#s007',
      start: 'top 70%',
      once: true,
    }
  }
);

/* ============================================================
   6. PERSONA SELECTOR LOGIC
   ============================================================ */
const purposeOptions = {
  'recruiter': [
    { value: 'check-experience',  label: 'Check my experience' },
    { value: 'see-my-work',       label: 'See my work' },
    { value: 'download-cv',       label: 'Download my CV' },
  ],
  'hiring-manager': [
    { value: 'review-case-studies', label: 'Review case studies' },
    { value: 'see-process',         label: 'See my process' },
    { value: 'understand-expertise', label: 'Understand expertise' },
  ],
  'design-director': [
    { value: 'see-thinking',         label: 'See my design thinking' },
    { value: 'review-work',          label: 'Review my work' },
    { value: 'discuss-collaboration', label: 'Discuss collaboration' },
  ],
  'designer': [
    { value: 'explore-portfolio', label: 'Explore portfolio' },
    { value: 'mentoring',         label: 'Learn about mentoring' },
    { value: 'just-browsing',     label: 'Just browsing' },
  ],
};

const personaRoutes = {
  'recruiter':       'recruiter.html',
  'hiring-manager':  'hiring-manager.html',
  'design-director': 'design-director.html',
  'designer':        'designer.html',
};

const personaSel = document.getElementById('persona-select');
const purposeSel = document.getElementById('purpose-select');
const exploreBtn = document.getElementById('explore-btn');

personaSel.addEventListener('change', () => {
  const val = personaSel.value;
  purposeSel.innerHTML = '<option value="">Select</option>';
  purposeSel.disabled = !val;
  exploreBtn.disabled = true;
  if (val && purposeOptions[val]) {
    purposeOptions[val].forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      purposeSel.appendChild(o);
    });
  }
});

purposeSel.addEventListener('change', () => {
  exploreBtn.disabled = !purposeSel.value;
});

exploreBtn.addEventListener('click', () => {
  const persona = personaSel.value;
  if (persona && personaRoutes[persona]) {
    window.location.href = personaRoutes[persona];
  }
});
