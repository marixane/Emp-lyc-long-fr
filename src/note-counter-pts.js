function parsePointText(text) {
  var match = String(text || '').match(/([0-9]+(?:[,.][0-9]+)?)/);
  return match ? Number(match[1].replace(',', '.')) : 0;
}

function formatPts(value) {
  var rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
}

function readVisibleTotal() {
  var sum = 0;
  document.querySelectorAll('.exam-exercise:not(.blank-exercise) .exercise-title-controls strong').forEach(function (node) {
    sum += parsePointText(node.textContent);
  });
  return Math.round(sum * 100) / 100;
}

function simplifyNoteCounter() {
  var total = readVisibleTotal();
  document.querySelectorAll('.note-scale-counter').forEach(function (counter) {
    var next = formatPts(total);
    if (counter.textContent !== next) counter.textContent = next;
  });
}

simplifyNoteCounter();
setTimeout(simplifyNoteCounter, 100);
setTimeout(simplifyNoteCounter, 400);
setInterval(simplifyNoteCounter, 250);

new MutationObserver(function () {
  simplifyNoteCounter();
}).observe(document.body, { childList: true, subtree: true, characterData: true });
