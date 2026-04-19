/* ===================================================================
   Nano Slim — anti-cópia / anti-DevTools
   Protege landing contra copy casual (não substitui segurança server-side)
=================================================================== */
(function(){
  'use strict';

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
