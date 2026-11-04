# FNB Botswana – Branch Queue Management (prototype)
Separate interfaces, one shared data layer (`app.js`) and theme (`styles.css`):
- `index.html` – customer booking site (public)
- `staff.html` – staff portal: counter + manager dashboard (demo PIN 1234)
- `kiosk.html` – in-branch kiosk: check-in and walk-in tickets
- `display.html` – waiting-area screen (ticket + counter only)

Demo data only. Same-browser sync via localStorage; no real SMS/WhatsApp.
