/* ===================================================================
   Nano Slim — anti-cópia / anti-DevTools / anti-zoom mobile
   Protege landing contra copy casual + ajuda retenção (sem substituir
   segurança server-side)
=================================================================== */
(function(){
  'use strict';

  // 0) CSS injection — desabilita callout iOS, seleção, e drag
  try {
    var st = document.createElement('style');
    st.textContent = ''
      + 'html, body { -webkit-touch-callout: none !important; -webkit-tap-highlight-color: transparent !important; touch-action: pan-x pan-y !important; }'
      + 'body, body * { -webkit-user-drag: none; }'
      + '.ck-input, .ck-phone-input, input, textarea, [contenteditable="true"] { -webkit-user-select: text !important; user-select: text !important; -webkit-touch-callout: default !important; }'
      ;
    document.head.appendChild(st);
  } catch(e) {}

  // 1) Disable right-click (menu contextual)
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); return false; });

  // 2) Disable drag de imagens
  document.addEventListener('dragstart', function(e){
    if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
  });

  // 3) Bloqueio de atalhos: F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I/J/C, Ctrl+P
  document.addEventListener('keydown', function(e){
    var k = e.key;
    var ctrl = e.ctrlKey || e.metaKey;
    // F12
    if (k === 'F12') { e.preventDefault(); return false; }
    // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    if (ctrl && (k === 'u' || k === 'U' || k === 's' || k === 'S' || k === 'p' || k === 'P')) {
      e.preventDefault(); return false;
    }
    // Ctrl+Shift+I (inspect), Ctrl+Shift+J (console), Ctrl+Shift+C (inspector)
    if (ctrl && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) {
      e.preventDefault(); return false;
    }
    // Ctrl + roda do rato pra zoom (já bloqueado em wheel listener abaixo)
  });

  // 3.1) Pinch-zoom (iOS) e gesture events
  document.addEventListener('gesturestart',  function(e){ e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); }, { passive: false });
  document.addEventListener('gestureend',    function(e){ e.preventDefault(); }, { passive: false });

  // 3.2) Double-tap zoom mobile
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    var now = Date.now();
    if (now - lastTouchEnd < 350) {
      // 2º tap em <350ms = double-tap → bloqueia
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // 3.3) Ctrl + roda do rato (zoom desktop) e Ctrl + +/-
  document.addEventListener('wheel', function(e){
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); }
  }, { passive: false });
  document.addEventListener('keydown', function(e){
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '_' || e.key === '0')) {
      e.preventDefault();
    }
  });

  // 4) Disable copiar texto (exceto em inputs e checkout)
  var isCheckout = /checkout\.html/i.test(window.location.pathname);
  if (!isCheckout) {
    document.addEventListener('copy', function(e){
      var t = e.target;
      var isInput = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (!isInput) { e.preventDefault(); return false; }
    });
    document.addEventListener('cut', function(e){
      var t = e.target;
      var isInput = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (!isInput) { e.preventDefault(); return false; }
    });
  }

  // 5) Detetar DevTools aberto (heurística por tamanho da viewport)
  // Desativado em mobile porque pode dar falso positivo com teclados virtuais
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    var devtoolsOpen = false;
    setInterval(function(){
      var threshold = 170;
      var wDiff = window.outerWidth - window.innerWidth;
      var hDiff = window.outerHeight - window.innerHeight;
      if ((wDiff > threshold || hDiff > threshold) && !devtoolsOpen) {
        devtoolsOpen = true;
        try { console.clear(); } catch(e) {}
      }
    }, 1500);
  }

  // 6) Console warning (afugenta curiosos)
  try {
    var css = 'color:#dc2626;font-size:22px;font-weight:900;';
    console.log('%c⚠ STOP!', css);
    console.log('%cEste é um painel reservado a programadores.', 'font-size:14px;color:#334155');
    console.log('%cSe alguém te pediu para colar código aqui, É BURLA.', 'font-size:14px;color:#334155');
  } catch(e) {}
})();
