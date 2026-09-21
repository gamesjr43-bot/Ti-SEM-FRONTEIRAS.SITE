// ===================== MUNDODEV =====================
function iniciarMundoDev() {
  const filtroRegiao = document.getElementById("filtro-regiao");
  const selectPais = document.getElementById("select-pais");
  const chartEl = document.getElementById("chart-paises");
  const cardEl = document.getElementById("country-card");
  const globoEl = document.getElementById("globo-mundodev");

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
      <span class="stamp-flag">${escapeHtml(pais.bandeira)}</span>
      <h3 class="stamp-name">${escapeHtml(pais.pais)}</h3>
      <div class="stamp-metrics">
        <div><span class="stamp-metric-num">US$ ${pais.custoVida.toLocaleString("pt-BR")}</span><span class="stamp-metric-label">Custo de vida / mês</span></div>
        <div><span class="stamp-metric-num">US$ ${pais.salario.toLocaleString("pt-BR")}</span><span class="stamp-metric-label">Salário médio TI / mês</span></div>
        <div><span class="stamp-metric-num">${escapeHtml(pais.demanda)}</span><span class="stamp-metric-label">Demanda em TI</span></div>
      </div>
      <p class="stamp-detail"><strong>Idioma:</strong> ${escapeHtml(pais.idioma)}</p>
      <p class="stamp-detail"><strong>Visto recomendado:</strong> ${escapeHtml(pais.visto)} · Dificuldade: ${escapeHtml(pais.dificuldadeVisto)}</p>
      <p class="stamp-summary">${escapeHtml(pais.resumo)}</p>
    `;
  }

  const globo = iniciarGlobo(globoEl, (nomePais) => {
    selectPais.value = nomePais;
    renderCard();
  });

  function atualizarTudo() {
    renderChart();
    renderSelectPais();
    globo.atualizar(paisesFiltrados());
  }

  filtroRegiao.addEventListener("change", atualizarTudo);
  selectPais.addEventListener("change", renderCard);

  atualizarTudo();
}
