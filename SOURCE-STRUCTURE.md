# BenADV.com — Source Structure

## Root files
- `index.html` — Vietnamese homepage.
- `en/index.html` — English homepage.
- `calendar.html` / `en/calendar.html` — Perpetual calendar.
- `utilities.html` / `en/utilities.html` — Utilities hub.
- `updates.html`, `notes.html` — lightweight supporting pages.
- `robots.txt` — crawler rules.
- `sitemap.xml` — indexable URLs.
- `_headers` — Cloudflare cache/security headers.

## CSS
- `css/style.css` — global design system, typography, header, navigation, homepage and utilities.
- `css/calendar.css` — calendar-only layout.
- `:root` at the top of `style.css` is the main place to change:
  - colors
  - font stack
  - max width
  - border radius
  - shadows

## JavaScript
- `js/script.js` — global navigation, language switch, theme, homepage clock.
- `js/calendar.js` — lunar conversion, Can Chi, zodiac hours and monthly calendar.

## Assets
- `assets/benadv-logo.svg` — editable full BenADV logo.
- `assets/benadv-icon.svg` — editable app/favicon icon.

## Branding
- Visible logo: `BenADV`
- Vietnamese menu: `Ben`
- English menu: `Ben`
- Domain: `BenADV.com`
- Ben ADV = Ben Adventure

## Color palette
- Brand blue: `#169EEA`
- Cyan: `#20C4F3`
- Deep blue: `#087FF0`
- Navy text: `#0B1F33`
- Accent orange: `#FF9A1F`
- Soft background: `#F6FAFD`
