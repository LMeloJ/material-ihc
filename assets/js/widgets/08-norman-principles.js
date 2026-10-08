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
        missionTextEl.innerHTML = `✓ <strong style="color:var(--accent-emerald);">Acerto em ${elapsed}ms!</strong> Você acionou corretamente o controle da boca ${activatedPos.name}.`;
      } else {
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

// Inicialização Global dos Widgets de Norman
document.addEventListener('DOMContentLoaded', () => {
  initStoveReactionGame();
  initThermostatSimulation();
  initAuditRedesignStudio();
});
