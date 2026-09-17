const DATA = {
  apertura: [
    "Designación formal del Residente / supervisor por el Ayuntamiento o dependencia",
    "Designación formal del Superintendente por el contratista",
    "Nota de apertura con fecha, datos de partes, personal autorizado, contrato y alcance",
    "Medio definido (electrónico autorizado o convencional) y lugar de resguardo",
    "Acceso efectivo de ambas partes a la bitácora",
    "Apertura en fecha de inicio de trabajos (o desfase documentado)",
    "Una bitácora por obra (no compartir entre contratos)",
    "Copia de documentos de acreditación integrada al expediente"
  ],
  operacion: [
    "Hechos trascendentes asentados el mismo día o dentro del plazo legal",
    "Cada nota identifica Sujeto (emisor/receptor acreditados)",
    "Cada nota registra Tiempo concurrente con el hecho (timestamp en electrónico)",
    "Asunto técnico inequívoco (tramo, eje, nivel, metrado, descripción)",
    "Referencia a planos, laboratorio, estimaciones o cláusulas del contrato",
    "Se evita frases genéricas («se avanza según programa», «todo en orden»)",
    "Suspensiones, reinicios y conceptos extraordinarios documentados",
    "Instrucciones del Residente fundadas y referidas al contrato/proyecto",
    "Contraparte ha validado o controvertido en plazo las notas relevantes",
    "No hay acumulación de notas al final del periodo"
  ],
  cierre: [
    "Todas las notas abiertas fueron respondidas o cerradas formalmente",
    "Existe asiento de cierre que certifica terminación de trabajos",
    "El asiento de cierre declara inexistencia de notas pendientes",
    "El cierre es anterior al acta de finiquito",
    "Bitácora integrada al expediente de la obra (físico y/o exportación electrónica)",
    "Resguardo conforme a normativa de archivo aplicable",
    "Copia disponible para OIC / ente de fiscalización si la requieren"
  ],
  vicios: [
    { t: "1. Extemporaneidad", d: "Registro días o semanas después del hecho. El timestamp lo acredita. Efecto: invalidez probatoria y observación en Cuenta Pública." },
    { t: "2. Ambigüedad / frases genéricas", d: "«Se avanza según programa». Efecto: no se acredita ejecución real; presunción de pago en exceso." },
    { t: "3. Falta de acreditación", d: "Firma de personal no facultado. Efecto: nulidad de instrucciones o acuerdos." },
    { t: "4. Omisión de anticipos / descalces", d: "Inicio sin registro de anticipo. Efecto: presunción de irregularidad en amortizaciones." },
    { t: "5. Descalce de calidad", d: "Autorización sin reportes de laboratorio. Efecto: duda sobre especificaciones; posible reintegro." },
    { t: "6. Cierre inexistente o defectuoso", d: "Finiquito con bitácora abierta. Efecto: vicio formal detectable y sanción administrativa." }
  ]
};
const LEVELS = [
  { min: 0, max: 39, label: "Crítico", color: "#B91C1C", risk: "Alto riesgo de observación y responsabilidad" },
  { min: 40, max: 59, label: "En riesgo", color: "#D97706", risk: "Brechas relevantes ante fiscalización" },
  { min: 60, max: 79, label: "Aceptable", color: "#C9A227", risk: "Base sólida; cerrar huecos pendientes" },
  { min: 80, max: 100, label: "Óptimo", color: "#3D7A5A", risk: "Blindaje preventivo adecuado" }
];
const STORAGE_KEY = "bitacora_checklist_v4";
const EMPTY_META = { obra: "", contrato: "", supervisor: "", residente: "", superintendente: "", auditor: "" };
function defaultState() { return { meta: { ...EMPTY_META }, apertura: {}, operacion: {}, cierre: {}, baselinePct: 0 }; }
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!raw) return defaultState();
    if (!raw.meta) raw.meta = { ...EMPTY_META };
    ["obra","contrato","supervisor","residente","superintendente","auditor"].forEach(k => { if (typeof raw.meta[k] !== "string") raw.meta[k] = ""; });
    ["apertura","operacion","cierre"].forEach(s => { if (!raw[s] || typeof raw[s] !== "object") raw[s] = {}; });
    return raw;
  } catch (e) { return defaultState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
let state = loadState();
function fillMetaForm() {
  const m = state.meta || EMPTY_META;
  document.querySelectorAll("[data-meta]").forEach(inp => { inp.value = m[inp.dataset.meta] || ""; });
  updateHeaderMeta();
}
function updateHeaderMeta() {
  const m = state.meta || {};
  const sub = document.getElementById("headerSub");
  if (!sub) return;
  if (m.obra || m.contrato) {
    const parts = [];
    if (m.obra) parts.push(m.obra);
    if (m.contrato) parts.push("Contrato " + m.contrato);
    sub.textContent = parts.join(" · ");
  } else sub.textContent = "Control preventivo · Obra pública municipal";
}
function getSectionStats(sec) {
  const items = DATA[sec] || [];
  const checked = state[sec] || {};
  const done = items.filter((_, i) => checked[i]).length;
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
}
function getGlobalStats() {
  let done = 0, total = 0;
  ["apertura","operacion","cierre"].forEach(sec => { const s = getSectionStats(sec); done += s.done; total += s.total; });
  const pct = total ? Math.round((done / total) * 100) : 0;
  const level = LEVELS.find(l => pct >= l.min && pct <= l.max) || LEVELS[0];
  return { done, total, pct, level };
}
function goTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.panel === id));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === id));
}
function renderHero() {
  const g = getGlobalStats();
  const heroPct = document.getElementById("heroPct");
  const heroLevel = document.getElementById("heroLevel");
  const heroRisk = document.getElementById("heroRisk");
  const globalProgress = document.getElementById("globalProgress");
  if (heroPct) heroPct.textContent = g.pct + "%";
  if (globalProgress) globalProgress.textContent = g.pct + "%";
  if (heroLevel) { heroLevel.textContent = g.level.label; heroLevel.style.color = g.level.color; heroLevel.style.borderColor = g.level.color; }
  if (heroRisk) heroRisk.textContent = g.done + " de " + g.total + " reactivos · " + g.level.risk;
  const titles = { apertura: "Apertura", operacion: "Operación", cierre: "Cierre" };
  const box = document.getElementById("secCards");
  if (box) {
    box.innerHTML = ["apertura","operacion","cierre"].map(sec => {
      const s = getSectionStats(sec);
      return '<div class="sec-card" data-goto="' + sec + '"><div class="sec-name"><span>' + titles[sec] + '</span><span>' + s.done + '/' + s.total + '</span></div><div class="bar"><i style="width:' + s.pct + '%"></i></div></div>';
    }).join("");
  }
}
function renderList(section) {
  const container = document.getElementById("list-" + section);
  if (!container) return;
  if (section === "vicios") {
    container.innerHTML = DATA.vicios.map(v => '<div class="vicio-card"><h3>' + v.t + '</h3><p>' + v.d + '</p></div>').join("");
    return;
  }
  const checked = state[section] || {};
  container.innerHTML = DATA[section].map((text, i) => {
    const on = !!checked[i];
    return '<div class="check-item' + (on ? ' done' : '') + '"><span class="item-num">' + (i + 1) + '</span><label><input type="checkbox" data-sec="' + section + '" data-idx="' + i + '"' + (on ? ' checked' : '') + '> ' + text + '</label></div>';
  }).join("");
}
function updateBadges() {
  ["apertura","operacion","cierre"].forEach(sec => {
    const s = getSectionStats(sec);
    const badge = document.getElementById("badge-" + sec);
    if (badge) badge.textContent = s.done + "/" + s.total;
  });
  renderHero();
}
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}
document.querySelectorAll("[data-meta]").forEach(inp => {
  const persist = () => { state.meta[inp.dataset.meta] = inp.value; saveState(); updateHeaderMeta(); };
  inp.addEventListener("input", persist);
  inp.addEventListener("change", persist);
});
document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => goTab(tab.dataset.panel)));
document.getElementById("secCards").addEventListener("click", e => {
  const card = e.target.closest("[data-goto]");
  if (card) goTab(card.dataset.goto);
});
document.querySelector("main").addEventListener("change", e => {
  const box = e.target.closest("input[type=checkbox][data-sec]");
  if (!box) return;
  const sec = box.dataset.sec;
  const idx = Number(box.dataset.idx);
  if (!state[sec]) state[sec] = {};
  state[sec][idx] = box.checked;
  saveState();
  const item = box.closest(".check-item");
  if (item) item.classList.toggle("done", box.checked);
  updateBadges();
});
document.getElementById("btnReset").addEventListener("click", () => {
  if (!confirm("¿Reiniciar el checklist? Se conservan los datos de la obra.")) return;
  const keepMeta = state.meta ? { ...state.meta } : { ...EMPTY_META };
  state = { meta: keepMeta, apertura: {}, operacion: {}, cierre: {}, baselinePct: 0 };
  saveState();
  ["apertura","operacion","cierre"].forEach(renderList);
  updateBadges();
  showToast("Checklist reiniciado");
});
document.getElementById("btnExport").addEventListener("click", () => {
  const g = getGlobalStats();
  const m = state.meta || EMPTY_META;
  const stamp = new Date().toLocaleString("es-MX");
  document.title = "Checklist Bitácora CATU · " + (m.obra || m.contrato || "sin obra") + " · " + g.pct + "%";
  const foot = document.querySelector(".print-foot");
  if (foot) foot.textContent = "CATU · centro.catu@gmail.com · " + stamp + " · Cumplimiento " + g.pct + "% (" + g.done + "/" + g.total + "). No sustituye una auditoría formal.";
  showToast("Abre «Guardar como PDF» y activa Fondos");
  setTimeout(() => window.print(), 250);
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
fillMetaForm();
["apertura","operacion","cierre","vicios"].forEach(renderList);
updateBadges();
