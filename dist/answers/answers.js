(() => {
  'use strict';
  const puzzles = new Map(JSON.parse(document.getElementById('puzzle-data').textContent).map(puzzle => [puzzle.id, puzzle]));
  const dialog = document.getElementById('answer-dialog');
  const closeButton = document.getElementById('dialog-close');
  const dialogImage = document.getElementById('dialog-image');
  const dialogFigure = document.querySelector('.answer-dialog-figure');
  const imageStatus = document.getElementById('dialog-image-status');
  let returnFocus = null;
  let imageRequest = 0;
  const stage = document.getElementById('answers-stage');
  const roll = document.getElementById('answers-roll');
  const scrollSpace = document.getElementById('answers-scroll-space');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let maxScroll = 0;
  let closeTimer = null;

  function renderScroll() {
    const y = Math.min(maxScroll, Math.max(0, window.scrollY));
    roll.style.transform = `translate3d(0,${-y}px,0)`;
  }

  function measureScroll() {
    maxScroll = Math.max(0, roll.scrollHeight - stage.clientHeight + 32);
    scrollSpace.style.height = `${maxScroll + window.innerHeight}px`;
    renderScroll();
  }

  function scrollToElement(element) {
    const stageRect = stage.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const target = window.scrollY + elementRect.top - stageRect.top - 28;
    window.scrollTo({top: Math.min(maxScroll, Math.max(0, target)), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  }

  document.querySelectorAll('a[href="#puzzles"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      scrollToElement(document.getElementById('puzzles'));
    });
  });
  // Keep keyboard navigation inside the visible ink window.
  stage.addEventListener('focusin', event => {
    if (!event.target.matches(':focus-visible')) return;
    const targetRect = event.target.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    if (targetRect.top < stageRect.top + 24 || targetRect.bottom > stageRect.bottom - 24) {
      scrollToElement(event.target.closest('.puzzle-card') || event.target);
    }
  });
  window.addEventListener('scroll', renderScroll, {passive: true});
  window.addEventListener('resize', measureScroll);
  new ResizeObserver(measureScroll).observe(roll);
  if (document.fonts) document.fonts.ready.then(measureScroll);
  measureScroll();

  document.querySelector('.answers-top').addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  document.querySelectorAll('.puzzle-card').forEach(card => {
    const triggers = card.querySelectorAll('.puzzle-trigger');
    const panel = card.querySelector('.puzzle-panel');
    const label = card.querySelector('.puzzle-toggle');
    function toggleAnswer() {
      const open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      triggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', String(open));
        trigger.setAttribute('aria-label', `問題${puzzles.get(card.dataset.puzzle).index.toString().padStart(2, '0')}の答えを${open ? '閉じる' : '表示'}`);
      });
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;
      label.textContent = open ? '答えを閉じる' : '答えを見る';
    }
    triggers.forEach(trigger => trigger.addEventListener('click', toggleAnswer));
    panel.addEventListener('click', event => {
      if (!event.target.closest('button')) toggleAnswer();
    });
  });

  document.querySelectorAll('.open-answer').forEach(button => {
    button.addEventListener('click', () => {
      const puzzle = puzzles.get(button.dataset.answer);
      if (!puzzle) return;
      returnFocus = button;
      const number = puzzle.index.toString().padStart(2, '0');
      document.getElementById('dialog-problem').textContent = `問題 ${number}`;
      document.getElementById('dialog-title').textContent = '答えと解説';
      document.getElementById('dialog-answer').textContent = puzzle.answer;
      const explanation = document.getElementById('dialog-explanation');
      explanation.replaceChildren(...puzzle.explanation.map(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
      const request = ++imageRequest;
      dialogFigure.classList.remove('is-error');
      dialogFigure.classList.add('is-loading');
      dialogFigure.setAttribute('aria-busy', 'true');
      imageStatus.textContent = '解答図を読み込んでいます…';
      dialogImage.src = puzzle.answerImage;
      dialogImage.alt = `問題${number}の解答図。答えは${puzzle.answer}。`;
      dialogImage.decode().then(() => {
        if (request !== imageRequest) return;
        dialogFigure.classList.remove('is-loading');
        dialogFigure.setAttribute('aria-busy', 'false');
        imageStatus.textContent = '';
      }).catch(() => {
        if (request !== imageRequest) return;
        dialogFigure.classList.remove('is-loading');
        dialogFigure.classList.add('is-error');
        dialogFigure.setAttribute('aria-busy', 'false');
        imageStatus.textContent = '解答図を読み込めませんでした。もう一度開いてください。';
      });
      dialog.dataset.puzzle = puzzle.id;
      clearTimeout(closeTimer);
      dialog.classList.remove('is-closing');
      dialog.showModal();
      document.documentElement.classList.add('answer-modal-open');
      dialog.querySelector('.answer-dialog-body').scrollTop = 0;
      closeButton.focus({preventScroll: true});
    });
  });

  function closeDialog() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (reducedMotion.matches) {
      dialog.close();
      return;
    }
    dialog.classList.add('is-closing');
    closeTimer = setTimeout(() => dialog.close(), 280);
  }
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    document.documentElement.classList.remove('answer-modal-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll: true});
  });

  if (window.location.hash) {
    const card = document.getElementById(window.location.hash.slice(1));
    if (card && card.classList.contains('puzzle-card')) {
      card.querySelector('.puzzle-trigger').click();
      requestAnimationFrame(() => scrollToElement(card));
    }
  }
})();
