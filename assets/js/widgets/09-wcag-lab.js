/**
 * WIDGET 09: Laboratório Avançado de Acessibilidade Digital & Diretrizes WCAG 2.1 / 2.2
 * Inclui:
 * 1. Avaliador de Contraste Matemático com Régua Visual e Simulador de Daltonismo & Baixa Visão
 * 2. Assistente Inteligente de Ajuste Acessível (Smart Contrast Auto-Fixer)
 * 3. Simulador de Leitor de Tela (Web Speech API + Árvore de Acessibilidade)
 * 4. Desafio Interativo de Auditoria WCAG (Checklist Capstone com Placar em Tempo Real)
 */

(function () {
  'use strict';

  // ===================================================================
  // MATEMÁTICA E UTILITÁRIOS WCAG (LUMINÂNCIA RELATIVA & CONTRASTE)
  // Conforme WCAG 2.1 / 2.2 - Recomendações W3C
  // ===================================================================

  function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  function hexToRgb(hex) {
    if (!hex) return { r: 0, g: 0, b: 0 };
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) return { r: 0, g: 0, b: 0 };
    const num = parseInt(hex, 16);
    if (isNaN(num)) return { r: 0, g: 0, b: 0 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbToHex(r, g, b) {
    const clamp = (val) => Math.max(0, Math.min(255, Math.round(val)));
    const toHex = (c) => clamp(c).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

  // Algoritmo para encontrar automaticamente uma variação acessível (>= targetRatio)
  function suggestAccessibleColor(fgHex, bgHex, targetRatio = 4.5) {
    const currentRatio = calculateContrastRatio(fgHex, bgHex);
    if (currentRatio >= targetRatio) return null;

    const bg = hexToRgb(bgHex);
    const bgLum = getLuminance(bg.r, bg.g, bg.b);
    const fg = hexToRgb(fgHex);

    // Se o fundo é claro (luminância > 0.4), devemos escurecer o texto
    // Se o fundo é escuro (luminância <= 0.4), devemos clarear o texto
    const shouldDarken = bgLum > 0.4;
    let r = fg.r;
    let g = fg.g;
    let b = fg.b;

    for (let step = 1; step <= 255; step++) {
      if (shouldDarken) {
        r = Math.max(0, r - 2);
        g = Math.max(0, g - 2);
        b = Math.max(0, b - 2);
      } else {
        r = Math.min(255, r + 2);
        g = Math.min(255, g + 2);
        b = Math.min(255, b + 2);
      }
      const testHex = rgbToHex(r, g, b);
      if (calculateContrastRatio(testHex, bgHex) >= targetRatio) {
        return testHex;
      }
    }
    return shouldDarken ? '#000000' : '#ffffff';
  }

  // ===================================================================
  // 1. ESTAÇÃO DE CONTRASTE & DALTONISMO
  // ===================================================================

  function initContrastStation() {
    const fgColor = document.getElementById('wcag-fg-color');
    const fgHex = document.getElementById('wcag-fg-hex');
    const bgColor = document.getElementById('wcag-bg-color');
    const bgHex = document.getElementById('wcag-bg-hex');
    const swapBtn = document.getElementById('wcag-swap-colors');

    const previewBox = document.getElementById('wcag-preview-card');
    const ratioDisplay = document.getElementById('wcag-ratio-number');
    const meterNeedle = document.getElementById('contrast-meter-needle');

    const badgeAaNormal = document.getElementById('badge-aa-normal');
    const badgeAaLarge = document.getElementById('badge-aa-large');
    const badgeAaaNormal = document.getElementById('badge-aaa-normal');
    const badgeAaaLarge = document.getElementById('badge-aaa-large');
    const badgeNonText = document.getElementById('badge-non-text');

    const suggestionBox = document.getElementById('wcag-suggestion-box');
    const suggestionText = document.getElementById('wcag-suggestion-text');
    const applySuggestionBtn = document.getElementById('wcag-apply-suggestion');

    const daltonismSelect = document.getElementById('wcag-daltonism-select');
    const presetButtons = document.querySelectorAll('[data-preset-fg]');

    if (!fgColor || !bgColor || !previewBox || !ratioDisplay) return;

    let suggestedHexColor = null;

    function updateStation() {
      const fg = fgColor.value;
      const bg = bgColor.value;

      // Sincroniza campos hex
      if (fgHex && document.activeElement !== fgHex) fgHex.value = fg.toUpperCase();
      if (bgHex && document.activeElement !== bgHex) bgHex.value = bg.toUpperCase();

      // Aplica estilo na prévia
      previewBox.style.color = fg;
      previewBox.style.backgroundColor = bg;

      // Amostra de botão dentro do preview
      const previewBtn = previewBox.querySelector('.preview-action-btn');
      if (previewBtn) {
        previewBtn.style.borderColor = fg;
        previewBtn.style.color = fg;
      }

      // Calcula razão de contraste
      const ratio = calculateContrastRatio(fg, bg);
      const formatted = ratio.toFixed(2);
      ratioDisplay.innerText = `${formatted} : 1`;

      // Posiciona agulha no medidor (escala de 1 a 21)
      if (meterNeedle) {
        // Mapeamento não-linear para melhor visibilidade dos valores 1 a 7
        // 1:1 -> 0%, 3:1 -> 14%, 4.5:1 -> 21.5%, 7:1 -> 33.3%, 21:1 -> 100%
        let percent = 0;
        if (ratio <= 3) {
          percent = ((ratio - 1) / 2) * 14;
        } else if (ratio <= 4.5) {
          percent = 14 + ((ratio - 3) / 1.5) * 7.5;
        } else if (ratio <= 7) {
          percent = 21.5 + ((ratio - 4.5) / 2.5) * 11.8;
        } else {
          percent = 33.3 + ((ratio - 7) / 14) * 66.7;
        }
        percent = Math.max(0, Math.min(100, percent));
        meterNeedle.style.left = `${percent}%`;
        meterNeedle.setAttribute('aria-label', `Razão ${formatted} de 21`);
      }

      // Atualiza badges
      function setPill(el, pass) {
        if (!el) return;
        el.className = `score-pill ${pass ? 'score-pass' : 'score-fail'}`;
        el.innerHTML = pass ? '✓ Passou' : '✗ Falhou';
      }

      setPill(badgeAaNormal, ratio >= 4.5);
      setPill(badgeAaLarge, ratio >= 3.0);
      setPill(badgeAaaNormal, ratio >= 7.0);
      setPill(badgeAaaLarge, ratio >= 4.5);
      setPill(badgeNonText, ratio >= 3.0);

      // Assistente Inteligente de Ajuste
      if (ratio < 4.5) {
        suggestedHexColor = suggestAccessibleColor(fg, bg, 4.5);
        if (suggestedHexColor && suggestionBox && suggestionText) {
          suggestionBox.style.display = 'flex';
          suggestionText.innerHTML = `O contraste atual (${formatted}:1) não atinge o Nível AA (4.5:1). Sugestão de cor ajustada: <code style="font-weight:700; color:var(--primary);">${suggestedHexColor.toUpperCase()}</code>.`;
        }
      } else {
        suggestedHexColor = null;
        if (suggestionBox) {
          suggestionBox.style.display = 'none';
        }
      }
    }

    // Eventos de Input e Cor
    fgColor.addEventListener('input', updateStation);
    bgColor.addEventListener('input', updateStation);

    if (fgHex) {
      fgHex.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          fgColor.value = val;
          updateStation();
        }
      });
    }

    if (bgHex) {
      bgHex.addEventListener('input', (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          bgColor.value = val;
          updateStation();
        }
      });
    }

    // Botão Inverter Cores
    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const temp = fgColor.value;
        fgColor.value = bgColor.value;
        bgColor.value = temp;
        updateStation();
      });
    }

    // Botão Aplicar Sugestão Inteligente
    if (applySuggestionBtn) {
      applySuggestionBtn.addEventListener('click', () => {
        if (suggestedHexColor) {
          fgColor.value = suggestedHexColor;
          updateStation();
        }
      });
    }

    // Botões de Presets
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const pFg = btn.getAttribute('data-preset-fg');
        const pBg = btn.getAttribute('data-preset-bg');
        if (pFg && pBg) {
          fgColor.value = pFg;
          bgColor.value = pBg;
          updateStation();
        }
      });
    });

    // Simulador de Daltonismo e Baixa Visão
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
          case 'low-vision':
            filterValue = 'blur(2.2px)';
            break;
          default:
            filterValue = 'none';
        }

        previewBox.style.filter = filterValue;
      });
    }

    // Inicializa a estação
    updateStation();
  }

  // ===================================================================
  // 2. SIMULADOR DE LEITOR DE TELA (ACCESSIBILITY TREE & WEB SPEECH)
  // ===================================================================

  function initScreenReaderStation() {
    const playBadBtn = document.getElementById('sr-play-bad');
    const playGoodBtn = document.getElementById('sr-play-good');
    const consoleText = document.getElementById('sr-speech-text');
    const waveAnim = document.getElementById('sr-wave-indicator');
    const a11yTreeCode = document.getElementById('sr-a11y-tree-code');

    if (!playBadBtn || !playGoodBtn || !consoleText) return;

    let currentUtterance = null;

    function speakText(textToSpeak, displayText, treeCode) {
      // Atualiza árvore de acessibilidade
      if (a11yTreeCode && treeCode) {
        a11yTreeCode.textContent = treeCode;
      }

      // Atualiza texto no console
      consoleText.innerHTML = displayText;
      if (waveAnim) waveAnim.style.display = 'inline-flex';

      // Dispara síntese de voz nativa se suportada
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // para anteriores
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.05;

        utterance.onend = () => {
          if (waveAnim) waveAnim.style.display = 'none';
        };

        utterance.onerror = () => {
          if (waveAnim) waveAnim.style.display = 'none';
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback visual temporizado se a API não estiver disponível
        setTimeout(() => {
          if (waveAnim) waveAnim.style.display = 'none';
        }, 3000);
      }
    }

    playBadBtn.addEventListener('click', () => {
      const speech = 'Texto simples. Finalizar pedido.';
      const display = '<span style="color:#f43f5e;">[Semântica Nula]</span> "Finalizar pedido." <small style="display:block; color:#94a3b8; margin-top:0.3rem;">O leitor lê apenas como texto solto. Não anuncia que é clicável, não possui foco de teclado e não reage a Enter ou Espaço.</small>';
      const tree = `<!-- Árvore de Acessibilidade (Accessibility Tree) do Navegador -->
Node: <generic>
  Accessible Name: "" (Vazio)
  Role: none / generic
  Focusable: false (Inatingível via Tab)
  Actions: none (Leitor não sabe que dispara ação)`;
      speakText(speech, display, tree);
    });

    playGoodBtn.addEventListener('click', () => {
      const speech = 'Botão. Finalizar pedido com pagamento seguro. Pressione Espaço para acionar.';
      const display = '<span style="color:#10b981;">[Semântica Perfeita]</span> "Botão, Finalizar pedido com pagamento seguro. Pressione Espaço para ativar." <small style="display:block; color:#94a3b8; margin-top:0.3rem;">O leitor reconhece o papel nativo de botão, anuncia o nome acessível e instrui o usuário sobre o atalho de teclado.</small>';
      const tree = `<!-- Árvore de Acessibilidade (Accessibility Tree) do Navegador -->
Node: <button>
  Accessible Name: "Finalizar pedido com pagamento seguro"
  Role: button
  Focusable: true (Atingível via Tab)
  Keyboard Shortcuts: Enter, Spacebar
  State: enabled, visible`;
      speakText(speech, display, tree);
    });
  }

  // ===================================================================
  // 3. DESAFIO CAPSTONE DE AUDITORIA WCAG (CHECKLIST INTERATIVO)
  // ===================================================================

  function initAuditChallenge() {
    const scoreDisplay = document.getElementById('audit-score-text');
    const progressBar = document.getElementById('audit-progress-bar');
    const badgeStatus = document.getElementById('audit-status-badge');

    const switchLabel = document.getElementById('audit-fix-label');
    const switchError = document.getElementById('audit-fix-error');
    const switchContrast = document.getElementById('audit-fix-contrast');
    const switchFocus = document.getElementById('audit-fix-focus');

    // Elementos da interface sob teste
    const demoEmailInput = document.getElementById('demo-email-input');
    const demoEmailLabel = document.getElementById('demo-email-label');
    const demoErrorMsg = document.getElementById('demo-error-msg');
    const demoSubmitBtn = document.getElementById('demo-submit-btn');

    if (!scoreDisplay || !switchLabel || !switchError || !switchContrast || !switchFocus) return;

    const switches = [switchLabel, switchError, switchContrast, switchFocus];

    function evaluateAudit() {
      let resolvedCount = 0;

      // 1. Label
      if (switchLabel.checked) {
        resolvedCount++;
        if (demoEmailLabel) demoEmailLabel.style.display = 'block';
        if (demoEmailInput) {
          demoEmailInput.setAttribute('id', 'demo-input-accessible');
          demoEmailLabel.setAttribute('for', 'demo-input-accessible');
          demoEmailInput.removeAttribute('aria-label');
        }
        document.getElementById('row-issue-label')?.classList.add('resolved');
      } else {
        if (demoEmailLabel) demoEmailLabel.style.display = 'none';
        document.getElementById('row-issue-label')?.classList.remove('resolved');
      }

      // 2. Erro (Não usar apenas cor)
      if (switchError.checked) {
        resolvedCount++;
        if (demoErrorMsg) {
          demoErrorMsg.innerHTML = '<span aria-hidden="true" style="font-weight:bold; margin-right:4px;">⚠</span> <strong>Erro:</strong> Informe um endereço de e-mail válido (exemplo: usuario@dominio.com).';
          demoErrorMsg.style.color = '#b91c1c';
          demoErrorMsg.setAttribute('role', 'alert');
        }
        document.getElementById('row-issue-error')?.classList.add('resolved');
      } else {
        if (demoErrorMsg) {
          demoErrorMsg.innerHTML = 'Preenchimento incorreto.';
          demoErrorMsg.style.color = '#f87171'; // cor suave sem ícone
          demoErrorMsg.removeAttribute('role');
        }
        document.getElementById('row-issue-error')?.classList.remove('resolved');
      }

      // 3. Contraste do Botão
      if (switchContrast.checked) {
        resolvedCount++;
        if (demoSubmitBtn) {
          demoSubmitBtn.style.backgroundColor = '#1d4ed8'; // Azul com 8.5:1 sobre branco
          demoSubmitBtn.style.color = '#ffffff';
          demoSubmitBtn.style.border = '1px solid #1e40af';
        }
        document.getElementById('row-issue-contrast')?.classList.add('resolved');
      } else {
        if (demoSubmitBtn) {
          demoSubmitBtn.style.backgroundColor = '#e2e8f0'; // Cinza claro
          demoSubmitBtn.style.color = '#94a3b8'; // Cinza médio (Razão ~1.8:1 - reprovado)
          demoSubmitBtn.style.border = '1px solid #cbd5e1';
        }
        document.getElementById('row-issue-contrast')?.classList.remove('resolved');
      }

      // 4. Foco Visível
      if (switchFocus.checked) {
        resolvedCount++;
        if (demoSubmitBtn) demoSubmitBtn.classList.remove('focus-hidden');
        if (demoEmailInput) demoEmailInput.classList.remove('focus-hidden');
        document.getElementById('row-issue-focus')?.classList.add('resolved');
      } else {
        if (demoSubmitBtn) demoSubmitBtn.classList.add('focus-hidden');
        if (demoEmailInput) demoEmailInput.classList.add('focus-hidden');
        document.getElementById('row-issue-focus')?.classList.remove('resolved');
      }

      // Atualiza placar
      const percent = Math.round((resolvedCount / switches.length) * 100);
      scoreDisplay.innerText = `${percent}% (${resolvedCount}/${switches.length} Critérios)`;
      if (progressBar) progressBar.style.width = `${percent}%`;

      if (badgeStatus) {
        if (percent === 100) {
          badgeStatus.className = 'score-pill score-pass';
          badgeStatus.innerHTML = '★ 100% Conforme WCAG 2.2 AA';
        } else if (percent >= 50) {
          badgeStatus.className = 'score-pill';
          badgeStatus.style.background = 'var(--accent-amber-light)';
          badgeStatus.style.color = 'var(--accent-amber)';
          badgeStatus.innerHTML = 'Em Progresso';
        } else {
          badgeStatus.className = 'score-pill score-fail';
          badgeStatus.innerHTML = 'Não Conforme (Inacessível)';
        }
      }
    }

    switches.forEach(sw => sw.addEventListener('change', evaluateAudit));
    evaluateAudit();
  }

  // Inicializador geral chamado tanto no DOMContentLoaded quanto imediatamente se o DOM já estiver pronto
  function initializeAllWcagModules() {
    initContrastStation();
    initScreenReaderStation();
    initAuditChallenge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllWcagModules);
  } else {
    initializeAllWcagModules();
  }
})();
