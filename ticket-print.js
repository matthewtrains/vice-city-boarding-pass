(() => {
  let printing = false;
  let pendingBuild = Promise.resolve();
  const previousBuild = build;
  build = function(seed) {
    pendingBuild = previousBuild(seed);
    return pendingBuild;
  };

  async function readyName() {
    await pendingBuild;
    const name = $('name').value.trim().toUpperCase();
    const deadline = performance.now() + 10000;
    while (!STATE || STATE.name !== name || (typeof qrcode === 'function' && !STATE.qr)) {
      if (performance.now() > deadline) throw new Error('Name preview is still preparing. Please try again.');
      await new Promise(resolve => setTimeout(resolve, 25));
    }
  }

  $('printActive').onclick = async () => {
    if (printing || exporting || !STATE) return;
    const win = window.open('', '_blank');
    if (!win) {
      $('exportStatus').textContent = 'Allow pop-ups for this page to open the print view.';
      return;
    }
    win.opener = null;
    win.document.title = 'Preparing ticket print page';
    win.document.body.textContent = 'Preparing the active ticket…';
    printing = true;
    exporting = true;
    const unlock = lockExportControls();
    let imageUrl = null;
    const cleanup = () => { if (imageUrl) URL.revokeObjectURL(imageUrl); };
    try {
      await readyName();
      await loadFonts();
      if (win.closed) throw new Error('Print view was closed.');
      const S = {...STATE, seatInfo: {...STATE.seatInfo}}, key = $('design').value, D = curDesign();
      const paper = $('printPaper').value === 'a4' ? 'a4' : 'letter';
      const option = $('printOrientation').value;
      const direction = option === 'portrait' || option === 'landscape' ? option : D.W > D.H ? 'landscape' : 'portrait';
      const width = paper === 'a4' ? 210 : 215.9, height = paper === 'a4' ? 297 : 279.4;
      const pw = direction === 'landscape' ? height : width, ph = direction === 'landscape' ? width : height, margin = 12.7;
      $('exportStatus').textContent = 'Preparing the active ticket for printing…';
      const canvas = document.createElement('canvas');
      canvas.width = D.W * 3; canvas.height = D.H * 3;
      const ctx = canvas.getContext('2d'); ctx.scale(3, 3); D.draw(ctx, S, {qr: S.qr});
      const blob = await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Print rendering failed')), 'image/png'));
      imageUrl = URL.createObjectURL(blob);
      canvas.width = canvas.height = 1;
      if (win.closed) throw new Error('Print view was closed.');
      const styles = `@page{size:${paper} ${direction};margin:${margin}mm;}
        *{box-sizing:border-box}body{margin:0;background:#e8e8ed;color:#161616;font-family:Arial,sans-serif}
        .toolbar{padding:16px;background:#20162e;color:white;position:sticky;top:0}.toolbar button{padding:9px 16px;margin-right:8px;cursor:pointer}.toolbar p{margin:10px 0 0;font-size:12px}
        .sheet{width:${pw}mm;height:${ph}mm;padding:${margin}mm;background:white;box-shadow:0 4px 16px #0002;margin:18px auto;overflow:hidden;break-inside:avoid}
        .ticket-image{display:block;width:100%;height:100%;object-fit:contain}
        @media print{html,body{margin:0;padding:0;background:white}.toolbar{display:none}.sheet{width:${pw-margin*2}mm;height:${ph-margin*2-.2}mm;padding:0;margin:0;box-shadow:none;print-color-adjust:exact;-webkit-print-color-adjust:exact}}`;
      win.document.open();
      win.document.write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Print active ticket</title><style>' + styles + '.layout-grid{grid-template-columns:repeat(6,minmax(0,1fr))}.layout-card{min-width:0}.include-layout{justify-content:center;margin-top:10px;gap:7px;font-size:10px;color:#e6d5e9}.selection-actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:16px}.selection-actions button{width:auto;padding:7px 12px;background:#ffffff0a;color:#ffdfca;border:1px solid #ffffff26;font-size:10px}.selection-actions span{font-size:10px;color:#e6d5e9;margin-left:auto}@media(max-width:1000px){.layout-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:480px){.layout-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.selection-actions span{margin-left:0;width:100%}}.print-options{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:18px}.print-options label{flex:1;min-width:180px;max-width:300px}.print-options p{font-size:10px;flex:1;min-width:180px;margin:0}.actions #printActive{background:#efbed1;color:#301b2a}@media(max-width:480px){.print-options label{max-width:none;width:100%}}.effects-bar{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-top:22px;padding:17px 21px;background:#21172cdd;border:1px solid #ffffff26;border-radius:16px}.effects-bar h2{margin:0 0 6px}.effects-bar p{font-size:10px;margin:0}.effects-controls{display:flex;align-items:center;flex-wrap:wrap;gap:18px}.effects-controls .chk{color:#f0d5e5;font-size:10px;gap:7px}.scenery-buttons{display:flex;gap:3px;padding:3px;background:#100c1c80;border:1px solid #ffffff26;border-radius:12px}.scenery-buttons button{width:auto;min-width:66px;padding:8px 12px;background:transparent;border:0;color:#dbc8e0;font-size:10px}.scenery-buttons button[aria-pressed=true]{background:#f3bcc9;color:#301b2a}.night-scene{position:fixed;inset:0;width:100%;height:100%;z-index:-2;pointer-events:none;opacity:0;transition:opacity 900ms ease}body.night-mode .night-scene{opacity:1}#stage{transform-origin:50% 50%;transition:transform 180ms ease-out;transform-style:preserve-3d}.preview-stamp{position:absolute;pointer-events:none;z-index:3;filter:drop-shadow(0 7px 7px #1b0c2526)}@media(max-width:600px){.effects-bar{padding:15px}.effects-controls{gap:13px;width:100%;justify-content:space-between}}@media(prefers-reduced-motion:reduce){#stage,.night-scene{transition:none!important}}</style></head><body><header class="toolbar"><button id="printAgain" type="button">Print / Save PDF</button><button id="closePrint" type="button">Close</button><p id="printSummary"></p><p>Active ticket only. Match the paper size in your printer dialog; turn off browser headers and footers if shown.</p></header><main class="sheet"><img class="ticket-image" id="printImage" alt="Active boarding pass"></main></body></html>');
      win.document.close();
      win.document.title = S.ref + ' — Print active ticket';
      const optionLabel = [...$('design').options].find(item => item.value === key);
      const label = optionLabel ? optionLabel.textContent : key;
      win.document.getElementById('printSummary').textContent = `${label} · one page · ${paper === 'a4' ? 'A4' : 'Letter'} · ${direction} · 0.5-inch margins`;
      const image = win.document.getElementById('printImage');
      image.dataset.layout = key;
      image.src = imageUrl;
      win.document.getElementById('printAgain').onclick = () => { win.focus(); win.print(); };
      win.document.getElementById('closePrint').onclick = () => win.close();
      win.addEventListener('pagehide', cleanup, {once: true});
      await image.decode();
      if (win.closed) throw new Error('Print view was closed.');
      $('exportStatus').textContent = 'Print view ready — active ticket only, one sheet.';
      win.focus();
      win.print();
    } catch (error) {
      cleanup();
      $('exportStatus').textContent = 'Print failed: ' + (error.message || error);
      if (!win.closed) win.document.body.textContent = 'Could not prepare the print view: ' + (error.message || error);
    } finally {
      unlock();
      exporting = false;
      printing = false;
    }
  };
})();

