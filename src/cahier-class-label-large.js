const resizeClassLabels = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;

  document.querySelectorAll('.homework-subject > div').forEach((line) => {
    const label = line.querySelector('span:nth-child(2)');
    if (!label) return;

    const count = line.parentElement?.children?.length || 1;
    const startSize = count >= 4 ? 8 : count === 3 ? 12 : 16;
    const minSize = 8;

    label.style.setProperty('font-weight', '900', 'important');
    label.style.setProperty('transform', 'none', 'important');
    label.style.setProperty('overflow', 'hidden', 'important');
    label.style.setProperty('text-overflow', 'clip', 'important');
    label.style.setProperty('white-space', 'nowrap', 'important');

    const styles = getComputedStyle(label);
    const padding = parseFloat(styles.paddingLeft || 0) + parseFloat(styles.paddingRight || 0);
    const availableWidth = Math.max(label.getBoundingClientRect().width - padding - 2, 0);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    let size = startSize;
    label.style.setProperty('font-size', `${size}px`, 'important');

    if (context && availableWidth > 0) {
      const family = styles.fontFamily || 'sans-serif';
      const weight = styles.fontWeight || '900';
      const text = label.textContent || '';

      context.font = `${weight} ${size}px ${family}`;
      while (size > minSize && context.measureText(text).width > availableWidth) {
        size = Math.max(minSize, size - 2);
        context.font = `${weight} ${size}px ${family}`;
      }

      label.style.setProperty('font-size', `${size}px`, 'important');
    }
  });
};

let classLabelFrame = 0;
const scheduleClassLabelResize = () => {
  cancelAnimationFrame(classLabelFrame);
  classLabelFrame = requestAnimationFrame(() => {
    resizeClassLabels();
    setTimeout(resizeClassLabels, 80);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleClassLabelResize, { once: true });
} else {
  scheduleClassLabelResize();
}

document.addEventListener('input', scheduleClassLabelResize, true);
document.addEventListener('focusout', scheduleClassLabelResize, true);
document.addEventListener('drop', scheduleClassLabelResize, true);
document.addEventListener('click', scheduleClassLabelResize, true);
