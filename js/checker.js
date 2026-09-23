const app = document.getElementById("app");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DELAY_MS = prefersReduced ? 0 : 1600;

try {
  start();
} catch (err) {
  console.error(err);
  renderError("broken", "en");
}

function start() {
  const token = new URLSearchParams(window.location.search).get("p");
  if (!token) {
    renderError("broken", "en");
    return;
  }

  let payload;
  try {
    payload = decodePayload(token);
  } catch (err) {
    const code = err instanceof PayloadError ? err.code : "broken";
    const lang = err instanceof PayloadError && err.lang ? err.lang : "en";
    renderError(code, lang);
    return;
  }

  setLang(payload.l);
  document.title = t("checkDocTitle");
  renderChecking();

  window.setTimeout(() => {
    renderVerdict(payload, verdict(payload));
  }, DELAY_MS);
}

function renderChecking() {
  document.body.className = "check-body checking-state";
  app.replaceChildren();
  const line = document.createElement("p");
  line.className = "checking-line";
  line.textContent = t("checking");
  app.append(line);
}

function renderVerdict(payload, result) {
  const praise = result.outcome === "praise";
  document.body.className = `check-body ${praise ? "praise-state" : "roast-state"}`;
  document.title = praise ? t("passed") : t("soulSold");

  const nodes = [];
  if (!praise) {
    const nameLine = document.createElement("p");
    nameLine.className = "roast-name";
    nameLine.textContent = roastNameLine(payload.n, payload.l);
    nodes.push(nameLine);
  }

  const stamp = document.createElement("p");
  stamp.className = "stamp";
  stamp.textContent = praise ? t("passed") : t("soulSold");

  const body = document.createElement("p");
  body.className = "verdict-copy";
  body.textContent = verdictMessage(
    payload,
    result,
    (iso) => formatDisplayDate(iso, localeFor(payload.l)),
    { skipName: !praise }
  );

  const meta = document.createElement("p");
  meta.className = "verdict-meta";
  meta.textContent = `${result.date} · ${result.time} · ${payload.tz}`;

  app.replaceChildren(...nodes, stamp, body, meta);
  if (!praise) renderRoastBubbles(payload.l);
}

function renderRoastBubbles(lang) {
  document.querySelector(".roast-bubbles")?.remove();
  const texts = roastBubbles(lang);
  if (!texts.length) return;
  const layer = document.createElement("div");
  layer.className = "roast-bubbles";
  layer.setAttribute("aria-hidden", "true");
  texts.forEach((text, index) => {
    const slot = BUBBLE_SLOTS[index % BUBBLE_SLOTS.length];
    const bubble = document.createElement("p");
    bubble.className = `bubble tail-${slot.tail}`;
    bubble.textContent = text;
    if (slot.top) bubble.style.top = slot.top;
    if (slot.bottom) bubble.style.bottom = slot.bottom;
    if (slot.right) bubble.style.right = slot.right;
    if (slot.centerX) {
      bubble.style.left = "50%";
      bubble.style.transform = `translateX(-50%) rotate(${slot.rotate}deg)`;
    } else {
      if (slot.left) bubble.style.left = slot.left;
      bubble.style.transform = `rotate(${slot.rotate}deg)`;
    }
    bubble.style.animationDelay = `${0.28 + index * 0.12}s`;
    layer.append(bubble);
  });
  document.body.append(layer);
}

function renderError(code, lang) {
  setLang(lang === "pl" ? "pl" : "en");
  document.body.className = "check-body error-state";
  document.title = t("checkDocTitle");
  applyDomI18n();

  const heading = document.createElement("h1");
  heading.className = "error-title";
  heading.textContent = t(code === "version" ? "errVersion" : "errBroken");

  const link = document.createElement("a");
  link.className = "back-link";
  link.href = "./index.html";
  link.textContent = t("backToGenerator");

  app.replaceChildren(heading, link);
}

