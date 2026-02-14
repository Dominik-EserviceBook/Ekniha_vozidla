// Nastav si tu dátumy:
const DATA = {
  stkDate: "2026-09-10",
  oilNextByDate: "2026-05-01",
  timeline: [
    { date: "2026-02-01", text: "Výmena oleja + filter" },
    { date: "2025-11-12", text: "Výmena brzdovej kvapaliny" },
  ]
};

function daysLeft(toDateStr) {
  const now = new Date();
  const to = new Date(toDateStr + "T00:00:00");
  const ms = to - now;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function setHealth(idLeft, idDate, label, dateStr) {
  const left = daysLeft(dateStr);
  document.getElementById(idLeft).textContent =
    left >= 0 ? `${left} dní` : `${Math.abs(left)} dní po termíne`;
  document.getElementById(idDate).textContent = `${label}: ${dateStr}`;
}

setHealth("stkLeft", "stkDate", "STK do", DATA.stkDate);
setHealth("oilLeft", "oilDate", "Olej do", DATA.oilNextByDate);

const timelineEl = document.getElementById("timeline");
DATA.timeline
  .slice()
  .sort((a,b) => (a.date < b.date ? 1 : -1))
  .forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="date">${item.date}</span> – ${item.text}`;
    timelineEl.appendChild(li);
  });
