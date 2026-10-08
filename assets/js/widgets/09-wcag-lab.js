/**
 * WIDGET 09: Laboratório de Acessibilidade Digital e WCAG 2.1 / 2.2
 * Referência: W3C WAI (Web Accessibility Initiative), Princípios POUR
 */

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function calculateContrastRatio(fgHex, bgHex) {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function initWcagWidget() {
  const fgInput = document.getElementById('wcag-fg-color');
  const bgInput = document.getElementById('wcag-bg-color');
  const previewBox = document.getElementById('wcag-preview-card');
  const ratioDisplay = document.getElementById('wcag-ratio-number');

  const badgeAaNormal = document.getElementById('badge-aa-normal');
  const badgeAaLarge = document.getElementById('badge-aa-large');
  const badgeAaaNormal = document.getElementById('badge-aaa-normal');
  const badgeAaaLarge = document.getElementById('badge-aaa-large');

  const daltonismSelect = document.getElementById('wcag-daltonism-select');

  if (!fgInput || !bgInput || !previewBox || !ratioDisplay) return;

  function updateContrast() {
    const fg = fgInput.value;
    const bg = bgInput.value;

    previewBox.style.color = fg;
    previewBox.style.backgroundColor = bg;

    const ratio = calculateContrastRatio(fg, bg);
    const formatted = ratio.toFixed(2);
    ratioDisplay.innerText = `${formatted} : 1`;

    function updateBadge(el, pass) {
      if (!el) return;
      el.className = `score-pill ${pass ? 'score-pass' : 'score-fail'}`;
      el.innerText = `${pass ? '✓ Passou' : '✗ Falhou'}`;
    }

    updateBadge(badgeAaNormal, ratio >= 4.5);
    updateBadge(badgeAaLarge, ratio >= 3.0);
    updateBadge(badgeAaaNormal, ratio >= 7.0);
    updateBadge(badgeAaaLarge, ratio >= 4.5);
  }

  fgInput.addEventListener('input', updateContrast);
  bgInput.addEventListener('input', updateContrast);

  if (daltonismSelect) {
    daltonismSelect.addEventListener('change', (e) => {
      const mode = e.target.value;
      let filterValue = 'none';

      switch (mode) {
        case 'protanopia':
          filterValue = 'url(#protanopia-filter)';
          break;
        case 'deuteranopia':
          filterValue = 'url(#deuteranopia-filter)';
          break;
        case 'tritanopia':
          filterValue = 'url(#tritanopia-filter)';
          break;
        case 'achromatopsia':
          filterValue = 'grayscale(100%)';
          break;
        default:
          filterValue = 'none';
      }

      previewBox.style.filter = filterValue;
    });
  }

  updateContrast();
}

document.addEventListener('DOMContentLoaded', initWcagWidget);
