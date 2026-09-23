const browserZone = getBrowserZone();
const MAX_URL_LENGTH = 2000;
const now = new Date();

const ptoRanges = [];
let pendingStart = null;
let hoverDate = null;
let calView = { year: now.getFullYear(), month: now.getMonth() };

const els = {
  form: document.getElementById("generator"),
  lang: document.getElementById("lang"),
  name: document.getElementById("name"),
  tz: document.getElementById("tz"),
  tzHint: document.getElementById("tz-hint"),
  start: document.getElementById("start"),
  end: document.getElementById("end"),
  ptoHint: document.getElementById("pto-hint"),
  ptoCalendar: document.getElementById("pto-calendar"),
  ptoList: document.getElementById("pto-list"),
  previewNow: document.getElementById("preview-now"),
  previewBadge: document.getElementById("preview-badge"),
  previewBody: document.getElementById("preview-body"),
  link: document.getElementById("link"),
  copy: document.getElementById("copy"),
  copyStatus: document.getElementById("copy-status"),
  errors: document.getElementById("errors"),
  urlWarn: document.getElementById("url-warn"),
};

init();

function init() {
  setLang(detectLang());
  els.lang.value = getLang();
  els.start.value = "09:00";
  els.end.value = "17:00";
  document.querySelectorAll('input[name="day"]').forEach((box) => {
    box.checked = Number(box.value) <= 5;
  });

  refreshZoneSelect();
  applyLanguage();
  refresh();

  els.lang.addEventListener("change", () => {
    setLang(els.lang.value);
    refreshZoneSelect(els.tz.value);
    applyLanguage();
    refresh();
  });

  els.form.addEventListener("input", refresh);
  els.form.addEventListener("change", refresh);
  els.copy.addEventListener("click", onCopy);
  els.ptoCalendar.addEventListener("mouseleave", () => {
    hoverDate = null;
    if (pendingStart) renderPtoCalendar();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && pendingStart) {
      pendingStart = null;
      hoverDate = null;
      renderPtoCalendar();
      updatePtoHint();
    }
  });
}

function applyLanguage() {
  document.title = t("docTitle");
  applyDomI18n();
  renderPtoCalendar();
  renderPtoChips();
  updatePtoHint();
}

function refreshZoneSelect(selected = browserZone) {
  populateZoneSelect(els.tz, selected, t, localeFor());
}

function weekdayLabels() {
  return [1, 2, 3, 4, 5, 6, 7].map((day) => t(`day${day}`));
}

function renderPtoCalendar() {
  renderMonthCalendar(els.ptoCalendar, {
    year: calView.year,
    month: calView.month,
    locale: localeFor(),
    weekdayLabels: weekdayLabels(),
    pendingStart,
    hoverDate,
    ranges: ptoRanges,
    todayIso: toIsoDate(new Date()),
    labels: { prev: t("calPrev"), next: t("calNext") },
    onPrev: () => shiftMonth(-1),
    onNext: () => shiftMonth(1),
    onSelect: onPtoDay,
    onHover: (iso) => {
      if (!pendingStart || hoverDate === iso) return;
      hoverDate = iso;
      renderPtoCalendar();
    },
  });
}

function shiftMonth(delta) {
  calView.month += delta;
  if (calView.month < 0) {
    calView.month = 11;
    calView.year -= 1;
  } else if (calView.month > 11) {
    calView.month = 0;
    calView.year += 1;
  }
  renderPtoCalendar();
}

function onPtoDay(iso) {
  if (!pendingStart) {
    pendingStart = iso;
    hoverDate = iso;
    renderPtoCalendar();
    updatePtoHint();
    return;
  }

  const [from, to] = orderedRange(pendingStart, iso);
  const exists = ptoRanges.some((range) => range.from === from && range.to === to);
  if (!exists) ptoRanges.push({ from, to });
  pendingStart = null;
  hoverDate = null;
  renderPtoCalendar();
  renderPtoChips();
  updatePtoHint();
  refresh();
}

function renderPtoChips() {
  els.ptoList.replaceChildren();
  if (!ptoRanges.length) {
    const empty = document.createElement("li");
    empty.className = "hint";
    empty.textContent = t("ptoEmpty");
    els.ptoList.append(empty);
    return;
  }

  for (const range of ptoRanges) {
    const item = document.createElement("li");
    item.className = "pto-chip";
    const label = document.createElement("span");
    label.textContent =
      range.from === range.to
        ? formatDisplayDate(range.from, localeFor())
        : t("ptoRange", {
            from: formatDisplayDate(range.from, localeFor()),
            to: formatDisplayDate(range.to, localeFor()),
          });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn ghost compact";
    remove.textContent = t("ptoRemove");
    remove.addEventListener("click", () => {
      const index = ptoRanges.indexOf(range);
      if (index >= 0) ptoRanges.splice(index, 1);
      renderPtoCalendar();
      renderPtoChips();
      refresh();
    });
    item.append(label, remove);
    els.ptoList.append(item);
  }
}

function updatePtoHint() {
  if (pendingStart) {
    els.ptoHint.removeAttribute("data-i18n");
    els.ptoHint.textContent = t("ptoHintPending", {
      date: formatDisplayDate(pendingStart, localeFor()),
    });
    return;
  }
  els.ptoHint.setAttribute("data-i18n", "ptoHint");
  els.ptoHint.textContent = t("ptoHint");
}

function readDays() {
  return [...document.querySelectorAll('input[name="day"]:checked')].map((box) => Number(box.value));
}

function readPto() {
  return ptoRanges.map((range) => ({ from: range.from, to: range.to, complete: true }));
}

function readForm() {
  return {
    lang: getLang(),
    name: els.name.value,
    tz: els.tz.value,
    start: (els.start.value || "09:00").slice(0, 5),
    end: (els.end.value || "17:00").slice(0, 5),
    days: readDays(),
    ptoRows: readPto(),
  };
}

function validate(form) {
  const errors = [];
  if (form.start >= form.end) errors.push(t("errHours"));
  if (!form.days.length) errors.push(t("errDays"));
  return errors;
}

function payloadFromForm(form) {
  return buildPayload({
    lang: form.lang,
    name: form.name,
    tz: form.tz,
    start: form.start,
    end: form.end,
    days: form.days,
    pto: form.ptoRows.map((row) => [row.from, row.to]),
  });
}

function refresh() {
  const form = readForm();
  const errors = validate(form);
  renderErrors(errors);
  els.tzHint.textContent = form.tz === browserZone ? t("timezoneHint") : t("timezoneOverrideHint");

  if (errors.length) {
    els.previewBadge.textContent = "";
    els.previewBadge.className = "badge";
    els.previewNow.textContent = "";
    els.previewBody.textContent = "";
    els.link.value = "";
    els.copy.disabled = true;
    els.urlWarn.hidden = true;
    return;
  }

  const payload = payloadFromForm(form);
  const result = verdict(payload);
  const zoneLabel = formatZoneLabel(payload.tz, localeFor());
  els.previewNow.textContent = t("previewNow", {
    time: result.time,
    zone: zoneLabel,
  });
  els.previewBadge.textContent = result.outcome === "praise" ? t("previewPraise") : t("previewRoast");
  els.previewBadge.className = `badge ${result.outcome}`;
  els.previewBody.textContent = verdictMessage(payload, result, (iso) =>
    formatDisplayDate(iso, localeFor())
  );

  const url = new URL("check.html", shareBase());
  url.search = "";
  url.hash = "";
  url.searchParams.set("p", encodePayload(payload));
  els.link.value = url.toString();
  els.copy.disabled = false;
  els.urlWarn.hidden = url.toString().length <= MAX_URL_LENGTH;
  els.copyStatus.textContent = "";
}

function renderErrors(errors) {
  els.errors.replaceChildren();
  els.errors.hidden = errors.length === 0;
  for (const message of errors) {
    const li = document.createElement("li");
    li.textContent = message;
    els.errors.append(li);
  }
}

async function onCopy() {
  const text = els.link.value;
  if (!text) return;
  const ok = await copyText(text);
  els.copyStatus.textContent = ok ? t("copied") : t("copyFailed");
  if (!ok) {
    els.link.focus();
    els.link.select();
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    els.link.focus();
    els.link.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    }
  }
}
