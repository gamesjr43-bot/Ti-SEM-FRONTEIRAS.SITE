// ===================== NAVEGAÇÃO PRINCIPAL =====================
const ROUTES = ["inicio", "mundodev", "globalit"];

function navegarPara(rota) {
  if (!ROUTES.includes(rota)) rota = "inicio";

  document.querySelectorAll(".view").forEach((el) => {
    el.hidden = el.id !== `view-${rota}`;
  });
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.route === rota);
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function rotaAtual() {
  return (location.hash || "#inicio").replace("#", "");
}

window.addEventListener("hashchange", () => navegarPara(rotaAtual()));

// ===================== HELPERS =====================
function criarOpcao(valor, texto) {
  const opt = document.createElement("option");
  opt.value = valor;
  opt.textContent = texto;
  return opt;
}

function popular(selectEl, valores, primeiraOpcao) {
  selectEl.innerHTML = "";
  selectEl.appendChild(criarOpcao("__todos__", primeiraOpcao));
  valores.forEach((v) => selectEl.appendChild(criarOpcao(v, v)));
}

function renderBarChart(container, itens, { labelKey, valueKey, max, formatValue }) {
  container.innerHTML = "";
  itens.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = item[labelKey];
    label.title = item[labelKey];

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    const pct = Math.max(4, Math.round((item[valueKey] / max) * 100));
    fill.style.width = pct + "%";
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = formatValue ? formatValue(item[valueKey]) : item[valueKey];

    row.append(label, track, value);
    container.appendChild(row);
  });
}

// ===================== INÍCIO =====================
function iniciarPaginaInicio() {
  document.getElementById("stat-paises").textContent = PAISES.length;
  document.getElementById("stat-vagas").textContent = VAGAS.length;
  document.getElementById("stat-tech").textContent = RADAR_TECNOLOGIAS.length;
}

// ===================== MUNDODEV =====================
function iniciarMundoDev() {
  const filtroRegiao = document.getElementById("filtro-regiao");
  const selectPais = document.getElementById("select-pais");
  const chartEl = document.getElementById("chart-paises");
  const cardEl = document.getElementById("country-card");

  const regioes = [...new Set(PAISES.map((p) => p.regiao))].sort();
  popular(filtroRegiao, regioes, "Todas as regiões");

  function paisesFiltrados() {
    const regiao = filtroRegiao.value;
    return regiao === "__todos__" ? PAISES : PAISES.filter((p) => p.regiao === regiao);
  }

  function renderChart() {
    const lista = [...paisesFiltrados()].sort((a, b) => a.salario - b.salario);
    const max = Math.max(...PAISES.map((p) => p.salario));
    renderBarChart(chartEl, lista, {
      labelKey: "pais",
      valueKey: "salario",
      max,
      formatValue: (v) => `US$ ${v.toLocaleString("pt-BR")}`,
    });
  }

  function renderSelectPais() {
    const atual = selectPais.value;
    const lista = paisesFiltrados();
    selectPais.innerHTML = "";
    lista.forEach((p) => selectPais.appendChild(criarOpcao(p.pais, p.pais)));
    const aindaExiste = lista.some((p) => p.pais === atual);
    selectPais.value = aindaExiste ? atual : lista[0]?.pais;
    renderCard();
  }

  function renderCard() {
    const pais = PAISES.find((p) => p.pais === selectPais.value);
    if (!pais) { cardEl.innerHTML = ""; return; }
    cardEl.innerHTML = `
      <span class="stamp-flag">${pais.bandeira}</span>
      <h3 class="stamp-name">${pais.pais}</h3>
      <div class="stamp-metrics">
        <div><span class="stamp-metric-num">US$ ${pais.custoVida.toLocaleString("pt-BR")}</span><span class="stamp-metric-label">Custo de vida / mês</span></div>
        <div><span class="stamp-metric-num">US$ ${pais.salario.toLocaleString("pt-BR")}</span><span class="stamp-metric-label">Salário médio TI / mês</span></div>
        <div><span class="stamp-metric-num">${pais.demanda}</span><span class="stamp-metric-label">Demanda em TI</span></div>
      </div>
      <p class="stamp-detail"><strong>Idioma:</strong> ${pais.idioma}</p>
      <p class="stamp-detail"><strong>Visto recomendado:</strong> ${pais.visto} · Dificuldade: ${pais.dificuldadeVisto}</p>
      <p class="stamp-summary">${pais.resumo}</p>
    `;
  }

  filtroRegiao.addEventListener("change", () => { renderChart(); renderSelectPais(); });
  selectPais.addEventListener("change", renderCard);

  renderChart();
  renderSelectPais();
}

// ===================== GLOBALIT JOBS =====================
function iniciarGlobalIT() {
  // --- Sub-navegação ---
  const subtabs = document.querySelectorAll(".subtab");
  const subviews = { vagas: document.getElementById("sub-vagas"), radar: document.getElementById("sub-radar"), trilhas: document.getElementById("sub-trilhas") };

  subtabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const alvo = btn.dataset.subview;
      subtabs.forEach((b) => b.classList.toggle("is-active", b === btn));
      Object.entries(subviews).forEach(([nome, el]) => { el.hidden = nome !== alvo; });
    });
  });

  // --- Vagas ---
  const filtroPais = document.getElementById("filtro-pais");
  const filtroSenioridade = document.getElementById("filtro-senioridade");
  const filtroModalidade = document.getElementById("filtro-modalidade");
  const listaEl = document.getElementById("vagas-list");
  const countEl = document.getElementById("vagas-count");

  popular(filtroPais, [...new Set(VAGAS.map((v) => v.pais))].sort(), "Todos os países");
  popular(filtroSenioridade, [...new Set(VAGAS.map((v) => v.senioridade))], "Todas as senioridades");
  popular(filtroModalidade, [...new Set(VAGAS.map((v) => v.modalidade))], "Todas as modalidades");

  function renderVagas() {
    let lista = VAGAS;
    if (filtroPais.value !== "__todos__") lista = lista.filter((v) => v.pais === filtroPais.value);
    if (filtroSenioridade.value !== "__todos__") lista = lista.filter((v) => v.senioridade === filtroSenioridade.value);
    if (filtroModalidade.value !== "__todos__") lista = lista.filter((v) => v.modalidade === filtroModalidade.value);

    countEl.textContent = `${lista.length} vaga(s) encontrada(s)`;
    listaEl.innerHTML = lista.map((v) => `
      <article class="ticket">
        <div>
          <h3 class="ticket-title">${v.titulo}</h3>
          <p class="ticket-company">${v.empresa} · ${v.pais}</p>
        </div>
        <div class="ticket-salary">US$ ${v.salario}/mês</div>
        <div class="ticket-meta">
          <span class="chip">${v.modalidade}</span>
          <span class="chip">${v.senioridade}</span>
          ${v.stack.map((s) => `<span class="chip chip-stack">${s}</span>`).join("")}
        </div>
      </article>
    `).join("") || `<p class="muted">Nenhuma vaga encontrada com esses filtros.</p>`;
  }

  [filtroPais, filtroSenioridade, filtroModalidade].forEach((el) => el.addEventListener("change", renderVagas));
  renderVagas();

  // --- Radar de tecnologias ---
  const radarEl = document.getElementById("chart-radar");
  const radarOrdenado = [...RADAR_TECNOLOGIAS].sort((a, b) => b.demanda - a.demanda);
  renderBarChart(radarEl, radarOrdenado, {
    labelKey: "tecnologia",
    valueKey: "demanda",
    max: 100,
    formatValue: (v) => v,
  });

  // --- Trilhas de qualificação ---
  const trilhasEl = document.getElementById("trilhas-list");
  trilhasEl.innerHTML = TRILHAS_QUALIFICACAO.map((t, i) => `
    <div class="accordion-item" data-index="${i}">
      <button class="accordion-trigger" type="button">
        <span>${t.area} — ${t.competencia}</span>
        <span class="chevron">▾</span>
      </button>
      <div class="accordion-panel">
        <ul class="cert-list">
          ${t.certificacoes.map((c, j) => `
            <li><label><input type="checkbox" id="cert-${i}-${j}"> ${c}</label></li>
          `).join("")}
        </ul>
      </div>
    </div>
  `).join("");

  trilhasEl.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      trigger.closest(".accordion-item").classList.toggle("is-open");
    });
  });
}

// ===================== BOOT =====================
document.addEventListener("DOMContentLoaded", async () => {
  // Aguarda a tentativa de leitura do Firestore (firebase-data.js) antes de
  // renderizar. Se o Firestore não responder, a Promise resolve mesmo assim
  // e os dados locais de data.js seguem valendo.
  if (window.dadosProntos) await window.dadosProntos;

  iniciarPaginaInicio();
  iniciarMundoDev();
  iniciarGlobalIT();
  navegarPara(rotaAtual());
});
