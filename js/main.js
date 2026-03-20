gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('load', () => {

  /* ----------------------------------------------------------
     BUILD TYPED LETTERS
     Fills #nm-rest-1 with AGDALENA and #nm-rest-2 with ENDZELEK.
     Each character is a <span> so GSAP can stagger them in.
     Opacity: 0 but present in DOM → container has full width
     from the start, so centering is stable throughout.
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
     INITIAL STATES
  ---------------------------------------------------------- */
  // Name block: centered via xPercent/yPercent, slightly
  // offset right so it "eases in from the right" on fade.
  // Because all letters are in DOM (opacity 0), the container
  // has full word width → M/H naturally appear left-of-center
  // which gives the "pushed slightly left" feeling.
  gsap.set('#mh-block', {
    xPercent: -50,
    yPercent: -50,
    x: 24,        // slight rightward offset — floats left as it fades in
    opacity: 0,
  });

  // Rest-of-name letters invisible
  gsap.set('#nm-rest-1 span, #nm-rest-2 span', { opacity: 0 });

  // Stickers: hidden + scaled down
  gsap.set(['#stk-a', '#stk-b', '#stk-c'], { opacity: 0, scale: 0 });

  // Photo: off-screen below
  gsap.set('#l-photo', { y: '70vh', opacity: 0 });

  // WHO? invisible
  gsap.set('.who-txt', { opacity: 0 });

  /* ----------------------------------------------------------
     INTRO TIMELINE  (auto-plays, no scroll needed)

     1 — MH fades in at center, floating slightly left as it lands
     2 — Brief pause (monogram moment)
     3 — "AGDALENA" types out from the M
     4 — "ENDZELEK" types out from the H
  ---------------------------------------------------------- */
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 1. Fade in + drift left into position
  intro.to('#mh-block', {
    opacity: 1,
    x: 0,
    duration: 1.0,
    ease: 'power3.out',
  });

  // 2. Hold as MH monogram
  intro.to({}, { duration: 0.55 });

  // 3. AGDALENA types out
  intro.to('#nm-rest-1 span', {
    opacity: 1,
    duration: 0.001,
    stagger: 0.062,
    ease: 'none',
  });

  // 4. ENDZELEK types out (starts before line 1 finishes)
  intro.to('#nm-rest-2 span', {
    opacity: 1,
    duration: 0.001,
    stagger: 0.062,
    ease: 'none',
  }, '-=0.28');

  /* ----------------------------------------------------------
     SCROLL PHASE 1 — Stickers pop in + float
  ---------------------------------------------------------- */
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

  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=80 top',
    once: true,
    onEnter: () => popAndFloat('#stk-a', -13, -6, 3.3),
  });

  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=240 top',
    once: true,
    onEnter: () => popAndFloat('#stk-b', -10,  7, 4.0),
  });

  ScrollTrigger.create({
    trigger: '#hero-zone',
    start: 'top+=400 top',
    once: true,
    onEnter: () => popAndFloat('#stk-c', -14, -4, 3.7),
  });

  /* ----------------------------------------------------------
     SCROLL PHASE 2 — Photo rises from below (scrubbed)
  ---------------------------------------------------------- */
  gsap.to('#l-photo', {
    y: 0,
    opacity: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-zone',
      start: 'top+=380 top',
      end:   'top+=780 top',
      scrub: 1.5,
    },
  });

  /* ----------------------------------------------------------
     SCROLL PHASE 3 — WHO? reveals:
     Name + photo fade out, WHO? fades in, stickers keep floating
  ---------------------------------------------------------- */
  const whoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-zone',
      start: 'top+=950 top',
      end:   'top+=1550 top',
      scrub: 1.5,
    },
  });

  // Name fades out
  whoTl.to('#mh-block',  { opacity: 0, duration: 25 }, 0);
  // Photo fades out slightly after
  whoTl.to('#l-photo',   { opacity: 0, duration: 25 }, 10);
  // WHO? fades in once they're gone
  whoTl.to('.who-txt',   { opacity: 1, duration: 35 }, 30);

  /* ----------------------------------------------------------
     HORIZONTAL SCROLL — 3 panels
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
      { v: 'thinking',    l: 'See my design thinking' },
      { v: 'review-work', l: 'Review my work' },
      { v: 'collaborate', l: 'Discuss collaboration' },
    ],
    'designer':        [
      { v: 'explore',   l: 'Explore portfolio' },
      { v: 'mentoring', l: 'Learn about mentoring' },
      { v: 'browsing',  l: 'Just browsing' },
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

  // 007 entrance animation
  gsap.fromTo('.s007-inner > *',
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#s007', start: 'top 70%', once: true },
    }
  );

});
