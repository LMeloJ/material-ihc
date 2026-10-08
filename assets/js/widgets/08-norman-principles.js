/**
 * WIDGET 08: Princípios Fundamentais de Don Norman e Design de Interação
 * Referência: Don Norman (The Design of Everyday Things, 2013) & Preece, Rogers e Sharp (2015)
 */

function initNormanWidget() {
  const mappingToggle = document.getElementById('norman-mapping-mode');
  const burners = [
    document.getElementById('burner-tl'), // Top-Left
    document.getElementById('burner-tr'), // Top-Right
    document.getElementById('burner-bl'), // Bottom-Left
    document.getElementById('burner-br')  // Bottom-Right
  ];
  const knobs = document.querySelectorAll('.stove-knob');
  const feedbackLog = document.getElementById('stove-feedback-log');

  if (!knobs.length || !burners[0]) return;

  let isNaturalMapping = false;

  if (mappingToggle) {
    mappingToggle.addEventListener('change', (e) => {
      isNaturalMapping = e.target.checked;
      burners.forEach(b => b.classList.remove('hot'));
      if (feedbackLog) {
        feedbackLog.innerHTML = isNaturalMapping 
          ? `<strong>Mapeamento Natural Ativado:</strong> A disposição dos botões reflete diretamente a geometria espacial das bocas.`
          : `<strong>Mapeamento Arbitrário / Ruim Ativado:</strong> Os botões estão em linha reta arbitrária, exigindo que o usuário memorize a correspondência.`;
      }
    });
  }

  knobs.forEach((knob, index) => {
    knob.addEventListener('click', () => {
      burners.forEach(b => b.classList.remove('hot'));

      let targetBurnerIndex;
      if (isNaturalMapping) {
        // Natural: botão 0 -> TL, botão 1 -> TR, botão 2 -> BL, botão 3 -> BR
        targetBurnerIndex = index;
      } else {
        // Arbitrário: mapeamento não-óbvio (ex: botão 0 acende BR, botão 1 acende TL, etc.)
        const badMap = [3, 0, 2, 1];
        targetBurnerIndex = badMap[index];
      }

      if (burners[targetBurnerIndex]) {
        burners[targetBurnerIndex].classList.add('hot');
      }

      if (feedbackLog) {
        const burnerNames = ["Superior Esquerda", "Superior Direita", "Inferior Esquerda", "Inferior Direita"];
        feedbackLog.innerHTML = `Você acionou o Botão #${index + 1}. A boca acesa foi: <strong>${burnerNames[targetBurnerIndex]}</strong>. ${!isNaturalMapping ? '<span style="color:var(--accent-rose); font-weight:600;">(Você esperava essa boca?)</span>' : '<span style="color:var(--accent-emerald); font-weight:600;">(Mapeamento espacial perfeito!)</span>'}`;
      }
    });
  });

  // Simulador de Porta de Norman
  const doorBtn = document.getElementById('norman-door-test-btn');
  const doorResult = document.getElementById('norman-door-result');
  const doorHandleType = document.getElementById('norman-door-type');

  if (doorBtn && doorResult && doorHandleType) {
    doorBtn.addEventListener('click', () => {
      const type = doorHandleType.value;
      if (type === 'bad-handle') {
        doorResult.innerHTML = `
          <div style="color:var(--accent-rose); font-weight:600; padding:0.5rem; background:var(--accent-rose-light); border-radius:var(--radius-sm);">
            💥 Você tentou PUXAR porque viu uma maçaneta de puxar (Signifier falso), mas a porta só ABRE EMPURRANDO! Você acabou de sofrer o efeito clássico de uma Porta de Norman.
          </div>
        `;
      } else {
        doorResult.innerHTML = `
          <div style="color:var(--accent-emerald); font-weight:600; padding:0.5rem; background:var(--accent-emerald-light); border-radius:var(--radius-sm);">
            ✓ A porta possui uma placa plana de metal (Barra antipânico). A affordance e o signifier comunicam de imediato: só é possível empurrar. Nenhum erro cometido!
          </div>
        `;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initNormanWidget);
