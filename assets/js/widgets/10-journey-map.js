/**
 * WIDGET 10: Mapa da Jornada do Usuário com Curva Emocional Interativa
 * Referência: Jim Kalbach (Mapping Experiences) & Marc Stickdorn (This is Service Design Thinking)
 */

const defaultJourneyStages = [
  {
    phase: "1. Descoberta",
    action: "Recebe anúncio nas redes sociais ou recomendação de amigo sobre o software.",
    touchpoint: "Instagram / Anúncio patrocinado",
    pain: "Muitas promessas genéricas de marketing, sem clareza se serve para o seu nicho.",
    emotion: 0 // -2 a +2
  },
  {
    phase: "2. Cadastro & Setup",
    action: "Entra na landing page e tenta criar uma conta gratuita para testar.",
    touchpoint: "Formulário de Cadastro Web",
    pain: "Excesso de campos obrigatórios e confirmação demorada por SMS que falha.",
    emotion: -1
  },
  {
    phase: "3. Primeiro Uso (Onboarding)",
    action: "Acessa o painel inicial e busca fazer sua primeira tarefa essencial.",
    touchpoint: "Dashboard Principal & Tour Guiado",
    pain: "Tour invasivo que bloqueia a tela; usuário fecha sem ler e fica perdido.",
    emotion: -2
  },
  {
    phase: "4. Execução da Tarefa",
    action: "Descobre um atalho intuitivo e consegue emitir o documento desejado.",
    touchpoint: "Editor de Tarefas",
    pain: "Pequena lentidão no salvamento, mas o resultado final foi satisfatório.",
    emotion: 1
  },
  {
    phase: "5. Suporte & Retenção",
    action: "Recebe mensagem automática confirmando sucesso e oferecendo dica avançada.",
    touchpoint: "Notificação & Chat de Suporte",
    pain: "Nenhum; sentiu-se valorizado e acolhido pelo produto.",
    emotion: 2
  }
];

function initJourneyWidget() {
  const tableBody = document.getElementById('journey-table-body');
  const curveSvg = document.getElementById('journey-curve-svg');
  const opportunityBox = document.getElementById('journey-opportunity-callout');

  if (!tableBody || !curveSvg) return;

  const currentStages = JSON.parse(JSON.stringify(defaultJourneyStages));

  function drawCurve() {
    const width = 600;
    const height = 90;
    const paddingX = 60;
    const stepX = (width - 2 * paddingX) / (currentStages.length - 1);

    // Mapeamento de emoção (-2 a +2) para Y (75 a 15)
    // -2 -> 75 (embaixo/triste), 0 -> 45 (neutro), +2 -> 15 (topo/feliz)
    const points = currentStages.map((stage, i) => {
      const x = paddingX + i * stepX;
      const y = 45 - (stage.emotion * 15);
      return { x, y, emotion: stage.emotion, phase: stage.phase };
    });

    const pathData = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const dots = points.map(pt => {
      const color = pt.emotion < 0 ? 'var(--accent-rose)' : pt.emotion > 0 ? 'var(--accent-emerald)' : 'var(--accent-amber)';
      return `
        <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="${color}" stroke="var(--bg-surface)" stroke-width="2"/>
        <text x="${pt.x}" y="${pt.y - 10}" text-anchor="middle" font-size="11" fill="var(--text-secondary)" font-family="Inter, sans-serif">
          ${pt.emotion > 0 ? '+' + pt.emotion : pt.emotion}
        </text>
      `;
    }).join('');

    curveSvg.innerHTML = `
      <line x1="${paddingX}" y1="45" x2="${width - paddingX}" y2="45" stroke="var(--border-color)" stroke-dasharray="4" stroke-width="1.5"/>
      <path d="${pathData}" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
    `;

    // Identifica o ponto crítico (menor emoção)
    const lowest = points.reduce((min, p) => p.emotion < min.emotion ? p : min, points[0]);
    if (opportunityBox) {
      opportunityBox.innerHTML = `
        <strong>Oportunidade de Maior Impacto em IHC:</strong> A fase mais crítica da jornada é 
        <span style="color:var(--accent-rose); font-weight:700;">${lowest.phase}</span> (Índice Emocional: ${lowest.emotion}). 
        Focar a prototipação e a redução de atrito nesta etapa trará o maior retorno na retenção e satisfação do usuário.
      `;
    }
  }

  function renderTable() {
    tableBody.innerHTML = currentStages.map((stage, idx) => `
      <tr>
        <td><strong>${stage.phase}</strong></td>
        <td>${stage.action}</td>
        <td><code>${stage.touchpoint}</code></td>
        <td style="color:var(--accent-rose);">${stage.pain}</td>
        <td>
          <select class="widget-select" style="padding:0.3rem;" data-idx="${idx}">
            <option value="2" ${stage.emotion === 2 ? 'selected' : ''}>+2 Encantado</option>
            <option value="1" ${stage.emotion === 1 ? 'selected' : ''}>+1 Satisfeito</option>
            <option value="0" ${stage.emotion === 0 ? 'selected' : ''}> 0 Neutro</option>
            <option value="-1" ${stage.emotion === -1 ? 'selected' : ''}>-1 Frustrado</option>
            <option value="-2" ${stage.emotion === -2 ? 'selected' : ''}>-2 Irritado</option>
          </select>
        </td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const i = parseInt(e.target.getAttribute('data-idx'), 10);
        currentStages[i].emotion = parseInt(e.target.value, 10);
        drawCurve();
      });
    });
  }

  renderTable();
  drawCurve();
}

document.addEventListener('DOMContentLoaded', initJourneyWidget);
