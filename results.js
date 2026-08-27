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

  function saveResults(saved) {
    localStorage.setItem(RESULT_KEY, JSON.stringify(saved));
  }

  function candidateKey(candidate) {
    return candidate?.url || `name:${candidate?.name || ''}`;
  }

  function buildCandidateLinks() {
    return Object.fromEntries(
      candidates
        .filter(candidate => candidate?.name && candidate?.url)
        .map(candidate => [candidate.name, candidate.url])
    );
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

    const completedGame = structuredClone(gameSnapshot);
    completedGame.status = 'completed';
    completedGame.winner = structuredClone(winner);

    saveResults({
      completedAt: new Date().toISOString(),
      placements,
      completedGame,
      candidateLinks: buildCandidateLinks(),
      autoShow: true
    });
  }

  function markPreviousResultAsSuperseded() {
    const saved = loadResults();
    if (!saved) return;
    saved.autoShow = false;
    saveResults(saved);
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
      badge.className = 'candidate-result-badge';
      badge.textContent = result;
      row.querySelector('.candidate-row-copy strong')?.insertAdjacentElement('afterend', badge);
    });
  }

  function normalizeCandidateCount() {
    if (!candidateCount) return;
    const text = candidateCount.textContent || '';
    if (text.endsWith('명')) candidateCount.textContent = `${text.slice(0, -1)}개`;
  }

  function findCandidateUrl(name, saved) {
    if (!name || name === '부전승') return '';
    return saved?.candidateLinks?.[name]
      || candidates.find(candidate => candidate.name === name)?.url
      || '';
  }

  function resultSiteLink(name, saved, label = '사이트 보기 ↗') {
    const url = findCandidateUrl(name, saved);
    if (!url) return '';
    return `<a class="history-site-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  function renderLinkedHistory(completedGame) {
    const saved = loadResults();
    if (!completedGame?.history?.length) {
      historyList.innerHTML = '';
      return;
    }

    historyList.innerHTML = completedGame.history
      .slice()
      .reverse()
      .map(item => {
        const winnerLink = resultSiteLink(item.winner, saved);
        const loserLink = item.loser === '부전승'
          ? ''
          : resultSiteLink(item.loser, saved);
        const loserText = item.loser === '부전승'
          ? '부전승'
          : `<span class="history-loser"><strong>${escapeHtml(item.loser)}</strong> 탈락</span>`;

        return `
          <div class="history-item history-item-linked">
            <b>${escapeHtml(item.round)}</b>
            <span class="history-person"><strong>${escapeHtml(item.winner)}</strong> 선택 ${winnerLink}</span>
            <span class="history-divider">·</span>
            <span class="history-person">${loserText} ${loserLink}</span>
          </div>
        `;
      })
      .join('');
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

  const originalRenderResult = renderResult;
  renderResult = function enhancedRenderResult(completedGame) {
    originalRenderResult(completedGame);
    renderLinkedHistory(completedGame);
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

  [startButton, playAgainButton, restartButton].forEach(button => {
    button?.addEventListener('click', markPreviousResultAsSuperseded, { capture: true });
  });

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
    .history-item-linked {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .history-person {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }
    .history-site-link {
      display: inline-flex;
      align-items: center;
      padding: 3px 7px;
      border: 1px solid #d3dadd;
      border-radius: 999px;
      color: #327e71;
      background: #fff;
      font-size: 11px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
    }
    .history-site-link:hover { text-decoration: underline; }
    .history-divider { color: #a0a7ab; }
  `;
  document.head.appendChild(style);

  renderCandidateList();
  normalizeCandidateCount();

  const savedResult = loadResults();
  if (!game && savedResult?.completedGame && savedResult.autoShow !== false) {
    renderResult(savedResult.completedGame);
    showView('result');
  }
})();
