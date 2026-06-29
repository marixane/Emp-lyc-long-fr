window.__showPageDate = window.__showPageDate !== false;
window.__pageDateValue = window.__pageDateValue || new Date().toISOString().slice(0, 10);

function formatDateValue(value) {
  if (!value) return new Date().toLocaleDateString('fr-FR');
  var parts = String(value).split('-');
  if (parts.length !== 3) return value;
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function updateDateButton() {
  var button = document.querySelector('.page-date-toggle');
  if (!button) return;
  button.classList.toggle('off', !window.__showPageDate);
  button.classList.toggle('on', window.__showPageDate);
  button.textContent = window.__showPageDate ? 'Date visible' : 'Date masquée';
}

function updateDateInput() {
  var input = document.querySelector('.page-date-input');
  if (!input) return;
  if (input.value !== window.__pageDateValue) input.value = window.__pageDateValue;
}

function syncPageDates() {
  var text = formatDateValue(window.__pageDateValue);
  document.body.classList.toggle('hide-page-date', !window.__showPageDate);

  document.querySelectorAll('.exam-page').forEach(function (page) {
    var date = page.querySelector('.page-date');
    if (!date) {
      date = document.createElement('div');
      date.className = 'page-date';
      page.appendChild(date);
    }
    date.textContent = text;
  });

  updateDateButton();
  updateDateInput();
}

function ensureDateControls() {
  var panel = document.querySelector('.panel');
  if (!panel) return;

  if (!document.querySelector('.page-date-toggle')) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-date-toggle on';
    button.textContent = 'Date visible';
    button.addEventListener('click', function () {
      window.__showPageDate = !window.__showPageDate;
      syncPageDates();
    });

    var barButton = panel.querySelector('.bar-ribbon-toggle');
    if (barButton && barButton.parentNode) {
      barButton.parentNode.insertBefore(button, barButton.nextSibling);
    } else {
      panel.appendChild(button);
    }
  }

  if (!document.querySelector('.page-date-control')) {
    var wrap = document.createElement('label');
    wrap.className = 'page-date-control';
    wrap.textContent = 'Choisir date';

    var input = document.createElement('input');
    input.type = 'date';
    input.className = 'page-date-input';
    input.value = window.__pageDateValue;
    input.addEventListener('change', function () {
      window.__pageDateValue = input.value || new Date().toISOString().slice(0, 10);
      syncPageDates();
    });

    wrap.appendChild(input);

    var toggle = document.querySelector('.page-date-toggle');
    if (toggle && toggle.parentNode) {
      toggle.parentNode.insertBefore(wrap, toggle.nextSibling);
    } else {
      panel.appendChild(wrap);
    }
  }
}

function syncDateFeature() {
  ensureDateControls();
  syncPageDates();
}

syncDateFeature();
setTimeout(syncDateFeature, 100);
setTimeout(syncDateFeature, 400);

new MutationObserver(function () {
  syncDateFeature();
}).observe(document.body, { childList: true, subtree: true });
