const PREVIEW_ID = 'cahier-pdf-preview-stable';
const DOWNLOAD_ID = 'cahier-pdf-button-stable';

const showProgress = () => {
  let box = document.getElementById('cahier-pdf-progress');
  if (!box) {
    box = document.createElement('div');
    box.id = 'cahier-pdf-progress';
    box.style.cssText = 'position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.68);font-family:Arial,sans-serif;';
    box.innerHTML = '<div style="min-width:300px;padding:28px 34px;border-radius:16px;background:white;color:#0f172a;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35)"><h2 style="margin:0 0 10px;font-size:22px">Génération du PDF en cours…</h2><p style="margin:0;font-size:15px">Veuillez patienter jusqu’à l’ouverture du document.</p></div>';
    document.body.append(box);
  }
  box.style.display = 'flex';
  return box;
};

const installPreviewWait = () => {
  const previewButton = document.getElementById(PREVIEW_ID);
  const downloadButton = document.getElementById(DOWNLOAD_ID);
  if (!previewButton || !downloadButton || previewButton.dataset.waitInstalled === 'true') return;

  const replacement = previewButton.cloneNode(true);
  replacement.dataset.waitInstalled = 'true';
  previewButton.replaceWith(replacement);

  replacement.addEventListener('click', () => {
    const waitingWindow = window.open('about:blank', '_blank');
    if (!waitingWindow) {
      alert('Autorisez les fenêtres surgissantes pour voir le PDF.');
      return;
    }

    waitingWindow.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Préparation PDF…</title></head><body></body></html>');
    waitingWindow.document.close();
    waitingWindow.blur();
    window.focus();

    const overlay = showProgress();
    const originalText = replacement.textContent;
    const originalCreateObjectURL = URL.createObjectURL.bind(URL);
    const originalRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    const originalAnchorClick = HTMLAnchorElement.prototype.click;

    let capturedUrl = '';
    let finished = false;

    replacement.disabled = true;
    replacement.textContent = 'Génération PDF...';

    const restore = () => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
      HTMLAnchorElement.prototype.click = originalAnchorClick;
      replacement.disabled = false;
      replacement.textContent = originalText;
      overlay.remove();
    };

    URL.createObjectURL = (blob) => {
      const url = originalCreateObjectURL(blob);
      if (!finished && blob instanceof Blob && String(blob.type || '').toLowerCase().includes('pdf')) {
        finished = true;
        capturedUrl = url;
        replacement.textContent = 'Ouverture PDF...';
        window.setTimeout(() => {
          waitingWindow.location.replace(capturedUrl);
          waitingWindow.focus();
          restore();
          window.setTimeout(() => originalRevokeObjectURL(capturedUrl), 60 * 60 * 1000);
        }, 50);
      }
      return url;
    };

    URL.revokeObjectURL = (url) => {
      if (url === capturedUrl) return;
      originalRevokeObjectURL(url);
    };

    HTMLAnchorElement.prototype.click = function previewSafeClick() {
      if (this.download && String(this.download).toLowerCase().endsWith('.pdf')) return;
      return originalAnchorClick.call(this);
    };

    downloadButton.click();

    window.setTimeout(() => {
      if (finished) return;
      restore();
      if (!waitingWindow.closed) waitingWindow.close();
      alert('Le PDF n’a pas été généré dans le délai prévu.');
    }, 120000);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installPreviewWait, { once: true });
} else {
  installPreviewWait();
}

window.setTimeout(installPreviewWait, 300);
