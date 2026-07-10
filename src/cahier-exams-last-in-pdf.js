const EXAMS_PAGE_ID = 'cahier-exams-groups-page';
const PDF_BUTTON_IDS = new Set(['cahier-pdf-button-stable', 'cahier-pdf-preview-stable']);

const moveExamsPageToEnd = () => {
  const page = document.getElementById(EXAMS_PAGE_ID);
  const zone = document.querySelector('.cahier-preview-zone');
  if (!page || !zone) return;
  if (zone.lastElementChild !== page) zone.append(page);
};

document.addEventListener('click', (event) => {
  const button = event.target?.closest?.('button');
  if (!button || !PDF_BUTTON_IDS.has(button.id)) return;
  moveExamsPageToEnd();
}, true);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', moveExamsPageToEnd, { once: true });
} else {
  moveExamsPageToEnd();
}
