/**
 * WIDGET 11: Laboratório de Interfaces de Média Fidelidade vs Baixa Fidelidade
 * Referências: Jesse James Garrett (The Elements of User Experience) & Dan Saffer (Designing for Interaction)
 */

function initWireframeWidget() {
  const toggleGrid = document.getElementById('wireframe-toggle-grid');
  const toggleAnnotations = document.getElementById('wireframe-toggle-annotations');
  const midFidelityBox = document.getElementById('mid-fidelity-screen');
  const gridOverlay = document.getElementById('wireframe-grid-overlay');
  const annotationsLayer = document.getElementById('wireframe-annotations-layer');

  if (!midFidelityBox) return;

  if (toggleGrid && gridOverlay) {
    toggleGrid.addEventListener('change', (e) => {
      gridOverlay.style.display = e.target.checked ? 'flex' : 'none';
    });
  }

  if (toggleAnnotations && annotationsLayer) {
    toggleAnnotations.addEventListener('change', (e) => {
      annotationsLayer.style.display = e.target.checked ? 'block' : 'none';
    });
  }

  // Permite clicar nos componentes do wireframe para inspecionar decisões de layout
  const inspectElements = document.querySelectorAll('.wireframe-inspectable');
  const inspectLog = document.getElementById('wireframe-inspect-log');

  if (inspectElements.length && inspectLog) {
    inspectElements.forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        inspectElements.forEach(item => item.style.outline = 'none');
        el.style.outline = '2px solid var(--primary)';
        const role = el.getAttribute('data-role');
        const justification = el.getAttribute('data-justification');
        inspectLog.innerHTML = `
          <strong>Componente Selecionado:</strong> ${role}<br>
          <span style="color:var(--text-secondary);">${justification}</span>
        `;
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initWireframeWidget);
