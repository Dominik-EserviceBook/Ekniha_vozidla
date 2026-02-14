const DATA = {
  vehicle: {
    owner: "Dominik Timanik",
    title: "Seat Leon Sportstourer (2022)",
    subtitle: "Verejná servisná kniha • QR prístup",
    note: "Kontaktuj majiteľa kvôli servisnej histórii alebo otázkam k vozidlu.",
    photo: "assets/auto.jpg",
    phone: "+421949853512",
    email: "dominik.timanik@live.com",
    vin: "VSSZZZKLZNR038116"
  },

  // STK / EK platná do:
  stkDate: "2028-02-06",

  // OLEJ: bez “ďalšieho dátumu”.
  // Dopĺňaš len dátum POSLEDNEJ výmeny + interval v mesiacoch.
  oil: {
    lastChange: "2026-02-07",     // napr. "2026-02-01" (keď budeš vedieť)
    intervalMonths: 5  // napr. 12 mesiacov
  },

  // Udalosti (časová os) – upravíš si neskôr
  timeline: [
    { date: "2026-02-07", text: "Výmena oleja + filter" },
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
  const leftEl = document.getElementById(idLeft);
  const dateEl = document.getElementById(idDate);

  if (!leftEl || !dateEl) return;

  if (!dateStr) {
    leftEl.textContent = "Doplniť";
    dateEl.textContent = `${label}: –`;
    return;
  }

  const left = daysLeft(dateStr);
  leftEl.textContent = left >= 0 ? `${left} dní` : `${Math.abs(left)} dní po termíne`;
  dateEl.textContent = `${label}: ${dateStr}`;
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // ochrana pre prípady ako 31. → mesiac bez 31 dní
  if (d.getDate() !== day) d.setDate(0);

  return d.toISOString().slice(0, 10);
}

function ensureVinLine(text) {
  // Ak v index.html existuje #carVin, použijeme ho.
  let el = document.getElementById("carVin");
  if (el) {
    el.textContent = text;
    return;
  }

  // Inak ho dynamicky vložíme pod #carSubtitle
  const sub = document.getElementById("carSubtitle");
  if (!sub) return;

  el = document.createElement("div");
  el.id = "carVin";
  el.className = "muted small";
  el.style.marginTop = "4px";
  el.textContent = text;

  sub.insertAdjacentElement("afterend", el);
}

// Health status
setHealth("stkLeft", "stkDate", "STK/EK do", DATA.stkDate);

// Olej – počítame z poslednej výmeny + interval, ale len ak je lastChange vyplnený
let oilNext = "";
if (DATA.oil?.lastChange) {
  oilNext = addMonths(DATA.oil.lastChange, Number(DATA.oil.intervalMonths || 12));
}
setHealth("oilLeft", "oilDate", "Olej do", oilNext);

// Úvodná karta vozidla (hero)
const titleEl = document.getElementById("carTitle");
const subEl = document.getElementById("carSubtitle");
const noteEl = document.getElementById("carNote");
const imgEl = document.getElementById("carPhoto");

if (titleEl) titleEl.textContent = DATA.vehicle.title;
if (subEl) subEl.textContent = `${DATA.vehicle.owner} • ${DATA.vehicle.subtitle}`;
if (noteEl) noteEl.textContent = DATA.vehicle.note;

if (imgEl) imgEl.src = DATA.vehicle.photo;

// VIN (zobrazí sa v hero karte)
ensureVinLine(`VIN: ${DATA.vehicle.vin}`);

// Kontaktné tlačidlá
const phoneClean = (DATA.vehicle.phone || "").replace(/\s+/g, "");
const btnCall = document.getElementById("btnCall");
const btnSms = document.getElementById("btnSms");
const btnMail = document.getElementById("btnMail");

if (btnCall) btnCall.href = `tel:${phoneClean}`;
if (btnSms) btnSms.href = `sms:${phoneClean}`;
if (btnMail) btnMail.href = `mailto:${DATA.vehicle.email}`;

// Timeline
const timelineEl = document.getElementById("timeline");
if (timelineEl) {
  timelineEl.innerHTML = "";
  DATA.timeline
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="date">${item.date}</span> – ${item.text}`;
      timelineEl.appendChild(li);
    });
}
