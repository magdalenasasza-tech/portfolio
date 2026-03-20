gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   GENERATE SPIKY CIRCLE SVG PATH
   Deterministic (no Math.random) — same shape every load
   ============================================================ */
function genSpikyPath(cx, cy, r, n) {
  const pts = [];
  const noise = (i) => (Math.sin(i * 17.3 + 2.1) * 0.5 + 0.5); // 0–1, deterministic
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const isSpike = i % 2 === 0;
    const v = noise(i);
    const rad = isSpike ? r + 4 + v * 22 : r - 2 - v * 7;
    pts.push([cx + rad * Math.cos(angle), cy + rad * Math.sin(angle)]);
  }
  return 'M ' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L ') + ' Z';
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('load', () => {

  // Build + inject spiky path
  const spikyEl = document.getElementById('spiky-path');
  spikyEl.setAttribute('d', genSpikyPath(200, 200, 140, 80));
  const pathLen = spikyEl.getTotalLength();

  // Set photo off-screen below
  gsap.set('#l-photo', { y: '110vh' });

  // ============================================================
  // SEQUENCE — time-based (plays on load, no scroll needed)
  // ============================================================
  const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });

  // 000: Logo SVG fades in
  intro.to('#mh-svg', { opacity: 1, duration: 0.4 });

  // Draw the spiky circle
  intro.fromTo(spikyEl,
    { strokeDasharray: pathLen, strokeDashoffset: pathLen },
    { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' },
    '<'
  );

  // MH letters appear after circle finishes
  intro.to('.mh-letter', { opacity: 1, stagger: 0.2, duration: 0.5 }, '-=0.4');

  // Short hold…
  intro.to({}, { duration: 0.7 });

  // 000 → 001: Logo fades out, name fades in simultaneously
  intro.to('#mh-svg', { opacity: 0, scale: 1.08, duration: 0.7, ease: 'power2.in' });
  intro.to('.big-name', { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

  // Short hold…
  intro.to({}, { duration: 0.5 });

  // 001 → 002: Stickers pop in with spring
  intro.to(['#stk-a', '#stk-b', '#stk-c'], {
    opacity: 1,
    scale: 1,
    stagger: 0.15,
    duration: 0.6,
    ease: 'back.out(2)',
    onComplete: startLevitation,
  });

});

/* ============================================================
   LEVITATION — continuous float for initial 3 stickers
   ============================================================ */
let levTweens = [];

function startLevitation() {
  const configs = [
    { id: '#stk-a', y: -14, rot:  3, dur: 3.4, delay: 0 },
    { id: '#stk-b', y: -10, rot: -4, dur: 4.1, delay: 0.7 },
    { id: '#stk-c', y: -12, rot:  2, dur: 3.7, delay: 1.3 },
  ];
  configs.forEach(({ id, y, rot, dur, delay }) => {
    const t = gsap.to(id, {
      y, rotation: rot,
      duration: dur,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay,
    });
    levTweens.push(t);
  });
}

/* ============================================================
   SCROLL — Hero phases (003 photo + 004 WHO scatter)
   ============================================================ */
const scrollTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero-zone',
    pin: '#hero-stage',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});

// Phase 003 (0–40%): Photo rises from below
scrollTl.to('#l-photo', { y: 0, duration: 40, ease: 'none' }, 0);

// Phase 003→004 (50–65%): Name + photo fade out
scrollTl.to('.big-name', { opacity: 0, duration: 12 }, 50);
scrollTl.to('#l-photo',  { opacity: 0, y: -30, duration: 12 }, 52);

// Phase 004 (58–80%): Stickers scatter to new positions
// Kill levitation tweens when scatter starts
ScrollTrigger.create({
  trigger: '#hero-zone',
  start: 'top+=58% top',
  onEnter: () => { levTweens.forEach(t => t.kill()); },
});

// Initial 3 stickers move to scatter positions
scrollTl.to('#stk-a', { left: '30%', top: '67%', scale: 1.15, duration: 20, ease: 'power2.inOut' }, 58);
scrollTl.to('#stk-b', { left: '14%', top: '27%', scale: 0.9,  duration: 20, ease: 'power2.inOut' }, 60);
scrollTl.to('#stk-c', { left: '56%', top: '70%', scale: 1.05, duration: 20, ease: 'power2.inOut' }, 59);

// 3 duplicate stickers appear (004 only)
scrollTl.fromTo('#stk-d', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 0.95, duration: 14, ease: 'back.out(1.5)' }, 63);
scrollTl.fromTo('#stk-e', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.1,  duration: 14, ease: 'back.out(1.5)' }, 65);
scrollTl.fromTo('#stk-f', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1.2,  duration: 14, ease: 'back.out(1.5)' }, 67);

// WHO? fades in
scrollTl.fromTo('.who-txt',
  { opacity: 0, scale: 0.92 },
  { opacity: 1, scale: 1, duration: 18, ease: 'power2.out' },
  68
);

/* ============================================================
   HORIZONTAL SCROLL
   ============================================================ */
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
  }
});

/* ============================================================
   PERSONA SELECTOR
   ============================================================ */
const purposeOptions = {
  'recruiter':       [{ v:'check-experience', l:'Check my experience' }, { v:'see-my-work', l:'See my work' }, { v:'download-cv', l:'Download my CV' }],
  'hiring-manager':  [{ v:'case-studies', l:'Review case studies' }, { v:'see-process', l:'See my process' }, { v:'expertise', l:'Understand expertise' }],
  'design-director': [{ v:'thinking', l:'See my design thinking' }, { v:'review-work', l:'Review my work' }, { v:'collaborate', l:'Discuss collaboration' }],
  'designer':        [{ v:'explore', l:'Explore portfolio' }, { v:'mentoring', l:'Learn about mentoring' }, { v:'browsing', l:'Just browsing' }],
};
const personaRoutes = { 'recruiter':'recruiter.html','hiring-manager':'hiring-manager.html','design-director':'design-director.html','designer':'designer.html' };

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
      el.value = o.v; el.textContent = o.l;
      purposeSel.appendChild(el);
    });
  }
});
purposeSel.addEventListener('change', () => { exploreBtn.disabled = !purposeSel.value; });
exploreBtn.addEventListener('click', () => {
  const p = personaSel.value;
  if (p && personaRoutes[p]) window.location.href = personaRoutes[p];
});

/* 007 entrance */
gsap.fromTo('.s007-inner > *',
  { opacity: 0, y: 28 },
  { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#s007', start: 'top 70%', once: true } }
);
