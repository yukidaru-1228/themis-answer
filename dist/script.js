(() => {
  'use strict';
  const credits = document.getElementById('credits');
  const stage = document.getElementById('stage');
  const space = document.getElementById('scroll-space');
  const progress = document.getElementById('progress');
  const percent = document.getElementById('percent');
  const status = document.getElementById('status');
  const resolution = document.getElementById('resolution');
  let maxScroll = 1;
  let revealStart = 0;
  let revealDistance = 1;
  let returning = false;
  let framePending = false;
  let lastY = -1;
  let lastReveal = -1;
  let lastHidden = null;
  let lastReady = null;
  let lastProgress = -1;
  let lastPercent = -1;

  function scheduleRender() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(render);
  }

  function render() {
    framePending = false;
    const y = Math.min(maxScroll, Math.max(0, window.scrollY));
    if (y !== lastY) {
      credits.style.transform = `translate3d(0,${-y}px,0)`;
      lastY = y;
    }
    // The final statement stays at the center; only its opacity follows scrolling.
    const reveal = Math.min(1, Math.max(0, (y - revealStart) / revealDistance));
    if (reveal !== lastReveal) {
      resolution.style.opacity = String(reveal * reveal * (3 - 2 * reveal));
      lastReveal = reveal;
    }
    const hidden = reveal === 0;
    if (hidden !== lastHidden) {
      resolution.setAttribute('aria-hidden', String(hidden));
      lastHidden = hidden;
    }
    const resolutionReady = reveal >= 0.98;
    if (resolutionReady !== lastReady) {
      resolution.inert = !resolutionReady;
      resolution.classList.toggle('is-ready', resolutionReady);
      lastReady = resolutionReady;
    }
    const fraction = y / maxScroll;
    const progressValue = Math.round(fraction * 1000);
    if (progressValue !== lastProgress) {
      progress.value = progressValue;
      progress.style.setProperty('--progress', `${progressValue / 10}%`);
      lastProgress = progressValue;
    }
    const percentValue = Math.round(fraction * 100);
    if (percentValue !== lastPercent) {
      percent.value = `${percentValue}%`;
      progress.setAttribute('aria-valuetext', `物語の${percentValue}パーセント`);
      lastPercent = percentValue;
    }
    if (returning && y < 1) {
      returning = false;
      status.textContent = '最初に戻りました';
    }
  }

  function measure() {
    const ratio = maxScroll > 1 ? window.scrollY / maxScroll : 0;
    revealStart = Math.max(0, credits.scrollHeight - stage.clientHeight * 0.08);
    revealDistance = Math.max(320, stage.clientHeight * 0.9);
    const nextMax = Math.max(1, revealStart + revealDistance);
    if (Math.abs(nextMax - maxScroll) > 1) {
      maxScroll = nextMax;
      space.style.height = `${maxScroll + window.innerHeight}px`;
      window.scrollTo({top: returning ? 0 : ratio * maxScroll, behavior: returning ? 'smooth' : 'instant'});
    } else {
      space.style.height = `${maxScroll + window.innerHeight}px`;
    }
    scheduleRender();
  }

  function restart(event) {
    event.preventDefault();
    returning = true;
    status.textContent = '最初へ戻っています';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  document.getElementById('restart').addEventListener('click', restart);
  document.querySelector('.wordmark').addEventListener('click', restart);
  progress.addEventListener('input', () => {
    returning = false;
    window.scrollTo({top: Number(progress.value) / 1000 * maxScroll, behavior: 'instant'});
  });
  document.getElementById('skip').addEventListener('click', event => {
    event.preventDefault();
    returning = false;
    window.scrollTo({top: document.getElementById('story').offsetTop - 25, behavior: 'smooth'});
    document.getElementById('ch1').tabIndex = -1;
    document.getElementById('ch1').focus({preventScroll: true});
  });
  window.addEventListener('scroll', scheduleRender, {passive: true});
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(credits);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
