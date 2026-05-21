/* ==========================================================
   The Unclutter Method — interactions
   - sticky header dark-mode toggle when over hero
   - reveal on scroll (IntersectionObserver)
   - parallax for hero bg
   - book page flip (3D)
   - mobile testimonial slider (drag/pagination)
   - smooth scroll w/ bottom-nav active state
   ========================================================== */

(function () {
  // ----- Header dark mode when over hero -----
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  if (header && hero) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        // when hero is mostly visible at the top, header is over dark image
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          header.classList.add('on-dark');
        } else {
          header.classList.remove('on-dark');
        }
      });
    }, { threshold: [0, 0.4, 0.6, 1] });
    io.observe(hero);
  }

  // ----- Reveal on scroll -----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  // ----- Hero parallax -----
  const heroBg = document.querySelector('.hero__bg');
  const heroBook = document.querySelector('.hero__book');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y < window.innerHeight) {
            heroBg.style.transform = `scale(1.06) translateY(${y * 0.25}px)`;
            if (heroBook) heroBook.style.transform = `translateY(${y * -0.05}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ----- Stat counters -----
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const startVal = 0;
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = startVal + (target - startVal) * eased;
        const isFloat = target % 1 !== 0;
        el.firstChild.textContent = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach((el) => statsObserver.observe(el));

  // ----- Book page flip -----
  setupBookViewer();

  // ----- Mobile testimonial slider -----
  setupTestimonialSlider();

  // ----- Bottom-nav active state -----
  setupBottomNav();

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          ev.preventDefault();
          window.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
        }
      }
    });
  });
})();

/* =========================================================
   Book viewer: realistic page-flip animation
   - We stack "page elements" at the right side
   - Each page is a 3D-rotatable element with front+back face
   - On flip, rotate from 0 -> -180deg around left edge
   ========================================================= */
function setupBookViewer() {
  const viewer = document.querySelector('.bookviewer');
  if (!viewer) return;

  const spreads = [
    {
      chapter: "Introduction",
      title: "The Quiet Revolution",
      body: [
        "We mistake fullness for fulfillment. A calendar packed with obligations, a desk crowded with tools we never use, a mind looping through tabs we never close — all of it begins to feel like proof of a life lived. But noise is not the same as meaning.",
        "This book is an invitation to subtract. Not to live with less for its own sake, but to make room for what matters most. To design a life the way you would design a room: with intention, light, and breath."
      ],
      figure: "Figure 1 — The three rings: Mind · Home · Life",
      pageNumLeft: 11,
      pageNumRight: 12,
      pullquote: "Subtraction is the most underrated form of creativity.",
      rightBody: [
        "Every chapter in this book moves through the same three rings: the mind, the home, the life. Start anywhere. Skip what doesn't apply. Mark the pages you want to return to.",
        "The Unclutter Method is not a system to follow — it is a posture to practice."
      ]
    },
    {
      chapter: "Chapter One",
      title: "Empty the Inbox of Your Mind",
      body: [
        "Before you reorganize a single drawer, begin with the place where most clutter actually lives — the inbox of your attention. Every unanswered thought, every loop of worry, every half-promise you made to yourself is a tab still open.",
        "Take a sheet of paper. Write down everything currently demanding space in your head. Don't sort. Don't judge. Just empty."
      ],
      figure: "Exercise 1.1 — The Brain Drain",
      pageNumLeft: 23,
      pageNumRight: 24,
      pullquote: "You cannot organize a room while standing inside the noise.",
      rightBody: [
        "Once it is on paper, it is no longer in you. The page becomes a holding room. From there, three categories: act, archive, or release.",
        "Most of what we carry belongs in the third pile. We carry it because nobody taught us we were allowed to put it down."
      ]
    },
    {
      chapter: "Chapter Two",
      title: "The Rule of One Room",
      body: [
        "When the whole house feels chaotic, the instinct is to begin everywhere — and that is precisely why we never begin at all. The Rule of One Room is simple: choose a single space, no larger than four square meters, and finish it completely before moving on.",
        "Completion creates momentum. Momentum compounds. By the time you reach the seventh room, you are no longer the person who started in the first."
      ],
      figure: "Method 2.1 — Map your seven rooms",
      pageNumLeft: 41,
      pageNumRight: 42,
      pullquote: "Begin small enough to finish. Finish often enough to believe.",
      rightBody: [
        "A drawer is a room. A photo album is a room. Your phone's home screen is, perhaps, the most cluttered room you own — and the easiest to clear in a single afternoon.",
        "Do not romanticize the size of your task. Romance the satisfaction of finishing it."
      ]
    },
    {
      chapter: "Chapter Three",
      title: "Design, Don't Decorate",
      body: [
        "Decoration adds. Design decides. The unclutter method is, at heart, an act of design: every object earns its place, every commitment justifies its hour, every relationship deserves its breath.",
        "Ask of every thing in your life the same question an architect asks of a wall: does this hold something up?"
      ],
      figure: "Worksheet 3.2 — Hold or Release",
      pageNumLeft: 67,
      pageNumRight: 68,
      pullquote: "A clear life is not an empty one. It is a chosen one.",
      rightBody: [
        "When you design instead of decorate, you stop apologizing for the things you say no to. The no becomes the proof that the yes is real.",
        "Turn the page. The next chapter begins where most decluttering books end — at the moment after the room is clean."
      ]
    }
  ];

  // Build pages markup
  const stage = viewer.querySelector('.book-stage');
  const book = document.createElement('div');
  book.className = 'book';
  book.innerHTML = `
    <div class="book__base">
      <div class="left-edge"></div>
    </div>
    <div class="book__spine"></div>
    <div class="pages">
      <div class="page-half left"></div>
      <div class="page-half right"></div>
    </div>
  `;
  stage.appendChild(book);

  const leftHalf = book.querySelector('.page-half.left');
  const rightHalf = book.querySelector('.page-half.right');

  // For each spread we create one "right-side" page that flips left, AND
  // we also stage a "left-side" page that already shows previous content.
  // Simpler approach: render all spreads, but only the current spread is visible
  // beneath, and on flip the top "right page" rotates revealing the next spread.

  // We'll do a sequential model where we always render the CURRENT spread on
  // the underlying base, and an animated "flipping page" overlays.
  function renderSpread(idx) {
    const s = spreads[idx];
    leftHalf.innerHTML = `
      <div class="page__face">
        ${pageContentLeft(s)}
      </div>
    `;
    rightHalf.innerHTML = `
      <div class="page__face">
        ${pageContentRight(s)}
      </div>
    `;
  }

  function pageContentLeft(s) {
    const paragraphs = s.body.map((p, i) => `<p class="${i === 0 ? 'dropcap' : ''}">${p}</p>`).join('');
    return `
      <div class="page-content">
        <div class="chapter">${s.chapter}</div>
        <h3>${s.title}</h3>
        ${paragraphs}
        <div class="figure">${s.figure}</div>
        <div class="page-num">— ${s.pageNumLeft} —</div>
      </div>
    `;
  }
  function pageContentRight(s) {
    const paragraphs = s.rightBody.map((p) => `<p>${p}</p>`).join('');
    return `
      <div class="page-content">
        <div class="pullquote">"${s.pullquote}"</div>
        ${paragraphs}
        <div class="page-num">— ${s.pageNumRight} —</div>
      </div>
    `;
  }

  let current = 0;
  renderSpread(current);

  // Page flip mechanic: build a single "flippable" overlay page that we
  // animate to reveal the next spread.
  const flipOverlay = document.createElement('div');
  flipOverlay.className = 'flip-overlay';
  flipOverlay.style.cssText = `
    position: absolute; inset: 14px;
    display: flex;
    perspective: 2400px;
    transform-style: preserve-3d;
    pointer-events: none;
    z-index: 50;
  `;
  flipOverlay.innerHTML = `
    <div class="page-half left"></div>
    <div class="page-half right">
      <div class="page" id="flipPage">
        <div class="page__face page__face--front"></div>
        <div class="page__face page__face--back"></div>
      </div>
    </div>
  `;
  book.appendChild(flipOverlay);

  // Reverse flip page (for going back) lives on the LEFT half
  const reverseFlipOverlay = document.createElement('div');
  reverseFlipOverlay.className = 'flip-overlay rev';
  reverseFlipOverlay.style.cssText = flipOverlay.style.cssText;
  reverseFlipOverlay.innerHTML = `
    <div class="page-half left">
      <div class="page" id="flipPageRev" style="transform-origin: right center; transform: rotateY(0deg);">
        <div class="page__face page__face--front"></div>
        <div class="page__face page__face--back"></div>
      </div>
    </div>
    <div class="page-half right"></div>
  `;
  book.appendChild(reverseFlipOverlay);

  const flipPage = flipOverlay.querySelector('#flipPage');
  const flipFront = flipPage.querySelector('.page__face--front');
  const flipBack = flipPage.querySelector('.page__face--back');

  const flipPageRev = reverseFlipOverlay.querySelector('#flipPageRev');
  const flipRevFront = flipPageRev.querySelector('.page__face--front');
  const flipRevBack = flipPageRev.querySelector('.page__face--back');

  // initial transform
  flipPage.style.transformOrigin = 'left center';
  flipPage.style.transform = 'rotateY(0deg)';
  flipPage.style.transformStyle = 'preserve-3d';
  flipPage.style.transition = 'transform 1.2s cubic-bezier(.55,.03,.35,1)';
  flipPage.style.position = 'absolute';
  flipPage.style.inset = '0';

  flipPageRev.style.transformStyle = 'preserve-3d';
  flipPageRev.style.transition = 'transform 1.2s cubic-bezier(.55,.03,.35,1)';
  flipPageRev.style.position = 'absolute';
  flipPageRev.style.inset = '0';

  // shading element to simulate paper shadow as page rotates
  const shading = document.createElement('div');
  shading.style.cssText = `
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(90deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.18) 100%);
    transition: opacity .6s ease;
    opacity: 0;
    border-radius: 0 4px 4px 0;
  `;
  flipFront.appendChild(shading);

  // back-face shading
  const backShading = document.createElement('div');
  backShading.style.cssText = shading.style.cssText.replace('60%', '60%').replace('rgba(0,0,0,0.0) 60%', 'rgba(0,0,0,0.0) 40%');
  flipBack.appendChild(backShading);

  // controls
  const prevBtn = document.querySelector('[data-flip="prev"]');
  const nextBtn = document.querySelector('[data-flip="next"]');
  const progressBar = document.querySelector('.flip-progress .bar i');
  const progressText = document.querySelector('.flip-progress .text');

  function updateProgress() {
    if (progressBar) {
      progressBar.style.width = ((current + 1) / spreads.length * 100) + '%';
    }
    if (progressText) {
      progressText.textContent = `Spread ${String(current + 1).padStart(2, '0')} / ${String(spreads.length).padStart(2, '0')}`;
    }
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === spreads.length - 1;
  }
  updateProgress();

  let isFlipping = false;

  function flipNext() {
    if (isFlipping || current >= spreads.length - 1) return;
    isFlipping = true;
    const cur = spreads[current];
    const next = spreads[current + 1];

    // Front face = current right page content (the one being flipped away)
    flipFront.innerHTML = pageContentRight(cur) + '';
    flipFront.appendChild(shading);
    // Back face = next left page content (revealed as page lays down)
    flipBack.innerHTML = pageContentLeft(next);
    flipBack.appendChild(backShading);

    // start from 0
    flipPage.style.transition = 'none';
    flipPage.style.transform = 'rotateY(0deg)';
    shading.style.opacity = '0';
    // force reflow
    void flipPage.offsetWidth;
    flipPage.style.transition = 'transform 1.2s cubic-bezier(.55,.03,.35,1)';
    requestAnimationFrame(() => {
      flipPage.style.transform = 'rotateY(-180deg)';
      shading.style.opacity = '0.55';
    });

    // when done, render new spread and reset
    setTimeout(() => {
      current += 1;
      renderSpread(current);
      flipPage.style.transition = 'none';
      flipPage.style.transform = 'rotateY(0deg)';
      shading.style.opacity = '0';
      flipFront.innerHTML = '';
      flipFront.appendChild(shading);
      flipBack.innerHTML = '';
      flipBack.appendChild(backShading);
      isFlipping = false;
      updateProgress();
    }, 1220);
  }

  function flipPrev() {
    if (isFlipping || current <= 0) return;
    isFlipping = true;
    const cur = spreads[current];
    const prev = spreads[current - 1];

    // Reverse: animate the LEFT half page rotating to the right (revealing the previous spread)
    flipRevFront.innerHTML = pageContentLeft(cur);
    flipRevBack.innerHTML = pageContentRight(prev);

    // start from 0
    flipPageRev.style.transition = 'none';
    flipPageRev.style.transformOrigin = 'right center';
    flipPageRev.style.transform = 'rotateY(0deg)';
    void flipPageRev.offsetWidth;
    flipPageRev.style.transition = 'transform 1.2s cubic-bezier(.55,.03,.35,1)';
    requestAnimationFrame(() => {
      flipPageRev.style.transform = 'rotateY(180deg)';
    });

    setTimeout(() => {
      current -= 1;
      renderSpread(current);
      flipPageRev.style.transition = 'none';
      flipPageRev.style.transform = 'rotateY(0deg)';
      flipRevFront.innerHTML = '';
      flipRevBack.innerHTML = '';
      isFlipping = false;
      updateProgress();
    }, 1220);
  }

  if (nextBtn) nextBtn.addEventListener('click', flipNext);
  if (prevBtn) prevBtn.addEventListener('click', flipPrev);

  // Click on right page to flip forward, click on left page to flip back
  rightHalf.addEventListener('click', flipNext);
  leftHalf.addEventListener('click', flipPrev);
  rightHalf.style.cursor = 'pointer';
  leftHalf.style.cursor = 'pointer';

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (!isInViewport(viewer)) return;
    if (e.key === 'ArrowRight') flipNext();
    if (e.key === 'ArrowLeft') flipPrev();
  });

  // Hover hint: lift right page a bit
  rightHalf.addEventListener('mouseenter', () => {
    if (isFlipping || current >= spreads.length - 1) return;
    flipPage.style.transition = 'transform .5s ease';
    flipPage.style.transform = 'rotateY(-12deg)';
    // need content so the hint is visible
    if (!flipFront.querySelector('.page-content')) {
      flipFront.innerHTML = pageContentRight(spreads[current]);
      flipFront.appendChild(shading);
    }
  });
  rightHalf.addEventListener('mouseleave', () => {
    if (isFlipping) return;
    flipPage.style.transition = 'transform .5s ease';
    flipPage.style.transform = 'rotateY(0deg)';
    setTimeout(() => {
      if (!isFlipping) {
        flipFront.innerHTML = '';
        flipFront.appendChild(shading);
      }
    }, 520);
  });
}

function isInViewport(el) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/* =========================================================
   Testimonial slider (mobile)
   ========================================================= */
function setupTestimonialSlider() {
  const track = document.querySelector('.t-slider__track');
  const dotsWrap = document.querySelector('.t-dots');
  const prev = document.querySelector('.t-slider__btns .prev');
  const next = document.querySelector('.t-slider__btns .next');
  if (!track) return;

  const cards = Array.from(track.children);
  // Build dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      b.addEventListener('click', () => goTo(i));
      if (i === 0) b.classList.add('active');
      dotsWrap.appendChild(b);
    });
  }

  function activeIndex() {
    const scrollX = track.scrollLeft + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((c, i) => {
      const center = c.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(center - scrollX);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function updateActive() {
    const i = activeIndex();
    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, j) => d.classList.toggle('active', j === i));
    }
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }

  function goTo(i) {
    const card = cards[i];
    if (!card) return;
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left, behavior: 'smooth' });
  }

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActive);
  }, { passive: true });

  if (next) next.addEventListener('click', () => goTo(Math.min(cards.length - 1, activeIndex() + 1)));
  if (prev) prev.addEventListener('click', () => goTo(Math.max(0, activeIndex() - 1)));

  // Drag with mouse
  let isDown = false, startX = 0, scrollStart = 0;
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('dragging');
    startX = e.pageX;
    scrollStart = track.scrollLeft;
  });
  track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('dragging');
    // snap to nearest
    goTo(activeIndex());
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    track.scrollLeft = scrollStart - dx;
  });

  updateActive();
}

/* =========================================================
   Bottom-nav active state via section observation
   ========================================================= */
function setupBottomNav() {
  const navLinks = document.querySelectorAll('.bottom-nav a[data-section]');
  if (!navLinks.length) return;
  const sections = Array.from(navLinks).map((a) => document.querySelector(a.getAttribute('href')));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.4) {
        const id = '#' + e.target.id;
        navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: [0.4, 0.6, 0.8] });

  sections.forEach((s) => { if (s) sectionObserver.observe(s); });
}
