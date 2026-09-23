# Work Notice

A static GitHub Pages joke. You configure someone’s work hours and PTO, copy a link, and send it. If they open it on the clock they get praised. If they open it after hours, on a weekend, or on leave, they get roasted for selling their soul.

Live site: https://michalmietlinski.github.io/work-notice/

On GitHub Pages, copied links use that URL (`/work-notice/...`).

Locally there is **no** `/work-notice/` prefix. From the project folder:

```bash
python -m http.server 8765
```

Then open http://localhost:8765/  
A check link looks like http://localhost:8765/check.html?p=...

## Pages

- `index.html` — generator (language, timezone, hours, PTO, copy link)
- `check.html` — verdict (reads `?p=` from the URL)

## GitHub Pages

Repo settings → Pages → Deploy from a branch → `master` / `/ (root)`.
