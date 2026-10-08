/**
 * WIDGET 04: Construtor e Analisador de PoV (Point of View) e How Might We (HMW)
 * Referência: Stanford d.school Bootcamp Bootleg & Min Basadur
 */

function initPovHmwWidget() {
  const userRoleInput = document.getElementById('pov-user');
  const userNeedInput = document.getElementById('pov-need');
  const userInsightInput = document.getElementById('pov-insight');
  const generateBtn = document.getElementById('pov-generate-btn');

  const povPreviewBox = document.getElementById('pov-preview-result');
  const hmwVariationsBox = document.getElementById('hmw-variations-container');
  const warningBox = document.getElementById('pov-antipattern-alert');

  if (!generateBtn || !povPreviewBox) return;

  generateBtn.addEventListener('click', () => {
    const user = (userRoleInput ? userRoleInput.value.trim() : "") || "um estudante universitário sobrecarregado";
    const need = (userNeedInput ? userNeedInput.value.trim() : "") || "organizar suas prioridades de estudo sem estresse";
    const insight = (userInsightInput ? userInsightInput.value.trim() : "") || "ele procrastina não por preguiça, mas pela ansiedade de não saber por onde começar";

    // Checagem de antipattern comum: se a necessidade já é a solução pronta (ex: "um app", "um site", "um botão")
    const solutionKeywords = ['um app', 'um aplicativo', 'um software', 'um botão', 'um sistema', 'uma tela', 'uma ferramenta'];
    const hasAntipattern = solutionKeywords.some(kw => need.toLowerCase().includes(kw));

    if (warningBox) {
      if (hasAntipattern) {
        warningBox.style.display = 'block';
        warningBox.innerHTML = `
          <strong>Atenção ao Antipattern de Design!</strong> Você incluiu uma solução física/digital na 'Necessidade' ("${need}"). 
          Lembre-se: no PoV a necessidade deve ser descrita como uma <em>ação ou objetivo humano</em> (verbo), e não como a solução pré-concebida (ex: em vez de "precisa de um app", use "precisa acompanhar tarefas em tempo real").
        `;
      } else {
        warningBox.style.display = 'none';
      }
    }

    // Render PoV
    povPreviewBox.innerHTML = `
      <div style="font-size:1.1rem; line-height:1.7;">
        <strong>[Usuário]:</strong> <span style="color:var(--primary); font-weight:600;">${user}</span><br>
        <strong>[Necessita de]:</strong> <span style="color:var(--accent-emerald); font-weight:600;">${need}</span><br>
        <strong>[Porque (Insight)]:</strong> <span style="color:var(--accent-purple); font-weight:600;">${insight}</span>.
      </div>
    `;

    // Gerador de variações How Might We
    const variations = [
      {
        tag: "Abordagem Direta",
        text: `Como poderíamos ajudar ${user} a ${need}?`
      },
      {
        tag: "Inversão / Redução da Dor",
        text: `Como poderíamos eliminar completamente o gatilho que causa "${insight.substring(0, 50)}..."?`
      },
      {
        tag: "Explorando Emoção & Conforto",
        text: `Como poderíamos fazer com que o momento de ${need} seja relaxante e recompensador para ${user}?`
      },
      {
        tag: "Uso de Recursos Inesperados",
        text: `Como poderíamos transformar colegas de turma ou rotinas pré-existentes em facilitadores para ${user}?`
      }
    ];

    hmwVariationsBox.innerHTML = variations.map(v => `
      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.85rem; margin-bottom:0.6rem;">
        <span class="badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem; margin-bottom:0.3rem;">${v.tag}</span>
        <div style="font-size:0.95rem; font-weight:600; color:var(--text-primary);">${v.text}</div>
      </div>
    `).join('');
  });
}

document.addEventListener('DOMContentLoaded', initPovHmwWidget);
