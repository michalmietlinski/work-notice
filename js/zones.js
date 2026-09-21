const ZONE_GROUPS = [
  {
    id: "europe",
    zones: [
      "Europe/Amsterdam",
      "Europe/Athens",
      "Europe/Berlin",
      "Europe/Brussels",
      "Europe/Bucharest",
      "Europe/Budapest",
      "Europe/Copenhagen",
      "Europe/Dublin",
      "Europe/Helsinki",
      "Europe/Kyiv",
      "Europe/Lisbon",
      "Europe/London",
      "Europe/Madrid",
      "Europe/Oslo",
      "Europe/Paris",
      "Europe/Prague",
      "Europe/Rome",
      "Europe/Stockholm",
      "Europe/Vienna",
      "Europe/Warsaw",
      "Europe/Zurich",
    ],
  },
  {
    id: "americas",
    zones: [
      "America/Argentina/Buenos_Aires",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Mexico_City",
      "America/New_York",
      "America/Sao_Paulo",
      "America/Toronto",
      "America/Vancouver",
    ],
  },
  {
    id: "asia",
    zones: [
      "Asia/Bangkok",
      "Asia/Dubai",
      "Asia/Hong_Kong",
      "Asia/Jakarta",
      "Asia/Kolkata",
      "Asia/Seoul",
      "Asia/Shanghai",
      "Asia/Singapore",
      "Asia/Tokyo",
    ],
  },
  {
    id: "other",
    zones: [
      "Africa/Cairo",
      "Africa/Johannesburg",
      "Australia/Melbourne",
      "Australia/Sydney",
      "Pacific/Auckland",
      "UTC",
    ],
  },
];

const GROUP_I18N = {
  europe: "zoneGroupEurope",
  americas: "zoneGroupAmericas",
  asia: "zoneGroupAsia",
  other: "zoneGroupOther",
};

function isValidZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function getBrowserZone() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return zone && isValidZone(zone) ? zone : "UTC";
  } catch {
    return "UTC";
  }
}

function allKnownZones() {
  return new Set(ZONE_GROUPS.flatMap((group) => group.zones));
}

function formatZoneLabel(timeZone, locale) {
  const nice = timeZone.replace(/_/g, " ");
  try {
    const tzName = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;
    return tzName ? `${nice} (${tzName})` : nice;
  } catch {
    return nice;
  }
}

function populateZoneSelect(select, selected, t, locale) {
  const known = allKnownZones();
  const current = selected || getBrowserZone();
  select.replaceChildren();

  if (!known.has(current)) {
    const group = document.createElement("optgroup");
    group.label = t("zoneGroupDetected");
    group.append(optionFor(current, locale));
    select.append(group);
  }

  for (const groupDef of ZONE_GROUPS) {
    const group = document.createElement("optgroup");
    group.label = t(GROUP_I18N[groupDef.id]);
    for (const zone of groupDef.zones) {
      if (isValidZone(zone)) group.append(optionFor(zone, locale));
    }
    if (group.childElementCount) select.append(group);
  }

  select.value = current;
  if (select.value !== current) {
    select.prepend(optionFor(current, locale));
    select.value = current;
  }
}

function optionFor(timeZone, locale) {
  const option = document.createElement("option");
  option.value = timeZone;
  option.textContent = formatZoneLabel(timeZone, locale);
  return option;
}
