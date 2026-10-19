# Vice City Boarding Pass Generator

Fictional Los Santos to Vice City boarding passes, generated locally in the browser.

Original concept and design: [Vinewood Motors (@Vinewood_motors)](https://x.com/Vinewood_motors).

Unofficial fan project. Not affiliated with Rockstar Games or Take-Two Interactive.

## Features
- Six layouts: Original, Remix, Portrait, Social, Ocean Drive, and horizontal Neon Coast.
- Thumbnail buttons preview a layout; separate checkboxes select layouts for ZIP export.
- Original starts checked. Select all and Clear control the ZIP selection.
- Download selected layouts as PNGs in one ZIP, using the selected 1x, 2x, 3x, or 4x resolution.
- Live passenger-name preview updates the ticket and QR payload without rerolling ticket details.
- Print active ticket prints only the layout shown in the main preview, on one Letter or A4 sheet. ZIP checkboxes do not affect printing.
- Printing uses a separate 3x render, half-inch margins, and automatic or manual orientation. The print view offers Print / Save PDF.
- Passenger name and connecting airport start blank; arrival stamp starts off.
- Optional paper-rip sound, single-ticket PNG downloads, and separate wallpaper exports.

## Files
- index.html: page markup.
- style.css: base styles.
- ticket-tools.css: selection controls and six-tile responsive grid.
- ticket-print.css: print controls.
- ticket-core.js: original settings, data, and drawing helpers.
- ticket-layouts.js: original four layout functions.
- app.js: ticket engine, Ocean Drive, exports, and sound.
- ticket-tools.js: Neon Coast, live name preview, and local ZIP generation.
- ticket-print.js: active-ticket print page and print dialog.

## Run
Open index.html in a modern browser while online. Google Fonts and the QR library load from external CDNs. Allow the print-view pop-up when printing. No server-side ticket storage is used.

## Publishing
In repository Settings > Pages, select deployment from main and the repository root. Use the published URL shown after deployment completes.

## Arrival setting
RELEASE is in ticket-core.js. Midnight is a visual placeholder, not a verified unlock time. Travel details and edition perks are fictional.
