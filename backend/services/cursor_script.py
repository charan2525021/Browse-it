# JavaScript injected into every page to render a visible cursor that follows
# the real mouse and shows a click animation at the actual click location.
# Playwright performs genuine mouse movements/clicks, so this reflects real agent actions.

CURSOR_INIT_SCRIPT = r"""
(() => {
  if (window.__browseit_cursor_installed) return;
  window.__browseit_cursor_installed = true;

  const ensure = () => {
    if (!document.body) { requestAnimationFrame(ensure); return; }

    // Cursor element
    let cursor = document.getElementById('__browseit_cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = '__browseit_cursor';
      cursor.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'width:24px', 'height:24px',
        'z-index:2147483647', 'pointer-events:none',
        'transition:transform 0.15s ease-out', 'will-change:transform',
        'transform:translate(-100px,-100px)'
      ].join(';');
      cursor.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
             style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4))">
          <path d="M4 2 L4 20 L9 15 L12.5 22 L15 21 L11.5 14 L18 14 Z"
                fill="#F5CF63" stroke="#1a1a1a" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>`;
      document.documentElement.appendChild(cursor);
    }

    let lastX = -100, lastY = -100;

    const move = (x, y) => {
      lastX = x; lastY = y;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };

    const ripple = (x, y) => {
      const r = document.createElement('div');
      r.style.cssText = [
        'position:fixed', `left:${x}px`, `top:${y}px`, 'width:8px', 'height:8px',
        'border-radius:50%', 'background:rgba(245,207,99,0.5)',
        'border:2px solid #F5CF63', 'z-index:2147483646', 'pointer-events:none',
        'transform:translate(-50%,-50%)', 'animation:__browseit_ripple 0.6s ease-out forwards'
      ].join(';');
      document.documentElement.appendChild(r);
      // press effect on cursor
      cursor.style.transform = `translate(${x}px, ${y}px) scale(0.8)`;
      setTimeout(() => { cursor.style.transform = `translate(${lastX}px, ${lastY}px) scale(1)`; }, 150);
      setTimeout(() => r.remove(), 650);
    };

    if (!document.getElementById('__browseit_cursor_style')) {
      const style = document.createElement('style');
      style.id = '__browseit_cursor_style';
      style.textContent = `@keyframes __browseit_ripple {
        0% { width:8px; height:8px; opacity:1; }
        100% { width:50px; height:50px; opacity:0; }
      }`;
      document.documentElement.appendChild(style);
    }

    // Track real mouse movements from Playwright
    document.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), true);
    document.addEventListener('mousedown', (e) => ripple(e.clientX, e.clientY), true);

    // Expose function for explicit positioning from Python
    window.__browseitMoveCursor = (x, y, click) => {
      move(x, y);
      if (click) ripple(x, y);
    };
  };

  ensure();
})();
"""
