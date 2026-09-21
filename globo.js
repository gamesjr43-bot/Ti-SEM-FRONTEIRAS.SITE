// ===================== GLOBO (base compartilhada) =====================
// Mesma ideia do projection="orthographic" usado no protótipo Streamlit
// (Plotly) — aqui renderizado com D3 puro, sem dependências pesadas.
// Usado tanto pelo globo de países (MundoDev) quanto pelo globo de vagas
// (GlobalIT Jobs), cada um desenhando sua própria camada por cima.

// world-atlas usa código numérico ISO 3166-1 como id de cada país; este
// mapa traduz nome do país (como vem em PAISES/VAGAS) -> esse código.
const ISO_NUMERICO = {
  "Portugal": "620",
  "Alemanha": "276",
  "Canadá": "124",
  "Irlanda": "372",
  "Espanha": "724",
  "Emirados Árabes Unidos": "784",
};

// Coordenadas aproximadas (capital) de cada país, para posicionar
// marcadores de vaga no globo — o dado de vaga só tem o nome do país.
const PAIS_COORDS = {
  "Portugal": [38.7223, -9.1393],
  "Alemanha": [52.5200, 13.4050],
  "Canadá": [45.4215, -75.6972],
  "Irlanda": [53.3498, -6.2603],
  "Espanha": [40.4168, -3.7038],
  "Emirados Árabes Unidos": [24.4539, 54.3773],
};

function criarGlobo(container) {
  if (typeof d3 === "undefined" || typeof topojson === "undefined") {
    container.innerHTML = '<p class="muted" style="padding:1rem;">Não foi possível carregar o mapa (biblioteca indisponível).</p>';
    return null;
  }

  const LARGURA = 600;
  const ALTURA = 420;
  const projecao = d3.geoOrthographic()
    .scale(200)
    .translate([LARGURA / 2, ALTURA / 2])
    .clipAngle(90)
    .rotate([0, -12]);
  const caminho = d3.geoPath(projecao);

  const svg = d3.select(container).append("svg").attr("viewBox", `0 0 ${LARGURA} ${ALTURA}`);
  svg.append("circle")
    .attr("cx", LARGURA / 2).attr("cy", ALTURA / 2).attr("r", projecao.scale())
    .attr("fill", "#FFFFFF").attr("stroke", "#DCE2EA");
  const grupoTerra = svg.append("g");
  const grupoMarcadores = svg.append("g");

  let tooltip = document.querySelector(".globo-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.className = "globo-tooltip";
    document.body.appendChild(tooltip);
  }

  const carregarMundo = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then((resp) => resp.json())
    .then((mundo) => topojson.feature(mundo, mundo.objects.countries).features)
    .catch((erro) => {
      console.warn("[Globo] Falha ao carregar o mapa-múndi:", erro);
      container.innerHTML = '<p class="muted" style="padding:1rem;">Não foi possível carregar o mapa-múndi (sem conexão?).</p>';
      return [];
    });

  let rotacao = [0, -12];
  const callbacksRotacao = [];
  svg.call(
    d3.drag().on("drag", (evento) => {
      const sensibilidade = 0.25;
      rotacao = [
        rotacao[0] + evento.dx * sensibilidade,
        Math.max(-90, Math.min(90, rotacao[1] - evento.dy * sensibilidade)),
      ];
      projecao.rotate(rotacao);
      callbacksRotacao.forEach((fn) => fn());
    })
  );

  return {
    svg, projecao, caminho, grupoTerra, grupoMarcadores, tooltip, carregarMundo,
    aoGirar(fn) { callbacksRotacao.push(fn); },
    pontoVisivel([lat, lon]) {
      const rot = projecao.rotate();
      const centro = [-rot[0], -rot[1]];
      return d3.geoDistance([lon, lat], centro) < Math.PI / 2;
    },
  };
}

// ===================== GLOBO MUNDODEV (colorido por salário) =====================
function iniciarGlobo(container, aoSelecionarPais) {
  const base = criarGlobo(container);
  if (!base) return { atualizar() {} };
  const { grupoTerra, caminho, tooltip, carregarMundo, aoGirar } = base;

  let features = null;
  let paisPorIso = new Map();
  let corEscala = () => "#DCE2EA";

  function desenhar() {
    if (!features) return;
    grupoTerra.selectAll("path")
      .data(features, (d) => d.id)
      .join("path")
      .attr("d", caminho)
      .attr("fill", (d) => (paisPorIso.has(d.id) ? corEscala(paisPorIso.get(d.id).salario) : "#E7EBF1"))
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 0.5)
      .style("cursor", (d) => (paisPorIso.has(d.id) ? "pointer" : "default"))
      .on("mousemove", (evento, d) => {
        const dado = paisPorIso.get(d.id);
        if (!dado) { tooltip.classList.remove("is-visible"); return; }
        tooltip.classList.add("is-visible");
        tooltip.style.left = `${evento.clientX + 14}px`;
        tooltip.style.top = `${evento.clientY + 14}px`;
        tooltip.innerHTML = `<strong>${dado.bandeira} ${dado.pais}</strong>US$ ${dado.salario.toLocaleString("pt-BR")}/mês · custo US$ ${dado.custoVida.toLocaleString("pt-BR")}/mês`;
      })
      .on("mouseleave", () => tooltip.classList.remove("is-visible"))
      .on("click", (evento, d) => {
        const dado = paisPorIso.get(d.id);
        if (dado) aoSelecionarPais(dado.pais);
      });
  }

  aoGirar(desenhar);
  carregarMundo.then((f) => { features = f; desenhar(); });

  function atualizar(listaPaises) {
    paisPorIso = new Map(
      listaPaises.filter((p) => ISO_NUMERICO[p.pais]).map((p) => [ISO_NUMERICO[p.pais], p])
    );
    const salarios = listaPaises.map((p) => p.salario);
    corEscala = d3.scaleLinear()
      .domain([Math.min(...salarios), Math.max(...salarios)])
      .range(["#E4F0EE", "#1E6E67"])
      .clamp(true);
    desenhar();
  }

  return { atualizar };
}

// ===================== GLOBO VAGAS (marcadores por país) =====================
function iniciarGloboVagas(container, aoSelecionarPais) {
  const base = criarGlobo(container);
  if (!base) return { atualizar() {} };
  const { projecao, caminho, grupoTerra, grupoMarcadores, tooltip, carregarMundo, aoGirar, pontoVisivel } = base;

  let features = null;
  carregarMundo.then((f) => {
    features = f;
    grupoTerra.selectAll("path")
      .data(features, (d) => d.id)
      .join("path")
      .attr("d", caminho)
      .attr("fill", "#F1F4F8")
      .attr("stroke", "#E7EBF1")
      .attr("stroke-width", 0.5);
  });

  let grupos = []; // [{ pais, coords: [lat, lon], vagas: [...] }]

  function desenharMarcadores() {
    const visiveis = grupos.filter((g) => pontoVisivel(g.coords));
    const maxVagas = Math.max(1, ...grupos.map((g) => g.vagas.length));
    const raio = d3.scaleSqrt().domain([1, maxVagas]).range([6, 20]);

    grupoMarcadores.selectAll("circle")
      .data(visiveis, (d) => d.pais)
      .join("circle")
      .attr("cx", (d) => projecao([d.coords[1], d.coords[0]])[0])
      .attr("cy", (d) => projecao([d.coords[1], d.coords[0]])[1])
      .attr("r", (d) => raio(d.vagas.length))
      .attr("fill", "#C1442D")
      .attr("fill-opacity", 0.82)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mousemove", (evento, d) => {
        tooltip.classList.add("is-visible");
        tooltip.style.left = `${evento.clientX + 14}px`;
        tooltip.style.top = `${evento.clientY + 14}px`;
        const exemplos = d.vagas.slice(0, 3).map((v) => `${v.titulo} · ${v.empresa}`).join("<br>");
        const resto = d.vagas.length > 3 ? `<br>+${d.vagas.length - 3} vaga(s)` : "";
        tooltip.innerHTML = `<strong>${d.pais} · ${d.vagas.length} vaga(s)</strong>${exemplos}${resto}`;
      })
      .on("mouseleave", () => tooltip.classList.remove("is-visible"))
      .on("click", (evento, d) => aoSelecionarPais(d.pais));
  }

  aoGirar(desenharMarcadores);
  carregarMundo.then(() => desenharMarcadores());

  function atualizar(listaVagas) {
    const porPais = new Map();
    listaVagas.forEach((v) => {
      const coords = PAIS_COORDS[v.pais];
      if (!coords) return; // vaga em país sem coordenada cadastrada
      if (!porPais.has(v.pais)) porPais.set(v.pais, { pais: v.pais, coords, vagas: [] });
      porPais.get(v.pais).vagas.push(v);
    });
    grupos = [...porPais.values()];
    desenharMarcadores();
  }

  return { atualizar };
}
