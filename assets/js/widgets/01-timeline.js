/**
 * WIDGET 01: Linha do Tempo de IHC e Simulador da Lei de Fitts
 */

const ihcTimelineData = [
  {
    year: "1945",
    title: "Memex (Vannevar Bush)",
    desc: "Vannevar Bush publica 'As We May Think', concebendo o Memex: um dispositivo eletromecânico para armazenamento e recuperação associativa de informações, considerado o embrião do hipertexto e da navegação moderna.",
    ref: "Bush, V. (1945). As We May Think. The Atlantic Monthly."
  },
  {
    year: "1963",
    title: "Sketchpad (Ivan Sutherland)",
    desc: "Criado no MIT, o Sketchpad foi o primeiro programa de desenho computacional com interface gráfica direta usando uma caneta óptica (light pen), fundando a manipulação direta.",
    ref: "Sutherland, I. E. (1963). Sketchpad: A man-machine graphical communication system. PhD thesis, MIT."
  },
  {
    year: "1968",
    title: "The Mother of All Demos (Douglas Engelbart)",
    desc: "Engelbart apresenta o NLS demonstrando em tempo real: o mouse (patenteado por ele), hipertexto, videoconferência, edição colaborativa de texto e janelas sobrepostas.",
    ref: "Engelbart, D. C. (1968). A research center for augmenting human intellect. Fall Joint Computer Conference."
  },
  {
    year: "1973",
    title: "Xerox Alto (Xerox PARC)",
    desc: "Primeiro computador pessoal a integrar GUI (Graphic User Interface), metáfora de desktop, janelas, ícones, mouse com três botões e editor WYSIWYG (What You See Is What You Get).",
    ref: "Kay, A., & Goldberg, A. (1977). Personal dynamic media. Computer, 10(3), 31-41."
  },
  {
    year: "1984",
    title: "Apple Macintosh",
    desc: "Primeiro computador comercial de sucesso popularizando a interface gráfica para o público em massa, acompanhado do primeiro guia formal de estilo de interface humana (Apple Human Interface Guidelines).",
    ref: "Apple Computer Inc. (1987). Human Interface Guidelines: The Apple Desktop Interface."
  },
  {
    year: "1988",
    title: "The Design of Everyday Things (Don Norman)",
    desc: "Donald Norman publica sua obra seminal aplicando psicologia cognitiva ao design de produtos, cunhando e popularizando conceitos como affordance, signifiers e feedback.",
    ref: "Norman, D. A. (1988). The Psychology of Everyday Things (depois The Design of Everyday Things). Basic Books."
  },
  {
    year: "1990s",
    title: "Nielsen, Heurísticas e Web",
    desc: "Jakob Nielsen e Rolf Molich formalizam os métodos de inspeção e a avaliação heurística de usabilidade, tornando a avaliação de IHC rápida, econômica e científica.",
    ref: "Nielsen, J., & Molich, R. (1990). Heuristic evaluation of user interfaces. ACM CHI."
  },
  {
    year: "Hoje",
    title: "Computação Ubíqua, Mobile e IA",
    desc: "IHC expande-se além de telas de desktop: interfaces por voz (VUI), vestíveis, realidade estendida (XR), interfaces conversacionais com IA e design universal acessível.",
    ref: "Weiser, M. (1991). The Computer for the 21st Century. Scientific American."
  }
];

function initTimelineWidget() {
  const container = document.getElementById('timeline-points-container');
  const card = document.getElementById('timeline-card-content');
  if (!container || !card) return;

  container.innerHTML = ihcTimelineData.map((item, index) => `
    <button class="timeline-node ${index === 0 ? 'active' : ''}" data-index="${index}" title="${item.title}">
      ${item.year.substring(2)}
    </button>
  `).join('');

  function renderMilestone(index) {
    const item = ihcTimelineData[index];
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
        <span class="badge" style="background:var(--primary-light); color:var(--primary); font-weight:700;">${item.year}</span>
        <span style="font-size:0.8rem; color:var(--text-muted);">Marco Histórico</span>
      </div>
      <h3 style="margin-bottom:0.5rem; color:var(--text-primary);">${item.title}</h3>
      <p style="margin-bottom:0.75rem;">${item.desc}</p>
      <div style="font-size:0.8rem; font-style:italic; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:0.5rem;">
        <strong>Ref:</strong> ${item.ref}
      </div>
    `;

    document.querySelectorAll('.timeline-node').forEach((node, i) => {
      node.classList.toggle('active', i === index);
    });
  }

  container.addEventListener('click', (e) => {
    const node = e.target.closest('.timeline-node');
    if (node) {
      renderMilestone(parseInt(node.getAttribute('data-index'), 10));
    }
  });

  renderMilestone(0);
}

// Simulador da Lei de Fitts: MT = a + b * log2(2D / W)
function initFittsWidget() {
  const arena = document.getElementById('fitts-arena');
  const target = document.getElementById('fitts-target');
  const statsEl = document.getElementById('fitts-stats');
  const resetBtn = document.getElementById('fitts-reset-btn');
  if (!arena || !target || !statsEl) return;

  let clicks = 0;
  let startTime = null;
  let totalTime = 0;
  let lastDistance = 0;
  let lastWidth = 60;

  function spawnTarget() {
    const arenaRect = arena.getBoundingClientRect();
    const sizes = [30, 50, 80, 110];
    const width = sizes[Math.floor(Math.random() * sizes.length)];
    const height = Math.min(width, 60);

    const maxX = arenaRect.width - width - 20;
    const maxY = arenaRect.height - height - 20;
    const posX = Math.max(10, Math.floor(Math.random() * maxX));
    const posY = Math.max(10, Math.floor(Math.random() * maxY));

    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
    target.style.left = `${posX}px`;
    target.style.top = `${posY}px`;

    lastWidth = width;
    startTime = performance.now();
  }

  target.addEventListener('click', () => {
    if (!startTime) return;
    const elapsed = Math.round(performance.now() - startTime);
    clicks++;
    totalTime += elapsed;
    const avg = Math.round(totalTime / clicks);

    // D estimado simplificado
    const id = (Math.log2(2 * (250 / lastWidth))).toFixed(2);

    statsEl.innerHTML = `
      <span>Cliques: <strong>${clicks}</strong></span> | 
      <span>Último tempo: <strong>${elapsed}ms</strong></span> | 
      <span>Largura alvo (W): <strong>${lastWidth}px</strong></span> | 
      <span>Índice Dificuldade (ID): <strong>${id} bits</strong></span>
    `;

    spawnTarget();
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clicks = 0;
      totalTime = 0;
      statsEl.innerHTML = 'Clique no alvo vermelho para iniciar o teste!';
      spawnTarget();
    });
  }

  spawnTarget();
}

document.addEventListener('DOMContentLoaded', () => {
  initTimelineWidget();
  initFittsWidget();
});
