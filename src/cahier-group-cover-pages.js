const GROUP_COVER_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];

const getHomeworkPageTitleForCover = (page) => String(
  page.querySelector('.homework-page > div:first-child > div:first-child')?.textContent ||
  page.firstElementChild?.firstElementChild?.textContent ||
  ''
).trim();

const getHomeworkPageDateForCover = (page) => {
  const dateText = String(page.querySelector('.homework-date')?.textContent || '');
  const match = dateText.match(/\b(\d{2})\/(\d{2})\b/);
  if (!match) return 99999;
  const day = Number(match[1]);
  const month = Number(match[2]);
  return (month >= 9 ? 0 : 10000) + month * 100 + day;
};

const splitVisibleHomeworkBlocks = () => {
  const visiblePages = Array.from(document.querySelectorAll('.homework-page.cahier-visible-group-page'));
  const blocks = [];
  let currentBlock = null;

  visiblePages.forEach((page) => {
    const title = getHomeworkPageTitleForCover(page);
    const firstDate = getHomeworkPageDateForCover(page);
    const startsNewBlock = !currentBlock || firstDate < currentBlock.lastDate || (title !== currentBlock.title && firstDate <= currentBlock.lastDate);

    if (startsNewBlock) {
      currentBlock = { title, pages: [], lastDate: -1 };
      blocks.push(currentBlock);
    }

    currentBlock.pages.push(page);
    currentBlock.lastDate = firstDate;
  });

  return blocks;
};

const getFilledGroupClassesForCover = () => {
  const timetablePage = Array.from(document.querySelectorAll('.cahier-page'))
    .find((page) => page.querySelector('.timetable-table'));

  const groupsWrap = Array.from(timetablePage?.children || []).find((child) => {
    const style = String(child.getAttribute('style') || '');
    return style.includes('grid-template-columns: repeat(5');
  });

  return Array.from(groupsWrap?.children || []).map((group) => ({
    title: String(group.children?.[0]?.textContent || '').trim(),
    classes: Array.from(group.children?.[1]?.querySelectorAll('span') || [])
      .map((span) => String(span.textContent || '').trim())
      .filter(Boolean)
  })).filter((group) => group.title && group.classes.length);
};

const buildClassesPanel = (classes) => {
  const panel = document.createElement('div');
  panel.className = 'cahier-group-cover-classes-panel';

  classes.forEach((className, index) => {
    const badge = document.createElement('div');
    badge.className = 'cahier-group-cover-class-badge';
    badge.style.setProperty('--class-index', String(index));
    badge.textContent = className;
    panel.append(badge);
  });

  return panel;
};

const buildGroupCoverPage = (title, index, classes) => {
  const page = document.createElement('div');
  page.className = 'a4-page cahier-page cahier-group-cover-page';
  page.style.setProperty('--group-cover-color', GROUP_COVER_COLORS[index % GROUP_COVER_COLORS.length]);

  const card = document.createElement('div');
  card.className = 'cahier-group-cover-card';

  const titleNode = document.createElement('div');
  titleNode.className = 'cahier-group-cover-title';
  titleNode.textContent = title;

  const classesPanel = buildClassesPanel(classes);

  const subtitle = document.createElement('div');
  subtitle.className = 'cahier-group-cover-subtitle';
  subtitle.textContent = 'Suivi pédagogique annuel 2025-2026';

  const icons = document.createElement('div');
  icons.className = 'cahier-group-cover-icons';
  ['✏️', '📖', '📐', '🧮', '🎓'].forEach((icon) => {
    const span = document.createElement('span');
    span.textContent = icon;
    icons.append(span);
  });

  card.append(titleNode, classesPanel, subtitle, icons);
  page.append(card);
  return page;
};

const applyGroupCoverPages = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;
  document.querySelectorAll('.cahier-group-cover-page').forEach((page) => page.remove());

  const blocks = splitVisibleHomeworkBlocks();
  const filledGroups = getFilledGroupClassesForCover();

  blocks.forEach((block, index) => {
    if (!block.pages.length) return;
    const group = filledGroups[index] || { classes: [] };
    const cover = buildGroupCoverPage(block.title, index, group.classes);
    block.pages[0].before(cover);
  });
};

let groupCoverPagesRaf = 0;
const scheduleGroupCoverPages = () => {
  if (groupCoverPagesRaf) return;
  groupCoverPagesRaf = window.requestAnimationFrame(() => {
    groupCoverPagesRaf = 0;
    applyGroupCoverPages();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleGroupCoverPages, { once: true });
} else {
  scheduleGroupCoverPages();
}

window.setTimeout(scheduleGroupCoverPages, 300);
window.setTimeout(scheduleGroupCoverPages, 900);
window.setTimeout(scheduleGroupCoverPages, 1800);
window.setTimeout(scheduleGroupCoverPages, 2600);

document.addEventListener('input', (event) => {
  if (event.target?.closest?.('.timetable-table')) window.setTimeout(scheduleGroupCoverPages, 180);
}, { passive: true });
document.addEventListener('drop', () => window.setTimeout(scheduleGroupCoverPages, 220), { passive: true });
document.addEventListener('mouseup', () => window.setTimeout(scheduleGroupCoverPages, 220), { passive: true });

new MutationObserver(scheduleGroupCoverPages).observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class', 'style']
});
