function syncSinglePageNumber() {
  var pages = document.querySelectorAll('.exam-page');
  var single = pages.length === 1;

  pages.forEach(function (page) {
    var number = page.querySelector('.page-number');
    if (!number) return;
    number.classList.toggle('single-page-hidden', single);
  });
}

syncSinglePageNumber();
setTimeout(syncSinglePageNumber, 100);
setTimeout(syncSinglePageNumber, 400);
setInterval(syncSinglePageNumber, 300);

new MutationObserver(function () {
  syncSinglePageNumber();
}).observe(document.body, { childList: true, subtree: true });
