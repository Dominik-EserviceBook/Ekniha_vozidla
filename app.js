// ====== NASTAVENIA (tu si vieš doplniť ďalšie termíny) ======
const DATA = {
  stkEk: "2028-02-06",
  oilLast: "2026-02-07",
  oilIntervalMonths: 5,

  // voliteľné (keď budeš chcieť)
  pzp: null,        // napr. "2026-09-30"
  vignette: null    // napr. "2026-12-31"
};

// ====== pomocné funkcie ======
function parseDateISO(iso){
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d, 12, 0, 0); // 12:00 aby neblblo časové pásmo
}
function formatISO(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function addMonths(date, months){
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);

  // korekcia pre mesiace s menším počtom dní
  if (d.getDate() < day) d.setDate(0);
  return d;
}
function daysBetween(a,b){
  const ms = (b - a);
  return Math.ceil(ms / (1000*60*60*24));
}
function setStatus(el, daysLeft){
  el.classList.remove("ok","warn","bad");
  // hranice si môžeš upraviť
  if (daysLeft < 0) el.classList.add("bad");
  else if (daysLeft <= 30) el.classList.add("warn");
  else el.classList.add("ok");
}
function leftText(daysLeft){
  if (daysLeft < 0) return `(${Math.abs(daysLeft)} dní po termíne)`;
  return `(ostáva ${daysLeft} dní)`;
}

// ====== výpočty ======
(function init(){
  const today = new Date();
  today.setHours(12,0,0,0);

  // STK/EK
  const stkEl = document.getElementById("stkEkDate");
  const stkLeftEl = document.getElementById("stkEkLeft");
  const stkStatusBox = document.getElementById("statusStkEk");
  const stkStatusText = document.getElementById("statusStkEkText");

  const stkDate = parseDateISO(DATA.stkEk);
  const stkLeft = daysBetween(today, stkDate);
  stkEl.textContent = DATA.stkEk;
  stkLeftEl.textContent = " " + leftText(stkLeft);
  setStatus(stkStatusBox, stkLeft);
  stkStatusText.textContent = `${DATA.stkEk} ${leftText(stkLeft)}`;

  // OLEJ
  const oilLastEl = document.getElementById("oilLastDate");
  const oilIntervalEl = document.getElementById("oilIntervalMonths");
  const oilNextEl = document.getElementById("oilNextDate");
  const oilLeftEl = document.getElementById("oilLeft");

  const oilStatusBox = document.getElementById("statusOil");
  const oilStatusText = document.getElementById("statusOilText");

  const oilLast = parseDateISO(DATA.oilLast);
  const oilNext = addMonths(oilLast, DATA.oilIntervalMonths);
  const oilLeft = daysBetween(today, oilNext);

  oilLastEl.textContent = DATA.oilLast;
  oilIntervalEl.textContent = String(DATA.oilIntervalMonths);
  oilNextEl.textContent = formatISO(oilNext);
  oilLeftEl.textContent = " " + leftText(oilLeft);

  setStatus(oilStatusBox, oilLeft);
  oilStatusText.textContent = `${formatISO(oilNext)} ${leftText(oilLeft)}`;

  // Kopírovať link
  const btnCopy = document.getElementById("btnCopyLink");
  btnCopy?.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(location.href);
      btnCopy.textContent = "Skopírované ✅";
      setTimeout(()=> btnCopy.textContent = "Kopírovať link", 1200);
    }catch(e){
      alert("Nepodarilo sa skopírovať link. Skús dlhé podržanie na adrese v prehliadači.");
    }
  });

  // Voliteľné: PZP / známka (ak doplníš dátumy)
  applyOptional("statusPzp", DATA.pzp, today);
  applyOptional("statusVignette", DATA.vignette, today);
})();

function applyOptional(id, iso, today){
  const box = document.getElementById(id);
  if (!box) return;
  const valueEl = box.querySelector(".status__value");
  if (!iso){
    box.classList.remove("ok","warn","bad");
    valueEl.textContent = "Doplň dátum v app.js";
    return;
  }
  const d = parseDateISO(iso);
  const left = daysBetween(today, d);
  setStatus(box, left);
  valueEl.textContent = `${iso} ${leftText(left)}`;
}
