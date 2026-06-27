// ===================================================
// Sharon Makeovers — Interactive JS
// ===================================================
(function(){
  'use strict';

  // ---------- Loader ----------
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
  });

  // ---------- Custom cursor ----------
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches){
    let mx=0,my=0,rx=0,ry=0;
    window.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    const animate = () => {
      rx += (mx-rx)*.15; ry += (my-ry)*.15;
      ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(animate);
    };
    animate();
    document.querySelectorAll('a, button, .product-card, .cat-card, .m-item, .ig').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }

  // ---------- Navbar scroll ----------
  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    const progress = document.querySelector('.scroll-progress');
    if (progress){
      const h = document.documentElement;
      const pct = (h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
      progress.style.width = pct+'%';
    }
    const back = document.querySelector('.back-top');
    if (back) back.classList.toggle('show', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ---------- Back to top ----------
  document.querySelector('.back-top')?.addEventListener('click', () =>
    window.scrollTo({top:0, behavior:'smooth'}));

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }});
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Counters ----------
  const counters = document.querySelectorAll('.counter .num[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting){
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1800;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now-start)/dur, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1-p,3))) + (el.dataset.suffix||'');
          if (p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, {threshold:.6});
  counters.forEach(c => cio.observe(c));

  // ---------- Typing effect ----------
  const typeEl = document.querySelector('[data-type]');
  if (typeEl){
    const words = JSON.parse(typeEl.dataset.type);
    let wi=0, ci=0, deleting=false;
    const loop = () => {
      const w = words[wi];
      typeEl.textContent = w.substring(0, ci);
      if (!deleting && ci < w.length){ ci++; setTimeout(loop, 90); }
      else if (deleting && ci > 0){ ci--; setTimeout(loop, 50); }
      else {
        deleting = !deleting;
        if (!deleting) wi = (wi+1) % words.length;
        setTimeout(loop, deleting ? 1500 : 350);
      }
    };
    loop();
  }

  // ---------- Gallery filter + lightbox ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.m-item');

function filterGallery(filter) {
  galleryItems.forEach(item => {
    item.classList.toggle('hide', !(filter === 'all' || item.dataset.cat === filter));
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterGallery(btn.dataset.filter);
  });
});

// Show all images on page load
filterGallery('all');

  const lb = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox img');
  document.querySelectorAll('.m-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      if (lb && lbImg){ lbImg.src = src; lb.classList.add('show'); }
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', () => lb.classList.remove('show'));
  lb?.addEventListener('click', e => { if (e.target===lb) lb.classList.remove('show'); });

  // ---------- Enquiry form progress ----------
  const form = document.querySelector('.form-luxe[data-progress]');
  if (form){
    const bar = form.querySelector('.progress-luxe .bar');
    const fields = form.querySelectorAll('input, select, textarea');
    const update = () => {
      const filled = [...fields].filter(f => f.value.trim()!=='').length;
      const pct = (filled/fields.length)*100;
      if (bar) bar.style.width = pct+'%';
    };
    fields.forEach(f => f.addEventListener('input', update));
  }
  document.querySelectorAll('form').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const btn = f.querySelector('button[type="submit"]');
    if (btn){ const t=btn.textContent; btn.textContent='Sent ✓'; btn.disabled=true;
      setTimeout(()=>{btn.textContent=t;btn.disabled=false;f.reset();},2500); }
  }));

  // ---------- Set active nav link ----------
  const page = (location.pathname.split('/').pop() || 'index.html').replace('.html','') || 'index';
  document.querySelectorAll('.nav-link').forEach(a => {
    const target = (a.getAttribute('href')||'').replace('.html','').replace('./','') || 'index';
    if (target === page) a.classList.add('active');
  });

  // ---------- Inject shared HTML (nav + footer + utils) ----------
  // Already inline in pages, no-op here.

})();
