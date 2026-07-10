const normalize = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const isDropPlaceholder = (value) => normalize(value) === 'deposer ici';
const SPACE = '\u00a0';

const replaceDropPlaceholder = (root = document) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    if (isDropPlaceholder(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    node.nodeValue = SPACE;
    node.parentElement?.setAttribute('aria-label', 'Zone de dépôt');
  });
};

const run = () => replaceDropPlaceholder(document);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', run, { once: true });
} else {
  run();
}

const observer = new MutationObserver(run);
observer.observe(document.documentElement, {
  childList: true,
  characterData: true,
  subtree: true
});

window.setInterval(run, 250);
