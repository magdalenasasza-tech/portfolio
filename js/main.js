gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   INIT — runs after all assets (fonts, images) are loaded
   ============================================================ */
window.addEventListener('load', () => {

  /* ----------------------------------------------------------
     BUILD TYPED LETTERS
     Populates #nm-rest-1 with AGDALENA, #nm-rest-2 with ENDZELEK
     Each character is a <span> so we can stagger them in
  ---------------------------------------------------------- */
  function buildTypedLetters(elId, letters) {
    const el = document.getElementById(elId);
    letters.split('').forEach(ch => {
      const s = document.createElement('span');
      s.textContent = ch;
      el.appendChild(s);
    });
  }

  buildTypedLetters('nm-rest-1', 'AGDALENA');
  buildTypedLetters('nm-rest-2', 'ENDZELEK');

  /* ----------------------------------------------------------
     INITIAL GSAP STATES
  ---------------------------------------------------------- */
  // Name block: hidden, centered via GSAP transforms
  gsap.set('#mh-block', {
    opacity: 0,
    xPercent: -50,   // shift left by 50% of own width → visual center
    yPercent: -50,   // shift up by 50% of own height → visual center
  });

  // Rest-of-name letters: invisible (will type in)
  gsap.set('#nm-rest-1 span, #nm-rest-2 span', { opacity: 0 });

  // Stickers: hidden and scaled down
  gsap.set(['#stk-a', '#stk-b', '#stk-c'], { opacity: 0, scale: 0 });

  // Photo: off-screen below
  gsap.set('#l-photo', { y: '70vh', opacity: 0 });

  /* ----------------------------------------------------------
     INTRO TIMELINE (auto-plays on load, no scroll required)

     Step 1 — MH fades in at center (only M and H visible)
     Step 2 — MH slides to the left
     Step 3 — "AGDALENA" types out letter by letter from M
     Step 4 — "ENDZELEK" types out letter by letter from H
  ---------------------------------------------------------- */
  const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 1. Fade in at center
  intro.to('#mh-block', {
    opacity: 1,
    duration: 0.7,
    ease: 'power3.out',
  });

  // Brief pause so the MH reads as a monogram
  intro.to({}, { duration: 0.5 });

  // 2. Slide from center to top-left
  intro.to('#mh-block', {
    left: '4%',
    xPercent: 0,
    duration: 1.0,
    ease: 'power3.inOut',
  });

  // 3. Type "AGDALENA" — each letter appears instantly, staggered
  intro.to('#nm-rest-1 span', {
    opacity: 1,
    duration: 0.001,
    stagger: 0.065,
    ease: 'none',
  }, '-=0.05');

  // 4. Type "ENDZELEK" — slight overlap with first line finishing
  intro.to('#nm-rest-2 span', {
    opacity: 1,
    duration: 0.001,
    stagger: 0.065,
    ease: 'none',
  }, '-=0.25');

  /* ----------------------------------------------------------
     SCROLL — stickers pop in one by one, then float
     Photo rises from the bottom
  ---------------------------------------------------------- */

  // Helper: pop sticker in with spring, then start floating loop
  function popAndFloat(id, floatY, rotation, floatDur) {
    gsap.to(id, {
      opacity: 1,
      scale: 1,
      duration: 0.55,
      ease: 'back.out(2.2)',
      onComplete: () => {
        gsap.to(id, {
          y: floatY,
          rotation: rotation,
          duration: floatDur,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      },
    });
  }

  // Sticker A appears first (shallow scroll)
  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=80 top',
    once: true,
    onEnter: () => popAndFloat('#stk-a', -13, -6, 3.3),
  });

  // Sticker B appears second
  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=220 top',
    once: true,
    onEnter: () => popAndFloat('#stk-b', -10,  7, 4.0),
  });

  // Sticker C appears third
  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=360 top',
    once: true,
    onEnter: () => popAndFloat('#stk-c', -15, -4, 3.7),
  });

  // Photo rises from below — scrubbed to scroll
  gsap.to('#l-photo', {
    y: 0,
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-zone',
      start: 'top+=350 top',
      end:   'top+=750 top',
      scrub: 1.5,
    },
  });

  /* ----------------------------------------------------------
     HORIZONTAL SCROLL — 3 panels slide sideways
  ---------------------------------------------------------- */
  gsap.to('#hx-track', {
    xPercent: -200,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hx-wrap',
      pin: '#hx-pin',
      start: 'top top',
      end: () => '+=' + (window.innerWidth * 2),
      scrub: 1,
      anticipatePin: 1,
    },
  });

  /* ----------------------------------------------------------
     PERSONA SELECTOR (007)
  ---------------------------------------------------------- */
  const purposeOptions = {
    'recruiter':       [
      { v: 'check-experience', l: 'Check my experience' },
      { v: 'see-my-work',      l: 'See my work' },
      { v: 'download-cv',      l: 'Download my CV' },
    ],
    'hiring-manager':  [
      { v: 'case-studies', l: 'Review case studies' },
      { v: 'see-process',  l: 'See my process' },
      { v: 'expertise',    l: 'Understand expertise' },
    ],
    'design-director': [
      { v: 'thinking',     l: 'See my design thinking' },
      { v: 'review-work',  l: 'Review my work' },
      { v: 'collaborate',  l: 'Discuss collaboration' },
    ],
    'designer':        [
      { v: 'explore',    l: 'Explore portfolio' },
      { v: 'mentoring',  l: 'Learn about mentoring' },
      { v: 'browsing',   l: 'Just browsing' },
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
      purposeOptions[val].forEach(o => {
        const el = document.createElement('option');
        el.value = o.v;
        el.textContent = o.l;
        purposeSel.appendChild(el);
      });
    }
  });

  purposeSel.addEventListener('change', () => {
    exploreBtn.disabled = !purposeSel.value;
  });

  exploreBtn.addEventListener('click', () => {
    const p = personaSel.value;
    if (p && personaRoutes[p]) window.location.href = personaRoutes[p];
  });

  // 007 section entrance animation
  gsap.fromTo('.s007-inner > *',
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#s007', start: 'top 70%', once: true },
    }
  );

});
