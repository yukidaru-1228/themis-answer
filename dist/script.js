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

  function render() {
    const y = Math.min(maxScroll, Math.max(0, window.scrollY));
    credits.style.transform = `translate3d(0,${-y}px,0)`;
    // The final statement stays at the center; only its opacity follows scrolling.
    const reveal = Math.min(1, Math.max(0, (y - revealStart) / revealDistance));
    resolution.style.opacity = String(reveal * reveal * (3 - 2 * reveal));
    resolution.setAttribute('aria-hidden', String(reveal === 0));
    const resolutionReady = reveal >= 0.98;
    resolution.inert = !resolutionReady;
    resolution.classList.toggle('is-ready', resolutionReady);
    const fraction = y / maxScroll;
    progress.value = Math.round(fraction * 1000);
    progress.style.setProperty('--progress', `${fraction * 100}%`);
    percent.value = `${Math.round(fraction * 100)}%`;
    progress.setAttribute('aria-valuetext', `物語の${Math.round(fraction * 100)}パーセント`);
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
    render();
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
  window.addEventListener('scroll', render, {passive: true});
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(credits);
  if (document.fonts) document.fonts.ready.then(measure);
  measure();
})();
