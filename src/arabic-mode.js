window.__examLanguage = window.__examLanguage || 'fr';

const FR = {
  rightTop: 'Lycée El jamai ,Tanger',
  rightBottom: 'Matière: Mathématique',
  individualTitle: 'Devoir individuel',
  freeTitle: 'Devoir libre',
  homeworkTitle: 'Devoir à la maison',
  subject: 'N° : 1 Semestre : 1',
  level: 'Classe : 2 Bac SPF',
  notes: 'Notes :',
  langButton: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
  freeButton: 'Devoir\nlibre',
  individualButton: 'Devoir\nindividuel',
  page: 'Page ',
  exercise: 'Exercice '
};

const AR = {
  rightTop: '\u062b\u0627\u0646\u0648\u064a\u0629 \u0627\u0644\u062c\u0627\u0645\u0639\u064a\u060c \u0637\u0646\u062c\u0629',
  rightBottom: '\u0645\u0627\u062f\u0629 : \u0627\u0644\u0631\u064a\u0627\u0636\u064a\u0627\u062a',
  individualTitle: '\u0641\u0631\u0636 \u0645\u062d\u0631\u0648\u0633',
  freeTitle: '\u0641\u0631\u0636 \u0645\u0646\u0632\u0644\u064a',
  homeworkTitle: '\u0641\u0631\u0636 \u0645\u0646\u0632\u0644\u064a',
  subject: '\u0631\u0642\u0645 1 \u0627\u0644\u062f\u0648\u0631\u0629 1',
  level: '\u0642\u0633\u0645 : 2 \u0628\u0627\u0643 \u0639.\u0641',
  notes: ': \u0627\u0644\u0646\u0642\u0637',
  langButton: 'Français',
  freeButton: '\u0641\u0631\u0636\n\u0645\u0646\u0632\u0644\u064a',
  individualButton: '\u0641\u0631\u0636\n\u0645\u062d\u0631\u0648\u0633',
  page: '\u0627\u0644\u0635\u0641\u062d\u0629 ',
  exercise: '\u062a\u0645\u0631\u064a\u0646 '
};

const DUR_FR_AR = {
  '30 min': '30 \u062f',
  '1 h': '1 \u0633',
  '1 h 30': '1 \u0633 30 \u062f',
  '2 h': '2 \u0633',
  '2 h 30': '2 \u0633 30 \u062f',
  '3 h': '3 \u0633',
  '3 h 30': '3 \u0633 30 \u062f',
  '4 h': '4 \u0633'
};
const DUR_AR_FR = {};
Object.keys(DUR_FR_AR).forEach(function (k) { DUR_AR_FR[DUR_FR_AR[k]] = k; });

function pack() { return window.__examLanguage === 'ar' ? AR : FR; }

function setTextArea(selector, value) {
  var el = document.querySelector(selector);
  if (!el || el.value === value) return;
  var d = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value');
  if (d && d.set) d.set.call(el, value); else el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function setIfKnown(selector, known, next) {
  var el = document.querySelector(selector);
  if (el && known.indexOf(el.value || '') !== -1) setTextArea(selector, next);
}

function syncHeader() {
  var p = pack();
  setIfKnown('.right-line-top', [FR.rightTop, AR.rightTop], p.rightTop);
  setIfKnown('.right-line-bottom', ['N° : 1 Semestre : 1', FR.rightBottom, AR.rightBottom], p.rightBottom);
  setIfKnown('.inline-class-input', [FR.level, AR.level], p.level);
  setIfKnown('.title-line-middle', ['Mathématique', FR.subject, AR.subject], p.subject);
  var top = document.querySelector('.title-line-top');
  if (!top) return;
  var v = top.value || '';
  if ([FR.individualTitle, AR.individualTitle].indexOf(v) !== -1) setTextArea('.title-line-top', p.individualTitle);
  if ([FR.freeTitle, AR.freeTitle].indexOf(v) !== -1) setTextArea('.title-line-top', p.freeTitle);
  if ([FR.homeworkTitle, AR.homeworkTitle].indexOf(v) !== -1) setTextArea('.title-line-top', p.homeworkTitle);
}

function syncLabels() {
  var p = pack();
  var notes = document.querySelector('.note-scale-title');
  if (notes) notes.textContent = p.notes;
  document.querySelectorAll('.page-number').forEach(function (n) {
    var m = (n.textContent || '').match(/(?:Page|\u0627\u0644\u0635\u0641\u062d\u0629)\s*(\d+)\s*\/\s*(\d+)/);
    if (m) n.textContent = p.page + m[1] + '/' + m[2];
  });
  document.querySelectorAll('.page-count-card > label').forEach(function (n) {
    var m = (n.textContent || '').match(/(?:Page|\u0627\u0644\u0635\u0641\u062d\u0629)\s*(\d+)/);
    if (m) n.textContent = p.page + m[1];
  });
  document.querySelectorAll('.exam-exercise:not(.blank-exercise) .exercise-title-controls > span:first-child').forEach(function (s) {
    var m = (s.textContent || '').match(/(?:Exercice|\u062a\u0645\u0631\u064a\u0646)\s*(\d+)/i);
    if (!m) return;
    var c = s.closest('.exercise-title-controls');
    var isHomework = c && !c.querySelector('button');
    s.textContent = p.exercise + m[1] + (isHomework ? '' : ' :');
  });
}

function syncDuration() {
  document.querySelectorAll('.tiny-duration-control strong').forEach(function (n) {
    var t = (n.textContent || '').trim();
    var next = window.__examLanguage === 'ar' ? DUR_FR_AR[t] : DUR_AR_FR[t];
    if (next) n.textContent = next;
  });
}

function syncDurationAfterReact() {
  if (window.__examLanguage !== 'ar') return;
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(syncDuration);
  });
}

function setFreeTitle(active) {
  var p = pack();
  setTextArea('.title-line-top', active ? p.freeTitle : p.individualTitle);
}

function syncButtons() {
  var panel = document.querySelector('.panel');
  if (!panel) return;
  var lang = document.querySelector('.language-toggle');
  if (!lang) {
    lang = document.createElement('button');
    lang.className = 'language-toggle';
    lang.type = 'button';
    lang.addEventListener('click', function () {
      window.__examLanguage = window.__examLanguage === 'ar' ? 'fr' : 'ar';
      syncLanguageMode();
    });
    var title = panel.querySelector('.eyebrow');
    if (title && title.nextSibling) panel.insertBefore(lang, title.nextSibling); else panel.insertBefore(lang, panel.firstChild);
  }
  var free = document.querySelector('.individual-toggle');
  if (!free) {
    free = document.createElement('button');
    free.className = 'individual-toggle';
    free.type = 'button';
    free.addEventListener('click', function () {
      document.body.classList.toggle('no-title-points');
      setFreeTitle(document.body.classList.contains('no-title-points'));
      syncButtons();
    });
    if (lang.nextSibling) panel.insertBefore(free, lang.nextSibling); else panel.appendChild(free);
  }
  var p = pack();
  var isFree = document.body.classList.contains('no-title-points');
  lang.textContent = p.langButton;
  free.textContent = isFree ? p.individualButton : p.freeButton;
  free.classList.toggle('active', !isFree);
}

function bindDurationButtons() {
  document.querySelectorAll('.tiny-duration-control button').forEach(function (b) {
    if (b.dataset.durationSyncBound === 'true') return;
    b.dataset.durationSyncBound = 'true';
    b.addEventListener('click', syncDurationAfterReact);
  });
}

function syncLanguageMode() {
  if (!document.body) return;
  document.body.classList.toggle('arabic-mode', window.__examLanguage === 'ar');
  document.documentElement.setAttribute('dir', 'ltr');
  syncButtons();
  syncHeader();
  syncLabels();
  syncDuration();
  bindDurationButtons();
  if (typeof window.formatExercisePointLabels === 'function') window.formatExercisePointLabels();
}

syncLanguageMode();
setTimeout(syncButtons, 250);
