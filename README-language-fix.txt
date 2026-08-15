LANGUAGE PATH FIX

Fixed the VI/EN switch for Cloudflare Pages clean directory URLs.

Previously:
- /en/ could be interpreted as the file "en"
- switching language could produce /en/en or /en/en/en

Now:
- / -> /en/index.html when switching to English
- /en/ -> /index.html when switching to Vietnamese
- /calendar.html <-> /en/calendar.html
- /utilities.html <-> /en/utilities.html

The existing per-page localStorage language preference remains intact.
