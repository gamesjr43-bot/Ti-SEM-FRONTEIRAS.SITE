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
  const globoVagasEl = document.getElementById("globo-vagas");

  popular(filtroPais, [...new Set(VAGAS.map((v) => v.pais))].sort(), "Todos os países");
  popular(filtroSenioridade, [...new Set(VAGAS.map((v) => v.senioridade))], "Todas as senioridades");
  popular(filtroModalidade, [...new Set(VAGAS.map((v) => v.modalidade))], "Todas as modalidades");

  function porSenioridadeEModalidade(lista) {
    if (filtroSenioridade.value !== "__todos__") lista = lista.filter((v) => v.senioridade === filtroSenioridade.value);
    if (filtroModalidade.value !== "__todos__") lista = lista.filter((v) => v.modalidade === filtroModalidade.value);
    return lista;
  }

  const globoVagas = iniciarGloboVagas(globoVagasEl, (pais) => {
    filtroPais.value = pais;
    renderVagas();
  });

  function renderVagas() {
    let lista = porSenioridadeEModalidade(VAGAS);
    // O globo mostra todos os países (ignorando o filtro de país) para que
    // seja sempre possível clicar em outro ponto e trocar de país.
    globoVagas.atualizar(lista);
    if (filtroPais.value !== "__todos__") lista = lista.filter((v) => v.pais === filtroPais.value);

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
