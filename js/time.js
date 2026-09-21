const WEEKDAY_FROM_SHORT = {
  Sun: 7,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getZonedParts(date, timeZone) {
  const parts = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)) {
    if (part.type !== "literal") parts[part.type] = part.value;
  }
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${hour}:${parts.minute}`,
    weekday: WEEKDAY_FROM_SHORT[parts.weekday],
  };
}

function formatDisplayDate(isoDate, locale) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12));
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(utcNoon);
}

function matchingPtoRange(isoDate, ranges) {
  for (const [from, to] of ranges || []) {
    if (isoDate >= from && isoDate <= to) return [from, to];
  }
  return null;
}

function verdict(payload, now = new Date()) {
  const zoned = getZonedParts(now, payload.tz);
  const ptoRange = matchingPtoRange(zoned.date, payload.p);

  if (ptoRange) {
    return {
      outcome: "roast",
      reason: "pto",
      ...zoned,
      ptoUntil: ptoRange[1],
    };
  }
  if (!payload.d.includes(zoned.weekday)) {
    return {
      outcome: "roast",
      reason: "off-day",
      ...zoned,
      ptoUntil: null,
    };
  }
  if (zoned.time < payload.s) {
    return {
      outcome: "roast",
      reason: "before-hours",
      ...zoned,
      ptoUntil: null,
    };
  }
  if (zoned.time >= payload.e) {
    return {
      outcome: "roast",
      reason: "after-hours",
      ...zoned,
      ptoUntil: null,
    };
  }
  return {
    outcome: "praise",
    reason: "on-the-clock",
    ...zoned,
    ptoUntil: null,
  };
}
