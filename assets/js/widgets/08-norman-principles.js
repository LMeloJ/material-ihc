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
const normanPrinciplesList = [
  { id: 'signifier', label: 'Affordance & Signifiers', desc: 'Pistas perceptíveis visuais de onde e como interagir' },
  { id: 'mapping', label: 'Mapeamento Natural (Mapping)', desc: 'Correspondência espacial direta entre comando físico e efeito real' },
  { id: 'feedback', label: 'Feedback Imediato', desc: 'Retorno sensorial imediato sobre o estado e processamento da ação' },
  { id: 'constraints', label: 'Restrições & Poka-Yoke (Constraints)', desc: 'Travas lógicas e físicas para prevenção de erros e acidentes' },
  { id: 'mental_model', label: 'Modelo Mental & Consistência', desc: 'Conceitualização conceitual coerente com as expectativas do usuário' }
];

const auditFlawsData = [
  {
    id: 'flaw-ventilation',
    moduleKey: 'ventilation',
    title: 'Incidente A: Dificuldade de Acionamento da Ventilação',
    shortTitle: 'Incidente A &bull; Ventilação Oculta',
    operatorReport: 'Operadores recém-chegados não conseguem ligar o exaustor de ventilação central. Afirmam que olham para o painel e acham que a função não foi implementada ou que a tela quebrou, pois não há nenhum botão visível na área de ventilação.',
    quote: '«Fiquei 10 minutos procurando onde clicar... pensei que aquele texto cinza era só uma legenda estática!»',
    correctPrinciple: 'signifier',
    correctAction: 'action-signifier-button',
    actionOptions: [
      { id: 'action-signifier-button', text: 'Transformar o texto plano em um botão evidente com elevação 3D, ícone indicativo (🌀), cor de destaque e cursor pointer ao passar o mouse.' },
      { id: 'action-signifier-text', text: 'Manter como texto cinza simples, mas trocar a frase por: "Por favor toque aqui para ligar o ar".' },
      { id: 'action-signifier-manual', text: 'Inserir link para download de um manual de 40 páginas ensinando onde tocar na tela.' }
    ],
    principleExplanation: 'Sem um **Signifier (Significante)** perceptível ou affordance explícita, o usuário é jogado no Abismo de Execução — ele quer agir, mas não enxerga a pista visual de onde o toque produz efeito.',
    resolved: false
  },
  {
    id: 'flaw-blinds',
    moduleKey: 'blinds',
    title: 'Incidente B: Comportamento Invertido das Persianas',
    shortTitle: 'Incidente B &bull; Persianas Invertidas',
    operatorReport: 'Um operador tentou abrir as persianas da sala de testes clicando na seta para cima [▲]. Em vez de subir, a persiana desceu bruscamente e atingiu instrumentos na bancada. O operador ficou desorientado com o controle.',
    quote: '«Apertei a seta para cima [▲] achando que ia recolher a persiana, mas ela desceu com tudo e bateu nos frascos!»',
    correctPrinciple: 'mapping',
    correctAction: 'action-mapping-align',
    actionOptions: [
      { id: 'action-mapping-align', text: 'Readequar o Mapeamento Natural: seta para cima [▲] deve recolher a persiana (subir) e seta para baixo [▼] deve fechá-la (descer).' },
      { id: 'action-mapping-invert-labels', text: 'Manter a lógica invertida e adicionar uma etiqueta em letras miúdas: "Atenção: botões operam no modo inverso".' },
      { id: 'action-mapping-speed', text: 'Reduzir a velocidade do motor da persiana para que o operador tenha tempo de soltar o botão se errar.' }
    ],
    principleExplanation: 'O **Mapeamento Natural (Mapping)** aproveita analogias espaciais e culturais (cima = subir, baixo = descer). Inverter as coordenadas aumenta a carga cognitiva e induz a erros mecânicos inevitáveis.',
    resolved: false
  },
  {
    id: 'flaw-lighting',
    moduleKey: 'lighting',
    title: 'Incidente C: Salvamento Mudo e Inerte de Iluminação',
    shortTitle: 'Incidente C &bull; Salvamento Mudo',
    operatorReport: 'Ao ajustar a iluminação e clicar em "Salvar Preferências", a interface congela por 4 segundos sem nenhum som, animação ou mudança de cor. Usuários clicam repetidamente até travar a CPU do terminal.',
    quote: '«Eu cliquei em salvar e a tela não fez nada. Achei que o clique não tinha pego e apertei cinco vezes seguidas!»',
    correctPrinciple: 'feedback',
    correctAction: 'action-feedback-toast',
    actionOptions: [
      { id: 'action-feedback-toast', text: 'Implementar Feedback Imediato (< 100ms): mostrar spinner de salvamento no próprio botão e exibir confirmação visual em toast verde com som suave.' },
      { id: 'action-feedback-wait', text: 'Colocar um aviso estático na tela dizendo: "O servidor é lento mesmo, aguarde com calma sem clicar novamente".' },
      { id: 'action-feedback-sound-only', text: 'Tocar um alarme estridente de sirene de 10 segundos para cada clique efetuado.' }
    ],
    principleExplanation: 'O **Feedback Imediato** fecha o Abismo de Avaliação. Don Norman pontua que o usuário precisa de confirmação perceptível instantânea de que sua ação foi registrada pelo sistema, evitando repetições compulsivas.',
    resolved: false
  },
  {
    id: 'flaw-reset',
    moduleKey: 'reset',
    title: 'Incidente D: Desligamento Acidental da Linha de Produção',
    shortTitle: 'Incidente D &bull; Queda Geral Inadvertida',
    operatorReport: 'Durante uma ronda noturna, um operador foi acionar o botão de luz e encostou a manga do jaleco no botão vermelho vizinho de "Reset Geral da Planta", paralisando os reatores da fábrica inteira sem qualquer confirmação.',
    quote: '«Foi um desastre... o botão de desligar a fábrica inteira ficava colado nas luzes, sem tampa, trava ou aviso!»',
    correctPrinciple: 'constraints',
    correctAction: 'action-constraints-pokayoke',
    actionOptions: [
      { id: 'action-constraints-pokayoke', text: 'Aplicar Restrições Poka-Yoke: segregar o comando crítico em área de segurança isolada com trava e exigir confirmação explícita em duas etapas.' },
      { id: 'action-constraints-color', text: 'Apenas pintar o botão com um vermelho fluorescente e aumentar o tamanho da fonte no mesmo local.' },
      { id: 'action-constraints-fine', text: 'Criar uma norma administrativa aplicando advertência disciplinar aos operadores que esbarrarem no botão.' }
    ],
    principleExplanation: 'As **Restrições (Constraints) e Poka-Yoke** protegem o usuário e o sistema contra deslizes (slips) e enganos (mistakes). Ações destrutivas nunca devem compartilhar a mesma proximidade gestual de ações rotineiras nem prescindir de confirmações seguras.',
    resolved: false
  }
];

function initAuditRedesignStudio() {
  const previewScreen = document.getElementById('audit-preview-screen');
  const flawsListContainer = document.getElementById('audit-flaws-list');
  const solverPanel = document.getElementById('audit-solver-panel');
  const scorePercentEl = document.getElementById('audit-score-percent');
  const scoreLabelEl = document.getElementById('audit-score-label');
  const scoreBarFill = document.getElementById('audit-score-bar-fill');
  const completionBanner = document.getElementById('audit-completion-banner');
  const resetAllBtn = document.getElementById('audit-reset-all-btn');

  if (!previewScreen || !flawsListContainer || !solverPanel) return;

  let activeFlawIndex = 0;
  let lastDiagnosticFeedback = null;

  // Renderiza a interface de teste em tempo real no topo
  function renderPreviewScreen() {
    const fVent = auditFlawsData[0].resolved;
    const fBlinds = auditFlawsData[1].resolved;
    const fLight = auditFlawsData[2].resolved;
    const fReset = auditFlawsData[3].resolved;

    const resolvedCount = auditFlawsData.filter(f => f.resolved).length;
    const isAllClean = resolvedCount === auditFlawsData.length;

    previewScreen.innerHTML = `
      <div class="audit-preview-header">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${isAllClean ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; box-shadow:0 0 6px ${isAllClean ? 'var(--accent-emerald)' : 'var(--accent-rose)'};"></span>
          <span style="font-weight:700; font-size:0.85rem; color:var(--text-primary);">Terminal Touchscreen &bull; Central Predial Smart Facility v2.0</span>
        </div>
        <div style="font-family:'JetBrains Mono', monospace; font-size:0.75rem; font-weight:700; color:${isAllClean ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          ${isAllClean ? '🟢 SISTEMA 100% OTIMIZADO &bull; SEGURO' : `🔴 ${4 - resolvedCount} VULNERABILIDADE(S) ATIVA(S)`}
        </div>
      </div>

      <div class="audit-modules-grid">
        <!-- MÓDULO 1: Ventilação -->
        <div class="audit-module-card ${fVent ? 'optimized' : 'vulnerable'}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">Módulo 01: Climatização</span>
              <span class="audit-module-badge ${fVent ? 'optimized' : 'vulnerable'}">
                ${fVent ? '✓ Signifier Ativo' : '⚡ Sem Signifier'}
              </span>
            </div>
            <div style="font-size:0.82rem; font-weight:600; margin-bottom:0.6rem;">Exaustor de Ventilação Central</div>
          </div>

          <div style="margin-top:0.5rem;" id="mock-vent-control-area">
            ${fVent ? `
              <button class="btn btn-primary" id="mock-btn-vent" style="padding:0.45rem 0.85rem; font-size:0.8rem; width:100%; display:flex; align-items:center; justify-content:center; gap:0.5rem; box-shadow:0 2px 4px rgba(0,0,0,0.15); cursor:pointer;">
                <span>🌀</span> <span>Ventilação: <strong>LIGADA</strong> (1.200 RPM)</span>
              </button>
              <div style="font-size:0.7rem; color:var(--accent-emerald); margin-top:0.35rem; text-align:center;">
                Affordance e significante explícitos e evidentes!
              </div>
            ` : `
              <div id="mock-flat-text-vent" style="padding:0.45rem; background:rgba(148,163,184,0.08); border:1px dashed #cbd5e1; border-radius:var(--radius-sm); color:#64748b; font-size:0.78rem; text-align:center; cursor:pointer;" title="Clique para testar">
                ligar ventilacao central (parece texto plano, sem botão!)
              </div>
              <div id="mock-vent-hint" style="font-size:0.7rem; color:var(--accent-rose); margin-top:0.35rem; text-align:center; display:none;">
                ⚠️ Texto plano! Usuários não percebem que é clicável.
              </div>
            `}
          </div>
        </div>

        <!-- MÓDULO 2: Persianas -->
        <div class="audit-module-card ${fBlinds ? 'optimized' : 'vulnerable'}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">Módulo 02: Aberturas</span>
              <span class="audit-module-badge ${fBlinds ? 'optimized' : 'vulnerable'}">
                ${fBlinds ? '✓ Mapeamento OK' : '⚡ Mapeamento Invertido'}
              </span>
            </div>
            <div style="font-size:0.82rem; font-weight:600; margin-bottom:0.6rem;">Persianas Motorizadas</div>
          </div>

          <div style="margin-top:0.5rem;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.4rem;">
              ${fBlinds ? `
                <button class="btn btn-outline" id="mock-blind-up-btn" style="padding:0.35rem; font-size:0.75rem; border-color:var(--border-color);">
                  ▲ Subir (Abre)
                </button>
                <button class="btn btn-outline" id="mock-blind-down-btn" style="padding:0.35rem; font-size:0.75rem; border-color:var(--border-color);">
                  ▼ Descer (Fecha)
                </button>
              ` : `
                <button class="btn btn-outline" id="mock-blind-up-btn" style="padding:0.35rem; font-size:0.75rem; color:var(--accent-rose); border-color:rgba(244,63,94,0.4);">
                  ▲ (Desce persiana!)
                </button>
                <button class="btn btn-outline" id="mock-blind-down-btn" style="padding:0.35rem; font-size:0.75rem; color:var(--accent-rose); border-color:rgba(244,63,94,0.4);">
                  ▼ (Sobe persiana!)
                </button>
              `}
            </div>
            <div id="mock-blind-status" style="font-size:0.7rem; color:${fBlinds ? 'var(--text-secondary)' : 'var(--accent-rose)'}; margin-top:0.35rem; text-align:center;">
              ${fBlinds ? 'Posição atual: 75% Aberta (Mapeamento correto)' : 'Atenção: Ao clicar ▲, persiana fecha contra o piso!'}
            </div>
          </div>
        </div>

        <!-- MÓDULO 3: Iluminação -->
        <div class="audit-module-card ${fLight ? 'optimized' : 'vulnerable'}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">Módulo 03: Iluminação</span>
              <span class="audit-module-badge ${fLight ? 'optimized' : 'vulnerable'}">
                ${fLight ? '✓ Feedback Imediato' : '⚡ Sem Feedback'}
              </span>
            </div>
            <div style="font-size:0.82rem; font-weight:600; margin-bottom:0.6rem;">Salvar Nível de Luz (650 lux)</div>
          </div>

          <div style="margin-top:0.5rem;">
            <button class="btn btn-outline" id="mock-light-save-btn" style="width:100%; padding:0.4rem; font-size:0.75rem; ${fLight ? 'border-color:var(--accent-emerald); color:var(--accent-emerald);' : ''}">
              ${fLight ? '💾 Salvar Preferências' : 'Salvar Preferências (Mudo)'}
            </button>
            <div id="mock-light-feedback" style="font-size:0.7rem; color:${fLight ? 'var(--accent-emerald)' : 'var(--text-muted)'}; margin-top:0.35rem; text-align:center;">
              ${fLight ? 'Feedback imediato ativo (< 50ms) com confirmação' : 'Clique para testar o congelamento sem feedback'}
            </div>
          </div>
        </div>

        <!-- MÓDULO 4: Parada de Emergência / Reset -->
        <div class="audit-module-card ${fReset ? 'optimized' : 'vulnerable'}">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-size:0.78rem; font-weight:700; color:var(--text-secondary);">Módulo 04: Segurança</span>
              <span class="audit-module-badge ${fReset ? 'optimized' : 'vulnerable'}">
                ${fReset ? '✓ Restrição Poka-Yoke' : '⚡ Ação Desprotegida'}
              </span>
            </div>
            <div style="font-size:0.82rem; font-weight:600; margin-bottom:0.6rem;">Reset da Planta Industrial</div>
          </div>

          <div style="margin-top:0.5rem;" id="mock-reset-container">
            ${fReset ? `
              <div style="background:rgba(16,185,129,0.08); border:1px solid var(--accent-emerald); border-radius:var(--radius-sm); padding:0.4rem 0.6rem; font-size:0.75rem; text-align:center; color:var(--text-primary);">
                🔒 <strong>Trava Poka-Yoke Ativa:</strong> Ação destrutiva isolada e protegida com dupla confirmação.
              </div>
            ` : `
              <button class="btn" id="mock-reset-danger-btn" style="width:100%; background:var(--accent-rose); color:#fff; padding:0.4rem; font-size:0.75rem; font-weight:700; border:none; border-radius:var(--radius-sm); cursor:pointer;">
                💥 RESET GERAL DA FÁBRICA
              </button>
              <div style="font-size:0.7rem; color:var(--accent-rose); margin-top:0.35rem; text-align:center;">
                Perigo: Colado a botões comuns e sem confirmação!
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    attachMockupEvents();
  }

  // Comportamentos interativos dentro da própria interface simulada sob teste
  function attachMockupEvents() {
    const flatVent = document.getElementById('mock-flat-text-vent');
    const ventHint = document.getElementById('mock-vent-hint');
    if (flatVent && ventHint) {
      flatVent.addEventListener('click', () => {
        ventHint.style.display = 'block';
      });
    }

    const blindUp = document.getElementById('mock-blind-up-btn');
    const blindDown = document.getElementById('mock-blind-down-btn');
    const blindStatus = document.getElementById('mock-blind-status');
    const fBlinds = auditFlawsData[1].resolved;

    if (blindUp && blindStatus) {
      blindUp.addEventListener('click', () => {
        if (!fBlinds) {
          blindStatus.innerHTML = '<span style="color:var(--accent-rose); font-weight:700;">⚠️ Erro! Você apertou ▲ mas a persiana DESCEU e bateu na bancada!</span>';
        } else {
          blindStatus.innerHTML = '<span style="color:var(--accent-emerald);">▲ Persiana recolhida para CIMA (Abertura 100%).</span>';
        }
      });
    }

    if (blindDown && blindStatus) {
      blindDown.addEventListener('click', () => {
        if (!fBlinds) {
          blindStatus.innerHTML = '<span style="color:var(--accent-rose); font-weight:700;">⚠️ Erro! Você apertou ▼ mas a persiana SUBIU! Mapeamento invertido!</span>';
        } else {
          blindStatus.innerHTML = '<span style="color:var(--accent-emerald);">▼ Persiana fechada para BAIXO (Abertura 0%).</span>';
        }
      });
    }

    const lightBtn = document.getElementById('mock-light-save-btn');
    const lightFeedback = document.getElementById('mock-light-feedback');
    const fLight = auditFlawsData[2].resolved;

    if (lightBtn && lightFeedback) {
      lightBtn.addEventListener('click', () => {
        if (!fLight) {
          lightBtn.disabled = true;
          lightFeedback.innerHTML = '<span style="color:var(--accent-rose); font-weight:700;">⏳ Silêncio total... (4s sem resposta! Usuário acha que travou)</span>';
          setTimeout(() => {
            lightBtn.disabled = false;
            lightFeedback.innerHTML = '<span style="color:var(--text-secondary);">Fim do congelamento. Nenhum aviso foi mostrado.</span>';
          }, 3500);
        } else {
          lightBtn.innerHTML = '⏳ Salvando...';
          setTimeout(() => {
            lightBtn.innerHTML = '✓ Salvo!';
            lightFeedback.innerHTML = '<span style="color:var(--accent-emerald); font-weight:700;">Toast exibido: "Preferências salvas com sucesso (200 OK)!"</span>';
            setTimeout(() => {
              lightBtn.innerHTML = '💾 Salvar Preferências';
            }, 1800);
          }, 250);
        }
      });
    }

    const dangerResetBtn = document.getElementById('mock-reset-danger-btn');
    if (dangerResetBtn) {
      dangerResetBtn.addEventListener('click', () => {
        alert('🚨 INCIDENTE CRÍTICO! A fábrica inteira foi desligada acidentalmente sem pedir confirmação! Violação gravíssima de Restrições.');
      });
    }
  }

  // Renderiza a lista de relatos na coluna da esquerda
  function renderFlawsList() {
    flawsListContainer.innerHTML = auditFlawsData.map((flaw, idx) => `
      <div class="flaw-selector-card ${idx === activeFlawIndex ? 'active' : ''} ${flaw.resolved ? 'resolved' : ''}" data-idx="${idx}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
          <strong style="font-size:0.92rem; color:var(--text-primary);">${flaw.title}</strong>
          <span class="badge" style="${flaw.resolved ? 'background:var(--accent-emerald-light); color:var(--accent-emerald);' : 'background:var(--accent-rose-light); color:var(--accent-rose);'} font-size:0.75rem;">
            ${flaw.resolved ? '✓ Corrigido (+25%)' : '⚡ Falha Ativa'}
          </span>
        </div>
        <p style="font-size:0.82rem; color:var(--text-secondary); margin:0 0 0.4rem; line-height:1.4;">
          ${flaw.operatorReport}
        </p>
        <div style="font-size:0.78rem; font-style:italic; color:var(--text-muted); background:var(--bg-subtle); padding:0.35rem 0.5rem; border-radius:4px; border-left:2px solid var(--border-color);">
          ${flaw.quote}
        </div>
      </div>
    `).join('');
  }

  // Renderiza o painel de diagnóstico na coluna da direita
  function renderSolverPanel() {
    const flaw = auditFlawsData[activeFlawIndex];
    if (!flaw) return;

    if (flaw.resolved) {
      solverPanel.innerHTML = `
        <div style="background:rgba(16,185,129,0.08); border:1px solid var(--accent-emerald); border-radius:var(--radius-sm); padding:1rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span style="font-size:1.2rem;">✅</span>
            <strong style="color:var(--accent-emerald); font-size:0.95rem;">Falha Diagnosticada e Redesign Aplicado!</strong>
          </div>
          <p style="font-size:0.86rem; color:var(--text-secondary); margin:0 0 0.6rem;">
            <strong>Princípio de Norman:</strong> ${normanPrinciplesList.find(p => p.id === flaw.correctPrinciple)?.label}
          </p>
          <div style="font-size:0.84rem; color:var(--text-primary); background:var(--bg-surface); padding:0.75rem; border-radius:var(--radius-sm); margin-bottom:0.8rem; line-height:1.45;">
            ${flaw.principleExplanation}
          </div>
          <button class="btn btn-outline" id="audit-revert-btn" style="font-size:0.82rem; padding:0.4rem 0.8rem;">
            ↺ Desfazer Redesign desta Falha (Para Treinar Novamente)
          </button>
        </div>
      `;

      const revertBtn = document.getElementById('audit-revert-btn');
      if (revertBtn) {
        revertBtn.addEventListener('click', () => {
          flaw.resolved = false;
          lastDiagnosticFeedback = null;
          updateEverything();
        });
      }
      return;
    }

    // Formulário de diagnóstico interativo
    solverPanel.innerHTML = `
      <div>
        <div style="font-size:0.82rem; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:0.25rem;">
          Diagnóstico do ${flaw.shortTitle}
        </div>
        <h4 style="margin:0 0 0.8rem; font-size:1rem; color:var(--text-primary);">
          Passo 1: Qual Princípio de Don Norman foi violado nesta falha?
        </h4>
        <div id="principle-radio-group">
          ${normanPrinciplesList.map(p => `
            <label class="audit-option-label" for="p-${p.id}">
              <input type="radio" name="selected-principle" id="p-${p.id}" value="${p.id}">
              <div>
                <strong>${p.label}</strong>
                <div style="font-size:0.76rem; color:var(--text-muted);">${p.desc}</div>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:0.5rem;">
        <h4 style="margin:0 0 0.8rem; font-size:1rem; color:var(--text-primary);">
          Passo 2: Qual a ação de redesign recomendada para solucionar o problema?
        </h4>
        <div id="action-radio-group">
          ${flaw.actionOptions.map(act => `
            <label class="audit-option-label" for="act-${act.id}">
              <input type="radio" name="selected-action" id="act-${act.id}" value="${act.id}">
              <div style="line-height:1.4;">${act.text}</div>
            </label>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:0.5rem;">
        <button class="btn btn-primary" id="audit-submit-diagnosis-btn" style="width:100%; padding:0.65rem 1rem; font-size:0.9rem;">
          🚀 Validar Diagnóstico & Aplicar Redesign na Interface
        </button>
      </div>

      <div id="audit-feedback-box">
        ${lastDiagnosticFeedback ? `
          <div class="audit-eval-feedback ${lastDiagnosticFeedback.type}">
            ${lastDiagnosticFeedback.message}
          </div>
        ` : ''}
      </div>
    `;

    const submitBtn = document.getElementById('audit-submit-diagnosis-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', validateStudentDiagnosis);
    }
  }

  function validateStudentDiagnosis() {
    const flaw = auditFlawsData[activeFlawIndex];
    if (!flaw) return;

    const checkedPrinciple = document.querySelector('input[name="selected-principle"]:checked');
    const checkedAction = document.querySelector('input[name="selected-action"]:checked');
    const feedbackBox = document.getElementById('audit-feedback-box');

    if (!checkedPrinciple || !checkedAction) {
      feedbackBox.innerHTML = `
        <div class="audit-eval-feedback error">
          ⚠️ Por favor, selecione <strong>um Princípio de Norman (Passo 1)</strong> e <strong>uma Ação de Redesign (Passo 2)</strong> antes de validar.
        </div>
      `;
      return;
    }

    const chosenPrinciple = checkedPrinciple.value;
    const chosenAction = checkedAction.value;

    const isPrincipleCorrect = chosenPrinciple === flaw.correctPrinciple;
    const isActionCorrect = chosenAction === flaw.correctAction;

    if (isPrincipleCorrect && isActionCorrect) {
      flaw.resolved = true;
      lastDiagnosticFeedback = null;
      updateEverything();
    } else if (!isPrincipleCorrect) {
      const selectedPrincipleObj = normanPrinciplesList.find(p => p.id === chosenPrinciple);
      feedbackBox.innerHTML = `
        <div class="audit-eval-feedback error">
          <strong>❌ Princípio Incorreto:</strong> Você selecionou <em>"${selectedPrincipleObj?.label}"</em>. 
          Releia o relato do operador: o problema central não é ${selectedPrincipleObj?.desc.toLowerCase()}. O que realmente está faltando na interface para que o usuário consiga agir ou entender o estado?
        </div>
      `;
    } else {
      feedbackBox.innerHTML = `
        <div class="audit-eval-feedback error">
          <strong>⚠️ Princípio Correto, mas Ação Inadequada:</strong> Você acertou que a causa raiz é <em>"${normanPrinciplesList.find(p => p.id === chosenPrinciple)?.label}"</em>, mas a ação proposta não segue as boas práticas de IHC. Escolha uma intervenção que realmente resolva o abismo cognitivo na interface.
        </div>
      `;
    }
  }

  function updateScore() {
    const resolvedCount = auditFlawsData.filter(f => f.resolved).length;
    const total = auditFlawsData.length;
    const percentage = Math.round((resolvedCount / total) * 100);

    if (scorePercentEl) scorePercentEl.innerText = `${percentage}%`;
    if (scoreLabelEl) scoreLabelEl.innerText = `${resolvedCount} de ${total} módulos otimizados`;
    if (scoreBarFill) scoreBarFill.style.width = `${percentage}%`;

    if (completionBanner) {
      if (percentage === 100) {
        completionBanner.style.display = 'block';
      } else {
        completionBanner.style.display = 'none';
      }
    }
  }

  function updateEverything() {
    renderPreviewScreen();
    renderFlawsList();
    renderSolverPanel();
    updateScore();
  }

  // Listener para seleção de falhas na coluna esquerda
  flawsListContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.flaw-selector-card');
    if (!card) return;
    activeFlawIndex = parseInt(card.getAttribute('data-idx'), 10);
    lastDiagnosticFeedback = null;
    renderFlawsList();
    renderSolverPanel();
  });

  // Botão de reset geral
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      auditFlawsData.forEach(f => f.resolved = false);
      activeFlawIndex = 0;
      lastDiagnosticFeedback = null;
      updateEverything();
    });
  }

  // Inicialização
  updateEverything();
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

  function validateFields() {
    const active = isPokaYoke();
    const depart = departureDateInput.value.trim();
    const ret = returnDateInput.value.trim();
    const pass = parseInt(passengersInput.value, 10);
    const docDigits = docInput.value.replace(/\D/g, '');

    if (!active) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      submitBtn.innerHTML = 'Emitir Bilhete de Embarque (Modo Sem Restrições)';
      return;
    }

    // Validações no modo Poka-Yoke (bloqueio antecipado)
    const isDepartValid = depart !== '';
    const isRetValid = ret !== '' && (!depart || ret >= depart);
    const isPassValid = !isNaN(pass) && pass >= 1 && pass <= 9;
    const isDocValid = docDigits.length === 11;

    const allValid = isDepartValid && isRetValid && isPassValid && isDocValid;

    if (allValid) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      submitBtn.innerHTML = '✓ Emitir Bilhete de Embarque (Restrições Atendidas)';
      if (resultConsole) {
        resultConsole.innerHTML = `<span style="color:var(--accent-emerald);">✓ <strong>Todos os campos estão válidos:</strong> As restrições Poka-Yoke foram satisfeitas. O botão foi liberado para emissão segura.</span>`;
      }
    } else {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = '🔒 Emitir Bilhete (Preencha todos os campos obrigatórios)';

      const pendencias = [];
      if (!isDepartValid) pendencias.push('Data de Ida');
      if (!isRetValid) pendencias.push('Data de Retorno posterior');
      if (!isPassValid) pendencias.push('Passageiros (1 a 9)');
      if (!isDocValid) pendencias.push('CPF (11 dígitos)');

      if (resultConsole) {
        resultConsole.innerHTML = `<span style="color:var(--text-muted);">🔒 <strong>Restrição Ativa (Poka-Yoke):</strong> O botão permanece travado para evitar submissão prematura. Pendente: <em>${pendencias.join(', ')}</em>.</span>`;
      }
    }
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
      if (passengersInput.value) {
        const val = parseInt(passengersInput.value, 10);
        if (val < 1) passengersInput.value = "1";
        if (val > 9) passengersInput.value = "9";
      }
    } else {
      returnDateInput.removeAttribute('min');
      passengersInput.removeAttribute('min');
      passengersInput.removeAttribute('max');
    }

    validateFields();
  }

  if (modeToggle) {
    modeToggle.addEventListener('change', () => {
      applyModeRestrictions();
      validateFields();
    });
  }

  ['input', 'change'].forEach(evt => {
    departureDateInput.addEventListener(evt, () => {
      if (isPokaYoke() && departureDateInput.value) {
        returnDateInput.min = departureDateInput.value;
        if (returnDateInput.value && returnDateInput.value < departureDateInput.value) {
          returnDateInput.value = departureDateInput.value;
        }
      }
      validateFields();
    });

    returnDateInput.addEventListener(evt, validateFields);

    passengersInput.addEventListener(evt, () => {
      if (isPokaYoke() && passengersInput.value) {
        const val = parseInt(passengersInput.value, 10);
        if (val < 1) passengersInput.value = "1";
        if (val > 9) passengersInput.value = "9";
      }
      validateFields();
    });
  });

  // Máscara e restrição sintática de CPF no modo Poka-Yoke
  if (docInput) {
    docInput.addEventListener('input', () => {
      if (isPokaYoke()) {
        let val = docInput.value.replace(/\D/g, '').slice(0, 11);
        if (val.length > 9) {
          val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (val.length > 6) {
          val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
        } else if (val.length > 3) {
          val = val.replace(/(\d{3})(\d{1,3})/, "$1.$2");
        }
        docInput.value = val;
      }
      validateFields();
    });
  }

  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const active = isPokaYoke();
    const depart = departureDateInput.value.trim();
    const ret = returnDateInput.value.trim();
    const pass = parseInt(passengersInput.value, 10);
    const doc = docInput.value.trim();

    if (!active) {
      // Avaliação no modo sem restrições (permite falhas absurdas)
      let errors = [];
      if (!depart) {
        errors.push("Data de partida não foi informada!");
      }
      if (!ret) {
        errors.push("Data de retorno não foi informada!");
      } else if (depart && ret < depart) {
        errors.push(`Data de retorno (${ret}) é anterior à data de partida (${depart})!`);
      }
      if (isNaN(pass) || pass <= 0 || pass > 100) {
        errors.push(`Quantidade de passageiros (${passengersInput.value || 'vazio'}) é inválida!`);
      }
      if (!doc || doc.replace(/\D/g, '').length !== 11) {
        errors.push(`Documento (${doc || 'em branco'}) não possui 11 dígitos de CPF.`);
      }

      if (errors.length > 0) {
        resultConsole.innerHTML = `
          <div style="color:var(--accent-rose); font-weight:700;">💥 ${errors.length} ERROS DETECTADOS APÓS SUBMISSÃO:</div>
          <ul style="margin:0.5rem 0 0 1rem; color:var(--text-secondary); font-size:0.85rem;">
            ${errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
          <p style="margin:0.5rem 0 0; font-size:0.8rem; color:var(--accent-rose);">
            <strong>Falha de IHC:</strong> A interface permitiu o clique mesmo incompleto, punindo o usuário após o esforço em vez de usar Poka-Yoke preventivo.
          </p>
        `;
        return;
      }
    }

    resultConsole.innerHTML = `
      <div style="color:var(--accent-emerald); font-weight:700;">✓ Passagem Emitida com Sucesso!</div>
      <p style="margin:0.35rem 0 0; font-size:0.85rem; color:var(--text-secondary);">
        Parabéns! Todos os parâmetros atenderam às restrições semânticas e lógicas do sistema.
      </p>
    `;
  });

  applyModeRestrictions();
  validateFields();
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

