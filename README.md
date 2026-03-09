# 📍 My Location Unknown

A lightweight, privacy-friendly PHP web app that lets you **detect and share your location** — no accounts, no databases, no tracking.

Designed to run on standard **cPanel shared hosting** (Apache + PHP 7.4 / 8.x).

---

## Features

| Feature | Detail |
|---|---|
| 🗺️ Location detection | Uses the browser's built-in Geolocation API |
| 🔗 Shareable links | Coordinates are encoded in the URL — nothing is stored server-side |
| 🗺️ Embedded map | Shared location page shows an OpenStreetMap preview (no API key needed) |
| 📋 Copy to clipboard | One-click copy of the share link |
| 🔒 Security headers | X-Frame-Options, HSTS, X-Content-Type-Options via `.htaccess` |
| 📱 Mobile-friendly | Responsive CSS, works on any modern browser |

---

## File Structure

```
mylocationuknown/
├── index.php     # Home page — detects your location
├── share.php     # Shared location viewer (uses ?lat=…&lng=… query params)
├── style.css     # Responsive stylesheet
├── .htaccess     # Apache / cPanel configuration
└── README.md
```

---

## Deploying on cPanel

1. Log in to your cPanel account.
2. Open **File Manager** and navigate to `public_html` (or a subdirectory).
3. Upload all files:
   - `index.php`
   - `share.php`
   - `style.css`
   - `.htaccess`
4. Make sure **mod_rewrite** is enabled (it is on virtually all cPanel hosts).
5. Visit your domain — the site is ready to use.

> **No database setup required.** The app stores nothing on the server.

---

## How It Works

1. The visitor grants browser permission to access their location.
2. The browser's Geolocation API returns latitude & longitude.
3. A shareable link is built: `https://yourdomain.com/share.php?lat=…&lng=…`
4. The recipient opens the link and sees the location on an embedded OpenStreetMap.

---

## Requirements

- PHP 7.4 or newer (standard on all modern cPanel servers)
- Apache with `mod_rewrite` and `mod_headers` (enabled by default on cPanel)
- A modern browser on the visitor's device (Chrome, Firefox, Safari, Edge)

---

## Privacy

- Location data is **never sent to the server** from `index.php`; it exists only in the user's browser.
- On `share.php`, lat/lng are read from the URL query string and rendered server-side — they are **not logged or stored**.
- No cookies, no analytics, no third-party scripts.
