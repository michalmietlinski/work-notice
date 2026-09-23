const SITE_BASE = "https://michalmietlinski.github.io/work-notice/";

function shareBase() {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return `${window.location.origin}/`;
  }
  return SITE_BASE;
}

// Tekst nad pieczątką na stronie negatywnej. {name} = imię z generatora.
const ROAST_NAME = {
  pl: {
    withName: "{name}, pojebało Cię?",
    fallback: "Pojebało Cię?",
  },
  en: {
    withName: "{name}, have you lost your mind?",
    fallback: "Have you lost your mind?",
  },
};

// Dymki na stronie negatywnej. Dopisz kolejne stringi — same się rozłożą.
const ROAST_BUBBLES = {
  pl: [
    "Znajdź se życie",
    "Daj sobie medal z ziemniaka korposzczurze",
    "Korpo dba o Ciebie tak jak Ty o nie?",
	"Na łożu śmierci na pewno będziesz wspominać to sprawdzanie wiadomości z zachwytem",
	"Serio nie masz nic lepszego do roboty?"
  ],
  en: [
    "Go get a life.",
    "Award yourself a potato medal, corporate rat.",
    "The corp cares about you the way you care about it?",
	"You will surely remember this message check with awe on your deathbed",
	"Seriously, nothing better to do than check this message?"
  ],
};

const BUBBLE_SLOTS = [
  { top: "6%", left: "4%", rotate: -8, tail: "down" },
  { top: "46%", right: "3%", rotate: 7, tail: "down" },
  { bottom: "7%", left: "50%", rotate: -4, tail: "up", centerX: true },
  { top: "7%", right: "5%", rotate: 6, tail: "down" },
  { bottom: "20%", left: "4%", rotate: -6, tail: "up" },
  { top: "28%", left: "3%", rotate: 5, tail: "down" },
  { bottom: "18%", right: "5%", rotate: 4, tail: "up" },
  { top: "62%", right: "4%", rotate: -5, tail: "down" },
];

function roastNameLine(name, lang) {
  const copy = ROAST_NAME[lang] || ROAST_NAME.pl;
  const trimmed = (name || "").trim();
  if (!trimmed) return copy.fallback;
  return copy.withName.replace("{name}", trimmed);
}

function roastBubbles(lang) {
  const list = ROAST_BUBBLES[lang] || ROAST_BUBBLES.pl;
  return list.filter((text) => String(text || "").trim());
}
