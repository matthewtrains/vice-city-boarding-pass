# Vice City Boarding Pass Generator

Fictional Los Santos to Vice City boarding passes, generated locally in the browser.

Original concept and ticket design: [Vinewood Motors (@Vinewood_motors)](https://x.com/Vinewood_motors).

Unofficial fan project. Not affiliated with Rockstar Games or Take-Two Interactive.

## Layouts
Original, Remix, Portrait, Social, and Ocean Drive. Click a thumbnail or use the layout selector. The original four rendering functions are preserved from the supplied source.

## Controls
- Passenger name and connecting airport start blank.
- Arrival stamp is off by default.
- Ticket PNG resolution: 1x, 2x, 3x, or 4x, with exact pixel dimensions shown for each layout.
- Paper-rip sound on ticket download, with an on/off toggle. Audio is synthesized locally.
- Wallpaper size is selected separately from ticket PNG resolution.

## Files
- index.html: page markup.
- style.css: page and thumbnail styles.
- ticket-core.js: original settings, data, and drawing helpers.
- ticket-layouts.js: original four layout functions.
- app.js: ticket generation, Ocean Drive, thumbnail controls, exports, and sound.

## Run
Open index.html in a modern browser while online. Google Fonts and the QR library load from external CDNs. No server-side ticket storage is used.

## Publishing
In repository Settings > Pages, select deployment from main and the repository root. Use the published URL shown after deployment completes.

## Arrival setting
RELEASE is in ticket-core.js. Midnight is a visual placeholder, not a verified unlock time. Travel details and edition perks are fictional.
