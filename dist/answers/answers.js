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

  document.querySelector('.answers-top').addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  document.querySelectorAll('.puzzle-card').forEach(card => {
    const trigger = card.querySelector('.puzzle-trigger');
    const panel = card.querySelector('.puzzle-panel');
    const label = card.querySelector('.puzzle-toggle');
    trigger.addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', `問題${puzzles.get(card.dataset.puzzle).index.toString().padStart(2, '0')}の答えを${open ? '閉じる' : '表示'}`);
      panel.setAttribute('aria-hidden', String(!open));
      panel.inert = !open;
      label.textContent = open ? '閉じる' : '答えを見る';
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
      dialog.showModal();
      document.documentElement.classList.add('answer-modal-open');
      dialog.querySelector('.answer-dialog-body').scrollTop = 0;
      closeButton.focus({preventScroll: true});
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('answer-modal-open');
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({preventScroll: true});
  });

  if (window.location.hash) {
    const card = document.getElementById(window.location.hash.slice(1));
    if (card && card.classList.contains('puzzle-card')) card.querySelector('.puzzle-trigger').click();
  }
})();
