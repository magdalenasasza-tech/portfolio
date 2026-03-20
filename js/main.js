/* ============================================================
   PERSONA OPTIONS  — dynamic second dropdown
   ============================================================ */
const purposeOptions = {
  'recruiter': [
    { value: 'check-experience',  label: 'Check my experience'  },
    { value: 'see-my-work',       label: 'See my work'          },
    { value: 'download-cv',       label: 'Download my CV'       },
    { value: 'get-in-touch',      label: 'Get in touch'         },
  ],
  'hiring-manager': [
    { value: 'review-case-studies', label: 'Review case studies'   },
    { value: 'see-process',         label: 'See my process'        },
    { value: 'understand-expertise',label: 'Understand my expertise'},
    { value: 'get-in-touch',        label: 'Get in touch'          },
  ],
  'design-director': [
    { value: 'see-thinking',          label: 'See my design thinking'  },
    { value: 'review-work',           label: 'Review my work'          },
    { value: 'discuss-collaboration', label: 'Discuss collaboration'    },
    { value: 'get-in-touch',          label: 'Get in touch'            },
  ],
  'designer': [
    { value: 'explore-portfolio', label: 'Explore portfolio'       },
    { value: 'learn-mentoring',   label: 'Learn about mentoring'   },
    { value: 'get-inspired',      label: 'Get inspired'            },
    { value: 'just-browsing',     label: 'Just browsing'           },
  ],
};

const personaRoutes = {
  'recruiter':       'recruiter.html',
  'hiring-manager':  'hiring-manager.html',
  'design-director': 'design-director.html',
  'designer':        'designer.html',
};

/* ============================================================
   DOM REFS
   ============================================================ */
const personaSelect = document.getElementById('persona-select');
const purposeSelect = document.getElementById('purpose-select');
const exploreBtn    = document.getElementById('explore-btn');
const prevBtn       = document.getElementById('prev-proj');
const nextBtn       = document.getElementById('next-proj');
const track         = document.getElementById('projects-track');

/* ============================================================
   PERSONA SELECTOR LOGIC
   ============================================================ */
personaSelect.addEventListener('change', () => {
  const val = personaSelect.value;

  // Reset second dropdown
  purposeSelect.innerHTML = '<option value="">Select</option>';
  purposeSelect.disabled = true;
  exploreBtn.disabled = true;

  if (val && purposeOptions[val]) {
    purposeOptions[val].forEach(opt => {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      purposeSelect.appendChild(o);
    });
    purposeSelect.disabled = false;
  }
});

purposeSelect.addEventListener('change', () => {
  exploreBtn.disabled = !purposeSelect.value;
});

exploreBtn.addEventListener('click', () => {
  const persona = personaSelect.value;
  if (persona && personaRoutes[persona]) {
    // Small delay so the fill animation plays before navigating
    exploreBtn.style.pointerEvents = 'none';
    setTimeout(() => {
      window.location.href = personaRoutes[persona];
    }, 320);
  }
});

/* ============================================================
   PROJECT THUMBNAIL CAROUSEL
   ============================================================ */
const CARD_HEIGHT = 170;
const CARD_GAP    = 12;
const VISIBLE     = 3;
const totalCards  = track.querySelectorAll('.project-card').length;
let   currentIdx  = 0;

function updateCarousel(animate = true) {
  const offset = currentIdx * (CARD_HEIGHT + CARD_GAP);
  track.style.transition = animate
    ? 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
    : 'none';
  track.style.transform = `translateY(-${offset}px)`;

  prevBtn.disabled = currentIdx === 0;
  nextBtn.disabled = currentIdx >= totalCards - VISIBLE;
}

prevBtn.addEventListener('click', () => {
  if (currentIdx > 0) {
    currentIdx--;
    updateCarousel();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIdx < totalCards - VISIBLE) {
    currentIdx++;
    updateCarousel();
  }
});

// Init without animation
updateCarousel(false);

/* ============================================================
   ENTRANCE ANIMATIONS
   ============================================================ */
const animEls = document.querySelectorAll('[data-animate]');

// Stagger each element by its data-delay (ms)
setTimeout(() => {
  animEls.forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    el.style.animationDelay = `${delay}ms`;
    el.classList.add('visible');
  });
}, 80);
