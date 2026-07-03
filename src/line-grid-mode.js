function ensureLineGridModeStyle() {
  var style = document.getElementById('line-grid-mode-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'line-grid-mode-style';
    document.head.appendChild(style);
  }

  style.textContent = '.a4-page.line-mode-grid .exercise-body,.exam-page.line-mode-grid .exercise-body,body.line-mode-grid .exercise-body{background-color:#fff!important;background-image:linear-gradient(#d7d7d7 1px,transparent 1px),linear-gradient(90deg,#d7d7d7 1px,transparent 1px)!important;background-size:28px 28px!important;background-position:0 0!important}.a4-page.line-mode-none .exercise-body,.exam-page.line-mode-none .exercise-body,body.line-mode-none .exercise-body{background:#fff!important}.a4-page.line-mode-grid.no-pdf-lines .exercise-body,.exam-page.line-mode-grid.no-pdf-lines .exercise-body{background-color:#fff!important;background-image:linear-gradient(#d7d7d7 1px,transparent 1px),linear-gradient(90deg,#d7d7d7 1px,transparent 1px)!important;background-size:28px 28px!important;background-position:0 0!important}body.line-mode-grid .a4-lines-proxy:after{width:16px!important;height:16px!important;background:none!important;border:1px solid currentColor!important;box-sizing:border-box!important;display:block!important;content:""!important;background-image:linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)!important;background-size:5px 5px!important;background-position:-1px -1px!important}body.line-mode-none .a4-lines-proxy:after{width:16px!important;height:12px!important;background:none!important;border-top:2px solid currentColor!important;border-bottom:2px solid currentColor!important;transform:rotate(-18deg)!important;display:block!important;content:""!important;box-sizing:border-box!important;opacity:.65!important}';
}

function getLineMode() {
  return window.__lineMode || 'line';
}

function setLineMode(mode) {
  window.__lineMode = mode;
  document.body.classList.toggle('line-mode-line', mode === 'line');
  document.body.classList.toggle('line-mode-grid', mode === 'grid');
  document.body.classList.toggle('line-mode-none', mode === 'none');
  document.querySelectorAll('.a4-page,.exam-page').forEach(function (page) {
    page.classList.toggle('line-mode-line', mode === 'line');
    page.classList.toggle('line-mode-grid', mode === 'grid');
    page.classList.toggle('line-mode-none', mode === 'none');
  });
  updateLineButtons();
}

function nextLineMode() {
  var mode = getLineMode();
  if (mode === 'line') return 'grid';
  if (mode === 'grid') return 'none';
  return 'line';
}

function modeTitle(mode) {
  if (mode === 'grid') return 'Lignes cahier à carreaux';
  if (mode === 'none') return 'Lignes masquées';
  return 'Lignes simples';
}

function updateLineButtons() {
  var mode = getLineMode();
  document.querySelectorAll('.a4-lines-proxy,.pdf-lines-toggle').forEach(function (button) {
    button.title = modeTitle(mode) + ' — cliquer pour changer';
    button.setAttribute('aria-label', button.title);
    button.classList.toggle('on', mode !== 'none');
    button.classList.toggle('off', mode === 'none');
    if (button.classList.contains('pdf-lines-toggle')) {
      button.textContent = modeTitle(mode);
    }
  });
}

function handleLineButtonClick(event) {
  var button = event.target && event.target.closest && event.target.closest('.a4-lines-proxy,.pdf-lines-toggle');
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  setLineMode(nextLineMode());
}

function syncLineGridMode() {
  ensureLineGridModeStyle();
  setLineMode(getLineMode());
}

ensureLineGridModeStyle();
document.addEventListener('click', handleLineButtonClick, true);
syncLineGridMode();
setTimeout(syncLineGridMode, 100);
setTimeout(syncLineGridMode, 300);
setTimeout(syncLineGridMode, 800);
setInterval(syncLineGridMode, 500);
window.syncLineGridMode = syncLineGridMode;
