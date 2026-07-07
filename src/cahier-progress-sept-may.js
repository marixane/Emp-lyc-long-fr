const PROGRESS_START_MONTH = 8;
const PROGRESS_START_DAY = 1;
const PROGRESS_END_MONTH = 4;
const PROGRESS_END_DAY = 30;

const getSchoolStartYearForProgress = () => {
  const today = new Date();
  return today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
};

const parseSchoolDate = (text, startYear) => {
  const match = String(text || '').match(/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = month >= 9 ? startYear : startYear + 1;
  return new Date(year, month - 1, day);
};

const getProgressPercent = (date, startYear) => {
  const start = new Date(startYear, PROGRESS_START_MONTH, PROGRESS_START_DAY);
  const end = new Date(startYear + 1, PROGRESS_END_MONTH, PROGRESS_END_DAY);
  const raw = ((date - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
};

const FLAG_DATES = ['19/10', '07/12', '15/03', '03/05'];

const updateCahierProgress = () => {
  const startYear = getSchoolStartYearForProgress();

  document.querySelectorAll('.homework-page').forEach((page) => {
    const firstDate = page.querySelector('.homework-date');
    const parsedDate = parseSchoolDate(firstDate?.textContent, startYear);
    if (!parsedDate) return;

    const percent = getProgressPercent(parsedDate, startYear);
    const header = page.firstElementChild;
    if (!header) return;

    const progressBar = Array.from(header.querySelectorAll('div')).find((node) => {
      const style = node.getAttribute('style') || '';
      return style.includes('border-radius: 999px') && style.includes('position: relative');
    });

    if (!progressBar) return;

    const fill = Array.from(progressBar.children).find((node) => {
      const style = node.getAttribute('style') || '';
      return style.includes('linear-gradient') && style.includes('width:');
    });
    if (fill) fill.style.width = `${percent}%`;

    const percentLabel = Array.from(header.querySelectorAll('div')).find((node) => /^\d+%$/.test(String(node.textContent || '').trim()));
    if (percentLabel) percentLabel.textContent = `${percent}%`;

    const flags = Array.from(progressBar.querySelectorAll('span'));
    flags.forEach((flag, index) => {
      const flagDate = parseSchoolDate(FLAG_DATES[index], startYear);
      if (flagDate) flag.style.left = `${getProgressPercent(flagDate, startYear)}%`;
    });
  });
};

const scheduleProgressUpdate = () => window.requestAnimationFrame(updateCahierProgress);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleProgressUpdate, { once: true });
} else {
  scheduleProgressUpdate();
}

document.addEventListener('focusout', scheduleProgressUpdate, true);
document.addEventListener('click', (event) => {
  if (event.target?.closest?.('.cahier-preview-zone, .cahier-tab')) scheduleProgressUpdate();
}, true);
