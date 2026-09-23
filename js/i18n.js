const STRINGS = {
  en: {
    docTitle: "Employee availability",
    checkDocTitle: "Timesheet review",
    formCode: "FORM HR-09",
    confidential: "CONFIDENTIAL",
    title: "Employee availability",
    tagline: "Internal use only. Unauthorized overtime will be commented on sarcastically.",
    language: "Language",
    name: "Employee name",
    nameOptional: "optional",
    namePlaceholder: "Karol",
    timezone: "Timezone",
    timezoneHint: "Using your browser timezone.",
    timezoneOverrideHint: "Using a timezone you picked. Hours will be judged in this zone, not theirs.",
    workDays: "Working days",
    day1: "Mon",
    day2: "Tue",
    day3: "Wed",
    day4: "Thu",
    day5: "Fri",
    day6: "Sat",
    day7: "Sun",
    dayFull1: "Monday",
    dayFull2: "Tuesday",
    dayFull3: "Wednesday",
    dayFull4: "Thursday",
    dayFull5: "Friday",
    dayFull6: "Saturday",
    dayFull7: "Sunday",
    hours: "Working hours",
    hoursFrom: "From",
    hoursTo: "To",
    pto: "Approved leave",
    ptoHint: "Click the first day, then the last day. One day: click it twice.",
    ptoHintPending: "Start: {date}. Now click the last day.",
    ptoFrom: "From",
    ptoTo: "To",
    ptoAdd: "Add date range",
    ptoRemove: "Remove",
    ptoEmpty: "No leave selected yet.",
    ptoRange: "{from} – {to}",
    calPrev: "Previous month",
    calNext: "Next month",
    previewLabel: "If they opened this right now",
    previewNow: "It is {time} in {zone}.",
    previewPraise: "Praise",
    previewRoast: "Slave",
    linkLabel: "Link to send",
    copy: "Copy link",
    copied: "Copied",
    copyFailed: "Could not copy. Select the link and copy it yourself.",
    errHours: "End time must be after start time.",
    errDays: "Pick at least one working day.",
    errPto: "Each leave range needs a start on or before the end.",
    warnLongUrl: "This link is very long. Slack and some apps may truncate it. Use fewer leave ranges.",
    footerJoke: "Not HR. A joke. Do not send this to people who did not ask for the bit.",
    zoneGroupDetected: "Detected",
    zoneGroupEurope: "Europe",
    zoneGroupAmericas: "Americas",
    zoneGroupAsia: "Asia",
    zoneGroupOther: "Other",
    checking: "Checking if you still belong to the company…",
    passed: "You passed",
    soulSold: "Corporate slave",
    praiseOnClock: "It's {time} in {zone}. Officially work. Lucky you: for once you opened this on the company's dime.",
    roastBefore: "You opened it outside work hours. You shouldn't be working now, you slave of the corporate.",
    roastAfter: "You opened it outside work hours. You shouldn't be working now, you slave of the corporate.",
    roastOffDay: "It's {day}. Not a work day. You opened it anyway, you slave of the corporate.",
    roastPto: "Leave until {until}. You are off. You still opened a work link, you slave of the corporate.",
    errBroken: "This link is broken. Ask whoever sent it to generate a new one.",
    errVersion: "This link needs a newer version of the page.",
    backToGenerator: "Generate a new link",
  },
  pl: {
    docTitle: "Dostępność pracownika",
    checkDocTitle: "Kontrola grafiku",
    formCode: "FORMULARZ HR-09",
    confidential: "POUFNE",
    title: "Dostępność pracownika",
    tagline: "Do użytku wewnętrznego. Nadgodziny zostaną skomentowane sarkastycznie.",
    language: "Język",
    name: "Imię i nazwisko",
    nameOptional: "opcjonalnie",
    namePlaceholder: "Karol",
    timezone: "Strefa czasowa",
    timezoneHint: "Używamy strefy czasowej przeglądarki.",
    timezoneOverrideHint: "Wybrano inną strefę. Godziny będą liczone w niej, nie w strefie odbiorcy.",
    workDays: "Dni robocze",
    day1: "Pn",
    day2: "Wt",
    day3: "Śr",
    day4: "Cz",
    day5: "Pt",
    day6: "So",
    day7: "Nd",
    dayFull1: "poniedziałek",
    dayFull2: "wtorek",
    dayFull3: "środa",
    dayFull4: "czwartek",
    dayFull5: "piątek",
    dayFull6: "sobota",
    dayFull7: "niedziela",
    hours: "Godziny pracy",
    hoursFrom: "Od",
    hoursTo: "Do",
    pto: "Urlop (zatwierdzony)",
    ptoHint: "Kliknij pierwszy dzień, potem ostatni. Jeden dzień: kliknij dwa razy.",
    ptoHintPending: "Początek: {date}. Teraz kliknij ostatni dzień.",
    ptoFrom: "Od",
    ptoTo: "Do",
    ptoAdd: "Dodaj zakres dat",
    ptoRemove: "Usuń",
    ptoEmpty: "Nie dodano jeszcze urlopu.",
    ptoRange: "{from} – {to}",
    calPrev: "Poprzedni miesiąc",
    calNext: "Następny miesiąc",
    previewLabel: "Gdyby otworzyli to teraz",
    previewNow: "Jest {time} w strefie {zone}.",
    previewPraise: "Pochwała",
    previewRoast: "Niewolnik",
    linkLabel: "Link do wysłania",
    copy: "Kopiuj link",
    copied: "Skopiowano",
    copyFailed: "Nie udało się skopiować. Zaznacz link i skopiuj ręcznie.",
    errHours: "Godzina końca musi być po godzinie początku.",
    errDays: "Wybierz przynajmniej jeden dzień roboczy.",
    errPto: "W każdym zakresie urlopu data początkowa nie może być po końcowej.",
    warnLongUrl: "Ten link jest bardzo długi. Slack i część aplikacji może go uciąć. Użyj mniej zakresów urlopu.",
    footerJoke: "To nie HR. To żart. Nie wysyłaj tego osobom, które nie prosiły o numer.",
    zoneGroupDetected: "Wykryta",
    zoneGroupEurope: "Europa",
    zoneGroupAmericas: "Ameryka",
    zoneGroupAsia: "Azja",
    zoneGroupOther: "Inne",
    checking: "Sprawdzamy, czy nadal należysz do firmy…",
    passed: "Zaliczone",
    soulSold: "Dusza sprzedana",
    praiseOnClock: "Jest {time} w strefie {zone}. Oficjalne godziny pracy. Przynajmniej tym razem otworzyłeś to na koszt firmy.",
    roastBefore: "Otworzyłeś to poza godzinami pracy. Nie powinieneś teraz pracować, niewolniku korporacji.",
    roastAfter: "Otworzyłeś to poza godzinami pracy. Nie powinieneś teraz pracować, niewolniku korporacji.",
    roastOffDay: "{day}. To nie jest dzień pracy. A i tak otworzyłeś, niewolniku korporacji.",
    roastPto: "Urlop do {until}. Jesteś wolny. I tak otworzyłeś służbowego linka, niewolniku korporacji.",
    errBroken: "Ten link jest popsuty. Poproś osobę, która go wysłała, o nowy.",
    errVersion: "Ten link wymaga nowszej wersji strony.",
    backToGenerator: "Wygeneruj nowy link",
  },
};

const LOCALES = { en: "en-GB", pl: "pl-PL" };
const SUPPORTED_LANGS = ["en", "pl"];

let currentLang = "en";

function detectLang() {
  const nav = String(navigator.language || "en").toLowerCase();
  if (nav.startsWith("pl")) return "pl";
  return "en";
}

function getLang() {
  return currentLang;
}

function setLang(lang) {
  currentLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";
  document.documentElement.lang = currentLang;
  return currentLang;
}

function localeFor(lang = currentLang) {
  return LOCALES[lang] || LOCALES.en;
}

function t(key, vars = {}, lang = currentLang) {
  const table = STRINGS[lang] || STRINGS.en;
  const template = table[key] ?? STRINGS.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] == null ? "" : String(vars[name])
  );
}

function applyDomI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder));
  });
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

function personalize(name, body) {
  const trimmed = (name || "").trim();
  if (!trimmed) return body;
  return `${trimmed}. ${body}`;
}

function verdictMessage(payload, result, formatUntil, options = {}) {
  const vars = {
    time: result.time,
    zone: payload.tz.split("/").pop().replace(/_/g, " "),
    day: t(`dayFull${result.weekday}`),
    until: result.ptoUntil && formatUntil ? formatUntil(result.ptoUntil) : result.ptoUntil || "",
  };
  const keys = {
    "on-the-clock": "praiseOnClock",
    "before-hours": "roastBefore",
    "after-hours": "roastAfter",
    "off-day": "roastOffDay",
    pto: "roastPto",
  };
  return personalize(options.skipName ? "" : payload.n, t(keys[result.reason] || "errBroken", vars));
}
