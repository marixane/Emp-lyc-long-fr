const PREVIEW_BUTTON_ID = 'cahier-pdf-preview-stable';
const DOWNLOAD_BUTTON_ID = 'cahier-pdf-button-stable';
const PDF_ENDPOINT = '/api/cahier-pdf';

let previewInProgress = false;

const writeLoadingPage = (previewWindow) => {
  previewWindow.document.open();
  previewWindow.document.write(`<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Génération du PDF…</title>
        <style>
          html,body{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#f8fafc;color:#0f172a}
          body{display:flex;align-items:center;justify-content:center;min-height:100vh}
          .card{text-align:center;padding:34px 40px;border-radius:16px;background:white;box-shadow:0 16px 45px rgba(15,23,42,.18)}
          .spinner{width:42px;height:42px;margin:0 auto 18px;border:5px solid #dbeafe;border-top-color:#2563eb;border-radius:50%;animation:spin .8s linear infinite}
          h2{margin:0 0 10px;font-size:22px}
          p{margin:0;color:#475569;font-weight:700}
          @keyframes spin{to{transform:rotate(360deg)}}
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2>Génération du PDF en cours…</h2>
          <p>Veuillez patienter. Le PDF s’ouvrira automatiquement.</p>
        </div>
      </body>
    </html>`);
  previewWindow.document.close();
};

const isPdfRequest = (input) => {
  try {
    const value = input instanceof Request ? input.url : String(input || '');
    return new URL(value, window.location.origin).pathname === PDF_ENDPOINT;
  } catch {
    return false;
  }
};

const hasPdfSignature = (buffer) => {
  if (!buffer || buffer.byteLength < 5) return false;
  const bytes = new Uint8Array(buffer, 0, 5);
  return String.fromCharCode(...bytes) === '%PDF-';
};

const handlePreviewClick = (event) => {
  const previewButton = event.target?.closest?.(`#${PREVIEW_BUTTON_ID}`);
  if (!previewButton) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  if (previewInProgress) return;

  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!downloadButton) {
    alert('Le bouton Télécharger PDF est introuvable.');
    return;
  }

  const previewWindow = window.open('about:blank', '_blank');
  if (!previewWindow) {
    alert('Autorisez les fenêtres surgissantes pour voir le PDF.');
    return;
  }

  writeLoadingPage(previewWindow);
  previewInProgress = true;

  const originalText = previewButton.textContent;
  const originalFetch = window.fetch.bind(window);
  let completed = false;
  let pdfUrl = '';

  previewButton.disabled = true;
  previewButton.textContent = 'Préparation PDF...';

  const stopPdfDownload = (clickEvent) => {
    const link = clickEvent.target?.closest?.('a[download]');
    if (!link || !String(link.download || '').toLowerCase().endsWith('.pdf')) return;
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
    clickEvent.stopImmediatePropagation();
  };

  const restore = () => {
    window.fetch = originalFetch;
    document.removeEventListener('click', stopPdfDownload, true);
    previewButton.disabled = false;
    previewInProgress = false;
    window.setTimeout(() => {
      previewButton.textContent = originalText;
    }, 900);
  };

  const fail = (error) => {
    restore();
    if (!previewWindow.closed) previewWindow.close();
    alert(`Erreur PDF : ${error?.message || 'aperçu impossible'}`);
  };

  document.addEventListener('click', stopPdfDownload, true);

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (!isPdfRequest(args[0]) || !response.ok) return response;

    previewButton.textContent = 'Génération PDF...';
    const previewResponse = response.clone();

    previewResponse.arrayBuffer().then((buffer) => {
      if (!hasPdfSignature(buffer)) {
        throw new Error('La réponse reçue n’est pas un fichier PDF valide.');
      }

      const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
      if (pdfBlob.size < 1000) {
        throw new Error('Le fichier PDF généré est vide.');
      }

      completed = true;
      previewButton.textContent = 'Ouverture PDF...';
      pdfUrl = URL.createObjectURL(pdfBlob);

      window.setTimeout(() => {
        if (!previewWindow.closed) {
          previewWindow.location.replace(pdfUrl);
          previewWindow.focus();
        }
        previewButton.textContent = 'PDF ouvert';
        restore();
      }, 150);

      window.setTimeout(() => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      }, 60 * 60 * 1000);
    }).catch(fail);

    return response;
  };

  downloadButton.click();

  window.setTimeout(() => {
    if (!completed) {
      fail(new Error('Le PDF n’a pas été généré dans le délai prévu.'));
    }
  }, 120000);
};

document.addEventListener('click', handlePreviewClick, true);
