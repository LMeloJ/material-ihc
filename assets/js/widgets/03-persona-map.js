/**
 * WIDGET 03: Construtor Interativo de Personas e Mapa de Empatia
 * Referência: Alan Cooper (Personas) & Dave Gray / XPLANE (Mapa de Empatia)
 */

const presetPersonas = {
  mariana: {
    nome: "Mariana Costa",
    idade: "23 anos",
    ocupacao: "Estudante de Engenharia & Estagiária",
    perfil: "Nativa digital, hiperconectada, lida com sobrecarga de tarefas e prazos apertados.",
    empathy: {
      pensaSente: ["Preciso me formar sem ter um burnout.", "Será que estou aprendendo o suficiente para o mercado?", "Odeio ferramentas lentas."],
      escuta: ["Amigos reclamando de processos burocráticos.", "Professores cobrando leituras extensas.", "Família incentivando estabilidade."],
      ve: ["Muitos apps concorrentes com interfaces poluídas.", "Colegas usando ferramentas mais ágeis no trabalho."],
      falaFaz: ["Usa atalhos de teclado sempre que pode.", "Reclama publicamente no Twitter quando um app falha.", "Estuda com fones de cancelamento de ruído."],
      dores: ["Falta de sincronização na nuvem em tempo real.", "Interfaces complexas que exigem treinamento."],
      ganhos: ["Economizar 30 minutos por dia.", "Centralizar suas notas acadêmicas com clareza visual."]
    }
  },
  roberto: {
    nome: "Roberto Mendes",
    idade: "54 anos",
    ocupacao: "Diretor Comercial e de Vendas",
    perfil: "Pragmático, focado em resultados e metas trimestrais, usa tecnologia como meio, não como fim.",
    empathy: {
      pensaSente: ["Tempo é dinheiro.", "Tenho medo de a equipe perder vendas por causa de erros em sistemas.", "Gosto de gráficos executivos."],
      escuta: ["Clientes cobrando respostas mais rápidas.", "Diretoria pedindo redução de custos e aumento de produtividade."],
      ve: ["Planilhas de Excel intermináveis e desatualizadas.", "Concorrentes usando inteligência artificial."],
      falaFaz: ["Liga em vez de mandar mensagem longa.", "Pede relatórios em PDF de uma página.", "Valoriza atendimento por suporte humano."],
      dores: ["Sistemas que travam no fechamento do mês.", "Excesso de cliques para aprovar uma cotação."],
      ganhos: ["Dashboards claros em tempo real no tablet.", "Segurança absoluta dos dados corporativos."]
    }
  }
};

function initPersonaWidget() {
  const personaSelect = document.getElementById('persona-preset-select');
  const personaNameEl = document.getElementById('persona-display-name');
  const personaMetaEl = document.getElementById('persona-display-meta');
  const personaBioEl = document.getElementById('persona-display-bio');

  const qPensaSente = document.getElementById('quadrant-pensa-sente');
  const qEscuta = document.getElementById('quadrant-escuta');
  const qVe = document.getElementById('quadrant-ve');
  const qFalaFaz = document.getElementById('quadrant-fala-faz');
  const qDores = document.getElementById('quadrant-dores');
  const qGanhos = document.getElementById('quadrant-ganhos');

  const addNoteBtn = document.getElementById('add-sticky-btn');
  const noteTextInput = document.getElementById('sticky-note-input');
  const noteQuadrantSelect = document.getElementById('sticky-quadrant-select');

  if (!personaSelect || !qPensaSente) return;

  function renderQuadrantNotes(container, notes) {
    container.innerHTML = notes.map((text, i) => `
      <div class="sticky-note">
        <span>${text}</span>
        <button style="border:none; background:none; cursor:pointer; color:inherit; font-size:1.1rem; line-height:1;" onclick="this.parentElement.remove()">×</button>
      </div>
    `).join('');
  }

  function loadPersona(key) {
    const data = presetPersonas[key];
    if (!data) return;

    if (personaNameEl) personaNameEl.innerText = data.nome;
    if (personaMetaEl) personaMetaEl.innerText = `${data.idade} • ${data.ocupacao}`;
    if (personaBioEl) personaBioEl.innerText = data.perfil;

    renderQuadrantNotes(qPensaSente, data.empathy.pensaSente);
    renderQuadrantNotes(qEscuta, data.empathy.escuta);
    renderQuadrantNotes(qVe, data.empathy.ve);
    renderQuadrantNotes(qFalaFaz, data.empathy.falaFaz);
    renderQuadrantNotes(qDores, data.empathy.dores);
    renderQuadrantNotes(qGanhos, data.empathy.ganhos);
  }

  personaSelect.addEventListener('change', (e) => {
    loadPersona(e.target.value);
  });

  if (addNoteBtn && noteTextInput && noteQuadrantSelect) {
    addNoteBtn.addEventListener('click', () => {
      const text = noteTextInput.value.trim();
      if (!text) return;
      const quad = noteQuadrantSelect.value;
      const targetEl = document.getElementById(`quadrant-${quad}`);
      if (targetEl) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'sticky-note';
        noteDiv.innerHTML = `
          <span>${text}</span>
          <button style="border:none; background:none; cursor:pointer; color:inherit; font-size:1.1rem; line-height:1;" onclick="this.parentElement.remove()">×</button>
        `;
        targetEl.appendChild(noteDiv);
        noteTextInput.value = '';
      }
    });
  }

  loadPersona('mariana');
}

document.addEventListener('DOMContentLoaded', initPersonaWidget);
