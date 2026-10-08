/**
 * WIDGET 07: Simulador Interativo da Técnica do Mágico de Oz (Wizard of Oz)
 * Referência: John F. Kelley (1984) & Carolyn Snyder (Paper Prototyping)
 */

function initWizardOzWidget() {
  const userChatArea = document.getElementById('woz-user-chat');
  const wizardChatArea = document.getElementById('woz-wizard-chat');
  const userInput = document.getElementById('woz-user-input');
  const sendUserBtn = document.getElementById('woz-send-user-btn');

  const wizardCannedSelect = document.getElementById('woz-canned-response');
  const sendWizardBtn = document.getElementById('woz-send-wizard-btn');
  const wizardCustomInput = document.getElementById('woz-custom-response');

  if (!userChatArea || !sendUserBtn) return;

  function appendMessage(sender, text) {
    const isUser = sender === 'user';
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user' : 'wizard'}`;
    bubble.innerHTML = `<strong>${isUser ? 'Usuário (Teste)' : 'Sistema (Mágico)'}:</strong> ${text}`;

    // Adiciona na tela do usuário
    userChatArea.appendChild(bubble.cloneNode(true));
    userChatArea.scrollTop = userChatArea.scrollHeight;

    // Adiciona na tela dos bastidores
    if (wizardChatArea) {
      wizardChatArea.appendChild(bubble);
      wizardChatArea.scrollTop = wizardChatArea.scrollHeight;
    }
  }

  sendUserBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    userInput.value = '';

    // Sugere resposta no painel do mágico
    if (wizardCustomInput) {
      wizardCustomInput.placeholder = `Mágico: como você responderá a "${text}"?`;
    }
  });

  if (sendWizardBtn) {
    sendWizardBtn.addEventListener('click', () => {
      let resp = "";
      if (wizardCustomInput && wizardCustomInput.value.trim()) {
        resp = wizardCustomInput.value.trim();
        wizardCustomInput.value = '';
      } else if (wizardCannedSelect) {
        resp = wizardCannedSelect.value;
      }
      if (!resp) return;

      appendMessage('wizard', resp);
    });
  }

  // Atalhos de mensagens pré-configuradas para o aluno testar rapidamente
  document.querySelectorAll('.woz-prompt-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      if (userInput) {
        userInput.value = btn.innerText;
        sendUserBtn.click();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initWizardOzWidget);
