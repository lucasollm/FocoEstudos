/* ============================================================
   home.js — Interações da tela inicial
   (Nenhuma lógica crítica aqui — extensões futuras)
============================================================ */

// Highlight do link de navegação ao scroll
window.addEventListener('scroll', () => {
  const sections = ['cursos-section', 'sobre-section'];
  const navLinks = document.querySelectorAll('.home-nav a');

  sections.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top <= 80 && rect.bottom > 80) {
      navLinks.forEach(l => l.style.color = '');
      if (navLinks[i]) navLinks[i].style.color = 'var(--accent)';
    }
  });
}, { passive: true });
