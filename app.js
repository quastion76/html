const CANDIDATE_KEY = 'link-worldcup-candidates-v2';
const GAME_KEY = 'link-worldcup-game-v2';

const sampleCandidates = [
  { id: crypto.randomUUID(), name: '더컨테이너 TOP & NEW', image: 'https://img2.itravelgo.co.kr/data/pension/44/floor/820/1024/phpyikHEa.jpg', url: 'https://www.ddtown.co.kr/room/44' },
  { id: crypto.randomUUID(), name: 'GG', image: 'https://img2.itravelgo.co.kr/data/pension/857/landscape/640/phpTNlGsR.jpg', url: 'https://www.dpv.co.kr/room/857' },
  { id: crypto.randomUUID(), name: '썬라이즈71', image: 'https://img2.itravelgo.co.kr/data/pension/285/landscape/640/php4wcM9J.jpg', url: 'https://www.dpv.co.kr/room/285' },
  { id: crypto.randomUUID(), name: '건축학개론', image: 'https://img2.itravelgo.co.kr/data/pension/257/landscape/640/phpXRrmfJ.jpg', url: 'https://www.dpv.co.kr/room/257' },
  { id: crypto.randomUUID(), name: '포커스', image: 'https://img2.itravelgo.co.kr/data/pension/72/landscape/640/phpPwwb3K.jpg', url: 'https://www.ddtown.co.kr/room/72' },
  { id: crypto.randomUUID(), name: '윈도우즈 월드D', image: 'https://img2.itravelgo.co.kr/data/pension/324/landscape/640/phpJbLIMo.jpg', url: 'https://www.dpv.co.kr/room/324' },
  { id: crypto.randomUUID(), name: '마루MT', image: 'https://img2.itravelgo.co.kr/data/pension/340/landscape/640/phpkM5V7V.jpg', url: 'https://www.dpv.co.kr/room/340' }
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
const homeManageButton = document.querySelector('#homeManageButton');
const brandHomeButton = document.querySelector('#brandHomeButton');
const headerHomeButton = document.querySelector('#headerHomeButton');
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
const battleStage = document.querySelector('#battleStage');
const versusMark = document.querySelector('#versusMark');
const winnerCard = document.querySelector('#winnerCard');
const historyList = document.querySelector('#historyList');

let candidates = loadCandidates();
let game = loadGame();
let isAnimating = false;

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
    if (saved && saved.status === 'playing' && saved.mode === 'sequential' && Array.isArray(saved.queue)) {
      return saved;
    }
    localStorage.removeItem(GAME_KEY);
    return null;
  } catch (_) {
    localStorage.removeItem(GAME_KEY);
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
  document.body.classList.toggle('playing-mode', name === 'game');
  manageButton.classList.toggle('hidden', name === 'game');
  headerHomeButton.classList.toggle('hidden', name === 'game');
  window.scrollTo({ top: 0, behavior: name === 'game' ? 'auto' : 'smooth' });
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  if (candidates.length < 2) {
    alert('후보를 최소 2개 등록해 주세요.');
    showManage();
    return;
  }

  const queue = shuffle(structuredClone(candidates));
  game = {
    status: 'playing',
    mode: 'sequential',
    queue,
    current: queue[0],
    index: 1,
    history: [],
    startedCandidateIds: candidates.map(item => item.id)
  };
  isAnimating = false;
  saveGame();
  showView('game');
  renderMatch();
}

function resumeGame() {
  if (!game) return;
  isAnimating = false;
  showView('game');
  renderMatch();
}

function renderMatch() {
  if (!game || game.status !== 'playing' || isAnimating) return;

  if (game.index >= game.queue.length) {
    finishGame(game.current);
    return;
  }

  const current = game.current;
  const challenger = game.queue[game.index];

  resetBattleStage();

  roundLabel.textContent = '연속 비교';
  matchProgress.textContent = `${game.index} / ${game.queue.length - 1}`;

  renderBattleCard(leftCandidate, current, () => chooseWinner(current, challenger, leftCandidate, rightCandidate));
  renderBattleCard(rightCandidate, challenger, () => chooseWinner(challenger, current, rightCandidate, leftCandidate));

  leftCandidate.dataset.role = 'current';
  rightCandidate.dataset.role = 'challenger';

  battleStage.classList.add('is-entering');
  window.setTimeout(() => battleStage.classList.remove('is-entering'), 330);
}

function resetBattleStage() {
  battleStage.classList.remove('is-resolving', 'is-entering');
  leftCandidate.classList.remove('is-selected', 'is-rejected');
  rightCandidate.classList.remove('is-selected', 'is-rejected');
  versusMark.removeAttribute('style');
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

  const image = target.querySelector('.battle-image');
  image.addEventListener('error', () => {
    image.removeAttribute('src');
    image.alt = '이미지를 불러오지 못했습니다.';
  }, { once: true });

  target.onclick = event => {
    if (event.target.closest('.site-link') || isAnimating) return;
    onChoose();
  };

  target.onkeydown = event => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.site-link') && !isAnimating) {
      event.preventDefault();
      onChoose();
    }
  };
}

function chooseWinner(winner, loser, selectedCard, rejectedCard) {
  if (!game || isAnimating) return;
  isAnimating = true;

  selectedCard.classList.add('is-selected');
  rejectedCard.classList.add('is-rejected');
  battleStage.classList.add('is-resolving');

  window.setTimeout(() => {
    if (!game) {
      isAnimating = false;
      return;
    }

    const step = game.index;
    game.current = structuredClone(winner);
    game.history.push({
      round: `비교 ${step}`,
      step,
      winner: winner.name,
      loser: loser.name
    });
    game.index += 1;
    saveGame();
    isAnimating = false;
    renderMatch();
  }, 520);
}

function finishGame(winner) {
  const completedGame = structuredClone(game);
  completedGame.status = 'completed';
  completedGame.winner = winner;
  localStorage.removeItem(GAME_KEY);
  game = null;
  isAnimating = false;
  renderResult(completedGame);
  showView('result');
}

function renderResult(completedGame) {
  const winner = completedGame.winner;
  winnerCard.innerHTML = `
    <img src="${escapeHtml(winner.image)}" alt="${escapeHtml(winner.name)} 이미지" />
    <h3>${escapeHtml(winner.name)}</h3>
    <a class="primary-button" href="${escapeHtml(winner.url)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;text-decoration:none;">최종 후보 사이트 보기 ↗</a>
  `;

  historyList.innerHTML = completedGame.history
    .slice()
    .reverse()
    .map(item => `<div class="history-item"><b>${escapeHtml(item.round)}</b> · <strong>${escapeHtml(item.winner)}</strong> 유지 · ${escapeHtml(item.loser)} 탈락</div>`)
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
  candidateCount.textContent = `${candidates.length}개`;
  resumeButton.classList.toggle('hidden', !game);
  startButton.textContent = candidates.length >= 2 ? '시작하기' : '후보를 먼저 등록하세요';
}

function showHome() {
  showView('home');
  renderHome();
}

function showManage() {
  renderCandidateList();
  showView('manage');
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

manageButton.addEventListener('click', showManage);
homeManageButton.addEventListener('click', showManage);
brandHomeButton.addEventListener('click', showHome);
headerHomeButton.addEventListener('click', showHome);
backHomeButton.addEventListener('click', showHome);
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

quitButton.addEventListener('click', showHome);

restartButton.addEventListener('click', () => {
  if (isAnimating) return;
  if (!confirm('현재 진행을 버리고 후보 순서를 다시 섞을까요?')) return;
  startGame();
});

playAgainButton.addEventListener('click', startGame);
resultHomeButton.addEventListener('click', showHome);

renderCandidateList();
renderHome();
showView('home');
