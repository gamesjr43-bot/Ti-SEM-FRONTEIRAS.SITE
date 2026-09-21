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
