(() => {
  const STORAGE_KEY = 'link-worldcup-candidates-v2';
  const IMAGE_MIGRATION_KEY = 'link-worldcup-real-images-20260827';

  const realImages = {
    'https://www.ddtown.co.kr/room/73': 'https://img2.itravelgo.co.kr/data/pension/73/landscape/640/phpqPfvEQ.jpg',
    'https://www.ddtown.co.kr/room/99': 'https://img2.itravelgo.co.kr/data/pension/99/landscape/640/phpHcbm1L.jpg',
    'https://www.dpv.co.kr/room/295': 'https://img2.itravelgo.co.kr/data/pension/295/landscape/640/phpdYxgYL.jpg',
    'https://www.ddtown.co.kr/room/70': 'https://img2.itravelgo.co.kr/data/pension/70/landscape/640/phpEsjcO0.jpg',
    'https://www.dpv.co.kr/room/317': 'https://img2.itravelgo.co.kr/data/pension/317/landscape/640/phpVu7LEy.jpg',
    'https://www.ddtown.co.kr/room/69': 'https://img2.itravelgo.co.kr/data/pension/69/landscape/640/phpuqmCAd.jpg',
    'https://www.ddtown.co.kr/room/71': 'https://img2.itravelgo.co.kr/data/pension/71/landscape/640/phpchgUZd.jpg',
    'https://www.ddtown.co.kr/room/74': 'https://img2.itravelgo.co.kr/data/pension/74/landscape/640/phpli4sOJ.jpg',
    'https://www.ddtown.co.kr/room/87': 'https://img2.itravelgo.co.kr/data/pension/87/landscape/640/phpF7NOvt.jpg',
    'https://www.dpv.co.kr/room/215': 'https://yaimg.yanolja.com/v5/2026/02/25/06/1280/699e9c617eccb9.64481953.jpg',
    'https://www.dpv.co.kr/room/269': 'https://img2.itravelgo.co.kr/data/pension/269/landscape/640/phpO1GND3.jpg',
    'https://www.ddtown.co.kr/room/92': 'https://img2.itravelgo.co.kr/data/pension/92/landscape/640/phpzSEVA8.jpg',
    'https://www.ddtown.co.kr/room/93': 'https://img2.itravelgo.co.kr/data/pension/93/landscape/640/phppKqAIg.jpg',
    'https://www.dpv.co.kr/room/283': 'https://img2.itravelgo.co.kr/data/pension/283/landscape/640/php8jZDk4.jpg',
    'https://www.dpv.co.kr/room/244': 'https://img2.itravelgo.co.kr/data/pension/244/landscape/640/phpXPQtII.jpg',
    'https://www.ddtown.co.kr/room/72': 'https://img2.itravelgo.co.kr/data/pension/72/landscape/640/phpPwwb3K.jpg',
    'https://www.ddtown.co.kr/room/95': 'https://img2.itravelgo.co.kr/data/pension/95/landscape/640/phpu4d1BF.jpg',
    'https://www.dpv.co.kr/room/212': 'https://img2.itravelgo.co.kr/data/pension/212/landscape/640/phpPmuRUh.jpg',
    'https://www.dpv.co.kr/room/321': 'https://img2.itravelgo.co.kr/data/pension/321/landscape/640/phpAOpodS.jpg',
    'https://www.dpv.co.kr/room/285': 'https://img2.itravelgo.co.kr/data/pension/285/landscape/640/php4wcM9J.jpg',
    'https://www.ddtown.co.kr/room/50': 'https://img2.itravelgo.co.kr/data/pension/50/landscape/640/phpNhVHmF.jpg',
    'https://www.ddtown.co.kr/room/55': 'https://img2.itravelgo.co.kr/data/pension/55/landscape/640/phpupwIJY.jpg',
    'https://www.ddtown.co.kr/room/53': 'https://img2.itravelgo.co.kr/data/pension/53/landscape/640/phpVoS9Mc.jpg',
    'https://www.dpv.co.kr/room/858': 'https://media.triple.guide/triple-cms/c_limit%2Cf_auto%2Ch_1024%2Cw_1024/5b171993-c50a-4303-a832-1a4503f83581',
    'https://www.dpv.co.kr/room/819': 'https://img2.itravelgo.co.kr/data/pension/819/landscape/640/phpy2YM96.png',
    'https://www.dpv.co.kr/room/776': 'https://img2.itravelgo.co.kr/data/pension/776/landscape/640/phpMcCpea.jpg',
    'https://www.dpv.co.kr/room/213': 'https://img2.itravelgo.co.kr/data/pension/213/landscape/640/php5FwxEz.jpg',
    'https://www.dpv.co.kr/room/324': 'https://img2.itravelgo.co.kr/data/pension/324/landscape/640/phpJbLIMo.jpg',
    'https://www.dpv.co.kr/room/788': 'https://img2.itravelgo.co.kr/data/pension/788/landscape/640/phpBE4M1f.jpg',
    'https://www.dpv.co.kr/room/327': 'https://img2.itravelgo.co.kr/data/pension/327/landscape/640/phpJCRZvB.jpg',
    'https://www.dpv.co.kr/room/256': 'https://img2.itravelgo.co.kr/data/pension/256/landscape/640/phpscJnMn.jpg',
    'https://www.dpv.co.kr/room/326': 'https://img2.itravelgo.co.kr/data/pension/326/landscape/640/phpGNo1L1.jpg',
    'https://www.dpv.co.kr/room/857': 'https://img2.itravelgo.co.kr/data/pension/857/landscape/640/phpTNlGsR.jpg',
    'https://www.dpv.co.kr/room/257': 'https://img2.itravelgo.co.kr/data/pension/257/landscape/640/phpXRrmfJ.jpg',
    'https://www.ddtown.co.kr/room/51': 'https://img2.itravelgo.co.kr/data/pension/51/landscape/640/phpkZkCF9.jpg',
    'https://www.ddtown.co.kr/room/52': 'https://img2.itravelgo.co.kr/data/pension/52/landscape/640/phpAsIcVn.jpg',
    'https://www.dpv.co.kr/room/739': 'https://img2.itravelgo.co.kr/data/pension/739/landscape/640/phpI2JoeC.jpg',
    'https://www.dpv.co.kr/room/713': 'https://img2.itravelgo.co.kr/data/pension/713/landscape/640/phpRj77ik.jpg',
    'https://www.ddtown.co.kr/room/165': 'https://img2.itravelgo.co.kr/data/pension/165/landscape/640/phpE8tqGt.jpg',
    'https://www.ddtown.co.kr/room/60': 'https://img2.itravelgo.co.kr/data/pension/60/landscape/640/phpjv8GwR.jpg',
    'https://www.dpv.co.kr/room/833': 'https://img2.itravelgo.co.kr/data/pension/833/landscape/640/phpnnsqX7.jpg',
    'https://www.dpv.co.kr/room/837': 'https://img2.itravelgo.co.kr/data/pension/837/landscape/640/phpd2KNt0.jpg',
    'https://www.dpv.co.kr/room/836': 'https://img2.itravelgo.co.kr/data/pension/836/landscape/640/phpZZWT9k.jpg',
    'https://www.ddtown.co.kr/room/161': 'https://img2.itravelgo.co.kr/data/pension/161/landscape/640/phpkzmUqY.jpg',
    'https://www.ddtown.co.kr/room/43': 'https://img2.itravelgo.co.kr/data/pension/43/landscape/640/phpMIargU.jpg',
    'https://www.dpv.co.kr/room/344': 'https://img2.itravelgo.co.kr/data/pension/344/landscape/640/phpCGVfTO.jpg',
    'https://www.ddtown.co.kr/room/49': 'https://img2.itravelgo.co.kr/data/pension/49/landscape/640/php2vas8Z.jpg',
    'https://www.dpv.co.kr/room/282': 'https://img2.itravelgo.co.kr/data/pension/282/landscape/640/php7ZQabg.jpg',
    'https://www.dpv.co.kr/room/340': 'https://img2.itravelgo.co.kr/data/pension/340/landscape/640/phpkM5V7V.jpg',
    'https://www.ddtown.co.kr/room/44': 'https://img2.itravelgo.co.kr/data/pension/44/floor/820/1024/phpyikHEa.jpg'
  };

  const presets = window.LINK_WORLDCUP_PRESETS;
  if (Array.isArray(presets)) {
    presets.forEach(item => {
      const image = realImages[item.url];
      if (image) item.image = image;
    });
  }

  if (localStorage.getItem(IMAGE_MIGRATION_KEY) !== '1') {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(current)) {
        const updated = current.map(item => {
          const image = realImages[item?.url];
          return image ? { ...item, image } : item;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      localStorage.setItem(IMAGE_MIGRATION_KEY, '1');
    } catch (_) {}
  }
})();
