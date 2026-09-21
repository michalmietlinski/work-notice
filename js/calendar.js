function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function orderedRange(a, b) {
  return a <= b ? [a, b] : [b, a];
}

function inIsoRange(iso, from, to) {
  const [start, end] = orderedRange(from, to);
  return iso >= start && iso <= end;
}

function monthTitle(year, month, locale) {
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(year, month, 1)
  );
}

function monthCells(year, month) {
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - mondayOffset);
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    cells.push({
      iso: toIsoDate(date),
      day: date.getDate(),
      outside: date.getMonth() !== month,
    });
  }
  return cells;
}

function renderMonthCalendar(root, options) {
  const {
    year,
    month,
    locale,
    weekdayLabels,
    pendingStart,
    hoverDate,
    ranges,
    todayIso,
    onPrev,
    onNext,
    onSelect,
    onHover,
    labels,
  } = options;

  root.replaceChildren();
  root.classList.add("calendar");

  const nav = document.createElement("div");
  nav.className = "cal-nav";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "cal-nav-btn";
  prev.setAttribute("aria-label", labels.prev);
  prev.textContent = "‹";
  prev.addEventListener("click", onPrev);

  const title = document.createElement("p");
  title.className = "cal-title";
  title.textContent = monthTitle(year, month, locale);

  const next = document.createElement("button");
  next.type = "button";
  next.className = "cal-nav-btn";
  next.setAttribute("aria-label", labels.next);
  next.textContent = "›";
  next.addEventListener("click", onNext);

  nav.append(prev, title, next);

  const grid = document.createElement("div");
  grid.className = "cal-grid";
  grid.setAttribute("role", "grid");

  for (const label of weekdayLabels) {
    const cell = document.createElement("div");
    cell.className = "cal-weekday";
    cell.textContent = label;
    grid.append(cell);
  }

  const preview = pendingStart && hoverDate ? orderedRange(pendingStart, hoverDate) : null;

  for (const cell of monthCells(year, month)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-day";
    btn.textContent = String(cell.day);
    btn.dataset.iso = cell.iso;
    if (cell.outside) btn.classList.add("outside");
    if (cell.iso === todayIso) btn.classList.add("today");
    if (ranges.some((range) => inIsoRange(cell.iso, range.from, range.to))) {
      btn.classList.add("booked");
    }
    if (preview && inIsoRange(cell.iso, preview[0], preview[1])) {
      btn.classList.add("pending");
    }
    if (cell.iso === pendingStart) btn.classList.add("start");
    if (preview && cell.iso === preview[0]) btn.classList.add("start");
    if (preview && cell.iso === preview[1]) btn.classList.add("end");
    btn.addEventListener("click", () => onSelect(cell.iso));
    btn.addEventListener("mouseenter", () => onHover(cell.iso));
    grid.append(btn);
  }

  root.append(nav, grid);
}
