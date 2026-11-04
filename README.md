# FNB Botswana – Branch Queue Management (prototype)

Interfaces (shared code in `app.js`, theme in `styles.css`):
- `index.html` – customer site: Book a visit, Check in / Walk-in (kiosk), Queue screen; "You work here" links to staff
- `staff.html` – staff portal: counter + manager dashboard (demo PIN 1234)
- `kiosk.html` – dedicated kiosk device (check-in by reference or QR scan, walk-in tickets)
- `display.html` – dedicated waiting-area screen (ticket + counter only)

Features: 27 branches, 70/30 appointment/walk-in capacity, bookings with QR code, English/Setswana toggle, live cross-device sync, optional real SMS/WhatsApp.

## Setup
1. **Live sync (Firebase Realtime Database):** create a project, create a Realtime Database in test mode, then in `config.js` set `window.FNBQ_DB="<your database URL>";`
2. **Real SMS/WhatsApp (optional):** deploy `notify-worker.js` as a Cloudflare Worker with Twilio credentials, then add to `config.js`: `window.FNBQ_SMS="<your worker URL>";`
3. Without these, the site runs in local mode (single browser) and messages are simulated on screen.

Demo data only. Test-mode database rules are open: do not store real customer data. Setswana text should be reviewed by a native speaker before any public use.
