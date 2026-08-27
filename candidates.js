(() => {
  const STORAGE_KEY = 'link-worldcup-candidates-v2';
  const GAME_KEY = 'link-worldcup-game-v2';
  const MIGRATION_KEY = 'link-worldcup-preset-pack-18plus-20260827';

  const rawPresets = [
    { name: '비얀드', url: 'https://www.ddtown.co.kr/room/73', capacity: '15~25' },
    { name: '나트랑', url: 'https://www.ddtown.co.kr/room/99', capacity: '15~20' },
    { name: '해바라기둘', url: 'https://www.dpv.co.kr/room/295', capacity: '15~25' },
    { name: '람보르기니', url: 'https://www.ddtown.co.kr/room/70', capacity: '15~25' },
    { name: '골드클래스 풀빌라', url: 'https://www.dpv.co.kr/room/317', capacity: '15~20' },
    { name: '갤럭시', url: 'https://www.ddtown.co.kr/room/69', capacity: '15~20' },
    { name: '포르쉐', url: 'https://www.ddtown.co.kr/room/71', capacity: '15~25' },
    { name: '휴갤러리', url: 'https://www.ddtown.co.kr/room/74', capacity: '15~20' },
    { name: '베네치아', url: 'https://www.ddtown.co.kr/room/87', capacity: '15~20' },
    { name: '해바라기하나', url: 'https://www.dpv.co.kr/room/215', capacity: '15~20' },
    { name: '체크메이트-비숍', url: 'https://www.dpv.co.kr/room/269', capacity: '15~20' },
    { name: '레몬트리', url: 'https://www.ddtown.co.kr/room/92', capacity: '15~20' },
    { name: '화이트캐슬', url: 'https://www.ddtown.co.kr/room/93', capacity: '15~20' },
    { name: 'YOLO 192', url: 'https://www.dpv.co.kr/room/283', capacity: '15~20' },
    { name: '굿플레이스', url: 'https://www.dpv.co.kr/room/244', capacity: '20~30' },
    { name: '포커스', url: 'https://www.ddtown.co.kr/room/72', capacity: '12~20' },
    { name: '카사블랑카', url: 'https://www.ddtown.co.kr/room/95', capacity: '15~18' },
    { name: '가자', url: 'https://www.dpv.co.kr/room/212', capacity: '15~18' },
    { name: '바코드라운지', url: 'https://www.dpv.co.kr/room/321', capacity: '20~30' },
    { name: '썬라이즈71', url: 'https://www.dpv.co.kr/room/285', capacity: '20~30' },
    { name: '헤세드', url: 'https://www.ddtown.co.kr/room/50', capacity: '18~30' },
    { name: '더스케치', url: 'https://www.ddtown.co.kr/room/55', capacity: '15~18' },
    { name: '파랑새', url: 'https://www.ddtown.co.kr/room/53', capacity: '20~20' },
    { name: '더하루', url: 'https://www.dpv.co.kr/room/858', capacity: '20~35' },
    { name: '모아이', url: 'https://www.dpv.co.kr/room/819', capacity: '20~40' },
    { name: '골드캐슬', url: 'https://www.dpv.co.kr/room/776', capacity: '20~30' },
    { name: '아침햇살', url: 'https://www.dpv.co.kr/room/213', capacity: '20~30' },
    { name: '윈도우즈 월드D', url: 'https://www.dpv.co.kr/room/324', capacity: '20~30' },
    { name: '루 ROO', url: 'https://www.dpv.co.kr/room/788', capacity: '20~40' },
    { name: '고래한마리277', url: 'https://www.dpv.co.kr/room/327', capacity: '20~25' },
    { name: 'VASO 142', url: 'https://www.dpv.co.kr/room/256', capacity: '20~30' },
    { name: '골든타임', url: 'https://www.dpv.co.kr/room/326', capacity: '20~40' },
    { name: 'GG', url: 'https://www.dpv.co.kr/room/857', capacity: '20~45' },
    { name: '건축학개론', url: 'https://www.dpv.co.kr/room/257', capacity: '20~30' },
    { name: 'NEW MOON', url: 'https://www.ddtown.co.kr/room/51', capacity: '20~30' },
    { name: 'FULL MOON', url: 'https://www.ddtown.co.kr/room/52', capacity: '20~30' },
    { name: '골든웨이브', url: 'https://www.dpv.co.kr/room/739', capacity: '20~45' },
    { name: '해남이 풀빌라', url: 'https://www.dpv.co.kr/room/713', capacity: '20~30' },
    { name: '더킹 The King', url: 'https://www.ddtown.co.kr/room/165', capacity: '20~30' },
    { name: 'HAUS 684', url: 'https://www.ddtown.co.kr/room/60', capacity: '12~20' },
    { name: '비오브제 B-Objet', url: 'https://www.dpv.co.kr/room/833', capacity: '20~35' },
    { name: '벨라루나', url: 'https://www.dpv.co.kr/room/837', capacity: '20~40' },
    { name: '벨라루체', url: 'https://www.dpv.co.kr/room/836', capacity: '20~40' },
    { name: '빌바오 BILBAO', url: 'https://www.ddtown.co.kr/room/161', capacity: '20~40' },
    { name: '데이바이D', url: 'https://www.ddtown.co.kr/room/43', capacity: '20~30' },
    { name: '오디세이', url: 'https://www.dpv.co.kr/room/344', capacity: '20~30' },
    { name: 'HAUS 684 PLUS', url: 'https://www.ddtown.co.kr/room/49', capacity: '17~30' },
    { name: 'YOLO 190', url: 'https://www.dpv.co.kr/room/282', capacity: '20~25' },
    { name: '마루MT', url: 'https://www.dpv.co.kr/room/340', capacity: '20~30' },
    { name: '더컨테이너 TOP & NEW', url: 'https://www.ddtown.co.kr/room/44', capacity: '25~40' }
  ];

  const knownImages = {
    'https://www.ddtown.co.kr/room/44': 'https://img2.itravelgo.co.kr/data/pension/44/floor/820/1024/phpyikHEa.jpg',
    'https://www.dpv.co.kr/room/857': 'https://img2.itravelgo.co.kr/data/pension/857/landscape/640/phpTNlGsR.jpg',
    'https://www.dpv.co.kr/room/285': 'https://img2.itravelgo.co.kr/data/pension/285/landscape/640/php4wcM9J.jpg',
    'https://www.dpv.co.kr/room/257': 'https://img2.itravelgo.co.kr/data/pension/257/landscape/640/phpXRrmfJ.jpg',
    'https://www.ddtown.co.kr/room/72': 'https://img2.itravelgo.co.kr/data/pension/72/landscape/640/phpPwwb3K.jpg',
    'https://www.dpv.co.kr/room/324': 'https://img2.itravelgo.co.kr/data/pension/324/landscape/640/phpJbLIMo.jpg',
    'https://www.dpv.co.kr/room/340': 'https://img2.itravelgo.co.kr/data/pension/340/landscape/640/phpkM5V7V.jpg'
  };

  const previewImage = url =>
    knownImages[url] ||
    `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;

  const slugify = value =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const presets = rawPresets.map(item => ({
    id: `preset-${slugify(item.name)}`,
    name: item.name,
    image: previewImage(item.url),
    url: item.url,
    capacity: item.capacity
  }));

  window.LINK_WORLDCUP_PRESETS = presets;

  function mergePresetsIntoStorage() {
    const storedText = localStorage.getItem(STORAGE_KEY);

    if (storedText === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
      localStorage.setItem(MIGRATION_KEY, '1');
      return;
    }

    let current;
    try {
      current = JSON.parse(storedText);
    } catch (_) {
      current = null;
    }

    if (!Array.isArray(current)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
      localStorage.setItem(MIGRATION_KEY, '1');
      return;
    }

    if (localStorage.getItem(MIGRATION_KEY) === '1') return;

    const existingNames = new Set(
      current.map(item => String(item?.name || '').trim().toLowerCase()).filter(Boolean)
    );
    const existingUrls = new Set(
      current.map(item => String(item?.url || '').trim()).filter(Boolean)
    );

    const additions = presets.filter(item =>
      !existingNames.has(item.name.trim().toLowerCase()) &&
      !existingUrls.has(item.url)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, ...additions]));
    localStorage.setItem(MIGRATION_KEY, '1');
  }

  mergePresetsIntoStorage();

  document.addEventListener('DOMContentLoaded', () => {
    const oldButton = document.querySelector('#restoreSamplesButton');
    if (!oldButton) return;

    const newButton = oldButton.cloneNode(true);
    newButton.textContent = '후보 50개 복원';
    oldButton.replaceWith(newButton);

    newButton.addEventListener('click', () => {
      const restored = presets.map(item => ({
        ...item,
        id: crypto.randomUUID()
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
      localStorage.removeItem(GAME_KEY);
      localStorage.setItem(MIGRATION_KEY, '1');
      window.location.reload();
    });
  });
})();
