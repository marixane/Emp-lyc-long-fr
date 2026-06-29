function clearAllBarMarks() {
  function removeOne() {
    var mark = document.querySelector('.bar-mark');
    if (!mark) return;
    mark.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true }));
    setTimeout(removeOne, 0);
  }
  removeOne();
}

document.addEventListener('click', function (event) {
  var button = event.target && event.target.closest && event.target.closest('.page-count-card .compact-control button');
  if (!button || button.disabled) return;
  setTimeout(clearAllBarMarks, 30);
}, true);
