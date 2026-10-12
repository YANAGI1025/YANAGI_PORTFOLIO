let filtered = ARTWORKS.slice();
    let activeTag = 'すべて';
    let currentIndex = -1;

    const gallery = document.getElementById('gallery');
    const tagButtons = document.getElementById('tagButtons');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalDate = document.getElementById('modalDate');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = document.getElementById('closeBtn');
    const pagerText = document.getElementById('pagerText');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function renderTagButtons() {
      tagButtons.innerHTML = '';

      getAllTags().forEach(tag => {
        const button = document.createElement('button');

        button.className = 'tag-btn' + (activeTag === tag ? ' active' : '');
        button.dataset.tag = tag;
        button.textContent = tag;

        button.addEventListener('click', () => {
          activeTag = tag;
          applyFilters();
          renderTagButtons();
        });

        tagButtons.appendChild(button);
      });
    }

    function applyFilters() {
      filtered = activeTag === 'すべて'
        ? ARTWORKS.slice()
        : ARTWORKS.filter(art => art.tags.includes(activeTag));

      renderGallery();
    }

    function renderGallery() {
      gallery.innerHTML = '';

      if (filtered.length === 0) {
        gallery.innerHTML = '<p class="empty-message">該当する作品がありません。</p>';
        return;
      }

      filtered.forEach((art, index) => {
        const card = document.createElement('article');

        card.className = 'card';
        card.tabIndex = 0;

        card.innerHTML = `

<div class="thumb">
  <img class="thumb-bg" src="${art.img}" alt="" aria-hidden="true">
  <img class="thumb-main" loading="lazy" src="${art.img}" alt="${art.title}">
</div>

          </div>
          <div class="card-body">
            <div class="card-header-line">
              <h3 class="card-title">${art.title}</h3>
              <div class="card-tags">
                ${(art.tags || []).map(tag =>
                  `<span class="pill" data-tag="${tag}">${tag}</span>`
                ).join('')}
              </div>
            </div>
          </div>
        `;

        card.addEventListener('click', () => openModal(index));

        card.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(index);
          }
        });

        gallery.appendChild(card);
      });
    }

    function openModal(index) {
      currentIndex = index;
      const art = filtered[currentIndex];

      if (!art) return;

      modalImg.src = art.img;
      modalImg.alt = art.title;
      modalTitle.textContent = art.title;
      modalDesc.textContent = art.desc || '';
      modalDate.textContent = '製作: ' + (art.date || '');
      modalTags.innerHTML = (art.tags || []).map(tag =>
        `<span class="pill" data-tag="${tag}">${tag}</span>`
      ).join('');
      pagerText.textContent = `${currentIndex + 1} / ${filtered.length}`;

      modal.classList.add('open');
      document.body.classList.add('modal-open');
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      currentIndex = -1;
    }

    function showNext() {
      if (!filtered.length) return;
      currentIndex = (currentIndex + 1) % filtered.length;
      openModal(currentIndex);
    }

    function showPrev() {
      if (!filtered.length) return;
      currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
      openModal(currentIndex);
    }

    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    modal.addEventListener('click', event => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', event => {
      if (!modal.classList.contains('open')) return;

      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrev();
    });

    tabButtons.forEach(button => {
      button.addEventListener('click', async () => {
        tabButtons.forEach(item => item.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById('tab-' + button.dataset.tab).classList.add('active');

        if (button.dataset.tab === 'board') {
          await initBoardOnce();
        }
      });
    });

    renderTagButtons();
    applyFilters();
