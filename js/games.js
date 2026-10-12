const GAME_PROJECTS = [
      {
        title: 'E:den',
        image: 'img/Game/eden.png',
        period: '2026.09 ~ 開発中',
        genre: 'HD2DホラーADV',
        engine: 'Unity',
        description: '「当たり前の日常が、少しずつ壊れていく」',
        role: 'プログラム',
        team: 'CEREAL : 3',
        links: [
          { label: 'ゲームをプレイ', url: '#' ,enabled: false},
        ],
        trailer: 'https://youtu.be/4ekDdK09I8I?si=jLq0w8k6kdtJmgKG'
      },
      {
        title: 'Born Bone Boom!',
        image: 'img/Game/bbb.png',
        period: '2026.08 ~ 開発中',
        genre: 'パーティー',
        engine: 'Unity (PUN2)',
        description: '頭・胴・おケツのホネを組み合わせ、\nヘンテコな生き物を復元する対戦パーティーゲーム！！！',
        role: 'プログラム',
        team: 'RAUGUGU',
        links: [
          { label: 'ゲームをプレイ', url: '#' ,enabled: false},
        ],
        trailer: 'https://youtu.be/pI6e8p7UPJw?si=7TKttfxCyDW1YWo0'
      },
      {
        title: 'キャンバスぬりつぶしろ！',
        image: 'img/Game/shiro.png',
        period: '2026.08',
        genre: '2Dアクション',
        engine: 'Unity',
        description: 'ある日、真っ白になってしまった世界。\n目の前に広がる白い世界を自分色に塗りつぶ”しろ”！！！',
        role: '企画・プログラム',
        team: 'RAUGUGU',
        events: ['unity1week #36 『しろ』　参加作品'],
        links: [
          { label: 'ゲームをプレイ', url: 'https://unityroom.com/games/nuritsubushiro' }
        ],
      },
      {
        title: 'らーめん裏飯家',
        image: 'img/Game/ura.png',
        period: '2026.03',
        genre: 'スコアアタック',
        engine: 'Unity',
        description: '特に怪しいわけでもないラーメン店に迷い込んだあなた。\n注文は“正しく”、“速く”組み立てろ！！！',
        role: '大将・企画・プログラム・デザイン',
        team: 'RAUGUGU',
        events: ['unity1week #35 『うら』　参加作品', '32回 3分ゲーコンテスト　2位入賞'],
        links: [
          { label: 'ゲームをプレイ', url: 'https://unityroom.com/games/urameshiya' }
        ]
      }
    ];

    const gameGallery = document.getElementById('gameGallery');
    const gameDetailModal = document.getElementById('gameDetailModal');
    const gameDetailClose = document.getElementById('gameDetailClose');
    const gameDetailImage = document.getElementById('gameDetailImage');
    const gameDetailBgImage = document.getElementById('gameDetailBgImage');

    const gameDetailTitle = document.getElementById('gameDetailTitle');
    const gameDetailPeriod = document.getElementById('gameDetailPeriod');
    const gameDetailKicker = document.getElementById('gameDetailKicker');
    const gameDetailTags = document.getElementById('gameDetailTags');

    const gameDetailDescription = document.getElementById('gameDetailDescription');
    const gameDetailRole = document.getElementById('gameDetailRole');
    const gameDetailEngine = document.getElementById('gameDetailEngine');
    const gameDetailGenre = document.getElementById('gameDetailGenre');
    const gameDetailEvents = document.getElementById('gameDetailEvents');
    const gameDetailPlay = document.getElementById('gameDetailPlay');
    const gameDetailTeam = document.getElementById('gameDetailTeam');

function openGameDetail(game) {
  gameDetailBgImage.src = game.image;
  gameDetailImage.src = game.image;
  gameDetailBgImage.alt = '';
  gameDetailImage.alt = game.title;

  gameDetailTeam.textContent = game.team || '—';

  gameDetailKicker.textContent =
    game.period || 'GAME PROJECT';

  gameDetailTitle.textContent =
    game.title;

if (gameDetailTags) {
  gameDetailTags.innerHTML = '';
    [game.engine, game.genre].filter(Boolean).forEach(value => {
      const tag = document.createElement('span');
      tag.textContent = value;
      gameDetailTags.appendChild(tag);
    });
}

  gameDetailPeriod.textContent =
    game.period || '—';

  gameDetailRole.textContent =
    game.role || '—';

  gameDetailEngine.textContent =
    game.engine || '—';

  gameDetailGenre.textContent =
    game.genre || '—';

  gameDetailDescription.textContent =
    game.description || '—';

  gameDetailEvents.innerHTML = '';

  if (
    game.events &&
    game.events.length > 0
  ) {
    const label =
      document.createElement('div');

    label.className =
      'game-detail-label';

    label.innerHTML =
      '<span>EVENTS</span><i></i>';

    const list =
      document.createElement('ul');

    game.events.forEach(eventText => {
      const item =
        document.createElement('li');

      item.textContent =
        eventText;

      list.appendChild(item);
    });

    gameDetailEvents.append(
      label,
      list
    );
  }

gameDetailPlay.innerHTML = '';

(game.links || []).forEach(link => {
  const anchor = document.createElement('a');

  anchor.className = 'game-play-button';

  anchor.textContent = link.label;

  if (link.enabled === false) {
    anchor.classList.add('disabled');
    anchor.setAttribute('aria-disabled', 'true');

    anchor.addEventListener('click', event => {
      event.preventDefault();
    });

    return gameDetailPlay.appendChild(anchor);
  }

  anchor.href = link.url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';

  gameDetailPlay.appendChild(anchor);
});

if (game.trailer) {
  const trailer = document.createElement('a');
  trailer.className = 'game-play-button game-trailer-button';
  trailer.textContent = 'トレーラー';
  trailer.href = game.trailer;
  trailer.target = '_blank';
  trailer.rel = 'noopener noreferrer';
  gameDetailPlay.appendChild(trailer);
}

  gameDetailModal.classList.add('open');

  gameDetailModal.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'modal-open'
  );

  gameDetailClose.focus();
}

function closeGameDetail() {
  gameDetailModal.classList.remove('open');
  gameDetailModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderGames() {
  gameGallery.innerHTML = '';

  GAME_PROJECTS.forEach(game => {
    const card = document.createElement('article');

    card.className = 'game-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${game.title}の詳細を見る`);

    card.innerHTML = `
      <div class="game-image">
        <img src="${game.image}" alt="${game.title}" loading="lazy">
      </div>

      <div class="game-card-content">
        <p class="game-period">${game.period}</p>
        <h2>${game.title}</h2>

        <div class="game-card-meta">
          <span>${game.engine}</span>
          <span>${game.genre}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openGameDetail(game);
    });

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openGameDetail(game);
      }
    });

    gameGallery.appendChild(card);
  });
}
    gameDetailClose.addEventListener('click', closeGameDetail);

    gameDetailModal.addEventListener('click', event => {
      if (event.target === gameDetailModal) {
        closeGameDetail();
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && gameDetailModal.classList.contains('open')) {
        closeGameDetail();
      }
    });

    renderGames();
