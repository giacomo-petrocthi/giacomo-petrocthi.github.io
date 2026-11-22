(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const motionButton = document.querySelector('[data-motion-toggle]');
  const motionLabel = document.querySelector('[data-motion-label]');
  const canvas = document.querySelector('#data-flow');
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running = !reduced, raf = 0, width = 0, height = 0, dpr = 1;
  let particles = [];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.75);
    width = canvas.clientWidth; height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(26, Math.min(75, Math.round(width / 20)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width, y: height * (.27 + Math.random() * .45),
      r: Math.random() * 1.5 + .3, speed: .18 + Math.random() * .48,
      phase: Math.random() * Math.PI * 2, blue: i % 6 === 0
    }));
  }
  function draw(time = 0) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(p => {
      p.x += p.speed;
      if (p.x > width + 40) p.x = -40;
      const bend = Math.sin(time * .0007 + p.phase) * 14;
      const y = p.y + bend;
      const grad = ctx.createLinearGradient(p.x - 38, y, p.x + 3, y);
      grad.addColorStop(0, 'rgba(216,180,118,0)');
      grad.addColorStop(1, p.blue ? 'rgba(118,190,220,.62)' : 'rgba(240,212,156,.72)');
      ctx.strokeStyle = grad; ctx.lineWidth = p.r * .55;
      ctx.beginPath(); ctx.moveTo(p.x - 42, y - bend * .12); ctx.quadraticCurveTo(p.x - 16, y - 5, p.x, y); ctx.stroke();
      ctx.fillStyle = p.blue ? 'rgba(155,215,238,.8)' : 'rgba(255,225,164,.9)';
      ctx.beginPath(); ctx.arc(p.x, y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (running) raf = requestAnimationFrame(draw);
  }
  function setRunning(next) {
    running = next;
    motionLabel.textContent = running ? 'Pause motion' : 'Play motion';
    motionButton.querySelector('.motion-icon').textContent = running ? 'Ⅱ' : '▶';
    if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    else cancelAnimationFrame(raf);
  }
  addEventListener('resize', resize, { passive: true });
  addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive: true });
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', e => { if (e.target.matches('a')) { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); } });
  motionButton.addEventListener('click', () => setRunning(!running));
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  resize(); draw(); if (!running) motionLabel.textContent = 'Motion reduced';
})();
