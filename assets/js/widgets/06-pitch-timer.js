/**
 * WIDGET 06: Construtor de Pitch Curto e Cronômetro Teleprompter de 60 Segundos
 * Referência: Geoffrey Moore (Crossing the Chasm) & SRI NABC (Need, Approach, Benefit, Competition)
 */

function initPitchWidget() {
  const userRole = document.getElementById('pitch-role');
  const userPain = document.getElementById('pitch-pain');
  const solutionName = document.getElementById('pitch-solution');
  const keyBenefit = document.getElementById('pitch-benefit');
  const competitor = document.getElementById('pitch-competitor');
  const differentiator = document.getElementById('pitch-diff');
  const buildBtn = document.getElementById('pitch-build-btn');

  const teleprompterText = document.getElementById('pitch-teleprompter-text');
  const timerDisplay = document.getElementById('pitch-timer-val');
  const startTimerBtn = document.getElementById('pitch-timer-start');
  const resetTimerBtn = document.getElementById('pitch-timer-reset');
  const phaseBadge = document.getElementById('pitch-phase-badge');

  if (!buildBtn || !teleprompterText) return;

  function generatePitchText() {
    const role = (userRole && userRole.value.trim()) || "profissionais autônomos e freelancers";
    const pain = (userPain && userPain.value.trim()) || "perdem até 8 horas semanais organizando notas fiscais manualmente";
    const sol = (solutionName && solutionName.value.trim()) || "o 'NotaÁgil'";
    const ben = (keyBenefit && keyBenefit.value.trim()) || "automatiza o recolhimento tributário com um único clique no WhatsApp";
    const comp = (competitor && competitor.value.trim()) || "planilhas estáticas ou softwares contábeis burocráticos";
    const diff = (differentiator && differentiator.value.trim()) || "não exigimos nenhum conhecimento fiscal prévio e integramos direto ao banco";

    return `
      [00s - 15s | A Dor]: "Você sabia que hoje mais de 70% dos ${role} ${pain}?<br><br>
      [15s - 35s | A Solução]: Para resolver isso criamos ${sol}, um serviço que ${ben}.<br><br>
      [35s - 50s | O Diferencial]: Diferente de ${comp}, nós ${diff}.<br><br>
      [50s - 60s | Call to Action]: Estamos validando nossos primeiros protótipos de baixa fidelidade e gostaríamos de 15 minutos para entender seu fluxo de trabalho. Vamos conversar?"
    `;
  }

  buildBtn.addEventListener('click', () => {
    teleprompterText.innerHTML = generatePitchText();
  });

  teleprompterText.innerHTML = generatePitchText();

  // Timer de 60 segundos
  let timerInterval = null;
  let remaining = 60;

  function updatePhaseBadge(secondsLeft) {
    if (!phaseBadge) return;
    if (secondsLeft > 45) {
      phaseBadge.innerText = "Fase 1: Contexto e Dor do Usuário (Prenda a atenção)";
      phaseBadge.style.background = "var(--primary-light)";
      phaseBadge.style.color = "var(--primary)";
    } else if (secondsLeft > 25) {
      phaseBadge.innerText = "Fase 2: Abordagem e Proposta de Valor Central";
      phaseBadge.style.background = "var(--accent-purple-light)";
      phaseBadge.style.color = "var(--accent-purple)";
    } else if (secondsLeft > 10) {
      phaseBadge.innerText = "Fase 3: Benefício Claro e Diferencial Competitivo";
      phaseBadge.style.background = "var(--accent-amber-light)";
      phaseBadge.style.color = "var(--accent-amber)";
    } else {
      phaseBadge.innerText = "Fase 4: Call to Action (Chamada para Próximos Passos)";
      phaseBadge.style.background = "var(--accent-rose-light)";
      phaseBadge.style.color = "var(--accent-rose)";
    }
  }

  if (startTimerBtn && timerDisplay) {
    startTimerBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimerBtn.innerText = "Retomar";
        return;
      }

      startTimerBtn.innerText = "Pausar";
      timerInterval = setInterval(() => {
        remaining--;
        timerDisplay.innerText = `${remaining.toString().padStart(2, '0')}s`;
        updatePhaseBadge(remaining);

        if (remaining <= 10) {
          timerDisplay.classList.add('danger');
        }

        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          startTimerBtn.innerText = "Tempo Esgotado!";
          startTimerBtn.disabled = true;
        }
      }, 1000);
    });

    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        remaining = 60;
        timerDisplay.innerText = "60s";
        timerDisplay.classList.remove('danger');
        startTimerBtn.innerText = "Iniciar Ensaio";
        startTimerBtn.disabled = false;
        updatePhaseBadge(60);
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', initPitchWidget);
