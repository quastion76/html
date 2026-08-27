const CANDIDATE_KEY = 'link-worldcup-candidates-v1';
const GAME_KEY = 'link-worldcup-game-v1';

const sampleCandidates = [
  { id: crypto.randomUUID(), name: '후보 A', image: 'https://picsum.photos/seed/stay-a/900/650', url: 'https://example.com/?candidate=A' },
  { id: crypto.randomUUID(), name: '후보 B', image: 'https://picsum.photos/seed/stay-b/900/650', url: 'https://example.com/?candidate=B' },
  { id: crypto.randomUUID(), name: '후보 C', image: 'https://picsum.photos/seed/stay-c/900/650', url: 'https://example.com/?candidate=C' },
  { id: crypto.randomUUID(), name: '후보 D', image: 'https://picsum.photos/seed/stay-d/900/650', url: 'https://example.com/?candidate=D' },
  { id: crypto.randomUUID(), name: '후보 E', image: 'https://picsum.photos/seed/stay-e/900/650', url: 'https://example.com/?candidate=E' },
  { id: crypto.randomUUID(), name: '후보 F', image: 'https://picsum.photos/seed/stay-f/900/650', url: 'https://example.com/?candidate=F' },
  { id: crypto.randomUUID(), name: '후보 G', image: 'https://picsum.photos/seed/stay-g/900/650', url: 'https://example.com/?candidate=G' },
  { id: crypto.randomUUID(), name: '후보 H', image: 'https://picsum.photos/seed/stay-h/900/650', url: 'https://example.com/?candidate=H' }
];

const views = {
  home: document.querySelector('#homeView'),
  manage: document.querySelector('#manageView'),
  game: document.querySelector('#gameView'),
  result: document.querySelector('#resultView')
};

const startButton = document.querySelector('#startButton');
const resumeButton = document.querySelector('#resumeButton');
const manageButton = document.querySelector('#manageButton');
const backHomeButton = document.querySelector('#backHomeButton');
const candidateForm = document.querySelector('#candidateForm');
const candidateList = document.querySelector('#candidateList');
const candidateCount = document.querySelector('#candidateCount');
const restoreSamplesButton = document.querySelector('#restoreSamplesButton');
const clearCandidatesButton = document.querySelector('#clearCandidatesButton');
const quitButton = document.querySelector('#quitButton');
const restartButton = document.querySelector('#restartButton');
const playAgainButton = document.querySelector('#playAgainButton');
const resultHomeButton = document.querySelector('#resultHomeButton');
const roundLabel = document.querySelector('#roundLabel');
const matchProgress = document.querySelector('#matchProgress');
const leftCandidate = document.querySelector('#leftCandidate');
const rightCandidate = document.querySelector('#rightCandidate');
const winnerCard = document.querySelector('#winnerCard');
const historyList = document.querySelector('#historyList');

let candidates = loadCandidates();
let game = loadGame();

function loadCandidates() {
  try {
    const saved = JSON.parse(localStorage.getItem(CANDIDATE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (_) {}
  const initial = structuredClone(sampleCandidates);
  localStorage.setItem(CANDIDATE_KEY, JSON.stringify(initial));
  return initial;
}

function saveCandidates() {
  localStorage.setItem(CANDIDATE_KEY, JSON.stringify(candidates));
  renderCandidateList();
  renderHome();
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_KEY));
    return saved && saved.status === 'playing' ? saved : null;
  } catch (_) {
    return null;
  }
}

function saveGame() {
  if (game) localStorage.setItem(GAME_KEY, JSON.stringify(game));
  else localStorage.removeItem(GAME_KEY);
  renderHome();
}

function showView(name) {
  Object.entries(views).forEach(([key, el]) => el.classList.toggle('hidden', key !== name));
  manageButton.classList.toggle('hidden', name === 'game');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRoundName(count) {
  if (count === 2) return '결승';
  if (count === 4) return '4강';
  return `${count}강`;
}

function startGame() {
  if (candidates.length < 2) {
    alert('후보를 최소 2명 등록해 주세요.');
    showView('manage');
    return;
  }

  game = {
    status: 'playing',
    round: shuffle(structuredClone(candidates)),
    winners: [],
    index: 0,
    history: [],
    startedCandidateIds: candidates.map(item => item.id)
  };
  saveGame();
  showView('game');
  renderMatch();
}

function resumeGame() {
  if (!game) return;
  showView('game');
  renderMatch();
}

function renderMatch() {
  if (!game || game.status !== 'playing') return;

  if (game.index >= game.round.length) {
    advanceRound();
    return;
  }

  const left = game.round[game.index];
  const right = game.round[game.index + 1];

  if (!right) {
    game.winners.push(left);
    game.history.push({ round: getRoundName(game.round.length), winner: left.name, loser: '부전승' });
    game.index += 2;
    saveGame();
    renderMatch();
    return;
  }

  roundLabel.textContent = getRoundName(game.round.length);
  const totalMatches = Math.ceil(game.round.length / 2);
  const currentMatch = Math.floor(game.index / 2) + 1;
  matchProgress.textContent = `${currentMatch} / ${totalMatches}`;

  renderBattleCard(leftCandidate, left, () => chooseWinner(left, right));
  renderBattleCard(rightCandidate, right, () => chooseWinner(right, left));
}

function renderBattleCard(target, candidate, onChoose) {
  target.innerHTML = `
    <img class="battle-image" src="${escapeHtml(candidate.image)}" alt="${escapeHtml(candidate.name)} 이미지" />
    <div class="battle-shade"></div>
    <div class="battle-copy">
      <h3>${escapeHtml(candidate.name)}</h3>
      <a class="site-link" href="${escapeHtml(candidate.url)}" target="_blank" rel="noopener noreferrer">사이트 보기 ↗</a>
    </div>
  `;

  target.onclick = event => {
    if (event.target.closest('.site-link')) return;
    onChoose();
  };

  target.onkeydown = event => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.site-link')) {
      event.preventDefault();
      onChoose();
    }
  };
}

function chooseWinner(winner, loser) {
  if (!game) return;
  game.winners.push(winner);
  game.history.push({ round: getRoundName(game.round.length), winner: winner.name, loser: loser.name });
  game.index += 2;
  saveGame();
  renderMatch();
}

function advanceRound() {
  if (!game) return;

  if (game.winners.length === 1) {
    finishGame(game.winners[0]);
    return;
  }

  game.round = shuffle(game.winners);
  game.winners = [];
  game.index = 0;
  saveGame();
  renderMatch();
}

function finishGame(winner) {
  const completedGame = structuredClone(game);
  completedGame.status = 'completed';
  completedGame.winner = winner;
  localStorage.removeItem(GAME_KEY);
  game = null;
  renderResult(completedGame);
  showView('result');
}

function renderResult(completedGame) {
  const winner = completedGame.winner;
  winnerCard.innerHTML = `
    <img src="${escapeHtml(winner.image)}" alt="${escapeHtml(winner.name)} 이미지" />
    <h3>${escapeHtml(winner.name)}</h3>
    <a class="primary-button" href="${escapeHtml(winner.url)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;text-decoration:none;">우승 후보 사이트 보기 ↗</a>
  `;

  historyList.innerHTML = completedGame.history
    .slice()
    .reverse()
    .map(item => `<div class="history-item"><b>${escapeHtml(item.round)}</b> · <strong>${escapeHtml(item.winner)}</strong> 선택 · ${escapeHtml(item.loser)} 탈락</div>`)
    .join('');
}

function renderCandidateList() {
  candidateList.innerHTML = '';

  if (!candidates.length) {
    candidateList.innerHTML = '<div class="empty-state">등록된 후보가 없습니다.</div>';
    return;
  }

  candidates.forEach(candidate => {
    const template = document.querySelector('#candidateCardTemplate').content.cloneNode(true);
    const row = template.querySelector('.candidate-row');
    const img = row.querySelector('img');
    const name = row.querySelector('strong');
    const link = row.querySelector('a');
    const remove = row.querySelector('.remove-button');

    img.src = candidate.image;
    img.alt = `${candidate.name} 이미지`;
    name.textContent = candidate.name;
    link.href = candidate.url;
    remove.addEventListener('click', () => {
      candidates = candidates.filter(item => item.id !== candidate.id);
      saveCandidates();
    });

    candidateList.appendChild(row);
  });
}

function renderHome() {
  candidateCount.textContent = `${candidates.length}명`;
  resumeButton.classList.toggle('hidden', !game);
  startButton.textContent = candidates.length >= 2 ? `${candidates.length}명으로 월드컵 시작` : '후보를 먼저 등록하세요';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

candidateForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#nameInput').value.trim();
  const image = document.querySelector('#imageInput').value.trim();
  const url = document.querySelector('#urlInput').value.trim();
  if (!name || !image || !url) return;

  candidates.push({ id: crypto.randomUUID(), name, image, url });
  saveCandidates();
  candidateForm.reset();
  document.querySelector('#nameInput').focus();
});

manageButton.addEventListener('click', () => {
  renderCandidateList();
  showView('manage');
});
backHomeButton.addEventListener('click', () => showView('home'));
startButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', resumeGame);

restoreSamplesButton.addEventListener('click', () => {
  candidates = structuredClone(sampleCandidates).map(item => ({ ...item, id: crypto.randomUUID() }));
  saveCandidates();
});

clearCandidatesButton.addEventListener('click', () => {
  if (!confirm('등록된 후보를 모두 삭제할까요?')) return;
  candidates = [];
  saveCandidates();
});

quitButton.addEventListener('click', () => {
  showView('home');
  renderHome();
});

restartButton.addEventListener('click', () => {
  if (!confirm('현재 진행을 버리고 후보를 다시 섞을까요?')) return;
  startGame();
});

playAgainButton.addEventListener('click', startGame);
resultHomeButton.addEventListener('click', () => showView('home'));

renderCandidateList();
renderHome();
showView('home');
