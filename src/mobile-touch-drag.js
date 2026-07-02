function ensureMobileTouchDragStyle() {
  var style = document.getElementById('mobile-touch-drag-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'mobile-touch-drag-style';
    document.head.appendChild(style);
  }

  style.textContent = '@media (max-width:1200px){.resize-handle,.draggable-photo,.white-mask,.mask-resize-handle,.bar-mark{touch-action:none!important;-webkit-user-select:none!important;user-select:none!important}.resize-handle{pointer-events:auto!important}}';
}

function getTouchPoint(event) {
  var touch = event.touches && event.touches[0] ? event.touches[0] : event.changedTouches && event.changedTouches[0] ? event.changedTouches[0] : null;
  if (!touch) return null;
  return { clientX: touch.clientX, clientY: touch.clientY, screenX: touch.screenX, screenY: touch.screenY };
}

function makeMouseEvent(type, point) {
  return new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: point.clientX,
    clientY: point.clientY,
    screenX: point.screenX,
    screenY: point.screenY,
    buttons: type === 'mouseup' ? 0 : 1,
    button: 0,
  });
}

function getA4MobileScale() {
  var page = document.querySelector('.a4-page');
  if (!page) return 1;
  var rect = page.getBoundingClientRect();
  if (!rect.width) return 1;
  return Math.max(0.32, Math.min(1, rect.width / 794));
}

function amplifyPoint(point) {
  var scale = getA4MobileScale();
  var factor = Math.max(1, Math.min(3, 1 / scale));
  return {
    clientX: point.clientX * factor,
    clientY: point.clientY * factor,
    screenX: point.screenX * factor,
    screenY: point.screenY * factor
  };
}

function isTouchDragTarget(target) {
  return !!(target && target.closest && target.closest('.resize-handle,.draggable-photo,.white-mask,.mask-resize-handle,.bar-mark'));
}

function installMobileTouchDrag() {
  ensureMobileTouchDragStyle();
  if (window.__mobileTouchDragInstalled) return;
  window.__mobileTouchDragInstalled = true;

  var activeTarget = null;
  var useAmplify = false;

  document.addEventListener('touchstart', function (event) {
    if (!window.matchMedia('(max-width: 1200px)').matches) return;
    if (!isTouchDragTarget(event.target)) return;
    var point = getTouchPoint(event);
    if (!point) return;
    activeTarget = event.target.closest('.resize-handle,.draggable-photo,.white-mask,.mask-resize-handle,.bar-mark');
    useAmplify = activeTarget && activeTarget.classList.contains('resize-handle');
    event.preventDefault();
    activeTarget.dispatchEvent(makeMouseEvent('mousedown', useAmplify ? amplifyPoint(point) : point));
  }, { passive: false, capture: true });

  document.addEventListener('touchmove', function (event) {
    if (!activeTarget) return;
    var point = getTouchPoint(event);
    if (!point) return;
    event.preventDefault();
    var p = useAmplify ? amplifyPoint(point) : point;
    document.dispatchEvent(makeMouseEvent('mousemove', p));
    var shell = document.querySelector('.app-shell');
    if (shell) shell.dispatchEvent(makeMouseEvent('mousemove', p));
  }, { passive: false, capture: true });

  function finishTouch(event) {
    if (!activeTarget) return;
    var point = getTouchPoint(event) || { clientX: 0, clientY: 0, screenX: 0, screenY: 0 };
    var p = useAmplify ? amplifyPoint(point) : point;
    event.preventDefault();
    document.dispatchEvent(makeMouseEvent('mouseup', p));
    var shell = document.querySelector('.app-shell');
    if (shell) shell.dispatchEvent(makeMouseEvent('mouseup', p));
    activeTarget = null;
    useAmplify = false;
  }

  document.addEventListener('touchend', finishTouch, { passive: false, capture: true });
  document.addEventListener('touchcancel', finishTouch, { passive: false, capture: true });
}

installMobileTouchDrag();
setTimeout(installMobileTouchDrag, 100);
setTimeout(installMobileTouchDrag, 500);
