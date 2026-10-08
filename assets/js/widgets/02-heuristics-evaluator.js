/**
 * WIDGET 02: Laboratório Interativo de Avaliação Heurística de Nielsen
 */

const heuristicsList = [
  { id: 1, name: "#1 Visibilidade do estado do sistema", desc: "O sistema deve sempre manter os usuários informados sobre o que está acontecendo através de feedback apropriado e em tempo razoável." },
  { id: 2, name: "#2 Correspondência entre o sistema e o mundo real", desc: "O sistema deve falar a linguagem do usuário, com palavras e conceitos familiares, e não termos orientados ao sistema." },
  { id: 3, name: "#3 Controle e liberdade do usuário", desc: "Usuários frequentemente escolhem funções por engano. Precisam de 'saídas de emergência' claras, como Desfazer (Undo) e Refazer." },
  { id: 4, name: "#4 Consistência e padrões", desc: "Os usuários não devem ter que se perguntar se palavras ou ações diferentes significam a mesma coisa. Siga as convenções da plataforma." },
  { id: 5, name: "#5 Prevenção de erros", desc: "Melhor do que boas mensagens de erro é um design cuidadoso que previne o erro antes que ele ocorra (ex: confirmações de ações destrutivas)." },
  { id: 6, name: "#6 Reconhecimento em vez de memorização", desc: "Minimize a carga de memória do usuário tornando elementos, ações e opções visíveis. Não exija lembrar dados de uma tela na outra." },
  { id: 7, name: "#7 Flexibilidade e eficiência de uso", desc: "Aceleradores (atalhos) que não são vistos pelo novato podem acelerar a interação para o usuário especialista." },
  { id: 8, name: "#8 Design estético e minimalista", desc: "Diálogos não devem conter informações irrelevantes ou raramente necessárias. Cada unidade extra de informação compete com as relevantes." },
  { id: 9, name: "#9 Ajudar os usuários a reconhecer, diagnosticar e recuperar-se de erros", desc: "Mensagens de erro devem ser expressas em linguagem clara (sem códigos obscuros), indicar com precisão o problema e sugerir uma solução construtiva." },
  { id: 10, name: "#10 Ajuda e documentação", desc: "Mesmo que o sistema possa ser usado sem documentação, pode ser necessário fornecer ajuda focada na tarefa do usuário com passos concretos." }
];

const mockFlaws = [
  {
    elementId: "flaw-btn-delete",
    correctHeuristic: 5,
    title: "Exclusão Instantânea sem Confirmação",
    explanation: "O botão 'Excluir Conta' apaga instantaneamente todo o histórico com um único clique acidental, sem pedir confirmação nem oferecer tela de aviso prévio. Violação clássica de Prevenção de Erros (Heurística #5).",
    severity: 4
  },
  {
    elementId: "flaw-loading-silent",
    correctHeuristic: 1,
    title: "Processamento sem Indicador de Progresso",
    explanation: "Ao clicar em 'Salvar Relatório', a tela trava completamente por 12 segundos sem nenhum spinner, barra de progresso ou aviso de que o sistema está trabalhando. Viola a Visibilidade do estado do sistema (#1).",
    severity: 3
  },
  {
    elementId: "flaw-cryptic-error",
    correctHeuristic: 9,
    title: "Mensagem de Erro Criptográfica",
    explanation: "A mensagem exibe: 'FATAL EXCEPTION: ERR_SQL_NULL_POINTER_0x882A'. Não diz o que o usuário fez de errado nem como resolver. Viola a Heurística #9 (Reconhecimento, diagnóstico e recuperação de erros).",
    severity: 3
  },
  {
    elementId: "flaw-weird-jargon",
    correctHeuristic: 2,
    title: "Jargão Técnico do Desenvolvedor",
    explanation: "O botão de 'Fazer Compras' é rotulado como 'Instanciar TransactionPayloadEntity'. Viola a Correspondência com o mundo real (#2), pois o usuário quer falar a linguagem de comércio, não de classes de software.",
    severity: 2
  },
  {
    elementId: "flaw-no-undo",
    correctHeuristic: 3,
    title: "Falta de Opção de Desfazer (Undo)",
    explanation: "O usuário moveu um arquivo importante para outra pasta e não há botão 'Desfazer' nem histórico de ações. Viola o Controle e liberdade do usuário (#3).",
    severity: 2
  }
];

function initHeuristicsAuditor() {
  const flawsListContainer = document.getElementById('auditor-flaws-selection');
  const heuristicsOptionsContainer = document.getElementById('auditor-heuristics-list');
  const feedbackBox = document.getElementById('auditor-feedback-box');
  const severitySelect = document.getElementById('auditor-severity');
  const submitBtn = document.getElementById('auditor-evaluate-btn');

  if (!flawsListContainer || !heuristicsOptionsContainer || !feedbackBox) return;

  let selectedFlaw = mockFlaws[0];
  let selectedHeuristicId = null;

  // Renderiza opções de heurísticas
  heuristicsOptionsContainer.innerHTML = heuristicsList.map(h => `
    <div class="heuristic-card-mini" data-id="${h.id}">
      <strong>${h.name}</strong>
      <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${h.desc.substring(0, 75)}...</div>
    </div>
  `).join('');

  heuristicsOptionsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.heuristic-card-mini');
    if (!card) return;
    document.querySelectorAll('.heuristic-card-mini').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedHeuristicId = parseInt(card.getAttribute('data-id'), 10);
  });

  // Listener para os pontos falhos no mockup simulado
  document.querySelectorAll('.flaw-spot').forEach(spot => {
    spot.addEventListener('click', (e) => {
      document.querySelectorAll('.flaw-spot').forEach(s => s.classList.remove('selected'));
      spot.classList.add('selected');
      const spotId = spot.id;
      selectedFlaw = mockFlaws.find(f => f.elementId === spotId) || mockFlaws[0];
      feedbackBox.innerHTML = `<div style="color:var(--text-muted);">Elemento selecionado: <strong>${selectedFlaw.title}</strong>. Agora selecione a heurística violada e a gravidade à direita e clique em <em>Verificar Avaliação</em>.</div>`;
    });
  });

  submitBtn.addEventListener('click', () => {
    if (!selectedHeuristicId) {
      feedbackBox.innerHTML = `<div style="color:var(--accent-rose); font-weight:600;">Por favor, selecione qual das 10 Heurísticas de Nielsen você acredita que foi violada.</div>`;
      return;
    }

    const isMatch = selectedHeuristicId === selectedFlaw.correctHeuristic;
    const chosenSeverity = severitySelect ? severitySelect.value : '3';

    if (isMatch) {
      feedbackBox.innerHTML = `
        <div style="background:var(--accent-emerald-light); border:1px solid var(--accent-emerald); border-radius:var(--radius-sm); padding:1rem; color:var(--text-primary);">
          <div style="font-weight:700; color:var(--accent-emerald); display:flex; align-items:center; gap:0.4rem; margin-bottom:0.4rem;">
            ✓ Avaliação Correta!
          </div>
          <p style="margin-bottom:0.5rem;"><strong>Problema:</strong> ${selectedFlaw.title}</p>
          <p style="margin-bottom:0.5rem;">${selectedFlaw.explanation}</p>
          <div style="font-size:0.85rem; color:var(--text-secondary); border-top:1px dashed var(--border-color); padding-top:0.4rem;">
            Gravidade recomendada por Nielsen: <strong>${selectedFlaw.severity}/4</strong> (Você atribuiu ${chosenSeverity}/4).
          </div>
        </div>
      `;
    } else {
      const correctH = heuristicsList.find(h => h.id === selectedFlaw.correctHeuristic);
      feedbackBox.innerHTML = `
        <div style="background:var(--accent-rose-light); border:1px solid var(--accent-rose); border-radius:var(--radius-sm); padding:1rem; color:var(--text-primary);">
          <div style="font-weight:700; color:var(--accent-rose); margin-bottom:0.4rem;">
            ✗ Heurística não correspondente
          </div>
          <p style="margin-bottom:0.4rem;">Você selecionou a Heurística #${selectedHeuristicId}, mas a violação primária é a <strong>${correctH.name}</strong>.</p>
          <p style="font-size:0.85rem; color:var(--text-secondary);">${selectedFlaw.explanation}</p>
        </div>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', initHeuristicsAuditor);
