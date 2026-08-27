(() => {
  const RESULT_KEY = 'link-worldcup-last-results-v1';

  function loadResults() {
    try {
      const saved = JSON.parse(localStorage.getItem(RESULT_KEY));
      return saved && typeof saved === 'object' ? saved : null;
    } catch (_) {
      return null;
    }
  }

  function candidateKey(candidate) {
    return candidate?.url || `name:${candidate?.name || ''}`;
  }

  function saveCompletedResults(gameSnapshot, winner) {
    if (!gameSnapshot) return;

    const byName = new Map(candidates.map(candidate => [candidate.name, candidate]));
    const placements = {};

    gameSnapshot.history.forEach(item => {
      if (!item?.loser || item.loser === '부전승') return;
      const candidate = byName.get(item.loser);
      if (!candidate) return;
      placements[candidateKey(candidate)] = item.round === '결승' ? '준우승' : item.round;
    });

    const champion = candidates.find(candidate => candidate.id === winner?.id)
      || byName.get(winner?.name);
    if (champion) placements[candidateKey(champion)] = '우승';

    localStorage.setItem(RESULT_KEY, JSON.stringify({
      completedAt: new Date().toISOString(),
      placements
    }));
  }

  function decorateCandidateResults() {
    const saved = loadResults();
    const placements = saved?.placements || {};
    const rows = candidateList.querySelectorAll('.candidate-row');

    rows.forEach((row, index) => {
      const candidate = candidates[index];
      if (!candidate) return;

      row.querySelector('.candidate-result-badge')?.remove();
      const result = placements[candidateKey(candidate)];
      if (!result) return;

      const badge = document.createElement('span');
      badge.className = `candidate-result-badge${result === '우승' ? ' is-winner' : ''}`;
      badge.textContent = result;
      row.querySelector('.candidate-row-copy strong')?.insertAdjacentElement('afterend', badge);
    });
  }

  function normalizeCandidateCount() {
    if (!candidateCount) return;
    const text = candidateCount.textContent || '';
    if (text.endsWith('명')) candidateCount.textContent = `${text.slice(0, -1)}개`;
  }

  const originalRenderHome = renderHome;
  renderHome = function enhancedRenderHome() {
    originalRenderHome();
    normalizeCandidateCount();
  };

  const originalRenderCandidateList = renderCandidateList;
  renderCandidateList = function enhancedRenderCandidateList() {
    originalRenderCandidateList();
    decorateCandidateResults();
  };

  const originalFinishGame = finishGame;
  finishGame = function enhancedFinishGame(winner) {
    const snapshot = game ? structuredClone(game) : null;
    saveCompletedResults(snapshot, winner);
    const result = originalFinishGame(winner);
    decorateCandidateResults();
    return result;
  };

  const countObserver = new MutationObserver(normalizeCandidateCount);
  countObserver.observe(candidateCount, { childList: true, characterData: true, subtree: true });

  const toolbar = document.querySelector('.toolbar-buttons');
  if (toolbar && !document.querySelector('#clearResultsButton')) {
    const button = document.createElement('button');
    button.id = 'clearResultsButton';
    button.className = 'secondary-button';
    button.type = 'button';
    button.textContent = '결과 초기화';
    button.addEventListener('click', () => {
      if (!localStorage.getItem(RESULT_KEY)) return;
      if (!confirm('지난 월드컵 결과를 초기화할까요?')) return;
      localStorage.removeItem(RESULT_KEY);
      renderCandidateList();
    });
    toolbar.insertBefore(button, toolbar.lastElementChild);
  }

  const style = document.createElement('style');
  style.textContent = `
    .candidate-result-badge {
      display: inline-flex;
      align-items: center;
      min-height: 22px;
      margin: -1px 0 6px;
      padding: 2px 8px;
      border: 1px solid #cfd8d6;
      border-radius: 999px;
      background: #f2f7f6;
      color: #3f5d57;
      font-size: 11px;
      font-weight: 800;
      line-height: 1;
    }
    .candidate-result-badge.is-winner {
      border-color: #d3ae52;
      background: #fff7d9;
      color: #765a12;
    }
  `;
  document.head.appendChild(style);

  renderCandidateList();
  normalizeCandidateCount();
})();
