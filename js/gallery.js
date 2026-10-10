/**
 * Gallery Showcase & Lightbox (Phase 18)
 * Progressive enhancement: carousel pagination + accessible full-screen modal lightbox.
 */
(() => {
  'use strict';

  function initGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const tiles = Array.from(galleryGrid.querySelectorAll('.gallery-tile'));
    if (tiles.length === 0) return;

    // 1. Create or populate pagination dots container
    let dotsContainer = document.querySelector('.gallery-dots');
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'gallery-dots';
      dotsContainer.setAttribute('role', 'tablist');
      dotsContainer.setAttribute('aria-label', 'Screenshot navigation');
      galleryGrid.after(dotsContainer);
    }

    const dots = tiles.map((tile, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'gallery-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Screenshot ${idx + 1} of ${tiles.length}`);
      dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        tile.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    // Update active dot on horizontal scroll
    let scrollRaf = null;
    galleryGrid.addEventListener('scroll', () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const gridRect = galleryGrid.getBoundingClientRect();
        const gridCenter = gridRect.left + gridRect.width / 2;
        let closestIdx = 0;
        let minDiff = Infinity;

        tiles.forEach((t, i) => {
          const rect = t.getBoundingClientRect();
          const tileCenter = rect.left + rect.width / 2;
          const diff = Math.abs(gridCenter - tileCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });

        dots.forEach((d, i) => {
          const isActive = i === closestIdx;
          d.classList.toggle('active', isActive);
          d.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      });
    }, { passive: true });

    // 2. Lightbox modal setup
    let dialog = document.getElementById('gallery-lightbox');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.id = 'gallery-lightbox';
      dialog.className = 'lightbox-dialog';
      dialog.setAttribute('aria-label', 'Screenshot preview');

      dialog.innerHTML = `
        <div class="lightbox-content">
          <button type="button" class="lightbox-close" aria-label="Close preview">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img class="lightbox-img" src="" alt="" width="720" height="1600">
          <p class="lightbox-caption"></p>
        </div>
      `;
      document.body.appendChild(dialog);
    }

    const lightboxImg = dialog.querySelector('.lightbox-img');
    const lightboxCaption = dialog.querySelector('.lightbox-caption');
    const closeBtn = dialog.querySelector('.lightbox-close');
    let triggerElement = null;

    function openLightbox(tile) {
      triggerElement = tile;
      const img = tile.querySelector('img');
      const caption = tile.querySelector('.tile-caption');

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
      }
      if (caption && lightboxCaption) {
        lightboxCaption.textContent = caption.textContent || '';
      }

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      closeBtn.focus();
    }

    function closeLightbox() {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      if (triggerElement) {
        triggerElement.focus();
      }
    }

    tiles.forEach(tile => {
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('role', 'button');
      tile.setAttribute('aria-haspopup', 'dialog');
      tile.addEventListener('click', () => openLightbox(tile));
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(tile);
        }
      });
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    dialog.addEventListener('click', (e) => {
      // Backdrop click dismisses
      const content = dialog.querySelector('.lightbox-content');
      if (content && !content.contains(e.target)) {
        closeLightbox();
      }
    });

    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeLightbox();
    });

    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
