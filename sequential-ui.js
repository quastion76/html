(() => {
  let lastCurrentKey = null;

  function getCandidateKey(candidate) {
    return candidate?.url || candidate?.id || candidate?.name || '';
  }

  function decorateSequentialCards() {
    if (!game || game.mode !== 'sequential' || game.status !== 'playing') return;

    const currentKey = getCandidateKey(game.current);
    const currentChanged = lastCurrentKey !== null && lastCurrentKey !== currentKey;

    leftCandidate.classList.add('current-pick-card');
    rightCandidate.classList.add('challenger-card');

    leftCandidate.setAttribute('aria-label', '현재 선택된 후보 유지');
    rightCandidate.setAttribute('aria-label', '새 후보로 교체');

    if (currentChanged) {
      leftCandidate.classList.remove('current-promoted');
      void leftCandidate.offsetWidth;
      leftCandidate.classList.add('current-promoted');
      window.setTimeout(() => leftCandidate.classList.remove('current-promoted'), 620);
    }

    rightCandidate.classList.remove('challenger-arrived');
    void rightCandidate.offsetWidth;
    rightCandidate.classList.add('challenger-arrived');

    lastCurrentKey = currentKey;
  }

  const originalRenderMatch = renderMatch;
  renderMatch = function fixedChampionRenderMatch() {
    const result = originalRenderMatch();
    if (game?.mode === 'sequential' && game?.status === 'playing' && !isAnimating) {
      decorateSequentialCards();
    }
    return result;
  };

  const originalStartGame = startGame;
  startGame = function fixedChampionStartGame() {
    lastCurrentKey = null;
    return originalStartGame();
  };

  const originalResumeGame = resumeGame;
  resumeGame = function fixedChampionResumeGame() {
    lastCurrentKey = null;
    return originalResumeGame();
  };

  const style = document.createElement('style');
  style.textContent = `
    /* Sequential champion UI: left stays, right rotates. */
    .battle-stage .left-card.current-pick-card {
      border-right: 2px solid rgba(25,183,157,.9);
      box-shadow: inset 0 0 0 2px rgba(25,183,157,.38), inset 0 72px 80px -72px rgba(25,183,157,.68);
    }

    .battle-stage .left-card.current-pick-card::before,
    .battle-stage .right-card.challenger-card::before {
      position: absolute;
      top: 18px;
      left: 18px;
      z-index: 6;
      display: inline-flex;
      align-items: center;
      min-height: 31px;
      padding: 0 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .03em;
      text-shadow: none;
      pointer-events: none;
    }

    .battle-stage .left-card.current-pick-card::before {
      content: '✓ 현재 선택 · 유지 중';
      color: #fff;
      background: rgba(17,146,127,.94);
      border: 1px solid rgba(255,255,255,.52);
      box-shadow: 0 5px 18px rgba(0,0,0,.25), 0 0 0 3px rgba(25,183,157,.15);
    }

    .battle-stage .right-card.challenger-card::before {
      content: 'NEW · 새 후보';
      color: #fff;
      background: rgba(28,34,39,.82);
      border: 1px solid rgba(255,255,255,.6);
      box-shadow: 0 5px 18px rgba(0,0,0,.25);
    }

    /* The current pick should feel stationary between comparisons. */
    .battle-stage.is-entering .left-card.current-pick-card {
      animation: none !important;
    }

    .battle-stage .right-card.challenger-card.challenger-arrived {
      animation: challenger-slide-in .34s cubic-bezier(.16,.82,.28,1) both !important;
    }

    .battle-stage .left-card.current-pick-card.current-promoted {
      animation: current-promoted .58s cubic-bezier(.16,.82,.28,1) both !important;
    }

    .left-card.current-pick-card .battle-shade {
      background: linear-gradient(to bottom, rgba(8,92,79,.13), rgba(0,0,0,.12) 55%, rgba(0,0,0,.82) 100%);
    }

    .right-card.challenger-card .battle-shade {
      background: linear-gradient(to bottom, rgba(0,0,0,.05) 46%, rgba(0,0,0,.2) 67%, rgba(0,0,0,.82) 100%);
    }

    .left-card.current-pick-card:hover {
      box-shadow: inset 0 0 0 3px rgba(25,183,157,.64), inset 0 72px 80px -72px rgba(25,183,157,.76);
    }

    .game-hint::before {
      content: '왼쪽은 계속 유지되는 현재 선택 · 오른쪽만 새 후보로 교체됩니다\\A';
      white-space: pre;
      color: #d5f5ef;
      font-weight: 800;
    }

    @keyframes challenger-slide-in {
      0% { opacity: 0; transform: translateX(54px) scale(.985); filter: brightness(.78); }
      100% { opacity: 1; transform: translateX(0) scale(1); filter: brightness(1); }
    }

    @keyframes current-promoted {
      0% { opacity: .55; transform: scale(.975); box-shadow: inset 0 0 0 8px rgba(25,183,157,.95); }
      45% { opacity: 1; transform: scale(1.018); box-shadow: inset 0 0 0 5px rgba(25,183,157,.95), 0 0 44px rgba(25,183,157,.38); }
      100% { transform: scale(1); }
    }

    @media (max-width: 760px) {
      .battle-stage .left-card.current-pick-card::before,
      .battle-stage .right-card.challenger-card::before {
        top: 12px;
        left: 12px;
        min-height: 27px;
        padding: 0 9px;
        font-size: 10px;
      }
    }
  `;
  document.head.appendChild(style);

  if (game?.mode === 'sequential' && game?.status === 'playing') {
    decorateSequentialCards();
  }
})();
