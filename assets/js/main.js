/**
 * Material IHC - Script Principal
 * Controle de Tema (Dark/Light), Filtros e Interatividades Globais
 */

(function () {
  'use strict';

  // Gerenciamento de Tema
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('ihc-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ihc-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`);
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
        : `<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>`;
    }
  }

  applyTheme(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Filtros na Home
  const filterBtns = document.querySelectorAll('.filter-btn');
  const topicCards = document.querySelectorAll('.topic-card');

  if (filterBtns.length > 0 && topicCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        topicCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Função utilitária para copiar referências no formato ABNT
  window.copyReference = function(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = buttonElement.innerText;
      buttonElement.innerText = 'Copiado!';
      buttonElement.style.color = 'var(--accent-emerald)';
      setTimeout(() => {
        buttonElement.innerText = originalText;
        buttonElement.style.color = '';
      }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar:', err);
    });
  };

  // Barra de leitura dinâmica (se existir elemento .reading-progress)
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // Gerenciamento genérico de Abas (.tabbed-card)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-nav-btn');
    if (!btn) return;
    const card = btn.closest('.tabbed-card');
    if (!card) return;
    const targetId = btn.getAttribute('data-tab');
    if (!targetId) return;

    card.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    card.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
      if (pane.id === targetId) {
        pane.classList.add('active');
      }
    });
  });

  // Gerenciamento global de Modais (.modal-backdrop)
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.querySelector('.modal-backdrop.active')) {
      document.body.style.overflow = '';
    }
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  document.addEventListener('click', (e) => {
    const openTrigger = e.target.closest('[data-open-modal]');
    if (openTrigger) {
      e.preventDefault();
      const targetId = openTrigger.getAttribute('data-open-modal');
      openModal(targetId);
      return;
    }

    const closeTrigger = e.target.closest('[data-close-modal]');
    if (closeTrigger) {
      e.preventDefault();
      const modal = closeTrigger.closest('.modal-backdrop');
      closeModal(modal);
      return;
    }

    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
    }
  });
})();

