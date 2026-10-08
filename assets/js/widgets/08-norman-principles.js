/**
 * WIDGET 08: Laboratório Avançado de Interaction Design & Princípios de Norman
 * Inclui:
 * 1. Minigame de Reação Cognitiva do Fogão (Mapeamento Arbitrário vs Natural)
 * 2. O Paradoxo do Termostato de Norman (Modelo Mental vs Modelo Físico)
 * 3. Estação de Redesign & Auditoria dos Abismos de Norman (Índice de Usabilidade)
 */

// ===================================================================
// ESTAÇÃO 1: TESTE DE REAÇÃO COGNITIVA DO FOGÃO (MAPEAMENTO)
// ===================================================================
const burnerPositions = [
  { id: 'tl', name: 'Superior-Esquerda', index: 0 },
  { id: 'tr', name: 'Superior-Direita', index: 1 },
  { id: 'bl', name: 'Inferior-Esquerda', index: 2 },
  { id: 'br', name: 'Inferior-Direita', index: 3 }
];

// No mapeamento arbitrário, botões [0, 1, 2, 3] acionam posições confusas:
const arbitraryMappingConfig = [3, 0, 2, 1]; // Botão 0 aciona BR, Botão 1 aciona TL, etc.

let stoveCurrentMission = null;
let stoveMissionStartTime = null;
let stoveReactionTimerInterval = null;
let stoveGameStats = {
  arbitrary: { trials: 0, totalTime: 0, errors: 0 },
  natural: { trials: 0, totalTime: 0, errors: 0 }
};

function initStoveReactionGame() {
  const startBtn = document.getElementById('stove-start-challenge-btn');
  const missionTextEl = document.getElementById('stove-mission-text');
  const missionBannerEl = missionTextEl ? missionTextEl.closest('.mission-banner') : null;
  const timerDisplay = document.getElementById('stove-reaction-timer');
  const mappingModeToggle = document.getElementById('stove-game-mapping-mode');
  const burners = {
    tl: document.getElementById('game-burner-tl'),
    tr: document.getElementById('game-burner-tr'),
    bl: document.getElementById('game-burner-bl'),
    br: document.getElementById('game-burner-br')
  };
  const knobs = document.querySelectorAll('.game-stove-knob');
  const resultReportEl = document.getElementById('stove-game-report');

  if (!startBtn || !missionTextEl || !knobs.length) return;

  function isNatural() {
    return mappingModeToggle && mappingModeToggle.checked;
  }

  function launchMission() {
    // Escolhe boca aleatória
    const target = burnerPositions[Math.floor(Math.random() * burnerPositions.length)];
    stoveCurrentMission = target;

    // Reseta visuais
    Object.values(burners).forEach(b => {
      if (b) {
        b.classList.remove('hot');
        b.style.borderColor = '#64748b';
      }
    });

    const targetEl = burners[target.id];
    if (targetEl) {
      targetEl.classList.add('hot');
    }

    if (missionBannerEl) {
      missionBannerEl.classList.remove('banner-success', 'banner-error');
      missionBannerEl.classList.add('banner-emergency');
    }

    missionTextEl.innerHTML = `🚨 EMERGÊNCIA: A panela na boca <span style="color:var(--accent-rose); font-weight:800; text-decoration:underline;">[${target.name}]</span> está fervendo! Acione o controle correspondente AGORA!`;

    stoveMissionStartTime = performance.now();
    if (stoveReactionTimerInterval) clearInterval(stoveReactionTimerInterval);

    stoveReactionTimerInterval = setInterval(() => {
      const elapsed = Math.round(performance.now() - stoveMissionStartTime);
      if (timerDisplay) timerDisplay.innerText = `${elapsed}ms`;
    }, 20);
  }

  startBtn.addEventListener('click', () => {
    startBtn.innerText = "Próxima Rodada";
    launchMission();
  });

  knobs.forEach((knob, knobIndex) => {
    knob.addEventListener('click', () => {
      if (!stoveCurrentMission || !stoveMissionStartTime) return;

      const elapsed = Math.round(performance.now() - stoveMissionStartTime);
      clearInterval(stoveReactionTimerInterval);
      stoveReactionTimerInterval = null;

      const natural = isNatural();
      const activatedBurnerIndex = natural ? knobIndex : arbitraryMappingConfig[knobIndex];
      const activatedPos = burnerPositions[activatedBurnerIndex];
      const isCorrect = activatedPos.id === stoveCurrentMission.id;

      const modeKey = natural ? 'natural' : 'arbitrary';
      stoveGameStats[modeKey].trials++;
      stoveGameStats[modeKey].totalTime += elapsed;
      if (!isCorrect) stoveGameStats[modeKey].errors++;

      if (isCorrect) {
        if (missionBannerEl) {
          missionBannerEl.classList.remove('banner-emergency', 'banner-error');
          missionBannerEl.classList.add('banner-success');
        }
        missionTextEl.innerHTML = `✓ <strong style="color:var(--accent-emerald);">Acerto em ${elapsed}ms!</strong> Você acionou corretamente o controle da boca ${activatedPos.name}.`;
      } else {
        if (missionBannerEl) {
          missionBannerEl.classList.remove('banner-emergency', 'banner-success');
          missionBannerEl.classList.add('banner-error');
        }
        missionTextEl.innerHTML = `💥 <strong style="color:var(--accent-rose);">ERRO COGNITIVO!</strong> Você clicou no controle que acionou a boca <em>${activatedPos.name}</em>, mas a emergência era na <em>${stoveCurrentMission.name}</em>!`;
      }

      stoveCurrentMission = null;

      // Atualiza relatório comparativo
      updateStoveReport(resultReportEl);
    });
  });

  if (mappingModeToggle) {
    mappingModeToggle.addEventListener('change', () => {
      const natural = isNatural();
      const knobsContainer = document.getElementById('game-knobs-container');
      if (knobsContainer) {
        if (natural) {
          knobsContainer.style.display = 'grid';
          knobsContainer.style.gridTemplateColumns = 'repeat(2, 90px)';
          knobsContainer.style.gap = '1rem';
        } else {
          knobsContainer.style.display = 'flex';
          knobsContainer.style.gap = '0.5rem';
        }
      }
      if (missionBannerEl) {
        missionBannerEl.classList.remove('banner-emergency', 'banner-success', 'banner-error');
      }
      if (missionTextEl) {
        missionTextEl.innerHTML = `Modo alterado para <strong>${natural ? 'Mapeamento Natural (2x2)' : 'Mapeamento Arbitrário (Linear)'}</strong>. Clique em 'Próxima Rodada' para testar seus reflexos!`;
      }
    });
  }

}

function updateStoveReport(reportEl) {
  if (!reportEl) return;
  const arb = stoveGameStats.arbitrary;
  const nat = stoveGameStats.natural;

  const arbAvg = arb.trials > 0 ? Math.round(arb.totalTime / arb.trials) : 0;
  const natAvg = nat.trials > 0 ? Math.round(nat.totalTime / nat.trials) : 0;
  const arbErrRate = arb.trials > 0 ? Math.round((arb.errors / arb.trials) * 100) : 0;
  const natErrRate = nat.trials > 0 ? Math.round((nat.errors / nat.trials) * 100) : 0;

  reportEl.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
      <div style="background:var(--accent-rose-light); border:1px solid rgba(244,63,94,0.3); padding:0.75rem; border-radius:var(--radius-sm);">
        <strong style="color:var(--accent-rose);">Mapeamento Arbitrário (Linear)</strong>
        <div style="font-size:0.85rem; margin-top:0.25rem;">
          Testes: <strong>${arb.trials}</strong> | Média: <strong>${arbAvg}ms</strong> | Taxa de Erro: <strong>${arbErrRate}%</strong>
        </div>
      </div>
      <div style="background:var(--accent-emerald-light); border:1px solid rgba(16,185,129,0.3); padding:0.75rem; border-radius:var(--radius-sm);">
        <strong style="color:var(--accent-emerald);">Mapeamento Natural (Espacial 2x2)</strong>
        <div style="font-size:0.85rem; margin-top:0.25rem;">
          Testes: <strong>${nat.trials}</strong> | Média: <strong>${natAvg}ms</strong> | Taxa de Erro: <strong>${natErrRate}%</strong>
        </div>
      </div>
    </div>
    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem; font-style:italic;">
      💡 <strong>Conclusão Ergonômica:</strong> O mapeamento natural reduz a sobrecarga de memória de trabalho. A geometria dos comandos processada pelo córtex visual guia a ação motora diretamente, eliminando o cálculo consciente!
    </div>
  `;
}

// ===================================================================
// ESTAÇÃO 2: O PARADOXO DO TERMOSTATO DE DON NORMAN
// ===================================================================
let thermostatSimInterval = null;
let thermostatCurrentTemp = 24.0; // °C
let thermostatTargetTemp = 4.0;
let thermostatDialValue = 5; // 1 a 10
let thermostatDesignMode = 'bad'; // 'bad' vs 'good'

function initThermostatSimulation() {
  const modeSelect = document.getElementById('thermostat-mode-select');
  const badControls = document.getElementById('thermostat-bad-controls');
  const goodControls = document.getElementById('thermostat-good-controls');
  const dialSlider = document.getElementById('thermostat-dial-slider');
  const dialDisplay = document.getElementById('thermostat-dial-display');
  const celsiusInput = document.getElementById('thermostat-celsius-input');

  const currentTempDisplay = document.getElementById('thermostat-current-temp');
  const targetTempDisplay = document.getElementById('thermostat-target-temp');
  const compressorStatusPill = document.getElementById('thermostat-compressor-pill');
  const mentalModelBox = document.getElementById('thermostat-mental-model-explanation');

  if (!currentTempDisplay || !dialSlider) return;

  function updateVisuals() {
    if (currentTempDisplay) currentTempDisplay.innerText = `${thermostatCurrentTemp.toFixed(1)}°C`;
    if (targetTempDisplay) targetTempDisplay.innerText = `${thermostatTargetTemp.toFixed(1)}°C`;

    const isCompressorRunning = thermostatCurrentTemp > thermostatTargetTemp;

    if (compressorStatusPill) {
      if (isCompressorRunning) {
        compressorStatusPill.className = 'compressor-status-pill compressor-on';
        compressorStatusPill.innerHTML = `⚡ Compressor LIGADO (Potência fixa constante: 100%)`;
      } else {
        compressorStatusPill.className = 'compressor-status-pill compressor-off';
        compressorStatusPill.innerHTML = `💤 Compressor em STANDBY (Meta atingida)`;
      }
    }

    if (mentalModelBox) {
      if (thermostatDesignMode === 'bad') {
        mentalModelBox.innerHTML = `
          <strong style="color:var(--accent-rose);">Ilusão do Modelo Mental (Escala 1 a 10):</strong><br>
          O usuário colocou no nível <strong>${thermostatDialValue}</strong> achando que a geladeira vai esfriar <em>${thermostatDialValue * 10}% mais rápido</em> (metáfora de acelerador de carro).<br>
          <span style="color:var(--text-secondary); font-size:0.85rem;">
            <strong>A Realidade Física do Sistema:</strong> O motor da geladeira só tem UMA velocidade. Ele trabalha a 100% de qualquer jeito. Colocar no 10 não esfria mais rápido &mdash; apenas faz a meta cair para congelamento desnecessário, gastando o dobro de energia elétrica!
          </span>
        `;
      } else {
        mentalModelBox.innerHTML = `
          <strong style="color:var(--accent-emerald);">Alinhamento do Modelo Conceitual (Graus Celsius Reais):</strong><br>
          O usuário selecionou explicitamente a meta de <strong>${thermostatTargetTemp}°C</strong>. O sistema exibe o tempo estimado e informa com transparência que o resfriamento opera em taxa termodinâmica constante.<br>
          <span style="color:var(--text-secondary); font-size:0.85rem;">
            O modelo mental do ser humano casa perfeitamente com a engenharia mecânica da máquina.
          </span>
        `;
      }
    }
  }

  // Loop de simulação termodinâmica
  if (thermostatSimInterval) clearInterval(thermostatSimInterval);
  thermostatSimInterval = setInterval(() => {
    if (thermostatCurrentTemp > thermostatTargetTemp) {
      thermostatCurrentTemp -= 0.15; // taxa física fixa de resfriamento
      if (thermostatCurrentTemp < thermostatTargetTemp) {
        thermostatCurrentTemp = thermostatTargetTemp;
      }
      updateVisuals();
    }
  }, 300);

  if (dialSlider) {
    dialSlider.addEventListener('input', (e) => {
      thermostatDialValue = parseInt(e.target.value, 10);
      if (dialDisplay) dialDisplay.innerText = thermostatDialValue;
      // Nível 1 = 12°C, Nível 10 = -2°C
      thermostatTargetTemp = 14 - (thermostatDialValue * 1.5);
      updateVisuals();
    });
  }

  if (celsiusInput) {
    celsiusInput.addEventListener('change', (e) => {
      thermostatTargetTemp = parseFloat(e.target.value);
      updateVisuals();
    });
  }

  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      thermostatDesignMode = e.target.value;
      if (thermostatDesignMode === 'bad') {
        if (badControls) badControls.style.display = 'block';
        if (goodControls) goodControls.style.display = 'none';
        thermostatTargetTemp = 14 - (thermostatDialValue * 1.5);
      } else {
        if (badControls) badControls.style.display = 'none';
        if (goodControls) goodControls.style.display = 'block';
        if (celsiusInput) thermostatTargetTemp = parseFloat(celsiusInput.value);
      }
      thermostatCurrentTemp = 24.0; // reseta para calor
      updateVisuals();
    });
  }

  updateVisuals();
}

// ===================================================================
// ESTAÇÃO 3: AUDITORIA DOS ABISMOS & ESTÚDIO DE REDESIGN INTERATIVO
// ===================================================================
const auditFlawsData = [
  {
    id: 'flaw-signifier',
    title: '1. Botão Crítico Invisível (Sem Signifier)',
    principle: 'Signifiers & Affordance',
    gulf: 'Abismo de Execução (O usuário não sabe onde clicar)',
    problem: 'O botão de ligar o sistema está disfarçado como um simples texto cinza plano, sem borda, sombra ou contraste.',
    solution: 'Adicionamos relevo de botão com sombra tridimensional, ícone universal e estado de hover evidente.',
    resolved: false
  },
  {
    id: 'flaw-mapping',
    title: '2. Persianas Invertidas (Mapeamento Ruim)',
    principle: 'Mapeamento Natural (Mapping)',
    gulf: 'Abismo de Execução (Ação do controle contradiz o efeito físico)',
    problem: 'O botão com seta para CIMA está programado para fechar a cortina para BAIXO, contrariando o mapeamento natural.',
    solution: 'Alinhamos a seta para CIMA com o recolhimento da persiana para CIMA.',
    resolved: false
  },
  {
    id: 'flaw-feedback',
    title: '3. Botão Mudo sem Confirmação (Sem Feedback)',
    principle: 'Feedback Imediato',
    gulf: 'Abismo de Avaliação (O usuário não sabe se o sistema operou)',
    problem: 'Ao salvar preferências, a interface congela por 4 segundos sem nenhum aviso visual nem alteração de estado.',
    solution: 'Adicionamos spinner de carregamento imediato no botão e toast de confirmação verde: "Preferências salvas com sucesso!".',
    resolved: false
  },
  {
    id: 'flaw-constraints',
    title: '4. Reset de Fábrica Destrutivo sem Proteção (Sem Restrições)',
    principle: 'Restrições (Constraints)',
    gulf: 'Prevenção de Erros Catastróficos',
    problem: 'O botão vermelho "Apagar Todos os Dados" está colado ao botão de "Ligar Luzes", sem pedir nenhuma confirmação prévia.',
    solution: 'Isolamos a ação em uma gaveta de segurança com trava de confirmação por texto ("Digite CONFIRMAR para prosseguir").',
    resolved: false
  }
];

function initAuditRedesignStudio() {
  const listContainer = document.getElementById('audit-flaws-list');
  const detailsBox = document.getElementById('audit-flaw-details');
  const applyFixBtn = document.getElementById('audit-apply-fix-btn');
  const scorePercentEl = document.getElementById('audit-score-percent');
  const scoreBarFill = document.getElementById('audit-score-bar-fill');
  const previewScreen = document.getElementById('audit-preview-screen');

  if (!listContainer || !detailsBox) return;

  let activeFlawIndex = 0;

  function renderList() {
    listContainer.innerHTML = auditFlawsData.map((flaw, idx) => `
      <div class="flaw-interactive-card ${idx === activeFlawIndex ? 'active' : ''} ${flaw.resolved ? 'resolved' : ''}" data-idx="${idx}">
        <div>
          <strong>${flaw.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${flaw.principle} &bull; ${flaw.gulf}</div>
        </div>
        <span class="badge" style="${flaw.resolved ? 'background:var(--accent-emerald-light); color:var(--accent-emerald);' : 'background:var(--accent-rose-light); color:var(--accent-rose);'}">
          ${flaw.resolved ? '✓ Corrigido' : '⚡ Falha Ativa'}
        </span>
      </div>
    `).join('');

    renderDetails();
    updateScore();
  }

  function renderDetails() {
    const flaw = auditFlawsData[activeFlawIndex];
    if (!flaw) return;

    detailsBox.innerHTML = `
      <h4 style="margin:0 0 0.5rem; color:var(--primary); font-size:1.05rem;">${flaw.title}</h4>
      <div style="font-size:0.85rem; margin-bottom:0.6rem;">
        <strong>Princípio Envolvido:</strong> ${flaw.principle}<br>
        <strong>Abismo Psicológico Afetado:</strong> <span style="color:var(--accent-rose); font-weight:700;">${flaw.gulf}</span>
      </div>
      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.85rem; margin-bottom:0.75rem; font-size:0.85rem;">
        <strong>Diagnóstico da Falha:</strong> ${flaw.problem}
      </div>
      <div style="background:var(--accent-emerald-light); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-sm); padding:0.85rem; font-size:0.85rem; color:var(--text-primary);">
        <strong>Solução de Redesign em IHC:</strong> ${flaw.solution}
      </div>
    `;

    if (applyFixBtn) {
      applyFixBtn.innerText = flaw.resolved ? "Reverter para Interface Quebrada" : "Aplicar Redesign de IHC";
      applyFixBtn.className = flaw.resolved ? "btn btn-outline" : "btn btn-primary";
    }

    renderMockupScreen();
  }

  function updateScore() {
    const resolvedCount = auditFlawsData.filter(f => f.resolved).length;
    const total = auditFlawsData.length;
    const percentage = Math.round((resolvedCount / total) * 100);

    if (scorePercentEl) scorePercentEl.innerText = `${percentage}%`;
    if (scoreBarFill) scoreBarFill.style.width = `${percentage}%`;
  }

  function renderMockupScreen() {
    if (!previewScreen) return;
    const fSignifier = auditFlawsData[0].resolved;
    const fMapping = auditFlawsData[1].resolved;
    const fFeedback = auditFlawsData[2].resolved;
    const fConstraints = auditFlawsData[3].resolved;

    previewScreen.innerHTML = `
      <div style="background:var(--bg-subtle); border-bottom:1px solid var(--border-color); padding:0.5rem 0.75rem; font-size:0.8rem; font-weight:700; display:flex; justify-content:space-between;">
        <span>Painel de Controle Smart Facility v2.0</span>
        <span style="font-family:'JetBrains Mono', monospace; color:var(--text-muted);">${fSignifier && fMapping && fFeedback && fConstraints ? '🟢 ESTÁVEL' : '🔴 VULNERÁVEL'}</span>
      </div>
      <div style="padding:1.25rem;">
        <!-- Componente 1: Botão Master Ligar/Desligar -->
        <div style="margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color);">
          <div style="font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Sistema de Ventilação Central:</div>
          ${fSignifier 
            ? `<button class="btn btn-primary" style="padding:0.4rem 0.8rem; font-size:0.8rem; display:flex; align-items:center; gap:0.4rem;">
                <span>🔘</span> Ligar Ventilação Central (Signifier em Destaque)
               </button>`
            : `<span style="color:#94a3b8; font-size:0.8rem; text-decoration:none; cursor:pointer;" title="Clique secreto">
                ligar ventilacao central (parece texto plano, sem botão!)
               </span>`
          }
        </div>

        <!-- Componente 2: Persianas -->
        <div style="margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color);">
          <div style="font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Persiana Automatizada:</div>
          <div style="display:flex; gap:0.5rem;">
            ${fMapping
              ? `<button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem;">▲ Subir Persiana (Mapeamento Correto)</button>
                 <button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem;">▼ Descer Persiana</button>`
              : `<button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem; color:var(--accent-rose);">▲ (Desce a persiana! Mapeamento Invertido)</button>
                 <button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem; color:var(--accent-rose);">▼ (Sobe a persiana!)</button>`
            }
          </div>
        </div>

        <!-- Componente 3: Salvar com Feedback -->
        <div style="margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border-color);">
          <div style="font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Preferências de Iluminação:</div>
          <div style="display:flex; gap:0.5rem; align-items:center;">
            ${fFeedback
              ? `<button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem; border-color:var(--accent-emerald); color:var(--accent-emerald);">
                  ✓ Salvo instantaneamente (Toast + Som de clique)
                 </button>`
              : `<button class="btn btn-outline" style="padding:0.3rem 0.6rem; font-size:0.8rem;">
                  Salvar Preferências (Inerte por 4 segundos!)
                 </button>`
            }
          </div>
        </div>

        <!-- Componente 4: Reset com Restrições -->
        <div>
          <div style="font-size:0.8rem; font-weight:600; margin-bottom:0.35rem;">Zona de Risco:</div>
          ${fConstraints
            ? `<div style="background:var(--bg-subtle); padding:0.6rem; border-radius:4px; font-size:0.8rem;">
                🔒 <strong>Ação de Alto Risco Bloqueada:</strong> Exige confirmação explícita de senha antes de resetar.
               </div>`
            : `<button class="btn" style="background:var(--accent-rose); color:#fff; padding:0.3rem 0.6rem; font-size:0.8rem;">
                💥 Resetar Toda a Planta Industrial (Sem confirmação, ao lado dos outros botões!)
               </button>`
          }
        </div>
      </div>
    `;
  }

  listContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.flaw-interactive-card');
    if (!card) return;
    activeFlawIndex = parseInt(card.getAttribute('data-idx'), 10);
    renderList();
  });

  if (applyFixBtn) {
    applyFixBtn.addEventListener('click', () => {
      const flaw = auditFlawsData[activeFlawIndex];
      if (!flaw) return;
      flaw.resolved = !flaw.resolved;
      renderList();
    });
  }

  renderList();
}

// ===================================================================
// ESTAÇÃO 4: LABORATÓRIO DE AFFORDANCE PERCEPTÍVEL
// ===================================================================
function initAffordanceLab() {
  const modeSelect = document.getElementById('affordance-mode-select');
  const targetBoxes = document.querySelectorAll('.affordance-target-box');
  const feedbackConsole = document.getElementById('affordance-lab-console');
  const resetBtn = document.getElementById('affordance-reset-btn');

  if (!targetBoxes.length) return;

  let clicksLog = [];

  function updateMode(mode) {
    const isFlat = mode === 'flat';
    targetBoxes.forEach(box => {
      const type = box.getAttribute('data-type');
      const actionEl = box.querySelector('.affordance-actionable');
      if (!actionEl) return;

      if (isFlat) {
        actionEl.className = 'affordance-actionable btn-affordance-flat';
        actionEl.style.boxShadow = 'none';
        actionEl.style.cursor = 'default';
      } else {
        if (type === 'zero') {
          actionEl.className = 'affordance-actionable btn-affordance-zero';
        } else if (type === 'modern') {
          actionEl.className = 'affordance-actionable btn-affordance-rich';
        } else if (type === 'skeuo') {
          actionEl.className = 'affordance-actionable btn btn-primary';
          actionEl.style.boxShadow = '0 6px 0 #312e81, 0 8px 12px rgba(0,0,0,0.2)';
        } else {
          actionEl.className = 'affordance-actionable btn btn-outline';
        }
      }
    });

    if (feedbackConsole) {
      feedbackConsole.innerHTML = isFlat 
        ? `<span style="color:var(--accent-rose);">[Modo Flat Extremo Ativo]</span> Todos os elementos perderam relevo, sombras e pistas de cursor. Clique nos cartões para avaliar a dificuldade de saber o que é acionável!`
        : `<span style="color:var(--accent-emerald);">[Modo Affordance Diferenciada Ativo]</span> Elementos utilizam pistas visuais perceptíveis de profundidade e cursor.`;
    }
  }

  targetBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
      const type = box.getAttribute('data-type');
      const label = box.getAttribute('data-label') || type;
      clicksLog.push(label);

      let diagnosis = '';
      if (type === 'zero') {
        diagnosis = `⚠️ <strong>Texto Plano:</strong> Parece um rótulo estático. Usuários reais raramente tentam clicar aqui sem instruções explícitas (Gibson, 1979).`;
      } else if (type === 'flat') {
        diagnosis = `ℹ️ <strong>Retângulo Chapado:</strong> Ausência de profundidade ou cursor específico cria dúvida ("será que é apenas um banner?").`;
      } else if (type === 'modern') {
        diagnosis = `✓ <strong>Affordance Moderna (Sombra + Elevação + Pointer):</strong> O cérebro decodifica o elemento instantaneamente como um botão tridimensional acionável.`;
      } else if (type === 'skeuo') {
        diagnosis = `✨ <strong>Affordance Tátil Evidente:</strong> Inspiração física imediata. A borda rebaixada comunica o gesto mecânico de compressão física.`;
      }

      if (feedbackConsole) {
        feedbackConsole.innerHTML = `
          <div><strong>Ação registrada:</strong> Clique no elemento <em>"${label}"</em></div>
          <div style="margin-top:0.35rem;">${diagnosis}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem;">Total de interações no teste: ${clicksLog.length}</div>
        `;
      }
    });
  });

  if (modeSelect) {
    modeSelect.addEventListener('change', () => {
      updateMode(modeSelect.value);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clicksLog = [];
      if (modeSelect) modeSelect.value = 'rich';
      updateMode('rich');
    });
  }
}

// ===================================================================
// ESTAÇÃO 5: O SIMULADOR DA PORTA DE NORMAN & SIGNIFICADORES
// ===================================================================
function initNormanDoorLab() {
  const hardwareSelect = document.getElementById('door-hardware-select');
  const signTextSelect = document.getElementById('door-sign-select');
  const pullBtn = document.getElementById('door-pull-action-btn');
  const pushBtn = document.getElementById('door-push-action-btn');
  const doorLeaf = document.getElementById('door-leaf-element');
  const hardwareMount = document.getElementById('door-hardware-mount');
  const signMount = document.getElementById('door-sign-mount');
  const resultMessage = document.getElementById('door-lab-message');

  if (!doorLeaf || !pullBtn || !pushBtn) return;

  function renderDoorHardware() {
    const hw = hardwareSelect ? hardwareSelect.value : 'pull-handle';
    const sign = signTextSelect ? signTextSelect.value : 'none';

    // Hardware
    if (hardwareMount) {
      if (hw === 'pull-handle') {
        hardwareMount.innerHTML = `<div class="door-hardware-handle" title="Maçaneta de Puxar"></div>`;
      } else if (hw === 'push-plate') {
        hardwareMount.innerHTML = `<div class="door-hardware-plate"><span>PLACA</span></div>`;
      } else if (hw === 'push-bar') {
        hardwareMount.innerHTML = `<div style="width:100%; height:14px; background:#475569; border:2px solid #1e293b; border-radius:3px;" title="Barra Antipânico"></div>`;
      } else {
        hardwareMount.innerHTML = `<div style="width:14px; height:14px; border-radius:50%; background:#475569;"></div>`;
      }
    }

    // Texto de Sinalização
    if (signMount) {
      if (sign === 'empurre') {
        signMount.innerHTML = `<span style="background:#0f172a; color:#38bdf8; padding:2px 6px; font-size:9px; font-weight:800; border-radius:2px; letter-spacing:0.05em;">EMPURRE</span>`;
      } else if (sign === 'puxe') {
        signMount.innerHTML = `<span style="background:#0f172a; color:#f43f5e; padding:2px 6px; font-size:9px; font-weight:800; border-radius:2px; letter-spacing:0.05em;">PUXE</span>`;
      } else {
        signMount.innerHTML = '';
      }
    }

    // Reseta estado da porta
    doorLeaf.classList.remove('open-success', 'bump-error');
  }

  pullBtn.addEventListener('click', () => {
    doorLeaf.classList.remove('open-success', 'bump-error');
    void doorLeaf.offsetWidth; // trigger reflow

    // A física real desta porta comercial é que ela SÓ ABRE EMPURRANDO!
    doorLeaf.classList.add('bump-error');

    const hw = hardwareSelect ? hardwareSelect.value : 'pull-handle';
    const sign = signTextSelect ? signTextSelect.value : 'none';

    if (hw === 'pull-handle') {
      resultMessage.innerHTML = `
        <div style="color:var(--accent-rose); font-weight:700;">💥 BATEU NA PORTA! (A Clássica Porta de Norman)</div>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          Você puxou a maçaneta porque a forma dela fornece o significador de agarrar e puxar. Porém a porta só abre empurrando! Você cometeu um erro não por falta de inteligência, mas porque o design da maçaneta mentiu para você.
        </p>
      `;
    } else {
      resultMessage.innerHTML = `
        <div style="color:var(--accent-rose); font-weight:700;">⛔ Ação Incompatível!</div>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          Esta porta não possui articulação de puxar para este sentido de tráfego. Ela só se move empurrando.
        </p>
      `;
    }
  });

  pushBtn.addEventListener('click', () => {
    doorLeaf.classList.remove('open-success', 'bump-error');
    void doorLeaf.offsetWidth;

    doorLeaf.classList.add('open-success');

    const hw = hardwareSelect ? hardwareSelect.value : 'pull-handle';
    const sign = signTextSelect ? signTextSelect.value : 'none';

    if (hw === 'push-plate' || hw === 'push-bar') {
      resultMessage.innerHTML = `
        <div style="color:var(--accent-emerald); font-weight:700;">✓ PORTA ABERTA COM SUCESSO!</div>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          <strong>Significador Conforme Perfeito:</strong> Uma placa plana ou barra horizontal impossibilita fisicamente o ato de puxar. O usuário empurra instintivamente sem hesitação nem necessidade de placas explicativas.
        </p>
      `;
    } else {
      resultMessage.innerHTML = `
        <div style="color:var(--accent-amber); font-weight:700;">✓ Porta Abriu (Mas com Carga Cognitiva)</div>
        <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
          A porta abriu porque você empurrou, mas note como ter uma maçaneta de puxar instalada causou um segundo de dúvida antes de agir.
        </p>
      `;
    }
  });

  if (hardwareSelect) hardwareSelect.addEventListener('change', renderDoorHardware);
  if (signTextSelect) signTextSelect.addEventListener('change', renderDoorHardware);

  renderDoorHardware();
}

// ===================================================================
// ESTAÇÃO 6: SIMULADOR DE LATÊNCIA E FEEDBACK (CHECKOUT)
// ===================================================================
function initFeedbackLatencyLab() {
  const modeSelect = document.getElementById('feedback-mode-select');
  const payBtn = document.getElementById('feedback-pay-btn');
  const logEl = document.getElementById('feedback-live-console');
  const counterEl = document.getElementById('feedback-clicks-counter');
  const chargesEl = document.getElementById('feedback-charges-counter');
  const resetBtn = document.getElementById('feedback-reset-btn');

  if (!payBtn || !logEl) return;

  let clicksDuringProcessing = 0;
  let completedCharges = 0;
  let isProcessing = false;

  function log(msg, color) {
    const time = new Date().toLocaleTimeString();
    const line = `<div style="color:${color || '#38bdf8'}; margin-bottom:2px;">[${time}] ${msg}</div>`;
    logEl.innerHTML = line + logEl.innerHTML;
  }

  payBtn.addEventListener('click', () => {
    const mode = modeSelect ? modeSelect.value : 'bad';
    clicksDuringProcessing++;
    if (counterEl) counterEl.innerText = clicksDuringProcessing;

    if (mode === 'bad') {
      // MODO RUIM: Sem feedback imediato e sem desabilitar o botão
      log(`⚠️ Clique no botão detectado (Tentativa #${clicksDuringProcessing}).`, '#facc15');

      // Cada clique gera uma transação concorrente sem proteção
      setTimeout(() => {
        completedCharges++;
        if (chargesEl) chargesEl.innerText = completedCharges;
        log(`💥 Cobrança #${completedCharges} de R$ 1.500 debitada com sucesso no cartão!`, '#f43f5e');

        if (completedCharges > 1) {
          log(`🚨 FALHA DE IHC: Usuário clicou repetidamente devido ao silêncio da interface. Cobranças duplicadas geradas: R$ ${completedCharges * 1500},00!`, '#fb7185');
        }
      }, 3500);

    } else {
      // MODO BOM: Feedback imediato em camadas (< 50ms)
      if (isProcessing) return; // Restrição impede múltiplos cliques
      isProcessing = true;

      payBtn.disabled = true;
      payBtn.innerHTML = `
        <span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>
        Processando pagamento via Banco Central...
      `;
      payBtn.style.opacity = '0.75';

      log(`✓ [0ms] Clique registrado: Botão desabilitado instantaneamente para evitar duplicidade.`, '#34d399');
      log(`⏱️ [300ms] Transmitindo dados criptografados...`, '#38bdf8');

      setTimeout(() => {
        completedCharges++;
        if (chargesEl) chargesEl.innerText = completedCharges;
        payBtn.innerHTML = `✓ Pagamento de R$ 1.500 Confirmado!`;
        payBtn.style.background = 'var(--accent-emerald)';
        payBtn.style.borderColor = 'var(--accent-emerald)';
        payBtn.style.color = '#fff';
        payBtn.style.opacity = '1';

        log(`🎉 [1200ms] Transação Pix concluída com sucesso! Recibo gerado.`, '#34d399');
        log(`📊 Abismo de Avaliação superado: Usuário soube com precisão de 100% o estado do sistema.`, '#a7f3d0');
      }, 1200);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clicksDuringProcessing = 0;
      completedCharges = 0;
      isProcessing = false;
      if (counterEl) counterEl.innerText = '0';
      if (chargesEl) chargesEl.innerText = '0';
      payBtn.disabled = false;
      payBtn.innerHTML = `Finalizar Pagamento de R$ 1.500,00`;
      payBtn.style.background = '';
      payBtn.style.borderColor = '';
      payBtn.style.color = '';
      payBtn.style.opacity = '';
      logEl.innerHTML = `<div style="color:#94a3b8;">Sistema pronto. Escolha o modo de feedback e faça o teste de clique.</div>`;
    });
  }
}

// ===================================================================
// ESTAÇÃO 7: RESTRIÇÕES POKA-YOKE (PREVENÇÃO ATIVA DE ERROS)
// ===================================================================
function initConstraintsPokaYokeLab() {
  const modeToggle = document.getElementById('constraints-mode-toggle');
  const departureDateInput = document.getElementById('const-date-depart');
  const returnDateInput = document.getElementById('const-date-return');
  const passengersInput = document.getElementById('const-passengers');
  const docInput = document.getElementById('const-cpf');
  const submitBtn = document.getElementById('const-submit-btn');
  const resultConsole = document.getElementById('const-result-console');

  if (!departureDateInput || !returnDateInput || !submitBtn) return;

  function isPokaYoke() {
    return modeToggle && modeToggle.checked;
  }

  function applyModeRestrictions() {
    const active = isPokaYoke();

    if (active) {
      // Bloqueia datas de volta anteriores à data de ida
      if (departureDateInput.value) {
        returnDateInput.min = departureDateInput.value;
        if (returnDateInput.value && returnDateInput.value < departureDateInput.value) {
          returnDateInput.value = departureDateInput.value;
        }
      }
      passengersInput.min = "1";
      passengersInput.max = "9";
      if (parseInt(passengersInput.value, 10) < 1) passengersInput.value = "1";
      if (parseInt(passengersInput.value, 10) > 9) passengersInput.value = "9";
    } else {
      returnDateInput.removeAttribute('min');
      passengersInput.removeAttribute('min');
      passengersInput.removeAttribute('max');
    }

    if (resultConsole) {
      resultConsole.innerHTML = active
        ? `<span style="color:var(--accent-emerald);">[Modo Poka-Yoke Ativo]</span> Restrições físicas, temporais e sintáticas ativadas. O formulário impede fisicamente a entrada de estados impossíveis.`
        : `<span style="color:var(--accent-rose);">[Modo Sem Restrições Ativo]</span> Qualquer dado é aceito nos campos. Erros só são validados depois que o usuário submete.`;
    }
  }

  if (modeToggle) {
    modeToggle.addEventListener('change', applyModeRestrictions);
  }

  if (departureDateInput) {
    departureDateInput.addEventListener('change', () => {
      if (isPokaYoke() && departureDateInput.value) {
        returnDateInput.min = departureDateInput.value;
        if (returnDateInput.value && returnDateInput.value < departureDateInput.value) {
          returnDateInput.value = departureDateInput.value;
        }
      }
    });
  }

  // Máscara e restrição sintática de CPF no modo Poka-Yoke
  if (docInput) {
    docInput.addEventListener('input', (e) => {
      if (!isPokaYoke()) return;
      let val = docInput.value.replace(/\D/g, '').slice(0, 11);
      if (val.length > 9) {
        val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (val.length > 6) {
        val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
      } else if (val.length > 3) {
        val = val.replace(/(\d{3})(\d{1,3})/, "$1.$2");
      }
      docInput.value = val;
    });
  }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const active = isPokaYoke();
    const depart = departureDateInput.value;
    const ret = returnDateInput.value;
    const pass = parseInt(passengersInput.value, 10);
    const doc = docInput.value.trim();

    if (!active) {
      // Avaliação no modo sem restrições
      let errors = [];
      if (depart && ret && ret < depart) {
        errors.push(`Data de retorno (${ret}) é anterior à data de partida (${depart})!`);
      }
      if (isNaN(pass) || pass <= 0 || pass > 100) {
        errors.push(`Quantidade de passageiros (${passengersInput.value}) é biologicamente ou operacionalmente inválida!`);
      }
      if (doc.length > 0 && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(doc) && !/^\d{11}$/.test(doc)) {
        errors.push(`Documento (${doc}) não respeita a estrutura esperada de dígitos.`);
      }

      if (errors.length > 0) {
        resultConsole.innerHTML = `
          <div style="color:var(--accent-rose); font-weight:700;">💥 ${errors.length} ERROS GRAVES DETECTADOS APÓS SUBMISSÃO:</div>
          <ul style="margin:0.5rem 0 0 1rem; color:var(--text-secondary); font-size:0.85rem;">
            ${errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
          <p style="margin:0.5rem 0 0; font-size:0.8rem; color:var(--accent-rose);">
            <strong>Diagnóstico de IHC:</strong> A interface transferiu para o usuário todo o fardo da validação, permitindo que ele cometesse o erro para então repreendê-lo.
          </p>
        `;
        return;
      }
    }

    resultConsole.innerHTML = `
      <div style="color:var(--accent-emerald); font-weight:700;">✓ Passagem Emitida com Sucesso!</div>
      <p style="margin:0.35rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
        Todos os parâmetros atenderam às restrições semânticas e lógicas do sistema. Nenhuma falha de submissão foi provocada.
      </p>
    `;
  });

  applyModeRestrictions();
}

// Inicialização Global dos Widgets de Norman
document.addEventListener('DOMContentLoaded', () => {
  initStoveReactionGame();
  initThermostatSimulation();
  initAuditRedesignStudio();
  initAffordanceLab();
  initNormanDoorLab();
  initFeedbackLatencyLab();
  initConstraintsPokaYokeLab();
});

