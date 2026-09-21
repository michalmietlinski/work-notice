# Corporate Checker — Project Plan

A static GitHub Pages joke: send someone a link. If they open it during work hours, they get a pat on the back. If they open it after hours or on PTO, they get roasted for being a corporate slave who sold their soul.

Stack: **HTML + CSS + vanilla JS only**. No backend, no build step, no npm.

---

## Decisions locked for v1

| Topic | Decision |
|---|---|
| Timezone | Detect the **browser timezone**, show it, allow changing it on the generator |
| Language | Selectable on the generator; stored in the link so the check page matches |
| Link shortening | **Skipped.** Copy the full GitHub Pages URL. No TinyURL. |

---

## 1. Concept

The gag is inverted “hustle culture”:

| When they open the link | Verdict | Message intent |
|---|---|---|
| During configured work hours, not PTO | **Praise** | Congrats. You opened this on company time. You still have a life. |
| Outside work hours, weekend, or PTO | **Roast** | You are checking this on your own time. Corporate slave. Soul: sold. |

The generator is for the sender. The check page is for the victim. The sender configures *that person’s* calendar (hours, PTO, timezone) and the **language of the roast**, then shares one link.

This is not a time tracker and not a productivity tool. It is a shareable roast with just enough real calendar logic to land the joke.

---

## 2. Pages

Two public pages on GitHub Pages.

### 2.1 Generator — `index.html`

Purpose: build the payload and produce a shareable URL.

Fields:

- **Language** — dropdown. Default: browser language if we support it (`navigator.language`), otherwise English. Changing it immediately re-renders the generator UI *and* is written into the link, so the victim sees the same language.
- **Name** (optional) — used in the roast/praise copy (“Karol, you sold your soul”).
- **Timezone** — IANA name. Default: `Intl.DateTimeFormat().resolvedOptions().timeZone` (the sender’s browser zone), labeled in the UI (“Detected: Europe/Warsaw”). Sender can pick a different zone if the victim’s office is elsewhere. Work hours are evaluated in *this* stored timezone, not whatever zone the victim’s laptop happens to be in when they open the link.
- **Work days** — checkboxes, default Mon–Fri.
- **Work start / work end** — time inputs, default `09:00`–`17:00`. End is exclusive (open at 17:00:00 is already after hours).
- **PTO** — one or more date ranges (`from` / `to`, inclusive calendar dates in the chosen timezone). Single days are a range with the same start and end.

Actions:

- **Generate link** — encodes the form into a query param on the check page.
- **Copy link** — copies the full GitHub Pages URL. That is the only share action.

Live preview on the generator: “If they opened it right now, they would get: Praise / Roast” — useful so the sender does not misconfigure hours. Preview copy follows the selected language.

### 2.2 Check page — `check.html`

Purpose: decode the URL, compare *now* against the payload, show one verdict **in the language stored in the link**.

Flow:

1. Read `?p=` from the query string.
2. Decode. If missing or corrupt → friendly error (English fallback, since we do not know the intended language).
3. Short beat (1–2s) before the reveal — “checking your timesheet…” — so it feels like a trap.
4. Show praise or roast, with the reason:
   - in hours
   - after hours
   - weekend / non-working day
   - PTO (`on leave until 2026-07-14`)
5. No “try again”, no score, no tracking. One shot, theatrical.

The check page must work with **no** query param only as an error state. It never silently fall back to 9–17, because that would roast random visitors who bookmarked `/check.html`.

The victim’s browser language is **ignored**. The sender chose the language; the link is the contract.

---

## 3. Language

v1 ships **English** and **Polish**. Those cover the joke copy and the generator chrome. Adding a third language later is a dictionary, not a rewrite.

### 3.1 What language controls

| Surface | Source |
|---|---|
| Generator labels, buttons, validation, preview | Generator dropdown (live) |
| Check page loading line, praise, roast, reasons, error (when payload decoded) | `l` in the payload |
| Broken / missing payload on check page | English (unknown intent) |

All user-facing strings live in one dictionary file, e.g. `js/i18n.js`:

```js
const STRINGS = {
  en: { generatorTitle: "…", praiseOnClock: "…", roastPto: "…" },
  pl: { generatorTitle: "…", praiseOnClock: "…", roastPto: "…" }
};
```

No i18n library. Missing key falls back to English. Dates and clock times still use `Intl` with the payload timezone; locale for number/date formatting follows the selected language (`en` → `en-GB` or `en-US`, `pl` → `pl-PL`).

### 3.2 Generator default

1. Read `navigator.language` (e.g. `pl-PL`, `en-US`).
2. If the prefix is `pl` → Polish. If `en` → English.
3. Anything else → English, dropdown still lets them pick Polish.

Timezone default is independent of language. A Polish UI can still use `America/New_York`.

### 3.3 Copy tone per language

Same joke, not a literal calque:

- EN praise: “It’s 14:12 in Warsaw. Officially work. You may proceed, employee of the month.”
- EN roast / PTO: “This is a PTO day. You are on leave. You opened a work link. Soul status: sold.”
- PL should sound like a smug HR memo, not Google Translate. Write native punchlines at implementation time.

Weekday labels on the generator (Mon–Sun / Pn–Nd) follow the selected UI language.

---

## 4. Encoding (not hashing)

A cryptographic hash is one-way. The check page *must* recover hours, timezone, language, and PTO. So the payload is **encoded**, not hashed.

Scheme:

1. Compact JSON object (short keys).
2. UTF-8 bytes → **base64url** (URL-safe, no `+` `/` `=` padding issues).
3. Put it in a **query parameter**: `check.html?p=...`

No extra obfuscation in v1. Anyone can decode the URL; the joke is the reveal, not secrecy.

Query param rather than `#fragment` is still the right default: some messengers mishandle hashes, and `?p=` is easy to debug.

### 4.1 Payload contract (v1)

```json
{
  "v": 1,
  "l": "pl",
  "n": "Karol",
  "tz": "Europe/Warsaw",
  "s": "09:00",
  "e": "17:00",
  "d": [1, 2, 3, 4, 5],
  "p": [["2026-07-01", "2026-07-14"], ["2026-12-24", "2026-12-24"]]
}
```

| Key | Meaning |
|---|---|
| `v` | Schema version. Lets us change the format later without breaking old links. |
| `l` | Language code: `en` or `pl`. Required. Unknown value → English. |
| `n` | Display name. Omit if empty. |
| `tz` | IANA timezone. Required. |
| `s` / `e` | Work start / end `HH:MM` in `tz`. |
| `d` | ISO weekdays, `1` = Monday … `7` = Sunday. Default `[1,2,3,4,5]`. |
| `p` | PTO ranges `[from, to]` as `YYYY-MM-DD` in `tz`, inclusive. |

Keep keys short. PTO lists are what make URLs long.

Overnight shifts (`22:00`–`06:00`) are **out of v1**. If start ≥ end, the generator shows a validation error.

---

## 5. Timezone on the generator

1. On load, detect `Intl.DateTimeFormat().resolvedOptions().timeZone`.
2. Pre-select that value in a timezone dropdown. Show a short hint: “Using your browser timezone.”
3. Dropdown is a **curated list** of common IANA zones (Europe, US, etc.) plus the detected zone if it is not already in the list. No free-text typing — invalid zone names would break the check page.
4. Changing the zone updates the live “would roast right now?” preview, because “now” is interpreted in that zone.

The check page does **not** offer a timezone picker. The link already contains `tz`.

---

## 6. Verdict logic

All comparisons use the payload timezone via `Intl` (format `Date` into that zone’s `YYYY-MM-DD`, weekday, and `HH:mm`).

```
nowTz = current instant expressed in payload.tz
date  = nowTz calendar date
time  = nowTz clock time
dow   = nowTz ISO weekday

if date is inside any PTO range:
    ROAST (reason: pto)
else if dow not in work days:
    ROAST (reason: off-day)
else if time < start OR time >= end:
    ROAST (reason: after-hours)
else:
    PRAISE (reason: on-the-clock)
```

Notes:

- **PTO wins over work hours.** Opening the link at 10:00 on a booked vacation day is a roast.
- **Weekends** are roasts unless the sender checked Sat/Sun as work days.
- **Clock change / DST**: evaluating “now” in an IANA zone is the correct approach; do not store UTC offsets like `+02:00`.
- **Victim traveling**: if they fly to another country, we still judge them by the *configured office timezone*. That is the intended joke (“you are on a beach in Greece and still opening this”).

Tone: mean, short, funny. Not actually abusive. No real HR / surveillance language.

---

## 7. Sharing (no shortener)

v1 action is **Copy link** only.

The URL looks like:

```
https://<user>.github.io/corporate-checker/check.html?p=eyJ2IjoxLCJsIjoicGwi...
```

It gets longer with more PTO ranges. If it exceeds ~2000 characters, warn the sender to use fewer ranges. We are not integrating TinyURL, bit.ly, or any third-party API (CORS, extra UI, and shortening would have dropped `#` fragments anyway).

Changing hours or PTO later means generating a **new** link. There is no edit-in-place.

---

## 8. GitHub Pages setup

Repo is this folder. Pages source: branch `main`, folder `/` (root).

Public URLs (example):

```
https://<user>.github.io/corporate-checker/           → generator
https://<user>.github.io/corporate-checker/check.html?p=...  → verdict
```

Rules:

- Relative links only (`check.html?p=`, `./css/app.css`) so it also works in a project site (`/corporate-checker/`) and a user site (`username.github.io` at root).
- Build the share URL with `new URL('check.html', window.location.href)` plus `searchParams`, never hardcode the GitHub username.
- No custom domain required for v1.

Local preview: open files via any static server (`npx serve`, VS Code Live Server, Python `http.server`). Opening `file://` can break query-param testing; document “use a local server”.

---

## 9. UI direction

Corporate satire, not a SaaS dashboard.

- Generator: looks like a cheap internal HR form — Times New Roman-ish / system fonts, beige, a slightly ugly submit button, label “Employee availability”. Language and timezone sit near the top, like a form header. That contrast makes the check page funnier.
- Check page: full-viewport, big type, one color shift:
  - Praise → sickly corporate green / gold star energy
  - Roast → red stamp, “WRITE-UP”, maybe a slow clap line
- No frameworks, no icon packs unless they are a few inline SVGs.
- Mobile-first: these links will be opened on phones in Slack.

Accessibility: verdict must not be color-only; include a clear heading (“You passed” / “Soul sold”). Respect `prefers-reduced-motion` on the reveal delay animation. Language dropdown must be a real `<select>` (not a custom widget that breaks screen readers).

`lang` / `dir` on `<html>` updates when the language changes (`en` / `pl`).

---

## 10. Proposed file layout

```
/
  PLAN.md                 ← this document
  README.md               ← how to run locally + how to enable GitHub Pages
  index.html              ← generator
  check.html              ← verdict
  css/
    app.css               ← shared look
  js/
    i18n.js               ← en / pl dictionaries + t(key)
    codec.js              ← encode / decode / versioned payload
    time.js               ← timezone, PTO, verdict
    zones.js              ← curated IANA list + detect browser zone
    generator.js
    checker.js
```

Shared modules stay plain IIFEs or ES modules. ES modules work on GitHub Pages; they do **not** work reliably from `file://`. That is another reason to preview via a static server.

No tests required for v1. `time.js` is the only logic worth extracting cleanly so we can add tests later if the DST/PTO edge cases get messy.

---

## 11. Edge cases to handle in v1

| Case | Behavior |
|---|---|
| Missing / garbage `p` | Error screen in English, no roast. |
| Unknown `l` in payload | English. |
| Future schema `v: 2` opened on old JS | Error: “this link needs a newer version of the page” (English + Polish if we can still read `l`). |
| Empty PTO list | Allowed. |
| Overlapping PTO ranges | Allowed; treat as union. |
| `to` before `from` | Generator validation error (in the selected UI language). |
| Browser timezone not in the curated list | Insert it at the top of the dropdown so the default is always valid. |
| Opened at exactly 09:00 | Praise (start inclusive). |
| Opened at exactly 17:00 | Roast (end exclusive). |
| Name with emoji / unicode | Must survive UTF-8 → base64url. |
| Very long PTO list | Warn if URL exceeds ~2000 chars. Suggest fewer ranges. |

Out of v1: accounts, editing a live link, lunch breaks, half-day PTO, recurring holidays, geolocation, notifications, extra languages, URL shorteners.

---

## 12. Privacy and ethics (keep this honest)

- Everything is in the URL. Slack logs and browser history see PTO dates and the chosen language.
- Do not add analytics, pixels, or IP logging. That would turn a joke into actual surveillance.
- Copy should read as a joke between colleagues, not as a tool for managers to catch people.
- README should say: do not send this to people who did not consent to the bit.

---

## 13. Implementation order

1. **i18n skeleton** — `en` / `pl` keys, `t()`, `html lang` switch.
2. **Codec + time helpers** — encode/decode round-trip including `l` and `tz`; verdict matrix for work / after-hours / weekend / PTO / DST.
3. **Generator UI** — language, browser timezone + override, defaults 09:00–17:00, Mon–Fri, PTO ranges, live preview, copy URL.
4. **Check page** — decode, delay, praise/roast in payload language, broken-link state.
5. **Polish** — copy in both languages, motion, mobile layout.
6. **GitHub Pages** — enable in repo settings, smoke-test a real copied link.

Do not start with styling. The verdict function is the product.

---

## 14. Success criteria

- Generator opens in the browser’s language when it is `en` or `pl`, otherwise English, and the dropdown switches the whole form.
- Timezone field starts as the browser zone and can be changed; the live preview follows the selected zone.
- Opening a default 9–17 weekday link during those hours shows praise in the chosen language.
- Opening the same link at 20:00, on Saturday, or on a PTO date shows roast, with the correct reason, in the chosen language.
- Copy-link is the only share action; no shortener UI.
- Generator and check page work on GitHub Pages with only static files.

---

## 15. Remaining open choices

| Topic | Default unless you say otherwise |
|---|---|
| Languages in v1 | English + Polish |
| Work-day default | Mon–Fri |
| Inclusive start / exclusive end | Yes |
| Name field | Optional |
| Visual theme | Fake HR form → dramatic verdict |

Say if you want more languages in v1, or different defaults. Otherwise this is ready to implement.
