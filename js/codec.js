const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const LANGS = new Set(["en", "pl"]);

class PayloadError extends Error {
  constructor(code, lang) {
    super(code);
    this.code = code;
    this.lang = lang;
  }
}

function encodePayload(payload) {
  const compact = { ...payload };
  if (!compact.p?.length) delete compact.p;
  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (const byte of bytes) bin += String.fromCharCode(byte);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodePayload(token) {
  if (!token || typeof token !== "string") {
    throw new PayloadError("broken");
  }
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const bin = atob(padded);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const raw = JSON.parse(new TextDecoder().decode(bytes));
    return normalizePayload(raw);
  } catch (err) {
    if (err instanceof PayloadError) throw err;
    throw new PayloadError("broken", err?.lang);
  }
}

function buildPayload({ lang, name, tz, start, end, days, pto }) {
  const payload = {
    v: 1,
    l: lang,
    tz,
    s: start,
    e: end,
    d: days,
  };
  const trimmed = (name || "").trim();
  if (trimmed) payload.n = trimmed;
  if (pto && pto.length) payload.p = pto;
  return normalizePayload(payload);
}

function normalizePayload(raw) {
  if (!raw || typeof raw !== "object") throw new PayloadError("broken");

  if (raw.v == null) throw new PayloadError("broken", raw.l);
  if (raw.v !== 1) throw new PayloadError("version", raw.l);

  const lang = LANGS.has(raw.l) ? raw.l : "en";
  if (typeof raw.tz !== "string" || !raw.tz) {
    throw new PayloadError("broken", lang);
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: raw.tz }).format(new Date());
  } catch {
    throw new PayloadError("broken", lang);
  }

  const start = normalizeTime(raw.s);
  const end = normalizeTime(raw.e);
  if (!start || !end) throw new PayloadError("broken", lang);
  if (start >= end) throw new PayloadError("broken", lang);

  const days = normalizeDays(raw.d);
  if (!days.length) throw new PayloadError("broken", lang);

  const pto = normalizePto(raw.p);
  if (pto === null) throw new PayloadError("broken", lang);

  const payload = {
    v: 1,
    l: lang,
    tz: raw.tz,
    s: start,
    e: end,
    d: days,
    p: pto,
  };
  if (typeof raw.n === "string" && raw.n.trim()) payload.n = raw.n.trim();
  return payload;
}

function normalizeTime(value) {
  if (typeof value !== "string") return null;
  const cut = value.slice(0, 5);
  return TIME_RE.test(cut) ? cut : null;
}

function normalizeDays(value) {
  if (!Array.isArray(value)) return [];
  const unique = [...new Set(value.map(Number))].filter((day) => day >= 1 && day <= 7);
  unique.sort((a, b) => a - b);
  return unique;
}

function normalizePto(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) return null;
  const ranges = [];
  for (const item of value) {
    if (!Array.isArray(item) || item.length < 2) return null;
    const from = item[0];
    const to = item[1];
    if (typeof from !== "string" || typeof to !== "string") return null;
    if (!DATE_RE.test(from) || !DATE_RE.test(to)) return null;
    if (from > to) return null;
    ranges.push([from, to]);
  }
  return ranges;
}
