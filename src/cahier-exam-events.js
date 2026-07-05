import './cahier-calendar-2026-data.js';

const EVENT_FIXES_2026 = [
  ['Vacance religieuse : Aïd Al Mawlid Annabaoui', 'Fête nationale : Fête de l’Unité', 'SAMEDI 31/10'],
  ['Vacance scolaire : Vacances intermédiaires 1', 'Vacance scolaire : Vacances intermédiaires 1', 'DIMANCHE 18/10 - DIMANCHE 25/10'],
  ['Fête nationale : Marche Verte', 'Fête nationale : Marche Verte', 'VENDREDI 06/11'],
  ['Fête nationale : Fête de l’Indépendance', 'Fête nationale : Fête de l’Indépendance', 'MERCREDI 18/11'],
  ['Vacance scolaire : Vacances intermédiaires 2', 'Vacance scolaire : Vacances intermédiaires 2', 'DIMANCHE 06/12 - DIMANCHE 13/12'],
  ['Fête nationale : Nouvel An', 'Fête nationale : Nouvel An', 'VENDREDI 01/01'],
  ['Fête nationale : Manifeste de l’Indépendance', 'Fête nationale : Manifeste de l’Indépendance', 'LUNDI 11/01'],
  ['Fête nationale : Nouvel An Amazigh', 'Fête nationale : Nouvel An Amazigh', 'JEUDI 14/01'],
  ['Vacance scolaire : Vacances de mi-année', 'Vacance scolaire : Vacances de mi-année', 'DIMANCHE 24/01 - DIMANCHE 31/01'],
  ['Vacance religieuse : Aïd Al-Fitr', 'Vacance religieuse : Aïd Al-Fitr', '29 RAMADAN - 02 CHAWWAL 1448'],
  ['Fête nationale : Fête du Travail', 'Fête nationale : Fête du Travail', 'SAMEDI 01/05'],
  ['Vacance scolaire : Vacances intermédiaires 4', 'Vacance scolaire : Vacances intermédiaires 4', 'DIMANCHE 09/05 - DIMANCHE 16/05'],
  ['Vacance religieuse : Aïd Al-Adha', 'Vacance religieuse : Aïd Al-Adha', '09 - 11 DHOU AL-HIJJA 1448'],
  ['Vacance religieuse : 1er Moharram', 'Vacance religieuse : 1er Moharram', '01 MOHARRAM 1449'],
  ['Examen : Examen normalisé local', 'Examen : Examen normalisé local', 'LUNDI 18/01 - MARDI 19/01'],
  ['Examen : Examen régional 1ère Bac', 'Examen : Examen régional 1ère Bac', 'VENDREDI 28/05 - SAMEDI 29/05'],
  ['Examen : Examen national 2ème Bac', 'Examen : Examen national 2ème Bac', 'MARDI 01/06 - JEUDI 03/06'],
  ['Examen : Examen régional', 'Examen : Examen régional', 'MERCREDI 23/06 - JEUDI 24/06'],
  ['Examen : Examen normalisé provincial', 'Examen : Examen normalisé provincial', 'VENDREDI 25/06 - SAMEDI 26/06'],
  ['Rattrapage : 1ère Bac', 'Rattrapage : 1ère Bac', 'LUNDI 28/06 - MARDI 29/06'],
  ['Rattrapage : 2ème Bac', 'Rattrapage : 2ème Bac', 'JEUDI 01/07 - SAMEDI 03/07']
];

const YEAR_TEXT_FIXES_2026 = [
  [/2025\s*\/\s*2026/g, '2026/2027'],
  [/2025-2026/g, '2026-2027']
];

const GROUP_TITLES_FOR_DEFAULT = ['Tronc Commun', '1ères Bac', '2ème Bac', 'Autres', 'Autres'];

const fixYears2026 = () => {
  document.querySelectorAll('input, h1, h2, h3, div, span, td, th').forEach((node) => {
    if (node.tagName === 'INPUT') {
      let value = node.value;
      YEAR_TEXT_FIXES_2026.forEach(([pattern, replacement]) => { value = value.replace(pattern, replacement); });
      if (value !== node.value) node.value = value;
      return;
    }
    if (node.childNodes.length !== 1 || node.firstChild?.nodeType !== Node.TEXT_NODE) return;
    let text = node.textContent || '';
    YEAR_TEXT_FIXES_2026.forEach(([pattern, replacement]) => { text = text.replace(pattern, replacement); });
    if (text !== node.textContent) node.textContent = text;
  });
};

const fixCahierDates2026 = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;
  fixYears2026();

  document.querySelectorAll('.homework-entry').forEach((entry) => {
    const textNode = entry.querySelector('.homework-text');
    const dateNode = entry.querySelector('.homework-date');
    if (!textNode || !dateNode) return;

    const title = String(textNode.textContent || '').trim();
    const match = EVENT_FIXES_2026.find(([oldTitle]) => title === oldTitle);
    if (!match) return;

    textNode.textContent = match[1];
    dateNode.textContent = match[2];
  });
};

const getTabFiber = () => {
  const shell = document.querySelector('.cahier-shell');
  if (!shell) return null;
  const fiberKey = Object.keys(shell).find((key) => key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$'));
  let fiber = fiberKey ? shell[fiberKey] : null;
  while (fiber) {
    const name = fiber.type?.name || fiber.elementType?.name || '';
    if (name === 'Tab') return fiber;
    fiber = fiber.return;
  }
  return null;
};

const getStateHook = (fiber, index) => {
  let hook = fiber?.memoizedState;
  for (let i = 0; hook && i < index; i += 1) hook = hook.next;
  return hook || null;
};

const getTableClasses = () => {
  const classes = [];
  document.querySelectorAll('.timetable-table tbody td[colspan] textarea').forEach((textarea) => {
    const value = String(textarea.value || textarea.textContent || '').trim();
    if (value && !classes.includes(value)) classes.push(value);
  });
  return classes;
};

const pushNewClassesToTroncCommun = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;
  const tableClasses = getTableClasses();
  if (!tableClasses.length) return;

  const fiber = getTabFiber();
  const manualGroupsHook = getStateHook(fiber, 8);
  const dispatch = manualGroupsHook?.queue?.dispatch;
  if (!dispatch) return;

  const currentGroups = Array.isArray(manualGroupsHook.memoizedState) ? manualGroupsHook.memoizedState : GROUP_TITLES_FOR_DEFAULT.map((title) => ({ title, classes: [] }));
  const nextGroups = GROUP_TITLES_FOR_DEFAULT.map((title, index) => ({
    title,
    classes: [...(currentGroups[index]?.classes || [])].filter((className) => tableClasses.includes(className))
  }));

  let changed = false;
  tableClasses.forEach((className) => {
    const alreadyGrouped = nextGroups.some((group) => group.classes.includes(className));
    if (!alreadyGrouped) {
      nextGroups[0].classes.push(className);
      changed = true;
    }
  });

  if (changed) dispatch(nextGroups);
};

let cahierDateFixTimer = 0;
const scheduleCahierDateFix2026 = () => {
  clearTimeout(cahierDateFixTimer);
  cahierDateFixTimer = window.setTimeout(fixCahierDates2026, 220);
};

const handleTimetableChanged = () => {
  pushNewClassesToTroncCommun();
  window.requestAnimationFrame(pushNewClassesToTroncCommun);
  scheduleCahierDateFix2026();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pushNewClassesToTroncCommun();
    scheduleCahierDateFix2026();
  }, { once: true });
} else {
  pushNewClassesToTroncCommun();
  scheduleCahierDateFix2026();
}

window.setTimeout(handleTimetableChanged, 600);
window.setTimeout(handleTimetableChanged, 1400);
window.setTimeout(handleTimetableChanged, 2600);

document.addEventListener('input', (event) => {
  if (event.target?.closest?.('.timetable-table')) handleTimetableChanged();
}, { passive: true, capture: true });
document.addEventListener('drop', handleTimetableChanged, { passive: true });
document.addEventListener('mouseup', handleTimetableChanged, { passive: true });
