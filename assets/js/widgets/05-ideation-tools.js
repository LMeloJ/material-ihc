/**
 * WIDGET 05: Ferramentas Criativas de Ideação
 * Brainwriting 6-3-5, SCAMPER, Worst Possible Ideas e Inversão
 * Referências: Rohrbach (1969), Bob Eberle (1971), Dam & Siang (Interaction Design Foundation)
 */

const scamperData = {
  S: {
    letter: "S",
    title: "Substituir (Substitute)",
    pergunta: "O que podemos substituir na interface, fluxo ou processo? Materiais, componentes, regras ou passos?",
    exemplo: "Substituir senhas alfanuméricas complexas por biometria rápida ou Magic Link via e-mail."
  },
  C: {
    letter: "C",
    title: "Combinar (Combine)",
    pergunta: "Quais funções, telas ou tecnologias podem ser mescladas em uma única experiência fluida?",
    exemplo: "Combinar a busca de produtos com recomendações sociais e bate-papo de suporte em tempo real."
  },
  A: {
    letter: "A",
    title: "Adaptar (Adapt)",
    pergunta: "Como podemos adaptar uma solução já existente em outra indústria para o nosso contexto?",
    exemplo: "Adaptar a mecânica de 'arrastar para o lado' (Tinder) para triagem rápida de e-mails ou currículos."
  },
  M: {
    letter: "M",
    title: "Modificar / Maximizar (Modify / Magnify)",
    pergunta: "O que acontece se aumentarmos dramaticamente o tamanho, a velocidade, o contraste ou o feedback?",
    exemplo: "Maximizar os botões essenciais para idosos com tremor nas mãos ou modos de leitura de alto contraste."
  },
  P: {
    letter: "P",
    title: "Propor Outro Uso (Put to another use)",
    pergunta: "Como o sistema ou dados coletados podem servir a um propósito totalmente novo e benéfico?",
    exemplo: "Usar o histórico de erros do usuário não para puni-lo, mas para personalizar tutoriais sob medida."
  },
  E: {
    letter: "E",
    title: "Eliminar (Eliminate)",
    pergunta: "Qual é a coisa mais supérflua ou burocrática que podemos remover sem prejudicar o objetivo?",
    exemplo: "Eliminar formulários de cadastro prévio, permitindo checkout direto como convidado (Guest Checkout)."
  },
  R: {
    letter: "R",
    title: "Reverter / Inverter (Reverse / Rearrange)",
    pergunta: "O que acontece se invertermos a ordem padrão das etapas ou o papel de quem executa?",
    exemplo: "Em vez do usuário procurar o produto, o produto vai até ele através de curadoria ativa preditiva."
  }
};

const worstIdeasCollection = [
  {
    worst: "Esconder o botão de fechar anúncios e fazê-lo se mover quando o cursor do mouse se aproxima.",
    inversion: "Projetar saídas de emergência e controles de dismiss totalmente estáticos, visíveis e instantâneos (Respeito ao usuário)."
  },
  {
    worst: "Pedir que o usuário confirme seu CPF, telefone e endereço para cada produto adicionado ao carrinho.",
    inversion: "Princípio do 1-Click Buy: memorizar dados com segurança e permitir compra em um único gesto."
  },
  {
    worst: "Tocar uma buzina alta em caso de qualquer erro de digitação no campo de senha.",
    inversion: "Feedback sutil, gentil e pedagógico em linha (inline validation) antes de submeter o formulário."
  }
];

function initIdeationWidget() {
  const scamperButtons = document.querySelectorAll('.scamper-letter-btn');
  const scamperTitleEl = document.getElementById('scamper-detail-title');
  const scamperQuestionEl = document.getElementById('scamper-detail-question');
  const scamperExampleEl = document.getElementById('scamper-detail-example');

  if (scamperButtons.length > 0 && scamperTitleEl) {
    function showScamper(letter) {
      const data = scamperData[letter];
      if (!data) return;
      scamperButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-letter') === letter);
      });
      scamperTitleEl.innerText = `${data.letter} - ${data.title}`;
      scamperQuestionEl.innerText = data.pergunta;
      scamperExampleEl.innerText = `Exemplo prático: ${data.exemplo}`;
    }

    scamperButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        showScamper(btn.getAttribute('data-letter'));
      });
    });

    showScamper('S');
  }

  // Pior Ideia Possível
  const worstBtn = document.getElementById('generate-worst-idea-btn');
  const worstDisplay = document.getElementById('worst-idea-display');
  const inversionDisplay = document.getElementById('inversion-display');

  if (worstBtn && worstDisplay && inversionDisplay) {
    worstBtn.addEventListener('click', () => {
      const randomItem = worstIdeasCollection[Math.floor(Math.random() * worstIdeasCollection.length)];
      worstDisplay.innerHTML = `<em>" ${randomItem.worst} "</em>`;
      inversionDisplay.innerHTML = `<strong>Inversão Positiva:</strong> ${randomItem.inversion}`;
    });
  }
}

document.addEventListener('DOMContentLoaded', initIdeationWidget);
